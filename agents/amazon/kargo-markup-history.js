/**
 * kargo-markup-history.js
 * Tracks per-account, per-brand markup history so Kargo can estimate
 * fair markups based on what's actually been paid in the past.
 *
 * Usage:
 *   const { logMarkup, getMarkupEstimate, loadHistory } = require('./kargo-markup-history');
 *
 *   // Log a completed order
 *   logMarkup({ brand: 'BodyHealth', account: 'Renee', wholesaleTotal: 200, paidTotal: 225, qty: 24, date: '2026-02-23' });
 *
 *   // Get estimated markup for planning
 *   const est = getMarkupEstimate('BodyHealth', 'Renee');
 *   // { type: 'pct', value: 0.125, confidence: 'high', samples: 4 }
 */

const fs   = require('fs');
const path = require('path');

const HISTORY_FILE = path.join(__dirname, 'kargo-markup-history.json');

function loadHistory() {
  try {
    return JSON.parse(fs.readFileSync(HISTORY_FILE, 'utf8'));
  } catch {
    return { entries: [], summaries: {} };
  }
}

function saveHistory(data) {
  fs.writeFileSync(HISTORY_FILE, JSON.stringify(data, null, 2));
}

/**
 * Log a markup data point from a completed order.
 * @param {Object} params
 *   brand         {string}  e.g. "BodyHealth"
 *   account       {string}  e.g. "Renee"
 *   wholesaleTotal {number} what Ortho/BH charges the account (no markup)
 *   paidTotal     {number}  what Matt actually paid (includes markup + PayPal)
 *   qty           {number}  total units ordered
 *   date          {string}  YYYY-MM-DD
 *   note          {string?} optional context
 */
function logMarkup({ brand, account, wholesaleTotal, paidTotal, qty, date, note }) {
  if (!brand || !account || !wholesaleTotal || !paidTotal) return;

  const paypayFee    = 0.035;
  // Back out PayPal fee first: paidTotal = (wholesale + markup) × 1.035
  const beforePaypal = paidTotal / (1 + paypayFee);
  const markupAmount = beforePaypal - wholesaleTotal;
  const markupPct    = markupAmount / wholesaleTotal;

  const entry = {
    brand,
    account,
    wholesaleTotal,
    paidTotal,
    qty,
    markupAmount: Math.round(markupAmount * 100) / 100,
    markupPct:    Math.round(markupPct * 10000) / 10000, // 4 decimal places
    date: date || new Date().toISOString().split('T')[0],
    note: note || '',
    loggedAt: Date.now(),
  };

  const history = loadHistory();
  history.entries.push(entry);

  // Recompute summary for this brand/account combo
  const key = `${brand}__${account}`;
  const related = history.entries.filter(e => e.brand === brand && e.account === account);
  const avgPct   = related.reduce((s, e) => s + e.markupPct, 0) / related.length;
  const avgFlat  = related.reduce((s, e) => s + e.markupAmount, 0) / related.length;

  // Determine if flat or percentage is more consistent
  const pctVariance  = variance(related.map(e => e.markupPct));
  const flatVariance = variance(related.map(e => e.markupAmount / e.qty)); // per-unit flat

  history.summaries[key] = {
    brand,
    account,
    samples: related.length,
    avgMarkupPct:  Math.round(avgPct * 10000) / 10000,
    avgMarkupFlat: Math.round(avgFlat * 100) / 100,
    perUnitFlat:   Math.round((avgFlat / (related.reduce((s,e) => s + e.qty, 0) / related.length)) * 100) / 100,
    likelyType:    flatVariance < pctVariance ? 'flat' : 'pct', // which is more consistent
    confidence:    related.length >= 3 ? 'high' : related.length === 2 ? 'medium' : 'low',
    lastUpdated:   new Date().toISOString().split('T')[0],
  };

  saveHistory(history);
  console.log(`[markup-history] Logged: ${brand} / ${account} — markup ${(markupPct * 100).toFixed(1)}% ($${markupAmount.toFixed(2)})`);
  return entry;
}

/**
 * Get markup estimate for a brand/account combo.
 * Returns null if no history exists.
 */
function getMarkupEstimate(brand, account) {
  const history = loadHistory();
  const key = `${brand}__${account}`;
  return history.summaries[key] || null;
}

/**
 * Get all summaries — useful for Kargo's planning context.
 */
function getAllMarkupSummaries() {
  return loadHistory().summaries;
}

/**
 * Format markup summaries as a readable string for Kargo's planning prompt.
 */
function buildMarkupContext() {
  const summaries = getAllMarkupSummaries();
  const lines = Object.values(summaries).map(s =>
    `${s.brand} / ${s.account}: avg ${(s.avgMarkupPct * 100).toFixed(1)}% markup ($${s.avgMarkupFlat.toFixed(2)} avg per order) — ${s.samples} order${s.samples !== 1 ? 's' : ''}, ${s.confidence} confidence`
  );
  if (!lines.length) return '';
  return 'MARKUP HISTORY (use these to estimate costs for accounts without confirmed rates):\n' + lines.join('\n');
}

function variance(vals) {
  if (vals.length < 2) return 0;
  const mean = vals.reduce((s, v) => s + v, 0) / vals.length;
  return vals.reduce((s, v) => s + Math.pow(v - mean, 2), 0) / vals.length;
}

module.exports = { logMarkup, getMarkupEstimate, getAllMarkupSummaries, buildMarkupContext, loadHistory };
