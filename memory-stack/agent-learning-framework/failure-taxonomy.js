#!/usr/bin/env node
// failure-taxonomy.js
// Categorizes failures to understand ROOT CAUSES
//
// Not: "I said done without testing"
// But: "Category: PREMATURE_COMPLETION — Root cause: skipped verification step.
//       Prevention: add mandatory verification to quality gate."
//
// Categories emerge from data, not predefined templates.

const fs = require('fs');
const path = require('path');
const { callHaiku, log } = require('../lib');

const WORKSPACE = path.join(__dirname, '../..');
const AGENTS_DIR = path.join(WORKSPACE, 'agents');
const MEMORY_DIR = path.join(WORKSPACE, 'memory');
const TAXONOMY_FILE = path.join(MEMORY_DIR, 'failure-taxonomy.json');
const PROCESS = 'failure-taxonomy';

function loadTaxonomy() {
  if (fs.existsSync(TAXONOMY_FILE)) {
    return JSON.parse(fs.readFileSync(TAXONOMY_FILE, 'utf8'));
  }
  return {
    version: '1.0',
    categories: {},
    failures: [],
    preventionStrategies: {}
  };
}

function saveTaxonomy(data) {
  fs.writeFileSync(TAXONOMY_FILE, JSON.stringify(data, null, 2));
}

// Classify a failure and add to taxonomy
async function classifyFailure(agentName, description, context) {
  const taxonomy = loadTaxonomy();
  
  // Get existing categories for context
  const existingCategories = Object.keys(taxonomy.categories);
  
  try {
    const classification = await callHaiku(
      `Classify this failure into a category and identify root cause.

Existing failure categories: ${existingCategories.join(', ') || 'None yet — create categories as needed'}

For the failure described, output:
CATEGORY: [ALL_CAPS_CATEGORY_NAME]
ROOT_CAUSE: [specific reason this happened]
PREVENTION: [specific action to prevent this in future]
SEVERITY: [LOW | MEDIUM | HIGH | CRITICAL]

Categories should be reusable. Examples:
- PREMATURE_COMPLETION (claimed done before verifying)
- CONTEXT_POLLUTION (used wrong context for the task)
- MISSING_VERIFICATION (didn't check data/output)
- WRONG_APPROACH (used suboptimal method)
- COMMUNICATION_MISMATCH (tone/style didn't match expectations)
- INCOMPLETE_OUTPUT (delivered partial work)

Create new categories when none fit.`,
      `Agent: ${agentName}\nFailure: ${description}\nContext: ${context}`
    );
    
    // Parse classification
    const catMatch = classification.match(/CATEGORY:\s*(\S+)/);
    const rootMatch = classification.match(/ROOT_CAUSE:\s*(.+)/);
    const prevMatch = classification.match(/PREVENTION:\s*(.+)/);
    const sevMatch = classification.match(/SEVERITY:\s*(\S+)/);
    
    const category = catMatch ? catMatch[1].trim() : 'UNCATEGORIZED';
    const rootCause = rootMatch ? rootMatch[1].trim() : description;
    const prevention = prevMatch ? prevMatch[1].trim() : 'Review before shipping';
    const severity = sevMatch ? sevMatch[1].trim() : 'MEDIUM';
    
    // Update taxonomy
    if (!taxonomy.categories[category]) {
      taxonomy.categories[category] = { count: 0, agents: [], firstSeen: Date.now() };
    }
    taxonomy.categories[category].count++;
    if (!taxonomy.categories[category].agents.includes(agentName)) {
      taxonomy.categories[category].agents.push(agentName);
    }
    taxonomy.categories[category].lastSeen = Date.now();
    
    // Add failure record
    taxonomy.failures.push({
      agent: agentName,
      category,
      rootCause,
      prevention,
      severity,
      description: description.slice(0, 200),
      timestamp: Date.now()
    });
    
    // Keep last 200 failures
    if (taxonomy.failures.length > 200) {
      taxonomy.failures = taxonomy.failures.slice(-200);
    }
    
    // Update prevention strategies
    if (!taxonomy.preventionStrategies[category]) {
      taxonomy.preventionStrategies[category] = [];
    }
    if (!taxonomy.preventionStrategies[category].includes(prevention)) {
      taxonomy.preventionStrategies[category].push(prevention);
    }
    
    saveTaxonomy(taxonomy);
    
    log(PROCESS, `Classified: ${category} (${severity}) — ${agentName}`);
    
    return { category, rootCause, prevention, severity };
    
  } catch (e) {
    log(PROCESS, `Classification failed: ${e.message}`);
    return null;
  }
}

// Get prevention strategies for an agent before a task
function getPreventionChecklist(agentName) {
  const taxonomy = loadTaxonomy();
  
  // Find categories this agent has failed in
  const agentCategories = Object.entries(taxonomy.categories)
    .filter(([_, data]) => data.agents.includes(agentName))
    .sort((a, b) => b[1].count - a[1].count);
  
  if (agentCategories.length === 0) return [];
  
  const checklist = [];
  for (const [category, data] of agentCategories) {
    const strategies = taxonomy.preventionStrategies[category] || [];
    checklist.push({
      category,
      frequency: data.count,
      prevention: strategies
    });
  }
  
  return checklist;
}

// Get most common failure categories across all agents
function getTopFailures(limit = 5) {
  const taxonomy = loadTaxonomy();
  
  return Object.entries(taxonomy.categories)
    .sort((a, b) => b[1].count - a[1].count)
    .slice(0, limit)
    .map(([category, data]) => ({
      category,
      count: data.count,
      agents: data.agents,
      prevention: taxonomy.preventionStrategies[category] || []
    }));
}

// CLI
if (require.main === module) {
  const action = process.argv[2];
  
  if (action === 'classify') {
    const agent = process.argv[3];
    const desc = process.argv[4];
    const ctx = process.argv[5] || '';
    classifyFailure(agent, desc, ctx).then(r => console.log(JSON.stringify(r, null, 2)));
  } else if (action === 'checklist') {
    const agent = process.argv[3];
    const checklist = getPreventionChecklist(agent);
    checklist.forEach(c => {
      console.log(`\n🛡️ ${c.category} (${c.frequency}x):`);
      c.prevention.forEach(p => console.log(`  → ${p}`));
    });
  } else if (action === 'top') {
    const limit = parseInt(process.argv[3]) || 5;
    const top = getTopFailures(limit);
    top.forEach(t => {
      console.log(`${t.category}: ${t.count}x (agents: ${t.agents.join(', ')})`);
    });
  } else {
    console.log('Usage:');
    console.log('  node failure-taxonomy.js classify <agent> <description> [context]');
    console.log('  node failure-taxonomy.js checklist <agent>');
    console.log('  node failure-taxonomy.js top [limit]');
  }
}

module.exports = { classifyFailure, getPreventionChecklist, getTopFailures };
