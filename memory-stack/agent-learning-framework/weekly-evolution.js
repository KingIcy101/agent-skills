#!/usr/bin/env node
// weekly-evolution.js
// The master weekly job that runs all learning systems
// Designed for cron: Sunday 3am PT
//
// Cost: ~$2/month (30 Haiku calls/week)

const path = require('path');
const { log } = require('../lib');

const PROCESS = 'weekly-evolution';

const AGENTS = ['alo', 'nash', 'quinn', 'ember', 'forge', 'cyrus', 'volt', 'prism', 'vex', 'kargo', 'nora'];

async function runWeeklyEvolution() {
  log(PROCESS, '=== Starting Weekly Evolution ===');
  const startTime = Date.now();
  
  const { extractPatterns } = require('./success-pattern-extractor');
  const { proposeOptimizations } = require('./autonomous-optimizer');
  const { analyzeMetaLearning } = require('./meta-learner');
  const { evolveDNA } = require('./behavioral-dna');
  const { synthesizeFromHistory } = require('./preference-engine');
  
  // Phase 1: Extract success patterns for each agent
  log(PROCESS, 'Phase 1: Success pattern extraction...');
  for (const agent of AGENTS) {
    try {
      await extractPatterns(agent, 7);
    } catch (e) {
      log(PROCESS, `Pattern extraction failed for ${agent}: ${e.message}`);
    }
  }
  
  // Phase 2: Propose optimizations
  log(PROCESS, 'Phase 2: Optimization proposals...');
  for (const agent of AGENTS) {
    try {
      await proposeOptimizations(agent);
    } catch (e) {
      log(PROCESS, `Optimization failed for ${agent}: ${e.message}`);
    }
  }
  
  // Phase 3: Meta-learning analysis
  log(PROCESS, 'Phase 3: Meta-learning...');
  for (const agent of AGENTS) {
    try {
      await analyzeMetaLearning(agent);
    } catch (e) {
      log(PROCESS, `Meta-learning failed for ${agent}: ${e.message}`);
    }
  }
  
  // Phase 4: Evolve behavioral DNA
  log(PROCESS, 'Phase 4: DNA evolution...');
  for (const agent of AGENTS) {
    try {
      await evolveDNA(agent);
    } catch (e) {
      log(PROCESS, `DNA evolution failed for ${agent}: ${e.message}`);
    }
  }
  
  // Phase 5: Synthesize preferences
  log(PROCESS, 'Phase 5: Preference synthesis...');
  try {
    await synthesizeFromHistory(7);
  } catch (e) {
    log(PROCESS, `Preference synthesis failed: ${e.message}`);
  }
  
  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
  log(PROCESS, `=== Weekly Evolution Complete (${elapsed}s) ===`);
  
  return { elapsed, agents: AGENTS.length, phases: 5 };
}

// CLI
if (require.main === module) {
  runWeeklyEvolution()
    .then(r => console.log(`\nComplete: ${r.agents} agents, ${r.phases} phases, ${r.elapsed}s`))
    .catch(e => console.error('Weekly evolution failed:', e));
}

module.exports = { runWeeklyEvolution };
