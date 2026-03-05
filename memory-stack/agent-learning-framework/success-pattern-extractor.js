#!/usr/bin/env node
// success-pattern-extractor.js
// Analyzes sessions that went well, extracts reusable patterns
// Uses CHEAP model (Haiku)

const fs = require('fs');
const path = require('path');
const { callHaiku } = require('../lib');
const learning = require('./index');

const MEMORY_DIR = path.join(__dirname, '../../memory');

async function extractPatterns(agentName, daysBack = 7) {
  console.log(`Extracting success patterns for ${agentName} (last ${daysBack} days)...`);
  
  // Read recent daily notes
  const notes = [];
  for (let i = 0; i < daysBack; i++) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().slice(0, 10);
    const file = path.join(MEMORY_DIR, `${dateStr}.md`);
    
    if (fs.existsSync(file)) {
      const content = fs.readFileSync(file, 'utf8');
      // Look for mentions of the agent and successful outcomes
      if (content.toLowerCase().includes(agentName.toLowerCase())) {
        notes.push(content);
      }
    }
  }
  
  if (notes.length === 0) {
    console.log('No relevant session data found.');
    return;
  }
  
  const combined = notes.join('\n\n---\n\n').slice(0, 6000);
  
  try {
    const patterns = await callHaiku(
      `Analyze these session logs for agent "${agentName}".
Extract patterns from SUCCESSFUL sessions (tasks completed well, no corrections).
What approaches worked? What led to good outcomes?
Return actionable patterns: "When doing X, Y approach works best"
Be specific and reusable.`,
      combined
    );
    
    if (patterns && patterns.length > 50) {
      // Save to agent's success-patterns.md
      const timestamp = new Date().toISOString().slice(0, 10);
      learning.logSuccess(
        agentName,
        'pattern extraction',
        'weekly analysis',
        `Extracted ${patterns.split('\n').length} patterns`,
        0
      );
      
      // Also share key insights to knowledge graph
      const lines = patterns.split('\n').filter(l => l.trim());
      lines.slice(0, 3).forEach(insight => {
        learning.shareInsight(agentName, insight, 'success-pattern');
      });
      
      console.log(`Patterns extracted for ${agentName}:`);
      console.log(patterns);
      
      return patterns;
    }
  } catch(e) {
    console.error('Pattern extraction failed:', e.message);
  }
}

// CLI
if (require.main === module) {
  const agentName = process.argv[2];
  const daysBack = parseInt(process.argv[3]) || 7;
  
  if (!agentName) {
    console.log('Usage: node success-pattern-extractor.js <agent-name> [days-back]');
    console.log('Example: node success-pattern-extractor.js nash 7');
    process.exit(1);
  }
  
  extractPatterns(agentName, daysBack).catch(e => console.error(e));
}

module.exports = { extractPatterns };
