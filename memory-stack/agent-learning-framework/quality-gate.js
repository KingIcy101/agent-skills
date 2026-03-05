#!/usr/bin/env node
// quality-gate.js
// Self-assessment before delivering output
//
// The problem: Agents say "done" without checking their work.
// This creates domain-specific quality rubrics that EVOLVE based on past corrections.
//
// Before shipping, an agent runs: qualityGate.assess(agentName, taskType, output)
// Returns: { pass: true/false, issues: [...], confidence: 0-1 }

const fs = require('fs');
const path = require('path');
const { callHaiku, log } = require('../lib');

const WORKSPACE = path.join(__dirname, '../..');
const AGENTS_DIR = path.join(WORKSPACE, 'agents');
const PROCESS = 'quality-gate';

function getRubricsPath(agentName) {
  return path.join(AGENTS_DIR, agentName, 'quality-rubrics.json');
}

function loadRubrics(agentName) {
  const file = getRubricsPath(agentName);
  if (!fs.existsSync(file)) return getDefaultRubrics();
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function getDefaultRubrics() {
  return {
    universal: [
      { id: 'completeness', question: 'Is the output complete? Nothing missing?', weight: 3 },
      { id: 'accuracy', question: 'Is the data/information accurate? Verified?', weight: 3 },
      { id: 'formatting', question: 'Is the formatting clean and consistent?', weight: 2 },
      { id: 'actionable', question: 'Can the recipient act on this immediately?', weight: 2 },
      { id: 'tested', question: 'Has this been tested/verified (not just assumed to work)?', weight: 3 }
    ],
    taskSpecific: {}
  };
}

// Assess output quality before delivering
async function assess(agentName, taskType, outputDescription) {
  const rubrics = loadRubrics(agentName);
  const dnaPath = path.join(AGENTS_DIR, agentName, 'behavioral-dna.md');
  const dna = fs.existsSync(dnaPath) ? fs.readFileSync(dnaPath, 'utf8') : '';
  
  // Get quality gates from DNA if they exist
  const dnaGates = extractQualityGates(dna);
  
  // Combine universal + task-specific + DNA-derived gates
  const allChecks = [
    ...rubrics.universal,
    ...(rubrics.taskSpecific[taskType] || []),
    ...dnaGates
  ];
  
  const checkList = allChecks.map((c, i) => `${i + 1}. [${c.id}] ${c.question} (weight: ${c.weight})`).join('\n');
  
  try {
    const assessment = await callHaiku(
      `You are a quality assessor for AI agent "${agentName}".
Before this agent ships its output, check it against these quality criteria.

Quality Checklist:
${checkList}

For each item, answer:
- PASS: Criterion met
- FAIL: Criterion NOT met (explain why)
- WARN: Partially met (explain concern)

At the end, give overall: SHIP or HOLD
- SHIP: Output is ready to deliver
- HOLD: Fix issues first

Be strict. Matt shouldn't have to find problems you could catch.`,
      `Task type: ${taskType}\nAgent: ${agentName}\nOutput description:\n${outputDescription.slice(0, 3000)}`
    );
    
    const pass = assessment && (assessment.includes('SHIP') && !assessment.includes('HOLD'));
    const issues = [];
    
    // Extract FAIL and WARN items
    const lines = (assessment || '').split('\n');
    for (const line of lines) {
      if (line.includes('FAIL') || line.includes('WARN')) {
        issues.push(line.trim());
      }
    }
    
    return {
      pass,
      issues,
      assessment: assessment || 'Assessment failed',
      checksRun: allChecks.length
    };
    
  } catch (e) {
    log(PROCESS, `Assessment failed: ${e.message}`);
    return { pass: false, issues: ['Assessment system error'], assessment: e.message, checksRun: 0 };
  }
}

// Learn from a correction to update rubrics
function learnFromCorrection(agentName, taskType, correction) {
  const rubrics = loadRubrics(agentName);
  
  if (!rubrics.taskSpecific[taskType]) {
    rubrics.taskSpecific[taskType] = [];
  }
  
  // Add new check based on correction
  const newCheck = {
    id: `learned-${Date.now()}`,
    question: `Check: ${correction}`,
    weight: 3, // High weight for learned corrections
    source: 'correction',
    addedDate: new Date().toISOString().slice(0, 10)
  };
  
  rubrics.taskSpecific[taskType].push(newCheck);
  
  // Save
  const dir = path.join(AGENTS_DIR, agentName);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(getRubricsPath(agentName), JSON.stringify(rubrics, null, 2));
  
  log(PROCESS, `Added quality check for ${agentName}/${taskType}: ${correction}`);
  
  return newCheck;
}

function extractQualityGates(dna) {
  if (!dna) return [];
  
  // Look for "Quality Gates" section in DNA
  const gatesMatch = dna.match(/## Quality Gates\n([\s\S]*?)(?=\n## |$)/);
  if (!gatesMatch) return [];
  
  const gatesText = gatesMatch[1];
  const checks = [];
  
  // Extract checklist items
  const lines = gatesText.split('\n').filter(l => l.match(/^[-*\d]/) || l.match(/^\[[ x]\]/));
  for (const line of lines) {
    const clean = line.replace(/^[-*\d.\[\]x ]+/, '').trim();
    if (clean.length > 10) {
      checks.push({
        id: `dna-${checks.length}`,
        question: clean,
        weight: 2,
        source: 'behavioral-dna'
      });
    }
  }
  
  return checks;
}

// CLI
if (require.main === module) {
  const action = process.argv[2];
  const agentName = process.argv[3];
  
  if (action === 'assess') {
    const taskType = process.argv[4] || 'general';
    const output = process.argv.slice(5).join(' ') || 'No output description provided';
    assess(agentName, taskType, output).then(result => {
      console.log(JSON.stringify(result, null, 2));
    }).catch(e => console.error(e));
  } else if (action === 'learn') {
    const taskType = process.argv[4];
    const correction = process.argv.slice(5).join(' ');
    learnFromCorrection(agentName, taskType, correction);
  } else {
    console.log('Usage:');
    console.log('  node quality-gate.js assess <agent> <task-type> <output-description>');
    console.log('  node quality-gate.js learn <agent> <task-type> <correction>');
  }
}

module.exports = { assess, learnFromCorrection, loadRubrics };
