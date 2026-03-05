#!/usr/bin/env node
// preference-engine.js
// Builds and maintains a deep model of Matt's preferences
//
// Not just "Matt prefers X" — but WHY, with confidence levels,
// weighted by recency and frequency.
//
// This is what makes agents feel like they "know" Matt.

const fs = require('fs');
const path = require('path');
const { callHaiku, log } = require('../lib');

const WORKSPACE = path.join(__dirname, '../..');
const MEMORY_DIR = path.join(WORKSPACE, 'memory');
const PREFS_FILE = path.join(MEMORY_DIR, 'preference-model.json');
const PROCESS = 'preference-engine';

function loadPreferences() {
  if (fs.existsSync(PREFS_FILE)) {
    return JSON.parse(fs.readFileSync(PREFS_FILE, 'utf8'));
  }
  return {
    version: '1.0',
    created: Date.now(),
    lastUpdated: Date.now(),
    categories: {},
    // Seeded with known preferences from memory
    preferences: [
      {
        category: 'communication',
        preference: 'Brief and direct, with some warmth — not cold',
        confidence: 'HIGH',
        evidence: ['USER.md explicit statement'],
        lastSeen: Date.now()
      },
      {
        category: 'communication',
        preference: 'Speak directly to Matt (use "you" not "Matt" in third person)',
        confidence: 'HIGH',
        evidence: ['March 4 correction — repeated 3x'],
        lastSeen: Date.now()
      },
      {
        category: 'builds',
        preference: 'No builds without discussed plan and explicit approval first',
        confidence: 'HIGH',
        evidence: ['HEARTBEAT.md rule, March 1'],
        lastSeen: Date.now()
      },
      {
        category: 'builds',
        preference: 'Never say "done" without testing on live URL where Matt will see it',
        confidence: 'HIGH',
        evidence: ['March 4 correction — repeated 4+ times in one session'],
        lastSeen: Date.now()
      },
      {
        category: 'notifications',
        preference: 'Proactively notify when builds/tasks/research completes — don\'t wait for Matt to ask',
        confidence: 'HIGH',
        evidence: ['March 4 explicit request'],
        lastSeen: Date.now()
      },
      {
        category: 'notifications',
        preference: 'Confirm when knowledge/skills/systems are saved with proof of persistence',
        confidence: 'HIGH',
        evidence: ['March 4 explicit request'],
        lastSeen: Date.now()
      },
      {
        category: 'design',
        preference: 'Reduce excessive animations — calmer visual design, functional over flashy',
        confidence: 'HIGH',
        evidence: ['March 4 correction on office visualization, Mission Control UI'],
        lastSeen: Date.now()
      },
      {
        category: 'design',
        preference: 'Modern tech office aesthetic (Figma HQ, Linear, Notion) — not cartoon or game',
        confidence: 'MEDIUM',
        evidence: ['March 4 office build feedback'],
        lastSeen: Date.now()
      },
      {
        category: 'pricing',
        preference: 'Always project at $1,950/mo — $950 clients are exceptions, not the norm',
        confidence: 'HIGH',
        evidence: ['MEMORY.md explicit rule'],
        lastSeen: Date.now()
      },
      {
        category: 'cost',
        preference: 'Use cheap models (Haiku/Flash) for agent execution — save Sonnet/Opus for orchestration and important tasks',
        confidence: 'HIGH',
        evidence: ['March 4 architecture discussion'],
        lastSeen: Date.now()
      }
    ]
  };
}

function savePreferences(prefs) {
  prefs.lastUpdated = Date.now();
  fs.writeFileSync(PREFS_FILE, JSON.stringify(prefs, null, 2));
}

// Add or update a preference
function recordPreference(category, preference, evidence) {
  const prefs = loadPreferences();
  
  // Check if similar preference exists
  const existing = prefs.preferences.find(p =>
    p.category === category &&
    p.preference.toLowerCase().includes(preference.toLowerCase().slice(0, 30))
  );
  
  if (existing) {
    // Strengthen existing preference
    existing.evidence.push(evidence);
    existing.lastSeen = Date.now();
    if (existing.evidence.length >= 3) existing.confidence = 'HIGH';
    else if (existing.evidence.length >= 2) existing.confidence = 'MEDIUM';
    log(PROCESS, `Strengthened preference: ${category} — ${preference.slice(0, 60)}`);
  } else {
    // Add new preference
    prefs.preferences.push({
      category,
      preference,
      confidence: 'LOW',
      evidence: [evidence],
      lastSeen: Date.now()
    });
    log(PROCESS, `New preference: ${category} — ${preference.slice(0, 60)}`);
  }
  
  savePreferences(prefs);
}

// Get preferences for a task context
function getPreferencesFor(taskType) {
  const prefs = loadPreferences();
  
  // Map task types to relevant categories
  const categoryMap = {
    'email': ['communication', 'tone'],
    'build': ['builds', 'design', 'cost'],
    'research': ['research', 'communication'],
    'ui': ['design', 'builds'],
    'notification': ['notifications', 'communication'],
    'pricing': ['pricing', 'business'],
    'outreach': ['communication', 'tone', 'pricing']
  };
  
  const relevantCategories = categoryMap[taskType] || Object.keys(prefs.categories || {});
  
  // Return HIGH and MEDIUM confidence preferences for relevant categories
  return prefs.preferences.filter(p =>
    (relevantCategories.includes(p.category) || relevantCategories.length === 0) &&
    (p.confidence === 'HIGH' || p.confidence === 'MEDIUM')
  );
}

// Weekly: synthesize preferences from session history
async function synthesizeFromHistory(daysBack = 7) {
  log(PROCESS, `Synthesizing preferences from last ${daysBack} days...`);
  
  const notes = [];
  for (let i = 0; i < daysBack; i++) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().slice(0, 10);
    const file = path.join(MEMORY_DIR, `${dateStr}.md`);
    if (fs.existsSync(file)) {
      notes.push(fs.readFileSync(file, 'utf8'));
    }
  }
  
  if (!notes.length) return;
  
  const combined = notes.join('\n\n---\n\n').slice(0, 6000);
  
  try {
    const newPrefs = await callHaiku(
      `Analyze these session notes and extract Matt's preferences.
Look for:
- Things Matt corrected (what he DOESN'T want)
- Things Matt approved/praised (what he DOES want)
- Communication style preferences
- Design preferences
- Process preferences
- Business priorities

For each, output:
CATEGORY: [category]
PREFERENCE: [specific preference]
EVIDENCE: [what in the notes supports this]

Only include genuine preferences backed by evidence.`,
      combined
    );
    
    if (newPrefs) {
      // Parse and add each preference
      const entries = newPrefs.split('\n\n');
      for (const entry of entries) {
        const catMatch = entry.match(/CATEGORY:\s*(.+)/);
        const prefMatch = entry.match(/PREFERENCE:\s*(.+)/);
        const evidMatch = entry.match(/EVIDENCE:\s*(.+)/);
        
        if (catMatch && prefMatch) {
          recordPreference(
            catMatch[1].trim().toLowerCase(),
            prefMatch[1].trim(),
            evidMatch ? evidMatch[1].trim() : 'Weekly synthesis'
          );
        }
      }
      
      log(PROCESS, 'Preference synthesis complete');
    }
  } catch (e) {
    log(PROCESS, `Synthesis failed: ${e.message}`);
  }
}

// Get a compact summary for agent session context
function getPreferenceSummary() {
  const prefs = loadPreferences();
  
  const highConf = prefs.preferences.filter(p => p.confidence === 'HIGH');
  
  const summary = highConf.map(p => `- ${p.category}: ${p.preference}`).join('\n');
  
  return `## Matt's Preferences (${highConf.length} high-confidence)\n${summary}`;
}

// CLI
if (require.main === module) {
  const action = process.argv[2];
  
  if (action === 'view') {
    console.log(getPreferenceSummary());
  } else if (action === 'for') {
    const taskType = process.argv[3];
    const relevant = getPreferencesFor(taskType);
    relevant.forEach(p => console.log(`[${p.confidence}] ${p.category}: ${p.preference}`));
  } else if (action === 'synthesize') {
    const days = parseInt(process.argv[3]) || 7;
    synthesizeFromHistory(days).catch(e => console.error(e));
  } else if (action === 'add') {
    const cat = process.argv[3];
    const pref = process.argv[4];
    const evidence = process.argv[5] || 'manual';
    recordPreference(cat, pref, evidence);
  } else {
    console.log('Usage:');
    console.log('  node preference-engine.js view              Show all high-confidence preferences');
    console.log('  node preference-engine.js for <task-type>   Get preferences for task type');
    console.log('  node preference-engine.js synthesize [days] Extract preferences from history');
    console.log('  node preference-engine.js add <cat> <pref> [evidence]');
  }
}

module.exports = { loadPreferences, recordPreference, getPreferencesFor, getPreferenceSummary, synthesizeFromHistory };
