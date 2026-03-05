#!/usr/bin/env node
// reflexion-loop.js
// Based on Reflexion (Shinn et al. 2023) + Multi-Agent Reflexion (MAR, 2025)
//
// The Reflexion pattern: Generate → Evaluate → Reflect → Retry
// Our adaptation: Agent acts → Quality gate evaluates → Reflection generates
// "verbal reinforcement" → Next attempt uses reflection as context
//
// Key insight from research:
// "Reflexion converts feedback into linguistic self-reflection stored in memory,
//  helping agents rapidly learn from prior mistakes"
//
// Multi-Agent Reflexion insight:
// Instead of single-agent self-critique, use MULTIPLE perspective critics
// for richer feedback. In our case: the agent itself + Cyrus (orchestrator)
// + the quality gate system.

const fs = require('fs');
const path = require('path');
const { callHaiku, log } = require('../lib');

const WORKSPACE = path.join(__dirname, '../..');
const AGENTS_DIR = path.join(WORKSPACE, 'agents');
const PROCESS = 'reflexion';

function getReflectionLogPath(agentName) {
  return path.join(AGENTS_DIR, agentName, 'reflection-log.md');
}

function getEpisodicMemoryPath(agentName) {
  return path.join(AGENTS_DIR, agentName, 'episodic-memory.json');
}

// Step 1: After a task, evaluate the trajectory (what happened)
async function evaluate(agentName, task, trajectory, outcome) {
  log(PROCESS, `Evaluating ${agentName} trajectory...`);
  
  try {
    const evaluation = await callHaiku(
      `You are an evaluator for agent "${agentName}".
Score this task execution:

SCORE: 1-10 (1=total failure, 10=perfect execution)
SUCCESS: true/false
ISSUES: List specific problems (or "none")
STRENGTHS: What went well

Be objective. Use evidence from the trajectory.`,
      `Task: ${task}\nTrajectory: ${trajectory.slice(0, 3000)}\nOutcome: ${outcome}`
    );
    
    // Parse score
    const scoreMatch = (evaluation || '').match(/SCORE:\s*(\d+)/);
    const successMatch = (evaluation || '').match(/SUCCESS:\s*(true|false)/i);
    
    return {
      score: scoreMatch ? parseInt(scoreMatch[1]) : 5,
      success: successMatch ? successMatch[1].toLowerCase() === 'true' : false,
      evaluation: evaluation || 'Evaluation failed'
    };
  } catch (e) {
    log(PROCESS, `Evaluation failed: ${e.message}`);
    return { score: 0, success: false, evaluation: 'Error' };
  }
}

// Step 2: Generate self-reflection (verbal reinforcement)
async function reflect(agentName, task, trajectory, evaluation) {
  log(PROCESS, `Generating reflection for ${agentName}...`);
  
  // Load past reflections for context (episodic memory)
  const pastReflections = loadEpisodicMemory(agentName);
  const recentReflections = pastReflections.slice(-3);
  
  const pastContext = recentReflections.length > 0
    ? `\n\nPast reflections:\n${recentReflections.map(r => `- ${r.reflection.slice(0, 150)}`).join('\n')}`
    : '';
  
  try {
    const reflection = await callHaiku(
      `You are agent "${agentName}" reflecting on your own performance.
Generate a SELF-REFLECTION that will help you do better next time.

This reflection will be stored and loaded as context in your next similar task.
Be specific about:
1. What exactly went wrong (if anything)
2. What you would do differently
3. What you should remember for next time

Write in first person ("I should have...", "Next time I will...", "I learned that...")
Keep it actionable and specific — this is YOUR memory for future reference.${pastContext}`,
      `Task: ${task}\nTrajectory: ${trajectory.slice(0, 2000)}\nEvaluation: ${evaluation.slice(0, 1000)}`
    );
    
    return reflection || 'No reflection generated';
  } catch (e) {
    log(PROCESS, `Reflection failed: ${e.message}`);
    return 'Reflection generation failed';
  }
}

// Step 3: Store reflection in episodic memory
function storeReflection(agentName, task, score, reflection) {
  const dir = path.join(AGENTS_DIR, agentName);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  
  // Append to reflection log (human-readable)
  const logFile = getReflectionLogPath(agentName);
  const timestamp = new Date().toISOString().slice(0, 16);
  const entry = `\n## [${timestamp}] Score: ${score}/10\n**Task:** ${task.slice(0, 100)}\n\n${reflection}\n\n---\n`;
  
  if (!fs.existsSync(logFile)) {
    fs.writeFileSync(logFile, `# Reflection Log — ${agentName}\n*Self-reflections from the Reflexion loop*\n`);
  }
  fs.appendFileSync(logFile, entry);
  
  // Store in episodic memory (machine-readable, for loading into future sessions)
  const memFile = getEpisodicMemoryPath(agentName);
  let episodes = [];
  if (fs.existsSync(memFile)) {
    episodes = JSON.parse(fs.readFileSync(memFile, 'utf8'));
  }
  
  episodes.push({
    task: task.slice(0, 200),
    score,
    reflection: reflection.slice(0, 500),
    timestamp: Date.now()
  });
  
  // Keep last 50 episodes
  if (episodes.length > 50) episodes = episodes.slice(-50);
  
  fs.writeFileSync(memFile, JSON.stringify(episodes, null, 2));
  
  log(PROCESS, `Reflection stored for ${agentName} (score: ${score}/10, episodes: ${episodes.length})`);
}

// Load episodic memory for context injection
function loadEpisodicMemory(agentName, limit = 10) {
  const file = getEpisodicMemoryPath(agentName);
  if (!fs.existsSync(file)) return [];
  
  const episodes = JSON.parse(fs.readFileSync(file, 'utf8'));
  return episodes.slice(-limit);
}

// Get reflection context for a new task (inject into agent's session)
function getReflectionContext(agentName, taskDescription) {
  const episodes = loadEpisodicMemory(agentName, 5);
  
  if (episodes.length === 0) return '';
  
  // Find relevant past reflections
  const relevant = episodes.filter(e => {
    const taskWords = taskDescription.toLowerCase().split(' ');
    const episodeWords = e.task.toLowerCase().split(' ');
    return taskWords.some(w => episodeWords.includes(w) && w.length > 3);
  });
  
  const toUse = relevant.length > 0 ? relevant : episodes.slice(-3);
  
  return `\n## Past Reflections (Learn from these)\n${toUse.map(e => 
    `**Task:** ${e.task} (Score: ${e.score}/10)\n**Lesson:** ${e.reflection}`
  ).join('\n\n')}\n`;
}

// Full Reflexion cycle: evaluate → reflect → store
async function runReflexionCycle(agentName, task, trajectory, outcome) {
  log(PROCESS, `=== Reflexion Cycle for ${agentName} ===`);
  
  // Evaluate
  const evalResult = await evaluate(agentName, task, trajectory, outcome);
  
  // Reflect
  const reflection = await reflect(agentName, task, trajectory, evalResult.evaluation);
  
  // Store
  storeReflection(agentName, task, evalResult.score, reflection);
  
  log(PROCESS, `Cycle complete: score=${evalResult.score}, success=${evalResult.success}`);
  
  return {
    score: evalResult.score,
    success: evalResult.success,
    reflection,
    evaluation: evalResult.evaluation
  };
}

// CLI
if (require.main === module) {
  const action = process.argv[2];
  const agentName = process.argv[3];
  
  if (action === 'cycle') {
    const task = process.argv[4] || 'test task';
    const trajectory = process.argv[5] || 'test trajectory';
    const outcome = process.argv[6] || 'test outcome';
    runReflexionCycle(agentName, task, trajectory, outcome)
      .then(r => console.log(JSON.stringify(r, null, 2)));
  } else if (action === 'context') {
    const task = process.argv[4] || '';
    console.log(getReflectionContext(agentName, task));
  } else if (action === 'history') {
    const episodes = loadEpisodicMemory(agentName);
    episodes.forEach(e => {
      console.log(`[${new Date(e.timestamp).toISOString().slice(0, 10)}] Score: ${e.score}/10 — ${e.task}`);
      console.log(`  Reflection: ${e.reflection.slice(0, 100)}...\n`);
    });
  } else {
    console.log('Usage:');
    console.log('  node reflexion-loop.js cycle <agent> <task> <trajectory> <outcome>');
    console.log('  node reflexion-loop.js context <agent> <task-description>');
    console.log('  node reflexion-loop.js history <agent>');
  }
}

module.exports = { runReflexionCycle, getReflectionContext, loadEpisodicMemory, evaluate, reflect, storeReflection };
