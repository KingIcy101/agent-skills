#!/usr/bin/env node
/**
 * Kargo Appendix Generator
 * Deep-pulls Sellerboard velocity + supplier account limits + Notion incoming orders
 * into a per-brand, per-product ordering intelligence document.
 * 
 * Run: node kargo-appendix.js
 * Output: kargo-appendix.json
 * Refresh: daily via cron, or manually before planning
 */

const fs    = require('fs');
const path  = require('path');
const https = require('https');

require('../../voice-server/node_modules/dotenv').config({
  path: path.join(__dirname, '../../voice-server/.env'),
});

const NOTION_TOKEN = process.env.NOTION_TOKEN;
const AMAZON_DB    = '3eda6d0e1c0d4a54905b6cb478f78a45';
const WALMART_DB   = '19789dac5745808d9bc1d62dccd06a04';
const OUTPUT_FILE  = path.join(__dirname, 'kargo-appendix.json');

// ── Brand / Account config (from SUPPLIER_INTEL.md) ──────────────────────────
const BRAND_CONFIG = {
  'BodyHealth': {
    flagging: true,
    flagNote: 'Currently flagging — keep per-account orders SMALL and spaced out',
    accounts: [
      { name: 'Carol',    discount: 0,    maxCasesPerOrder: 2, notes: 'Monthly orders' },
      { name: 'Angelica', discount: 0,    maxCasesPerOrder: 2, notes: 'Monthly orders' },
      { name: 'Mike',     discount: 0.20, maxCasesPerOrder: 2, notes: 'First order 20% off (carlos20)' },
      { name: 'Suzanne',  discount: 0,    maxCasesPerOrder: 2, notes: 'Monthly orders' },
      { name: 'Renee',    discount: 0,    maxCasesPerOrder: 2, notes: 'Monthly orders' },
      { name: 'DUFFLE',   discount: 0,    maxCasesPerOrder: 2, notes: 'Via Mateo — extra capacity' },
      { name: 'Rebecca',  discount: 0,    maxCasesPerOrder: 3, notes: 'Higher markup, overflow only' },
    ],
    caseSizes: {
      '300ct': 24, '150ct': 24, 'powder_30sv': 24, 'powder_60sv': 24,
      'electrolytes': 24, '600ct': 12, 'powder_120sv': 12,
    },
    defaultCaseSize: 24,
    pricing: {
      'PerfectAmino 300ct Non Coated': 38.95,
      'PerfectAmino 300ct Coated':     38.95,
      'PerfectAmino 600ct Non Coated': 73.15,
      'PerfectAmino 600ct Coated':     73.15,
      'PerfectAmino 150ct Coated':     21.50,
      'PA Powder Strawberry 60sv':     39.90,
      'PA Powder Mixed Berry 60sv':    39.90,
      'PA Powder Lemon Lime 60sv':     39.90,
      'PA Powder Berry 30sv':          21.85,
      'PA Powder Strawberry 30sv':     21.85,
      'PA Powder Strawberry 120sv':    74.01,
      'PA Electrolytes Mixed Berry 30sv': 14.25,
      'Multi Complete 120ct':          28.26,
    },
    // Max total units per month across all accounts (flagging constraint)
    maxMonthlyUnits: 100,
  },

  'Ortho Molecular': {
    flagging: false,
    accounts: [
      // markup is PER BRAND PER ACCOUNT — Mike's 10% is Ortho-specific only
      // Other brands use flat rates. null = not yet confirmed, read from sheet/history.
      // All paid via PayPal (+3.5%). COGS: pct = wholesale×(1+pct)×1.035; flat = (wholesale+flat)×1.035
      { name: 'Rebecca', discount: 0.10, markup: { type: null,  value: null }, notes: 'Higher markup (overflow). Read from sheet.' },
      { name: 'Renee',   discount: 0.10, markup: { type: null,  value: null }, notes: '5% off at 72+, 10% off at 144+. Read markup from sheet.' },
      { name: 'Suzanne', discount: 0.10, markup: { type: null,  value: null }, notes: '5% off at 72+, 10% off at 144+. Read markup from sheet.' },
      { name: 'Pierce',  discount: 0.10, markup: { type: null,  value: null }, notes: '5% off at 72+, 10% off at 144+. Read markup from sheet.' },
      { name: 'Mike',    discount: 0.10, markup: { type: 'pct', value: 0.10 }, notes: 'CONFIRMED Ortho only: 10% off (144+ tier) + 10% markup. Other brands = flat rate (unknown).' },
      { name: 'Marco',   discount: 0.10, markup: { type: null,  value: null }, notes: '5% off at 72+, 10% off at 144+. Read markup from sheet.' },
      { name: 'Carol',   discount: 0.10, markup: { type: null,  value: null }, notes: '5% off at 72+, 10% off at 144+. Read markup from sheet.' },
      { name: 'DUFFLE',  discount: 0,    markup: { type: 'flat', value: 0   }, notes: 'Via Mateo. No markup.' },
    ],
    paypayFee: 0.035, // Always added — Matt pays all Ortho orders via PayPal
    volumeThresholds: [
      { minUnits: 72,  discount: 0.05, label: '5% off at 72+ units' },
      { minUnits: 144, discount: 0.10, label: '10% off at 144+ units' },
    ],
    // Targets from Matt's planning sheet — rough ceiling, adjust for stock + incoming
    planningSheetId: '1oyDlwT7fB51s8AzM8LQhkNCQHRYTawtiEdIrCC-kqvM',
  },

  'Standard Process': {
    flagging: false,
    accounts: [
      { name: 'Carl',      notes: 'Shared coordinated restock list' },
      { name: 'Lisa',      notes: 'Same list as Carl' },
      { name: 'Catherine', notes: 'Same list as Carl' },
      { name: 'Pierce',    notes: 'SP + MediHerb + Ortho' },
      { name: 'Mike',      notes: 'Has SP tab' },
      { name: 'Marco',     notes: "Marco's BH tab = SP restock list" },
    ],
    note: 'All 6 share coordinated restock list — split across accounts to stay under brand radar',
    topProducts: ['Pituitrophin PMG', 'Neutrophin PMG', 'Pneumotrophin PMG', 'Adrenal Desiccated', 'Drenamin 90ct', 'Cataplex B', 'Immuplex', 'Catalyn', 'Cyruta Plus'],
  },

  'Klaire Labs': {
    flagging: false,
    accounts: [
      { name: 'Mike',  notes: 'Primary. Most recent 2/4/26.' },
      { name: 'Marco', notes: 'Secondary.' },
    ],
    pricing: {
      'Ther-Biotic Complete 120ct': 51.99,
    },
  },

  'Metagenics': {
    flagging: false,
    accounts: [
      { name: 'Mike',   notes: 'Most recent data (2/6/26)' },
      { name: 'DUFFLE', notes: 'Matt Metagenics tab. 12/15/25 order.' },
      { name: 'Suzanne',notes: 'Old data (2024) — confirm active' },
      { name: 'Renee',  notes: 'Active' },
    ],
  },

  'Econugenics': {
    flagging: false,
    accounts: [
      { name: 'Renee',  notes: 'Primary. Monthly cadence (~47 units/$2,700-2,900/order). 2/14/26 most recent.' },
      { name: 'DUFFLE', notes: 'Active' },
    ],
    discount: 0.15,
    pricing: {
      'PectaSol Powder 90sv Unflavoured':   72.00,
      'PectaSol Powder 90sv Berry':         78.00,
      'PectaSol Powder 90sv Lime':          78.00,
      'PectaSol 270 Capsules':              52.20,
      'PectaSol Chewables':                 40.80,
      'PectaClear 60ct':                    27.00,
    },
  },

  'BodyBio': {
    flagging: false,
    accounts: [
      { name: 'DUFFLE',  notes: 'Active. Most recent 1/14/26.' },
      { name: 'Rebecca', notes: 'Has BodyBio tab' },
      { name: 'Suzanne', notes: 'Has Bodybio tab' },
      { name: 'Renee',   notes: 'Has Bodybio tab' },
      { name: 'Marco',   notes: 'Has BodyBio tab' },
    ],
    pricing: {
      'Liposomal Glutathione': 39.04,
    },
  },

  'Arthur Andrew': {
    flagging: false,
    accounts: [
      { name: 'DUFFLE', discount: 0.20, notes: 'Only account. 20% off.' },
    ],
    pricing: {
      'Neprinol 90ct':  28.00, // $35 → 20% off
      'Syntol 360ct':   79.99, // $99.99 → 20% off
    },
  },

  'Carlson': {
    flagging: false,
    accounts: [
      { name: 'Marco', discount: 0.20, notes: 'Most recent 12/16/25. 20% off.' },
    ],
    namingNote: 'DUFFLE "Matt Carlson" tab = LMNT products NOT Carlson brand. Carlson = rep name.',
    pricing: {
      'Maximum Omega 2000 180ct':         53.76,
      'Maximum Omega 2000 90ct':          36.91,
      'Elite EPA Gems 1000 120ct':        45.55,
      'The Very Finest Fish Oil 16.9oz':  26.40,
    },
  },
};

// ── Notion API ─────────────────────────────────────────────────────────────────
function notionRequest(endpoint, body = null) {
  return new Promise(resolve => {
    const data   = body ? JSON.stringify(body) : null;
    const method = body ? 'POST' : 'GET';
    const headers = {
      'Authorization': `Bearer ${NOTION_TOKEN}`,
      'Notion-Version': '2022-06-28',
      'Content-Type': 'application/json',
    };
    if (data) headers['Content-Length'] = Buffer.byteLength(data);
    const req = https.request({ hostname: 'api.notion.com', path: endpoint, method, headers }, r => {
      let d = ''; r.on('data', c => d += c);
      r.on('end', () => { try { resolve(JSON.parse(d)); } catch { resolve({}); } });
    });
    req.on('error', () => resolve({}));
    if (data) req.write(data);
    req.end();
  });
}

function getProp(props, key) {
  const p = props?.[key];
  if (!p) return null;
  if (p.title)     return p.title.map(t => t.plain_text).join('');
  if (p.rich_text) return p.rich_text.map(t => t.plain_text).join('');
  if (p.select)    return p.select.name;
  if (p.status)    return p.status.name;
  if (p.number !== undefined) return p.number;
  if (p.checkbox !== undefined) return p.checkbox;
  if (p.date)      return p.date.start;
  return null;
}

// ── Get incoming/purchased orders from Notion ─────────────────────────────────
async function getIncomingOrders() {
  const [amazonRes, walmartRes] = await Promise.all([
    notionRequest(`/v1/databases/${AMAZON_DB}/query`, {
      filter: { or: [
        { property: 'Status', status: { equals: 'Purchased' } },
        { property: 'Status', status: { equals: 'Ordering' } },
      ]},
      page_size: 100,
    }),
    notionRequest(`/v1/databases/${WALMART_DB}/query`, {
      filter: { or: [
        { property: 'Order Status', status: { equals: 'Purchased' } },
        { property: 'Order Status', status: { equals: 'Ordering' } },
      ]},
      page_size: 100,
    }),
  ]);

  const incoming = [];
  for (const row of (amazonRes?.results || [])) {
    const p = row.properties;
    incoming.push({
      platform: 'Amazon',
      product: getProp(p, 'Order') || '',
      supplier: getProp(p, 'Supplier') || '',
      status: getProp(p, 'Status') || '',
      amount: getProp(p, 'Est Amount') || 0,
      pageId: row.id,
    });
  }
  for (const row of (walmartRes?.results || [])) {
    const p = row.properties;
    incoming.push({
      platform: 'Walmart',
      product: getProp(p, 'Name') || '',
      supplier: getProp(p, 'Supplier') || '',
      status: getProp(p, 'Order Status') || '',
      amount: getProp(p, 'Est Amount') || 0,
      pageId: row.id,
    });
  }
  return incoming;
}

// ── Read Ortho planning sheet for live remaining units ────────────────────────
function fetchOrthoSheet() {
  return new Promise(resolve => {
    const url = `https://docs.google.com/spreadsheets/d/1oyDlwT7fB51s8AzM8LQhkNCQHRYTawtiEdIrCC-kqvM/export?format=csv`;
    https.get(url, res => {
      if ([301,302,307,308].includes(res.statusCode)) {
        https.get(res.headers.location, res2 => {
          let d = ''; res2.on('data', c => d+=c);
          res2.on('end', () => resolve(d));
        }).on('error', () => resolve(null));
        res.resume();
        return;
      }
      let d = ''; res.on('data', c => d+=c);
      res.on('end', () => resolve(d));
    }).on('error', () => resolve(null));
  });
}

function parseOrthoSheet(csv) {
  if (!csv || csv.length < 100) return {};
  const rows = csv.split('\n').map(r => r.split(',').map(c => c.replace(/^"|"$/g,'').trim()));
  const targets = {};
  for (let i = 3; i < rows.length; i++) {
    const row = rows[i];
    if (!row[0]) continue;
    const name      = row[0].trim();
    const target    = parseInt(row[1]) || 0;
    const remaining = parseInt(row[2]);
    if (name) targets[name] = { monthlyTarget: target, remaining: isNaN(remaining) ? target : remaining };
  }
  return targets;
}

// ── Match a product name to a brand ──────────────────────────────────────────
function detectBrand(productName) {
  const n = productName.toLowerCase();
  if (n.includes('perfectamino') || n.includes('bodyhealth') || n.includes('multi complete')) return 'BodyHealth';
  if (n.includes('ortho') || n.includes('reacted') || n.includes('estrodim') || n.includes('methyl cpg') ||
      n.includes('methyl b12') || n.includes('orthomune') || n.includes('alpha base') ||
      n.includes('sinatrol') || n.includes('turiva') || n.includes('digestzyme') ||
      n.includes('spore ig') || n.includes('glutashield') || n.includes('citranox') ||
      n.includes('hepta core') || n.includes('cancidforte') || n.includes('candicid') ||
      n.includes('diaxinol') || n.includes('diaxonal') || n.includes('vitamin k2') ||
      n.includes('super aloe') || n.includes('zinc') || n.includes('nk stim') ||
      n.includes('wholemune') || n.includes('ocuview') || n.includes('virakid') ||
      n.includes('floraboost') || n.includes('lithium orotate') || n.includes('methyl b')) return 'Ortho Molecular';
  if (n.includes('ther-biotic') || n.includes('klaire')) return 'Klaire Labs';
  if (n.includes('metagenics') || n.includes('ultraflora') || n.includes('omegagenics') ||
      n.includes('coq10 st') || n.includes('phytomulti') || n.includes('estrovera')) return 'Metagenics';
  if (n.includes('pectasol') || n.includes('pectaclear') || n.includes('econugenics')) return 'Econugenics';
  if (n.includes('neprinol') || n.includes('syntol') || n.includes('arthur andrew')) return 'Arthur Andrew';
  if (n.includes('bodybio') || n.includes('liposomal glutathione')) return 'BodyBio';
  if (n.includes('maximum omega') || n.includes('elite epa') || n.includes('finest fish oil') ||
      n.includes('carlson')) return 'Carlson';
  if (n.includes('cataplex') || n.includes('pituitrophin') || n.includes('drenamin') ||
      n.includes('immuplex') || n.includes('catalyn') || n.includes('cyruta') ||
      n.includes('pneumotrophin') || n.includes('adrenal desiccated') || n.includes('neutrophin')) return 'Standard Process';
  return null;
}

// ── Main: generate appendix ───────────────────────────────────────────────────
async function generateAppendix() {
  console.log('[kargo-appendix] Generating...');

  // 1. Load Sellerboard product data
  let sbProducts = [];
  try {
    const sb = JSON.parse(fs.readFileSync(path.join(__dirname, '../../mission-control-server/sellerboard-data.json'), 'utf8'));
    sbProducts = sb.expectedRevenue?.products || [];
  } catch (e) { console.warn('Sellerboard data not found:', e.message); }

  // 2. Get Notion incoming orders
  console.log('[kargo-appendix] Fetching Notion incoming orders...');
  const incomingOrders = await getIncomingOrders();
  console.log(`[kargo-appendix] ${incomingOrders.length} incoming orders`);

  // 3. Fetch Ortho planning sheet
  console.log('[kargo-appendix] Fetching Ortho planning sheet...');
  const orthoCsv = await fetchOrthoSheet();
  const orthoTargets = parseOrthoSheet(orthoCsv);
  console.log(`[kargo-appendix] Ortho sheet: ${Object.keys(orthoTargets).length} products`);

  // 4. Group Sellerboard products by brand
  const brandProducts = {};
  for (const p of sbProducts) {
    const brand = detectBrand(p.name || '');
    if (!brand) continue;
    if (!brandProducts[brand]) brandProducts[brand] = [];
    brandProducts[brand].push(p);
  }

  // 5. Build appendix per brand
  const appendix = {
    generatedAt: new Date().toISOString(),
    summary: {
      totalIncomingOrders: incomingOrders.length,
      incomingOrderValue: incomingOrders.reduce((s, o) => s + (o.amount || 0), 0).toFixed(2),
      brandsWithVelocityData: Object.keys(brandProducts).length,
    },
    incomingOrders,
    brands: {},
  };

  for (const [brandName, config] of Object.entries(BRAND_CONFIG)) {
    const products = brandProducts[brandName] || [];
    const brandIncoming = incomingOrders.filter(o =>
      detectBrand(o.product || '') === brandName
    );

    // Calculate total max orderable this month
    const accountCount = config.accounts?.length || 0;
    const maxUnitsPerAccount = config.accounts?.reduce((s, a) => {
      const caseSize = config.defaultCaseSize || 24;
      return s + (a.maxCasesPerOrder || 3) * caseSize;
    }, 0) || 0;

    // Build product list with velocity + stock + ordering recommendation
    const productDetails = products
      .sort((a, b) => b.sales - a.sales)
      .map(p => {
        const salesPerMonth  = Math.round((p.units || 0) / 3); // 90-day → monthly
        const currentStock   = p.stock || 0;
        const incomingUnits  = brandIncoming
          .filter(o => o.product.toLowerCase().includes(p.name?.substring(0, 15).toLowerCase() || ''))
          .reduce((s, o) => s + Math.round((o.amount || 0) / (p.cogs || 40)), 0);
        const trueGap        = Math.max(0, salesPerMonth - currentStock - incomingUnits);
        const urgency        = currentStock === 0 && salesPerMonth > 10 ? 'HIGH' :
                               currentStock < salesPerMonth * 0.5 ? 'MEDIUM' : 'LOW';

        const rec = {
          name:          p.name?.substring(0, 60) || '',
          asin:          p.asin || '',
          channel:       p.channel || '',
          sales90d:      p.sales || 0,
          units90d:      p.units || 0,
          salesPerMonth,
          currentStock,
          incomingApprox: incomingUnits,
          trueMonthlyGap: trueGap,
          margin:        p.margin || 0,
          roi:           p.roi || 0,
          urgency,
        };

        // Ortho: add planning sheet targets
        if (brandName === 'Ortho Molecular') {
          const key = Object.keys(orthoTargets).find(k =>
            p.name?.toLowerCase().includes(k.toLowerCase().substring(0, 12))
          );
          if (key) {
            rec.monthlyTarget  = orthoTargets[key].monthlyTarget;
            rec.remainingTarget = orthoTargets[key].remaining;
          }
        }

        return rec;
      })
      .filter(p => p.salesPerMonth > 0 || p.urgency === 'HIGH');

    appendix.brands[brandName] = {
      flagging:            config.flagging || false,
      flagNote:            config.flagNote || null,
      accountCount,
      maxUnitsOrderable:   config.maxMonthlyUnits || maxUnitsPerAccount,
      accounts:            config.accounts || [],
      incomingOrders:      brandIncoming,
      incomingOrderCount:  brandIncoming.length,
      incomingOrderValue:  brandIncoming.reduce((s, o) => s + (o.amount || 0), 0).toFixed(2),
      topProducts:         productDetails.slice(0, 25),
      highUrgency:         productDetails.filter(p => p.urgency === 'HIGH').map(p => p.name),
      orderingNote:        config.note || null,
    };

    console.log(`[kargo-appendix] ${brandName}: ${productDetails.length} products, ${brandIncoming.length} incoming orders, ${productDetails.filter(p=>p.urgency==='HIGH').length} high urgency`);
  }

  // 6. Save
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(appendix, null, 2));
  console.log(`[kargo-appendix] Saved to ${OUTPUT_FILE}`);
  console.log(`[kargo-appendix] Done. Summary:`);
  console.log(`  Brands: ${Object.keys(appendix.brands).join(', ')}`);
  console.log(`  Incoming orders: ${appendix.summary.totalIncomingOrders} worth $${appendix.summary.incomingOrderValue}`);
  for (const [brand, data] of Object.entries(appendix.brands)) {
    if (data.highUrgency.length > 0) {
      console.log(`  ${brand} HIGH: ${data.highUrgency.slice(0,3).join(', ')}`);
    }
  }

  return appendix;
}

generateAppendix().catch(console.error);
