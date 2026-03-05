#!/usr/bin/env node
// behavioral-dna.js
// The core of real learning: a compact behavioral model for each agent
// 
// Instead of just logging corrections, this builds a DECISION MODEL:
// "When faced with situation X, do Y because Z (evidence: [sessions])"
//
// This is what gets loaded at session start — not a list of mistakes,
// but a refined understanding of HOW to work.

const fs = require('fs');
const path = require('path');
const { callHaiku, log } = require('../lib');

const WORKSPACE = path.join(__dirname, '../..');
const AGENTS_DIR = path.join(WORKSPACE, 'agents');
const MEMORY_DIR = path.join(WORKSPACE, 'memory');
const PROCESS = 'behavioral-dna';

// The DNA file is the most important file an agent has.
// It's a distilled, actionable behavioral model — not raw logs.
function getDNAPath(agentName) {
  return path.join(AGENTS_DIR, agentName, 'behavioral-dna.md');
}

function loadDNA(agentName) {
  const file = getDNAPath(agentName);
  if (!fs.existsSync(file)) return null;
  return fs.readFileSync(file, 'utf8');
}

// Build initial DNA from corrections + success patterns + session history
async function buildDNA(agentName) {
  log(PROCESS, `Building behavioral DNA for ${agentName}...`);
  
  const dir = path.join(AGENTS_DIR, agentName);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  // Gather all learning data
  const corrections = readIfExists(path.join(dir, 'corrections.md'));
  const successes = readIfExists(path.join(dir, 'success-patterns.md'));
  const metrics = readIfExists(path.join(dir, 'learning-metrics.json'));
  const knowledgeGraph = readIfExists(path.join(MEMORY_DIR, 'knowledge-graph.json'));
  
  // Get relevant knowledge graph insights
  let graphInsights = '';
  if (knowledgeGraph) {
    try {
      const graph = JSON.parse(knowledgeGraph);
      const relevant = graph.insights.slice(-20);
      graphInsights = relevant.map(i => `${i.agent}: ${i.insight}`).join('\n');
    } catch {}
  }

  const context = `
AGENT: ${agentName}

CORRECTIONS (mistakes to avoid):
${corrections || 'None yet'}

SUCCESS PATTERNS (what works):
${successes || 'None yet'}

METRICS:
${metrics || 'No metrics yet'}

CROSS-AGENT INSIGHTS:
${graphInsights || 'None yet'}
`.slice(0, 8000);

  try {
    const dna = await callHaiku(
      `You are building a "Behavioral DNA" file for an AI agent named "${agentName}".

This file will be loaded at the START of every session. It must be:
- Compact (under 2000 words)
- Actionable (specific behaviors, not vague advice)
- Structured as decision rules
- Self-improving (notes what needs more data)

Output format:

# Behavioral DNA — ${agentName}
*Last synthesized: [today's date]*

## Identity
[One sentence: what this agent does and its core competency]

## Decision Rules
[Numbered list of "When X, do Y because Z" rules derived from data]
[Each rule tagged with confidence: HIGH (3+ data points), MEDIUM (1-2), LOW (inferred)]

## Quality Gates
[Checklist this agent runs BEFORE delivering any output]
[Derived from past corrections — what to verify]

## Approach Playbook
[Step-by-step for this agent's most common task types]
[Refined from success patterns]

## Anti-Patterns
[Specific things this agent must NEVER do, with why]
[Derived from repeated corrections]

## Active Experiments
[Approaches currently being tested]
[Track: hypothesis, start date, success criteria]

## Knowledge Gaps
[What this agent doesn't know yet but should learn]
[Self-identified areas for improvement]

## Cross-Agent Insights Applied
[Patterns learned from other agents via knowledge graph]

Be specific. Use data. No generic advice.`,
      context
    );

    if (dna && dna.length > 200) {
      fs.writeFileSync(getDNAPath(agentName), dna);
      log(PROCESS, `DNA built for ${agentName}: ${dna.length} chars`);
      return dna;
    }
  } catch (e) {
    log(PROCESS, `DNA build failed for ${agentName}: ${e.message}`);
  }
  
  return null;
}

// Evolve DNA: merge new learnings into existing DNA
// This is the key innovation — DNA EVOLVES, it doesn't just accumulate
async function evolveDNA(agentName) {
  log(PROCESS, `Evolving DNA for ${agentName}...`);
  
  const currentDNA = loadDNA(agentName);
  if (!currentDNA) {
    return buildDNA(agentName);
  }
  
  const dir = path.join(AGENTS_DIR, agentName);
  
  // Get NEW data since last DNA build
  const corrections = readIfExists(path.join(dir, 'corrections.md'));
  const successes = readIfExists(path.join(dir, 'success-patterns.md'));
  const proposals = readIfExists(path.join(dir, 'optimization-proposals.md'));
  const metaInsights = readIfExists(path.join(dir, 'meta-learning-insights.md'));
  
  const context = `
CURRENT DNA (what the agent currently knows):
${currentDNA.slice(0, 4000)}

NEW CORRECTIONS (since last DNA build):
${corrections ? corrections.slice(-2000) : 'None'}

NEW SUCCESS PATTERNS:
${successes ? successes.slice(-2000) : 'None'}

OPTIMIZATION PROPOSALS:
${proposals ? proposals.slice(-1500) : 'None'}

META-LEARNING INSIGHTS:
${metaInsights ? metaInsights.slice(-1500) : 'None'}
`.slice(0, 8000);

  try {
    const evolved = await callHaiku(
      `You are EVOLVING the Behavioral DNA of agent "${agentName}".

You have the current DNA and new data (corrections, successes, proposals).
Your job is to produce an UPDATED DNA that:

1. Keeps all existing rules that are still valid
2. Updates rules based on new evidence (strengthen or weaken confidence)
3. Adds NEW rules from new corrections/successes
4. Removes rules that have been disproven
5. Promotes HIGH-confidence rules (more evidence)
6. Demotes or removes LOW-confidence rules with contradicting data
7. Updates quality gates based on new corrections
8. Refines approach playbooks based on what actually worked
9. Notes which experiments concluded and their results
10. Identifies new knowledge gaps

Keep the same format as the current DNA.
This is EVOLUTION, not replacement — preserve hard-won knowledge.
Be specific. Use data. Compact.`,
      context
    );

    if (evolved && evolved.length > 200) {
      // Backup old DNA
      const backupDir = path.join(dir, 'dna-history');
      if (!fs.existsSync(backupDir)) fs.mkdirSync(backupDir, { recursive: true });
      const backupFile = path.join(backupDir, `dna-${new Date().toISOString().slice(0, 10)}.md`);
      fs.writeFileSync(backupFile, currentDNA);
      
      // Write evolved DNA
      fs.writeFileSync(getDNAPath(agentName), evolved);
      log(PROCESS, `DNA evolved for ${agentName}: ${evolved.length} chars (backed up previous)`);
      return evolved;
    }
  } catch (e) {
    log(PROCESS, `DNA evolution failed for ${agentName}: ${e.message}`);
  }
  
  return currentDNA;
}

function readIfExists(filePath) {
  if (fs.existsSync(filePath)) return fs.readFileSync(filePath, 'utf8');
  return null;
}

// CLI
if (require.main === module) {
  const action = process.argv[2];
  const agentName = process.argv[3];
  
  if (!action || !agentName) {
    console.log('Usage:');
    console.log('  node behavioral-dna.js build <agent-name>     Build initial DNA');
    console.log('  node behavioral-dna.js evolve <agent-name>    Evolve existing DNA');
    console.log('  node behavioral-dna.js view <agent-name>      View current DNA');
    process.exit(1);
  }
  
  if (action === 'build') {
    buildDNA(agentName).then(dna => {
      if (dna) console.log(dna);
      else console.log('Failed to build DNA.');
    }).catch(e => console.error(e));
  } else if (action === 'evolve') {
    evolveDNA(agentName).then(dna => {
      if (dna) console.log(dna);
      else console.log('Failed to evolve DNA.');
    }).catch(e => console.error(e));
  } else if (action === 'view') {
    const dna = loadDNA(agentName);
    if (dna) console.log(dna);
    else console.log(`No DNA found for ${agentName}. Run 'build' first.`);
  }
}

module.exports = { loadDNA, buildDNA, evolveDNA, getDNAPath };
