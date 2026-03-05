#!/usr/bin/env node
/**
 * check-dimensions.js — Kargo Automation
 * Scans Notion Amazon + Walmart orders for shipments > 7 days old with no tracking.
 * Flags to Matt via Telegram if dimensions haven't been received from supplier.
 * 
 * Run daily via cron or on-demand.
 */

const https = require('https');

const TOKEN = 'NOTION_TOKEN_REDACTED';
const AMAZON_DB = '3eda6d0e1c0d4a54905b6cb478f78a45';
const WALMART_DB = '19789dac5745808d9bc1d62dccd06a04';
// Load env from voice-server
require('/Users/mattbender/.openclaw/workspace/voice-server/node_modules/dotenv').config({
  path: '/Users/mattbender/.openclaw/workspace/voice-server/.env'
});
const TELEGRAM_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const MATT_CHAT_ID = process.env.TELEGRAM_CHAT_ID || '8465598242';
const FLAG_DAYS = 7;          // Flag if older than this many days with no tracking
const MAX_DAYS = 9999;        // No upper limit — track all orders from start date forward
const START_DATE = '2026-02-23'; // Only check orders placed on or after this date

function notionPost(path, body) {
  return new Promise((res, rej) => {
    const data = JSON.stringify(body);
    const req = https.request({
      hostname: 'api.notion.com', path, method: 'POST',
      headers: { 'Authorization': 'Bearer ' + TOKEN, 'Notion-Version': '2022-06-28',
        'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(data) }
    }, r => { let b = ''; r.on('data', d => b += d); r.on('end', () => res(JSON.parse(b))); });
    req.on('error', rej); req.write(data); req.end();
  });
}

async function getAllPages(dbId) {
  let all = [], cursor;
  do {
    const body = { page_size: 100 };
    if (cursor) body.start_cursor = cursor;
    const r = await notionPost(`/v1/databases/${dbId}/query`, body);
    all.push(...(r.results || []));
    cursor = r.has_more ? r.next_cursor : null;
  } while (cursor);
  return all;
}

function getProp(props, name) {
  const p = props[name]; if (!p) return null;
  if (p.type === 'number') return p.number;
  if (p.type === 'date') return p.date?.start;
  if (p.type === 'select') return p.select?.name;
  if (p.type === 'status') return p.status?.name;
  if (p.type === 'title') return p.title?.map(t => t.plain_text).join('');
  if (p.type === 'rich_text') return p.rich_text?.map(t => t.plain_text).join('');
  if (p.type === 'checkbox') return p.checkbox;
  return null;
}

function daysSince(dateStr) {
  if (!dateStr) return 999;
  return Math.floor((Date.now() - new Date(dateStr).getTime()) / 86400000);
}

async function sendTelegram(msg) {
  if (!TELEGRAM_TOKEN) { console.log('[Telegram skip] No token —', msg); return; }
  return new Promise((res, rej) => {
    const body = JSON.stringify({ chat_id: MATT_CHAT_ID, text: msg, parse_mode: 'HTML' });
    const req = https.request({
      hostname: 'api.telegram.org', path: `/bot${TELEGRAM_TOKEN}/sendMessage`, method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) }
    }, r => { let b = ''; r.on('data', d => b += d); r.on('end', () => res(JSON.parse(b))); });
    req.on('error', rej); req.write(body); req.end();
  });
}

async function main() {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - FLAG_DAYS);

  const flagged = [];

  for (const [platform, dbId, statusField] of [
    ['Amazon', AMAZON_DB, 'Status'],
    ['Walmart', WALMART_DB, 'Order Status']
  ]) {
    const pages = await getAllPages(dbId);
    for (const p of pages) {
      const pr = p.properties;
      const statusProp = pr[statusField];
      const status = statusProp?.status?.name || statusProp?.select?.name || '';
      if (status === 'Needs Placed') continue;
      if (!['Done', 'Purchased'].includes(status)) continue;

      const date = getProp(pr, 'Date to Purchase');
      if (!date) continue;
      const days = daysSince(date);
      // New orders (placed on/after Feb 23): flag after 7 days no tracking
      // Old orders (before Feb 23): only flag if 30+ days old — genuinely missing
      const isOldOrder = date < START_DATE;
      const threshold = isOldOrder ? 30 : FLAG_DAYS;
      if (days < threshold) continue;

      const tracking = getProp(pr, 'Tracking') || '';
      if (tracking.trim()) continue; // already has tracking

      const brand = getProp(pr, 'Order') || getProp(pr, 'Name') || '?';
      const supplier = getProp(pr, 'Supplier') || '?';
      const amount = getProp(pr, 'Est Amount') || 0;
      // Skip non-supplement suppliers
      const supLower = supplier.toLowerCase();
      const skipSet = new Set(['amazon','ebay','bjs','walmart','target','sams club','dollar tree',
        'newegg','faire','cocoon','bath and body','me','brand','tcg','game gn','robi curu',
        'popn toyzz','pokemon','rare candy','mateo']);
      if (skipSet.has(supLower)) continue;

      flagged.push({ platform, supplier, brand, date, days, amount });
    }
  }

  if (!flagged.length) {
    console.log('✅ No overdue shipments — all orders under 7 days or have tracking.');
    return;
  }

  // Sort by age descending
  flagged.sort((a, b) => b.days - a.days);

  console.log(`\n⚠️ ${flagged.length} orders with no tracking after ${FLAG_DAYS}+ days:\n`);
  flagged.forEach(f => console.log(`  ${f.days}d | ${f.platform} | ${f.supplier} / ${f.brand} | $${Math.round(f.amount)} | ordered ${f.date}`));

  // Build Telegram message
  const lines = flagged.map(f => `  • ${f.supplier} / ${f.brand} — ${f.days} days ago ($${Math.round(f.amount)})`);
  const msg = `📦 <b>Kargo: Missing Dimensions / No Tracking</b>\n\n${flagged.length} order(s) placed ${FLAG_DAYS}+ days ago with no UPS tracking yet:\n\n${lines.join('\n')}\n\n<i>Follow up with these suppliers to get box dimensions so labels can be generated.</i>`;

  await sendTelegram(msg);
  console.log('\nAlert sent to Matt.');
}

main().catch(e => { console.error(e); process.exit(1); });
