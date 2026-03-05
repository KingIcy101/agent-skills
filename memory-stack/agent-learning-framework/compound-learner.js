#!/usr/bin/env node
// compound-learner.js
// Learning that BUILDS on itself over time
//
// Week 1: "Multi-source verification helps"
// Week 2: "Specifically, NPI + Google Maps + website = best combo for healthcare leads"
// Week 3: "For dental specifically, add state licensing board as 4th source"
// Week 4: "Dental leads in Maryland respond better when contacted within 48hrs of NPI update"
//
// Each insight refines the previous one. Knowledge compounds.

const fs = require('fs');
const path = require('path');
const { callHaiku, log } = require('../lib');

const WORKSPACE = path.join(__dirname, '../..');
const AGENTS_DIR = path.join(WORKSPACE, 'agents');
const PROCESS = 'compound-learner';

function getInsightChainPath(agentName) {
  return path.join(AGENTS_DIR, agentName, 'insight-chains.json');
}

function loadChains(agentName) {
  const file = getInsightChainPath(agentName);
  if (!fs.existsSync(file)) return { chains: [] };
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function saveChains(agentName, data) {
  const dir = path.join(AGENTS_DIR, agentName);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(getInsightChainPath(agentName), JSON.stringify(data, null, 2));
}

// Add a new insight, linking it to existing chains if related
async function addInsight(agentName, insight, context) {
  const data = loadChains(agentName);
  
  // Check if this insight builds on an existing chain
  const existingChains = data.chains.map((c, i) => ({
    index: i,
    topic: c.topic,
    latest: c.insights[c.insights.length - 1].text,
    depth: c.insights.length
  }));
  
  let chainIndex = -1;
  
  if (existingChains.length > 0) {
    try {
      const matching = await callHaiku(
        `Does this new insight build on any existing knowledge chain?
Reply with just the chain number (0-indexed), or "NEW" if it's a new topic.

Existing chains:
${existingChains.map(c => `${c.index}: ${c.topic} (latest: ${c.latest})`).join('\n')}`,
        `New insight: ${insight}\nContext: ${context}`
      );
      
      const match = matching.trim().match(/^(\d+)/);
      if (match) {
        chainIndex = parseInt(match[1]);
        if (chainIndex >= data.chains.length) chainIndex = -1;
      }
    } catch (e) {
      log(PROCESS, `Chain matching failed: ${e.message}`);
    }
  }
  
  const insightEntry = {
    text: insight,
    context,
    timestamp: Date.now(),
    date: new Date().toISOString().slice(0, 10)
  };
  
  if (chainIndex >= 0) {
    // Add to existing chain — this is compound learning!
    data.chains[chainIndex].insights.push(insightEntry);
    data.chains[chainIndex].depth = data.chains[chainIndex].insights.length;
    data.chains[chainIndex].lastUpdated = Date.now();
    
    log(PROCESS, `Compounded insight in chain "${data.chains[chainIndex].topic}" (depth: ${data.chains[chainIndex].depth})`);
  } else {
    // Start new chain
    data.chains.push({
      topic: insight.slice(0, 80),
      insights: [insightEntry],
      depth: 1,
      created: Date.now(),
      lastUpdated: Date.now()
    });
    
    log(PROCESS, `New insight chain started: "${insight.slice(0, 60)}"`);
  }
  
  saveChains(agentName, data);
  
  return {
    chainIndex: chainIndex >= 0 ? chainIndex : data.chains.length - 1,
    depth: chainIndex >= 0 ? data.chains[chainIndex].depth : 1,
    isCompound: chainIndex >= 0
  };
}

// Get the deepest chains (most compounded knowledge)
function getDeepestChains(agentName, limit = 5) {
  const data = loadChains(agentName);
  
  return data.chains
    .sort((a, b) => b.depth - a.depth)
    .slice(0, limit)
    .map(c => ({
      topic: c.topic,
      depth: c.depth,
      evolution: c.insights.map(i => `[${i.date}] ${i.text}`),
      lastUpdated: new Date(c.lastUpdated).toISOString().slice(0, 10)
    }));
}

// Synthesize a chain into a single refined insight
async function synthesizeChain(agentName, chainIndex) {
  const data = loadChains(agentName);
  
  if (chainIndex >= data.chains.length) {
    console.log('Chain index out of range');
    return null;
  }
  
  const chain = data.chains[chainIndex];
  const evolution = chain.insights.map(i => `[${i.date}] ${i.text}`).join('\n');
  
  try {
    const synthesis = await callHaiku(
      `Synthesize this knowledge chain into ONE refined, actionable insight.
The chain shows how understanding evolved over time — combine into the BEST current understanding.

Output: A single paragraph that captures everything learned.`,
      `Topic: ${chain.topic}\n\nEvolution:\n${evolution}`
    );
    
    return {
      topic: chain.topic,
      synthesis: synthesis.trim(),
      depth: chain.depth,
      timespan: `${chain.insights[0].date} → ${chain.insights[chain.insights.length - 1].date}`
    };
  } catch (e) {
    log(PROCESS, `Chain synthesis failed: ${e.message}`);
    return null;
  }
}

// CLI
if (require.main === module) {
  const action = process.argv[2];
  const agentName = process.argv[3];
  
  if (action === 'add') {
    const insight = process.argv[4];
    const context = process.argv[5] || '';
    addInsight(agentName, insight, context).then(r => console.log(JSON.stringify(r, null, 2)));
  } else if (action === 'deep') {
    const limit = parseInt(process.argv[4]) || 5;
    const chains = getDeepestChains(agentName, limit);
    chains.forEach(c => {
      console.log(`\n📚 ${c.topic} (depth: ${c.depth})`);
      c.evolution.forEach(e => console.log(`  ${e}`));
    });
  } else if (action === 'synthesize') {
    const index = parseInt(process.argv[4]) || 0;
    synthesizeChain(agentName, index).then(r => {
      if (r) console.log(`\n🧬 ${r.topic}\n${r.synthesis}\n(${r.timespan}, depth ${r.depth})`);
    });
  } else {
    console.log('Usage:');
    console.log('  node compound-learner.js add <agent> <insight> [context]');
    console.log('  node compound-learner.js deep <agent> [limit]');
    console.log('  node compound-learner.js synthesize <agent> <chain-index>');
  }
}

module.exports = { addInsight, getDeepestChains, synthesizeChain };
