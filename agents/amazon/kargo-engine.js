#!/usr/bin/env node
/**
 * Kargo Engine — Order Flow Automation
 * Reads Sellerboard data + product catalog → generates restock list
 * Posts to Slack → logs to Notion → updates prep sheet
 */

const fs   = require('fs');
const path = require('path');
require('/Users/mattbender/.openclaw/workspace/voice-server/node_modules/dotenv').config({
  path: path.join(__dirname, '../../voice-server/.env')
});

const SLACK_TOKEN    = process.env.SLACK_BOT_TOKEN;
const SLACK_CH_ORDERS = process.env.SLACK_CH_ORDERS || 'C094RGF96K0';
const NOTION_TOKEN   = process.env.NOTION_TOKEN;
const NOTION_AMZ_DB  = '3eda6d0e1c0d4a54905b6cb478f78a45';
const NOTION_WMT_DB  = '19789dac5745808d9bc1d62dccd06a04';
const PREP_SHEET_ID  = '15bGErKdxpBouR22DDaOdnwf6lxu7NZZI-0QfKr8tAQk';

const PRODUCTS      = JSON.parse(fs.readFileSync(path.join(__dirname, 'product-data.json'), 'utf8'));
const SUPPLIER_DATA = JSON.parse(fs.readFileSync(path.join(__dirname, '../../mission-control-server/supplier-data.json'), 'utf8'));
const BRAND_ROUTING = JSON.parse(fs.readFileSync(path.join(__dirname, 'brand-routing.json'), 'utf8'));

// ── Sellerboard data ──────────────────────────────────────────────
function getSellerboardData() {
  const p = path.join(__dirname, '../../mission-control-server/sellerboard-data.json');
  try { return JSON.parse(fs.readFileSync(p, 'utf8')); } catch { return null; }
}

// ── Restock Analysis ──────────────────────────────────────────────
// Returns ranked list of top-selling products sorted by revenue + margin
// Since we don't have live stock levels, this shows what should be prioritized
function analyzeRestocks(topN = 20) {
  const allProducts = [
    ...((PRODUCTS.amazon?.products) || []).map(p => ({ ...p, platform: 'Amazon' })),
    ...((PRODUCTS.walmart?.products) || []).map(p => ({ ...p, platform: 'Walmart' })),
  ];

  const SKIP_BRANDS = ['momentous', 'mediherb'];
  const filtered = allProducts.filter(p => {
    const brand = (p.name || '').toLowerCase();
    return !SKIP_BRANDS.some(b => brand.includes(b)) && p.units > 0 && p.cogs > 0;
  });

  // Score by profit contribution
  const scored = filtered.map(p => {
    const unitProfit = (p.price || 0) - (p.cogs || 0);
    const totalProfit = (p.netProfit || p.grossProfit || unitProfit * p.units);
    const velocity = p.units || 0; // units sold in period
    const qtyToOrder = Math.max(Math.ceil(velocity * 0.8), 12); // ~1 month supply
    const estCost = (p.cogs * qtyToOrder).toFixed(2);

    return {
      platform: p.platform,
      name: p.name?.trim(),
      asin: p.asin,
      sku: p.sku,
      unitsSold: velocity,
      price: p.price,
      cogs: p.cogs,
      margin: p.margin,
      roi: p.roi,
      totalProfit: Math.round(totalProfit),
      qtyToOrder,
      estOrderCost: estCost,
      score: totalProfit * (p.roi / 100 || 1),
    };
  });

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, topN);
}

// ── Slack posting ─────────────────────────────────────────────────
async function postToSlack(channel, text, blocks = null) {
  const body = { channel, text };
  if (blocks) body.blocks = blocks;

  const r = await fetch('https://slack.com/api/chat.postMessage', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${SLACK_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
  const d = await r.json();
  if (!d.ok) throw new Error('Slack error: ' + d.error);
  return d;
}

// Brand abbreviations (matching Matt's style in Slack)
const BRAND_ABBREV = {
  'bodyhealth':          'BH',
  'body health':         'BH',
  'ortho molecular':     'Ortho',
  'designs for health':  'DFH',
  'design for health':   'DFH',
  'econugenics':         'Eco',
  'klaire labs':         'Klaire',
  'klaire lab':          'Klaire',
  'arthur andrew':       'Arthur Andrew',
  'standard process':    'SP',
  'metagenics':          'Metagenics',
  'numedica':            'Numedica',
  'bodybio':             'BodyBio',
  'apex energetics':     'Apex',
  'fairhaven health':    'Fairhaven',
  'natures plus':        'NaturesPlus',
};

function abbreviateBrand(name = '') {
  const lower = name.toLowerCase();
  for (const [key, abbr] of Object.entries(BRAND_ABBREV)) {
    if (lower.includes(key)) return abbr;
  }
  // Extract first 2 words as fallback
  return name.split(' ').slice(0, 2).join(' ');
}

// Format a weekly order list — matches Matt's exact Slack style from #orders-amz-walmart:
// :dart:*Orders so Far this Week to place MM/DD-MM/DD*:dart: *(Updated)*
// 1. *$X,XXX.XX Supplier Brand*:stopwatch:
// 2. *$X,XXX.XX Supplier Brand*:stopwatch:
function formatOrderMessage(items, platform = null) {
  if (!items.length) return null;

  const now   = new Date();
  // Start of week (Monday)
  const mon = new Date(now);
  mon.setDate(now.getDate() - ((now.getDay() + 6) % 7));
  // End of week (Friday)
  const fri = new Date(mon);
  fri.setDate(mon.getDate() + 4);
  const fmt = (d) => d.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit' });
  const start = fmt(mon);
  const end   = fmt(fri);

  const header = `:dart:*Orders so Far this Week to place ${start}-${end}*:dart: *(Updated)*`;

  const lines = items.map((item, idx) => {
    const brandAbbr = abbreviateBrand(item.name);
    const routeKey  = brandAbbr.toUpperCase().replace(/\s+/g, '_');
    const route     = BRAND_ROUTING[routeKey] || BRAND_ROUTING[brandAbbr.toUpperCase()];
    const supplier  = route?.primary?.[0] || '';
    const cost      = item.estOrderCost
      ? `$${parseFloat(item.estOrderCost).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
      : 'TBD';
    const label = supplier ? `${supplier} ${brandAbbr}` : brandAbbr;
    // Format: N. *$X,XXX.XX Practitioner Brand*:stopwatch:  (no space before stopwatch)
    return `${idx + 1}. *${cost} ${label}*:stopwatch:`;
  });

  return `${header}\n${lines.join('\n')}`;
}

// Format a single PAID confirmation — matches Matt's style:
// *$X,XXX.XX Supplier Brand PAID* ✅
function formatPaidMessage(amount, supplier, brand) {
  const cost = parseFloat(amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  return `*$${cost} ${supplier} ${brand} PAID* :white_check_mark:`;
}

// ── Prep Sheet Logging ────────────────────────────────────────────
// Appends a new row to the Nova prep sheet (Amazon or Walmart tab)
// Requires Google Sheets API access — will be wired once service account is set up
async function logToPrepSheet(platform, items) {
  // TODO: implement once Google Sheets service account is configured
  // For now, log locally and return instructions
  const logFile = path.join(__dirname, 'prep-sheet-pending.json');
  let pending = [];
  try { pending = JSON.parse(fs.readFileSync(logFile, 'utf8')); } catch {}

  const date = new Date().toLocaleDateString('en-US');
  for (const item of items) {
    pending.push({
      date,
      platform,
      itemName: `${item.brand} — ${item.name}`,
      qtyOrdered: item.qtyToOrder,
      buyCost: item.estOrderCost || '',
      tracking: '',
      status: 'pending-log',
      loggedAt: new Date().toISOString(),
    });
  }
  fs.writeFileSync(logFile, JSON.stringify(pending, null, 2));
  console.log(`Logged ${items.length} items to prep-sheet-pending.json (Google Sheets API needed for live write)`);
}

// ── Notion: Log order as placed ───────────────────────────────────
async function markNotionOrderPlaced(pageId, trackingNumber = null) {
  const body = {
    properties: {
      'Status': { select: { name: 'Purchased' } },
    }
  };
  if (trackingNumber) {
    body.properties['Tracking'] = { rich_text: [{ text: { content: trackingNumber } }] };
  }

  const r = await fetch(`https://api.notion.com/v1/pages/${pageId}`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${NOTION_TOKEN}`,
      'Notion-Version': '2022-06-28',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
  return r.json();
}

// ── Read Slack history ────────────────────────────────────────────
async function readChannelHistory(channelId, limit = 100) {
  const r = await fetch(`https://slack.com/api/conversations.history?channel=${channelId}&limit=${limit}`, {
    headers: { 'Authorization': `Bearer ${SLACK_TOKEN}` }
  });
  const d = await r.json();
  if (!d.ok) throw new Error('Slack read error: ' + d.error);
  return d.messages || [];
}

// ── Main: Run restock check ───────────────────────────────────────
async function runRestockCheck(options = {}) {
  const { dryRun = false, topN = 15, post = true } = options;

  console.log('🔍 Analyzing top products for restocking...');
  const restocks = analyzeRestocks(topN);

  if (!restocks.length) {
    console.log('✅ No data available for restock analysis.');
    return { restocks: [], message: null };
  }

  console.log(`Top ${restocks.length} items by profit contribution:`);
  restocks.slice(0, 5).forEach(r =>
    console.log(`  ${r.platform} | ${r.name?.slice(0,50)} | ${r.unitsSold} units | ROI ${r.roi}% | order ${r.qtyToOrder}`)
  );

  const amzItems = restocks.filter(i => i.platform === 'Amazon');
  const wmtItems = restocks.filter(i => i.platform === 'Walmart');
  const message  = formatOrderMessage(restocks);

  if (!dryRun && post && SLACK_TOKEN) {
    try {
      if (amzItems.length) await postToSlack(SLACK_CH_ORDERS, formatOrderMessage(amzItems, 'Amazon'));
      if (wmtItems.length) await postToSlack(SLACK_CH_ORDERS, formatOrderMessage(wmtItems, 'Walmart'));
      console.log('✅ Posted to #orders-amz-walmart');
    } catch (e) {
      console.error('Slack post failed:', e.message);
    }
  } else {
    console.log('\n--- DRAFT MESSAGE (Amazon) ---');
    console.log(formatOrderMessage(amzItems, 'Amazon'));
    if (wmtItems.length) {
      console.log('\n--- DRAFT MESSAGE (Walmart) ---');
      console.log(formatOrderMessage(wmtItems, 'Walmart'));
    }
    console.log('--- END DRAFT ---');
  }

  if (amzItems.length) await logToPrepSheet('Amazon', amzItems);
  if (wmtItems.length) await logToPrepSheet('Walmart', wmtItems);

  return { restocks, message };
}

// (exports and entrypoint at end of file)

// ── Prep Sheet Reader ─────────────────────────────────────────────
const PREP_SHEET_GIDS = {
  amazon:         '0',
  walmart:        '906356618',
  amazonArchive:  '1045490102',
  walmartArchive: '876832504',
};

async function readPrepSheet(tab = 'amazon') {
  const gid = PREP_SHEET_GIDS[tab] || '0';
  const url = `https://docs.google.com/spreadsheets/d/${PREP_SHEET_ID}/export?format=csv&gid=${gid}`;
  const r = await fetch(url);
  if (!r.ok) throw new Error(`Prep sheet fetch failed: ${r.status}`);
  const csv = await r.text();

  const rows = csv.split('\n').map(line =>
    line.split(',').map(c => c.replace(/^"|"$/g, '').trim())
  );

  const headers = rows[0];
  const entries = [];
  let currentSupplier = null;

  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    const itemName = row[2] || row[3] || ''; // col C or D

    // Detect supplier header rows (e.g. "Marco BH", "Renee SP")
    const isHeader = row.every((c, idx) => idx === 2 ? !!c : !c || c === '') ||
                     (row[2] && !row[3] && !row[4]);

    if (isHeader && itemName && !itemName.match(/^\d/)) {
      currentSupplier = itemName;
      continue;
    }

    if (!itemName || itemName.toLowerCase().includes('do not remove')) continue;

    entries.push({
      supplier: currentSupplier,
      date:       row[0] || '',
      asin:       row[1] || '',
      itemName,
      qtyOrdered: row[3] || row[4] || '',
      qtyReceived:row[4] || row[5] || '',
      sku:        row[5] || '',
      buyCost:    row[7] || row[11] || '',
      tracking:   row[8] || row[13] || '',
      notes:      row[9] || '',
    });
  }

  return { headers, entries, tab };
}

// Find items in prep sheet that still haven't been received (missing Qty Received)
async function getPendingPrepItems(tab = 'amazon') {
  const { entries } = await readPrepSheet(tab);
  return entries.filter(e => e.qtyOrdered && !e.qtyReceived);
}

// ── Exports & entrypoint ──────────────────────────────────────────
module.exports = {
  analyzeRestocks,
  formatOrderMessage,
  formatPaidMessage,
  postToSlack,
  logToPrepSheet,
  markNotionOrderPlaced,
  readChannelHistory,
  runRestockCheck,
  readPrepSheet,
  getPendingPrepItems,
  SLACK_CH_ORDERS,
  PREP_SHEET_ID,
  PREP_SHEET_GIDS,
  BRAND_ROUTING,
};

if (require.main === module) {
  const dryRun = process.argv.includes('--dry-run');
  const cmd    = process.argv[2];

  if (cmd === 'prep') {
    readPrepSheet('amazon').then(({ entries }) => {
      console.log(`Prep sheet: ${entries.length} entries`);
      entries.slice(0, 10).forEach(e =>
        console.log(` [${e.supplier}] ${e.itemName.slice(0,40)} | qty: ${e.qtyOrdered} | rcvd: ${e.qtyReceived}`)
      );
    }).catch(console.error);
  } else {
    runRestockCheck({ dryRun, topN: 15 })
      .then(r => console.log(`Done. ${r.restocks.length} items flagged.`))
      .catch(console.error);
  }
}
