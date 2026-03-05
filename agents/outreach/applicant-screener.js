#!/usr/bin/env node
/**
 * applicant-screener.js
 * Reads a Google Sheet of applicants, scores their written English quality,
 * and outputs a ranked review report.
 *
 * Usage:
 *   node applicant-screener.js <SHEET_ID>
 *   APPLICANT_SHEET_ID=<ID> node applicant-screener.js
 *
 * The sheet must be publicly viewable (or shared with your Google account).
 * Uses the gviz/tq CSV endpoint — no OAuth required for public sheets.
 *
 * Expected sheet columns (row 1 = headers):
 *   Name | Email | Application Text | [any other columns]
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

// ─── Config ──────────────────────────────────────────────────────────────────

const SHEET_ID = process.argv[2] || process.env.APPLICANT_SHEET_ID;
const GID = process.env.SHEET_GID || '0'; // tab index (0 = first tab)
const NAME_COL = process.env.NAME_COL || 'Name';
const TEXT_COL = process.env.TEXT_COL || 'Application Text';
const EMAIL_COL = process.env.EMAIL_COL || 'Email';

if (!SHEET_ID) {
  console.error('❌  No Sheet ID provided.');
  console.error('    Usage: node applicant-screener.js <SHEET_ID>');
  console.error('    Or set APPLICANT_SHEET_ID env var.');
  process.exit(1);
}

// ─── Fetch Sheet ─────────────────────────────────────────────────────────────

function fetchSheet(sheetId, gid) {
  return new Promise((resolve, reject) => {
    const url = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv&gid=${gid}`;
    console.log(`📄 Fetching sheet: ${url}\n`);

    https.get(url, (res) => {
      if (res.statusCode === 302 || res.statusCode === 301) {
        // Follow redirect
        https.get(res.headers.location, (res2) => {
          let data = '';
          res2.on('data', (chunk) => data += chunk);
          res2.on('end', () => resolve(data));
          res2.on('error', reject);
        }).on('error', reject);
        return;
      }
      if (res.statusCode !== 200) {
        reject(new Error(`HTTP ${res.statusCode} — Check that the sheet is publicly viewable.`));
        return;
      }
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => resolve(data));
      res.on('error', reject);
    }).on('error', reject);
  });
}

// ─── Parse CSV ───────────────────────────────────────────────────────────────

function parseCSV(raw) {
  const lines = raw.trim().split('\n');
  if (lines.length < 2) return [];

  // Parse header row
  const headers = splitCSVRow(lines[0]).map(h => h.trim().replace(/^"|"$/g, ''));

  const rows = [];
  for (let i = 1; i < lines.length; i++) {
    const vals = splitCSVRow(lines[i]).map(v => v.trim().replace(/^"|"$/g, ''));
    if (vals.every(v => v === '')) continue; // skip empty rows
    const row = {};
    headers.forEach((h, idx) => {
      row[h] = vals[idx] || '';
    });
    rows.push(row);
  }
  return rows;
}

function splitCSVRow(line) {
  // Handles quoted fields with commas inside
  const result = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') { current += '"'; i++; }
      else { inQuotes = !inQuotes; }
    } else if (ch === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += ch;
    }
  }
  result.push(current);
  return result;
}

// ─── Scoring Engine ───────────────────────────────────────────────────────────
/**
 * Scores written English quality on a 1–5 scale.
 * 5 = excellent (native or near-native)
 * 4 = good (minor issues, clearly communicates)
 * 3 = acceptable (noticeable issues but readable)
 * 2 = poor (significant issues, hard to follow)
 * 1 = very poor (incomprehensible or all-caps spam)
 */

function scoreEnglish(text) {
  const notes = [];
  let score = 5;

  if (!text || text.trim().length === 0) {
    return { score: 1, notes: ['No application text provided'] };
  }

  const trimmed = text.trim();
  const wordCount = trimmed.split(/\s+/).length;
  const sentences = trimmed.split(/[.!?]+/).filter(s => s.trim().length > 0);

  // 1. All-caps check
  const upperRatio = (trimmed.replace(/[^A-Z]/g, '').length) /
                     (trimmed.replace(/[^a-zA-Z]/g, '').length || 1);
  if (upperRatio > 0.6) {
    score -= 2;
    notes.push('Mostly or all caps');
  }

  // 2. Very short response
  if (wordCount < 10) {
    score -= 2;
    notes.push(`Very short (${wordCount} words)`);
  } else if (wordCount < 25) {
    score -= 1;
    notes.push(`Short response (${wordCount} words)`);
  }

  // 3. No punctuation
  const hasPunctuation = /[.,!?;:]/.test(trimmed);
  if (!hasPunctuation && wordCount > 15) {
    score -= 1;
    notes.push('No punctuation');
  }

  // 4. Non-English / heavy non-ASCII characters
  const nonAsciiRatio = (trimmed.replace(/[\x00-\x7F]/g, '').length) / (trimmed.length || 1);
  if (nonAsciiRatio > 0.3) {
    score -= 2;
    notes.push(`High non-ASCII character ratio (${Math.round(nonAsciiRatio * 100)}%)`);
  } else if (nonAsciiRatio > 0.1) {
    score -= 1;
    notes.push(`Some non-ASCII characters (${Math.round(nonAsciiRatio * 100)}%)`);
  }

  // 5. Repeated words / spammy patterns
  const lowerText = trimmed.toLowerCase();
  const spamPatterns = [/(.)\1{4,}/, /(.{3,})\1{2,}/];
  if (spamPatterns.some(p => p.test(lowerText))) {
    score -= 1;
    notes.push('Repetitive or spammy text pattern');
  }

  // 6. Very short average sentence length (may indicate fragments)
  if (sentences.length > 0) {
    const avgWordsPerSentence = wordCount / sentences.length;
    if (avgWordsPerSentence < 4 && sentences.length > 2) {
      score -= 1;
      notes.push(`Fragmented sentences (avg ${avgWordsPerSentence.toFixed(1)} words/sentence)`);
    }
  }

  // 7. Common non-English filler that indicates copy-paste or poor translation
  const suspectPhrases = [
    /i am very interest/i,
    /i am hardworking and dedicated/i,
    /i can do the work/i,
    /please give me this opportunity/i,
    /i am good in english/i,
    /i need this job/i,
    /i am a fast learner and hardworking/i,
  ];
  const suspectMatches = suspectPhrases.filter(p => p.test(trimmed));
  if (suspectMatches.length >= 2) {
    score -= 1;
    notes.push('Generic/template phrases detected');
  }

  // 8. Bonus: checks for good writing signals
  const goodSignals = [];
  if (wordCount > 80) goodSignals.push('Detailed response');
  if (/\b(however|therefore|furthermore|additionally|although)\b/i.test(trimmed)) {
    goodSignals.push('Uses connective language well');
  }
  if (/[A-Z][^.!?]*[.!?]/.test(trimmed) && sentences.length >= 3) {
    goodSignals.push('Proper sentence structure');
  }

  // Cap score
  score = Math.max(1, Math.min(5, score));

  return {
    score,
    notes: notes.length ? notes : (goodSignals.length ? goodSignals : ['No major issues detected']),
    goodSignals,
  };
}

// ─── Recommendation ──────────────────────────────────────────────────────────

function recommend(score) {
  if (score >= 4) return '🟢 Green — Strong candidate';
  if (score === 3) return '🟡 Yellow — Review manually';
  return '🔴 Red — Likely not suitable';
}

// ─── Format Report ────────────────────────────────────────────────────────────

function buildReport(scored, date) {
  const lines = [];

  lines.push(`# Applicant English Quality Review`);
  lines.push(`*Generated: ${date}*`);
  lines.push(`*Sheet ID: ${SHEET_ID}*`);
  lines.push('');
  lines.push(`**Total applicants:** ${scored.length}`);
  lines.push(`**Green (4–5):** ${scored.filter(a => a.score >= 4).length}`);
  lines.push(`**Yellow (3):** ${scored.filter(a => a.score === 3).length}`);
  lines.push(`**Red (1–2):** ${scored.filter(a => a.score <= 2).length}`);
  lines.push('');
  lines.push('---');
  lines.push('');
  lines.push('## Ranked Results');
  lines.push('');

  // Markdown table
  lines.push('| Rank | Name | Email | Score | Notes | Action |');
  lines.push('|------|------|-------|-------|-------|--------|');

  scored.forEach((a, idx) => {
    const name = escMd(a.name || '(no name)');
    const email = escMd(a.email || '—');
    const notes = escMd(a.notes.slice(0, 2).join('; ') || '—');
    const action = recommend(a.score);
    lines.push(`| ${idx + 1} | ${name} | ${email} | ${a.score}/5 | ${notes} | ${action} |`);
  });

  lines.push('');
  lines.push('---');
  lines.push('');
  lines.push('## Full Application Text (for manual review)');
  lines.push('');

  scored.forEach((a, idx) => {
    lines.push(`### ${idx + 1}. ${escMd(a.name || '(no name)')} — Score: ${a.score}/5 — ${recommend(a.score)}`);
    lines.push('');
    if (a.email) lines.push(`**Email:** ${escMd(a.email)}`);
    lines.push('');
    lines.push('**Application text:**');
    lines.push('');
    lines.push('> ' + (a.text || '*(empty)*').replace(/\n/g, '\n> '));
    lines.push('');
    lines.push(`**Score breakdown:** ${a.notes.join(', ')}`);
    lines.push('');
    lines.push('---');
    lines.push('');
  });

  return lines.join('\n');
}

function escMd(str) {
  return String(str).replace(/\|/g, '\\|').replace(/\n/g, ' ');
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  try {
    const raw = await fetchSheet(SHEET_ID, GID);
    const rows = parseCSV(raw);

    if (rows.length === 0) {
      console.error('❌  No rows found in sheet. Check column headers and sheet visibility.');
      process.exit(1);
    }

    console.log(`✅  Loaded ${rows.length} applicant rows\n`);

    // Score each applicant
    const scored = rows.map(row => {
      const name = row[NAME_COL] || row['name'] || row['Full Name'] || Object.values(row)[0] || '';
      const email = row[EMAIL_COL] || row['email'] || row['Email Address'] || '';
      const text = row[TEXT_COL] || row['application text'] || row['Cover Letter'] ||
                   row['Tell us about yourself'] || row['Message'] || '';

      const { score, notes } = scoreEnglish(text);
      return { name, email, text, score, notes };
    });

    // Sort by score descending
    scored.sort((a, b) => b.score - a.score);

    // Print summary to console
    console.log('APPLICANT REVIEW SUMMARY');
    console.log('═'.repeat(60));
    console.log(`${'Rank'.padEnd(5)} ${'Name'.padEnd(25)} ${'Score'.padEnd(7)} Action`);
    console.log('─'.repeat(60));
    scored.forEach((a, idx) => {
      const action = recommend(a.score).replace(/🟢|🟡|🔴/g, '').trim();
      console.log(`${String(idx + 1).padEnd(5)} ${(a.name || '(no name)').padEnd(25)} ${String(a.score + '/5').padEnd(7)} ${action}`);
    });
    console.log('═'.repeat(60));

    // Save report
    const dateStr = new Date().toISOString().split('T')[0];
    const outDir = path.join(__dirname);
    const outFile = path.join(outDir, `applicant-review-${dateStr}.md`);
    const report = buildReport(scored, new Date().toLocaleString());
    fs.writeFileSync(outFile, report, 'utf8');
    console.log(`\n📝  Report saved: ${outFile}`);

  } catch (err) {
    console.error('❌  Error:', err.message);
    if (err.message.includes('HTTP 401') || err.message.includes('HTTP 403')) {
      console.error('    The sheet may not be publicly viewable. Share it with "Anyone with the link" to view.');
    }
    process.exit(1);
  }
}

main();
