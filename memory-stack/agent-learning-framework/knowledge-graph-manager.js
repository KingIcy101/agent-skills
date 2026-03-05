#!/usr/bin/env node
// knowledge-graph-manager.js
// Manages cross-agent knowledge sharing
// Insights from one agent benefit all agents

const fs = require('fs');
const path = require('path');
const learning = require('./index');

const KNOWLEDGE_GRAPH_FILE = path.join(__dirname, '../../memory/knowledge-graph.json');

function initializeGraph() {
  if (!fs.existsSync(KNOWLEDGE_GRAPH_FILE)) {
    const graph = {
      version: '1.0',
      created: Date.now(),
      insights: [],
      categories: ['success-pattern', 'meta-learning', 'optimization', 'research', 'communication']
    };
    fs.writeFileSync(KNOWLEDGE_GRAPH_FILE, JSON.stringify(graph, null, 2));
    console.log('Knowledge graph initialized.');
  }
}

function addInsight(agentName, insight, category = 'general') {
  initializeGraph();
  
  const result = learning.shareInsight(agentName, insight, category);
  console.log(`Insight added: ${agentName} → ${category}`);
  console.log(`Total insights in graph: ${result.totalInsights}`);
  
  return result;
}

function getInsightsByCategory(category) {
  initializeGraph();
  
  const insights = learning.getInsights(category);
  console.log(`Found ${insights.length} insights in category: ${category}`);
  
  return insights;
}

function getInsightsByAgent(agentName) {
  initializeGraph();
  
  const allInsights = learning.getInsights();
  const filtered = allInsights.filter(i => i.agent === agentName);
  
  console.log(`Found ${filtered.length} insights from agent: ${agentName}`);
  
  return filtered;
}

function getRecentInsights(limit = 10) {
  initializeGraph();
  
  const all = learning.getInsights();
  const recent = all.slice(-limit);
  
  console.log(`Recent ${limit} insights:`);
  recent.forEach(i => {
    console.log(`  ${i.agent} (${i.category}): ${i.insight.slice(0, 80)}...`);
  });
  
  return recent;
}

function cleanupStaleInsights(maxAgeDays = 90) {
  if (!fs.existsSync(KNOWLEDGE_GRAPH_FILE)) return;
  
  const graph = JSON.parse(fs.readFileSync(KNOWLEDGE_GRAPH_FILE, 'utf8'));
  const cutoff = Date.now() - (maxAgeDays * 24 * 60 * 60 * 1000);
  
  const before = graph.insights.length;
  graph.insights = graph.insights.filter(i => i.timestamp > cutoff);
  const removed = before - graph.insights.length;
  
  fs.writeFileSync(KNOWLEDGE_GRAPH_FILE, JSON.stringify(graph, null, 2));
  
  console.log(`Cleaned up ${removed} stale insights (older than ${maxAgeDays} days)`);
  
  return { removed, remaining: graph.insights.length };
}

// CLI
if (require.main === module) {
  const action = process.argv[2];
  
  if (action === 'init') {
    initializeGraph();
  } else if (action === 'add') {
    const agent = process.argv[3];
    const category = process.argv[4] || 'general';
    const insight = process.argv.slice(5).join(' ');
    
    if (!agent || !insight) {
      console.log('Usage: node knowledge-graph-manager.js add <agent> <category> <insight>');
      process.exit(1);
    }
    
    addInsight(agent, insight, category);
  } else if (action === 'get') {
    const target = process.argv[3];
    
    if (!target) {
      console.log('Usage: node knowledge-graph-manager.js get <category|agent-name>');
      console.log('       node knowledge-graph-manager.js get recent');
      process.exit(1);
    }
    
    if (target === 'recent') {
      getRecentInsights(10);
    } else {
      // Try as category first
      const byCategory = getInsightsByCategory(target);
      if (byCategory.length === 0) {
        // Try as agent
        getInsightsByAgent(target);
      }
    }
  } else if (action === 'cleanup') {
    const days = parseInt(process.argv[3]) || 90;
    cleanupStaleInsights(days);
  } else {
    console.log('Knowledge Graph Manager');
    console.log('Usage:');
    console.log('  node knowledge-graph-manager.js init');
    console.log('  node knowledge-graph-manager.js add <agent> <category> <insight>');
    console.log('  node knowledge-graph-manager.js get <category|agent|recent>');
    console.log('  node knowledge-graph-manager.js cleanup [max-age-days]');
  }
}

module.exports = {
  initializeGraph,
  addInsight,
  getInsightsByCategory,
  getInsightsByAgent,
  getRecentInsights,
  cleanupStaleInsights
};
