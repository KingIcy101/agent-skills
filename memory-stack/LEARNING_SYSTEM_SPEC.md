# Learning System - Full Specification
**Date:** March 4, 2026  
**Builder:** Opus (subagent)  
**Scope:** Multi-agent self-learning infrastructure

---

## Core Requirement: Agent-Agnostic

**This system works for ALL agents, not just Alo.**

### Individual Agent Learning
Each agent gets:
- `agents/<name>/corrections.md` - mistakes to avoid
- `agents/<name>/success-patterns.md` - what works
- `agents/<name>/learning-metrics.json` - performance data

Agents: Nash, Quinn, Ember, Forge, Cyrus, Volt, Prism, Vex, Kargo, Nora (+ future agents)

### Cross-Agent Knowledge Sharing
- Central `knowledge-graph.json` stores shared insights
- Nash discovers pattern → shares to graph
- Quinn/Ember/others read graph → apply pattern
- Collective intelligence emerges

---

## Components to Build

### 1. Success Pattern Analysis
- `success-pattern-extractor.js`
- Analyzes sessions that went well
- Extracts reusable patterns
- Stores to `agents/<name>/success-patterns.md`

### 2. Data-Driven Learning
- `learning-metrics-tracker.js`
- Tracks: completion time, corrections/session, approval rate
- A/B tests approaches internally
- Stores to `memory/learning-insights.md`

### 3. Autonomous Knowledge Acquisition
- `proactive-study-scheduler.js`
- Reads skills proactively
- Researches best practices
- Proposes optimizations

### 4. Meta-Learning
- `meta-learner.js`
- Improves the learning process itself
- Detects repeated corrections (why?)
- Optimizes internalization speed

### 5. Continuous Optimization
- `autonomous-optimizer.js`
- Weekly self-review
- Updates own processes
- Proposes experiments

---

## Integration Points

### With Existing Memory Stack
- Hooks into `runner.js`
- Uses `learning-engine.js` (corrections)
- Extends `correction-detector.js`

### With Cron System
**Q: Should learning checks run on cron schedule?**
- Weekly pattern scan (already in learning-engine.js)
- Daily metrics collection?
- Weekly self-review?
- Monthly meta-learning analysis?

**Answer needed:** Which learning tasks should be cron-scheduled vs on-demand?

---

## Cross-Agent Learning Flow

**Example:**
```
Nash (research) discovers: "3+ sources = 2x accuracy"
  ↓
Logs to: agents/nash/success-patterns.md
  ↓
Framework extracts: "Multi-source verification improves accuracy"
  ↓
Shares to: knowledge-graph.json
  ↓
Quinn reads graph
  ↓
Applies pattern to prospect research
  ↓
Ember applies to client intel gathering
  ↓
All agents benefit from Nash's discovery
```

---

## Universal API

Any agent can call:
```javascript
const learning = require('./memory-stack/agent-learning-framework');

// Log success
learning.logSuccess({
  agent: 'nash',
  task: 'lead research',
  approach: 'multi-source verification',
  outcome: 'high accuracy',
  timeMs: 45000
});

// Get relevant patterns
const patterns = learning.getPatterns({
  agent: 'quinn',
  taskType: 'research'
});

// Check for corrections before task
const corrections = learning.preTaskCheck({
  agent: 'ember',
  task: 'draft client email'
});
```

---

## File Structure

```
memory-stack/
├── agent-learning-framework/
│   ├── index.js (main API)
│   ├── success-pattern-extractor.js
│   ├── learning-metrics-tracker.js
│   ├── autonomous-optimizer.js
│   ├── meta-learner.js
│   ├── proactive-study-scheduler.js
│   └── knowledge-graph-manager.js
├── learning-engine.js (existing, enhance)
├── correction-detector.js (existing, extend)
└── runner.js (integrate new components)

agents/
├── nash/
│   ├── corrections.md
│   ├── success-patterns.md
│   └── learning-metrics.json
├── quinn/
│   ├── corrections.md
│   ├── success-patterns.md
│   └── learning-metrics.json
└── [etc for all agents]

memory/
├── knowledge-graph.json (shared insights)
├── learning-insights.md (global patterns)
└── success-patterns.md (Alo-specific, for backward compat)
```

---

## Cron Schedule (TBD)

**Proposed:**
- **Daily (6am):** Metrics collection (`learning-metrics-tracker.js`)
- **Weekly (Sun 2am):** Pattern scan (`success-pattern-extractor.js`)
- **Weekly (Sun 3am):** Meta-learning analysis (`meta-learner.js`)
- **Monthly:** Knowledge graph pruning (remove stale insights)

**Matt to decide:** Which tasks should be cron vs on-demand?

---

## Success Criteria

**Individual agent improvement:**
- Corrections/week trending down
- Task completion time improving
- Approval rate increasing

**Collective intelligence:**
- Cross-agent pattern adoption
- Shared insights being applied
- Network-wide performance gains

**Autonomous optimization:**
- Agents propose improvements without prompting
- Self-directed skill reading
- Experimentation with new approaches

---

**Built by:** Opus subagent (session: agent:main:subagent:8390fef1-47c4-4307-95d3-134df79a664d)  
**Status:** In progress (15min timeout)  
**Deliverable:** Full implementation + LEARNING_SYSTEM_V2.md documentation
