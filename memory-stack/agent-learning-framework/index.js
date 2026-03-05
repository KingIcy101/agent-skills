#!/usr/bin/env node
// agent-learning-framework/index.js
// Universal learning API for all agents
// Agents: Nash, Quinn, Ember, Forge, Cyrus, Volt, Prism, Vex, Kargo, Nora

const fs = require('fs');
const path = require('path');
const { callHaiku } = require('../lib');

const WORKSPACE = path.join(__dirname, '../..');
const AGENTS_DIR = path.join(WORKSPACE, 'agents');
const MEMORY_DIR = path.join(WORKSPACE, 'memory');

// Ensure agent directory exists
function ensureAgentDir(agentName) {
  const dir = path.join(AGENTS_DIR, agentName);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  return dir;
}

// Log a correction for an agent
function logCorrection(agentName, context, feedback) {
  const dir = ensureAgentDir(agentName);
  const file = path.join(dir, 'corrections.md');
  
  if (!fs.existsSync(file)) {
    fs.writeFileSync(file, `# Corrections - ${agentName}\n*Agent-specific mistakes to avoid*\n\n`);
  }
  
  const timestamp = new Date().toISOString().slice(0, 10);
  const entry = `## [${timestamp}] Correction\n- **Context:** ${context}\n- **Feedback:** ${feedback}\n\n`;
  fs.appendFileSync(file, entry);
  
  return { agent: agentName, logged: true, file };
}

// Log a success pattern
function logSuccess(agentName, task, approach, outcome, timeMs) {
  const dir = ensureAgentDir(agentName);
  const file = path.join(dir, 'success-patterns.md');
  
  if (!fs.existsSync(file)) {
    fs.writeFileSync(file, `# Success Patterns - ${agentName}\n*What works well for this agent*\n\n`);
  }
  
  const timestamp = new Date().toISOString().slice(0, 10);
  const entry = `## [${timestamp}] Success\n- **Task:** ${task}\n- **Approach:** ${approach}\n- **Outcome:** ${outcome}\n- **Time:** ${timeMs}ms\n\n`;
  fs.appendFileSync(file, entry);
  
  return { agent: agentName, logged: true, file };
}

// Update metrics for an agent
function updateMetrics(agentName, data) {
  const dir = ensureAgentDir(agentName);
  const file = path.join(dir, 'learning-metrics.json');
  
  let metrics = {};
  if (fs.existsSync(file)) {
    metrics = JSON.parse(fs.readFileSync(file, 'utf8'));
  }
  
  // Merge new data
  metrics.lastUpdated = Date.now();
  metrics.totalTasks = (metrics.totalTasks || 0) + (data.tasksCompleted || 0);
  metrics.totalCorrections = (metrics.totalCorrections || 0) + (data.corrections || 0);
  metrics.avgTimeMs = data.avgTimeMs || metrics.avgTimeMs || 0;
  
  fs.writeFileSync(file, JSON.stringify(metrics, null, 2));
  
  return metrics;
}

// Get corrections for an agent (pre-task check)
function getCorrections(agentName) {
  const file = path.join(AGENTS_DIR, agentName, 'corrections.md');
  if (!fs.existsSync(file)) return null;
  return fs.readFileSync(file, 'utf8');
}

// Get success patterns for an agent
function getSuccessPatterns(agentName) {
  const file = path.join(AGENTS_DIR, agentName, 'success-patterns.md');
  if (!fs.existsSync(file)) return null;
  return fs.readFileSync(file, 'utf8');
}

// Get metrics for an agent
function getMetrics(agentName) {
  const file = path.join(AGENTS_DIR, agentName, 'learning-metrics.json');
  if (!fs.existsSync(file)) return null;
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

// Pre-task check: find relevant corrections
async function preTaskCheck(agentName, taskDescription) {
  const corrections = getCorrections(agentName);
  if (!corrections) return { relevant: [] };
  
  try {
    const result = await callHaiku(
      `You help agents learn from past mistakes. Find corrections relevant to this task.
Return ONLY the corrections that apply. Format: ⚠️ [brief reminder]
If none apply, return: NONE`,
      `Agent: ${agentName}\nTask: ${taskDescription}\n\nPast corrections:\n${corrections.slice(0, 4000)}`
    );
    
    if (result && result.trim() !== 'NONE') {
      return { relevant: result.trim().split('\n').filter(l => l.trim()) };
    }
  } catch(e) {
    console.error('Pre-task check failed:', e.message);
  }
  
  return { relevant: [] };
}

// Share insight to knowledge graph
function shareInsight(agentName, insight, category) {
  const file = path.join(MEMORY_DIR, 'knowledge-graph.json');
  
  let graph = { insights: [] };
  if (fs.existsSync(file)) {
    graph = JSON.parse(fs.readFileSync(file, 'utf8'));
  }
  
  graph.insights.push({
    agent: agentName,
    insight,
    category,
    timestamp: Date.now()
  });
  
  // Keep last 100 insights
  if (graph.insights.length > 100) {
    graph.insights = graph.insights.slice(-100);
  }
  
  fs.writeFileSync(file, JSON.stringify(graph, null, 2));
  
  return { shared: true, totalInsights: graph.insights.length };
}

// Get insights from knowledge graph
function getInsights(category = null) {
  const file = path.join(MEMORY_DIR, 'knowledge-graph.json');
  if (!fs.existsSync(file)) return [];
  
  const graph = JSON.parse(fs.readFileSync(file, 'utf8'));
  
  if (category) {
    return graph.insights.filter(i => i.category === category);
  }
  
  return graph.insights;
}

module.exports = {
  logCorrection,
  logSuccess,
  updateMetrics,
  getCorrections,
  getSuccessPatterns,
  getMetrics,
  preTaskCheck,
  shareInsight,
  getInsights
};
