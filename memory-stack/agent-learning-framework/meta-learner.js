#!/usr/bin/env node
// meta-learner.js
// Improves the learning process itself
// Analyzes: Which corrections get repeated? Why? How to learn faster?
// Uses CHEAP model (Haiku)

const fs = require('fs');
const path = require('path');
const { callHaiku } = require('../lib');
const learning = require('./index');

async function analyzeMetaLearning(agentName) {
  console.log(`Meta-learning analysis for ${agentName}...`);
  
  const corrections = learning.getCorrections(agentName);
  const metrics = learning.getMetrics(agentName);
  
  if (!corrections) {
    console.log('No corrections data yet.');
    return;
  }
  
  const context = `
Agent: ${agentName}
Total Corrections: ${metrics ? metrics.totalCorrections : 'unknown'}
Total Tasks: ${metrics ? metrics.totalTasks : 'unknown'}

Correction History:
${corrections.slice(-4000)}
`;
  
  try {
    const analysis = await callHaiku(
      `You analyze an agent's learning process.
Questions to answer:
1. Are any corrections getting repeated? (same mistake multiple times)
2. Why might these repetitions happen? (not understanding, not applying, context issue)
3. How can the agent internalize lessons faster?
4. What's blocking improvement?
Be diagnostic and solution-oriented.`,
      context
    );
    
    if (analysis && analysis.length > 50) {
      // Save to meta-learning insights
      const dir = path.join(__dirname, '../../agents', agentName);
      const file = path.join(dir, 'meta-learning-insights.md');
      
      const timestamp = new Date().toISOString().slice(0, 10);
      const entry = `## [${timestamp}] Meta-Learning Analysis\n${analysis}\n\n`;
      
      if (!fs.existsSync(file)) {
        fs.writeFileSync(file, `# Meta-Learning Insights - ${agentName}\n*How to learn better*\n\n`);
      }
      fs.appendFileSync(file, entry);
      
      // Share critical insights to knowledge graph
      if (analysis.includes('repeated') || analysis.includes('blocking')) {
        learning.shareInsight(agentName, analysis.slice(0, 200), 'meta-learning');
      }
      
      console.log(`Meta-learning insights for ${agentName}:`);
      console.log(analysis);
      
      return analysis;
    }
  } catch(e) {
    console.error('Meta-learning analysis failed:', e.message);
  }
}

// CLI
if (require.main === module) {
  const agentName = process.argv[2];
  
  if (!agentName) {
    console.log('Usage: node meta-learner.js <agent-name>');
    console.log('Example: node meta-learner.js nash');
    process.exit(1);
  }
  
  analyzeMetaLearning(agentName).catch(e => console.error(e));
}

module.exports = { analyzeMetaLearning };
