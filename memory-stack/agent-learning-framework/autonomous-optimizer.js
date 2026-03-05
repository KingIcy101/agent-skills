#!/usr/bin/env node
// autonomous-optimizer.js
// Proposes improvements based on data
// Uses CHEAP model (Haiku or Flash)

const fs = require('fs');
const path = require('path');
const { callHaiku } = require('../lib');
const learning = require('./index');

async function proposeOptimizations(agentName) {
  console.log(`Analyzing ${agentName} for optimization opportunities...`);
  
  // Gather agent data
  const corrections = learning.getCorrections(agentName);
  const patterns = learning.getSuccessPatterns(agentName);
  const metrics = learning.getMetrics(agentName);
  
  if (!corrections && !patterns) {
    console.log('Insufficient data for optimization.');
    return;
  }
  
  const context = `
Agent: ${agentName}
Metrics: ${metrics ? JSON.stringify(metrics, null, 2) : 'No metrics yet'}

Recent Corrections:
${corrections ? corrections.slice(-2000) : 'None'}

Success Patterns:
${patterns ? patterns.slice(-2000) : 'None'}
`;
  
  try {
    const optimizations = await callHaiku(
      `You analyze agent performance and propose improvements.
Based on corrections (mistakes) and success patterns, suggest:
1. What the agent should do MORE of (patterns that work)
2. What the agent should do LESS of (repeated mistakes)
3. New approaches to try (experiments)
Be specific and actionable.`,
      context
    );
    
    if (optimizations && optimizations.length > 50) {
      // Save to a proposals file
      const dir = path.join(__dirname, '../../agents', agentName);
      const file = path.join(dir, 'optimization-proposals.md');
      
      const timestamp = new Date().toISOString().slice(0, 10);
      const entry = `## [${timestamp}] Optimization Proposals\n${optimizations}\n\n`;
      
      if (!fs.existsSync(file)) {
        fs.writeFileSync(file, `# Optimization Proposals - ${agentName}\n\n`);
      }
      fs.appendFileSync(file, entry);
      
      console.log(`Optimizations proposed for ${agentName}:`);
      console.log(optimizations);
      
      return optimizations;
    }
  } catch(e) {
    console.error('Optimization failed:', e.message);
  }
}

// CLI
if (require.main === module) {
  const agentName = process.argv[2];
  
  if (!agentName) {
    console.log('Usage: node autonomous-optimizer.js <agent-name>');
    console.log('Example: node autonomous-optimizer.js nash');
    process.exit(1);
  }
  
  proposeOptimizations(agentName).catch(e => console.error(e));
}

module.exports = { proposeOptimizations };
