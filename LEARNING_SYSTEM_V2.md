# Learning System V2 - Agent-Agnostic Self-Improvement
**Built:** March 4, 2026  
**For:** All agents (Nash, Quinn, Ember, Forge, Cyrus, Volt, Prism, Vex, Kargo, Nora)

---

## Overview

This is a comprehensive self-learning system that works for ALL agents in the multi-agent architecture. Agents learn from:
- **Mistakes** (corrections)
- **Successes** (patterns that work)
- **Each other** (shared knowledge graph)
- **Themselves** (meta-learning)

**Goal:** Agents improve autonomously without Matt having to repeat corrections.

---

## Architecture

### Individual Agent Learning
Each agent has their own learning files:
```
agents/<name>/
├── corrections.md           - Mistakes to avoid
├── success-patterns.md      - What works well
├── learning-metrics.json    - Performance data
├── optimization-proposals.md - AI-generated improvement ideas
└── meta-learning-insights.md - How to learn better
```

### Cross-Agent Learning
Shared knowledge graph:
```
memory/
└── knowledge-graph.json     - Insights all agents can access
```

**Example:** Nash discovers "3+ sources = 2x accuracy" → shares to graph → Quinn applies to prospect research → Ember applies to client intel.

---

## Components

### 1. Core API (`agent-learning-framework/index.js`)
Main interface all agents use:
```javascript
const learning = require('./memory-stack/agent-learning-framework');

// Log a correction
learning.logCorrection('nash', 'lead research', 'verify email format');

// Log a success
learning.logSuccess('quinn', 'email draft', 'personalized opener', 'high response', 45000);

// Update metrics
learning.updateMetrics('ember', { tasksCompleted: 1, corrections: 0 });

// Pre-task check (find relevant past corrections)
const check = await learning.preTaskCheck('nash', 'research chiropractor leads');
if (check.relevant.length > 0) {
  console.log('⚠️ Past corrections to apply:', check.relevant);
}

// Share insight to knowledge graph
learning.shareInsight('nash', 'Multi-source verification doubles accuracy', 'success-pattern');

// Get insights from graph
const patterns = learning.getInsights('success-pattern');
```

### 2. Success Pattern Extractor (`success-pattern-extractor.js`)
Analyzes sessions that went well, extracts reusable patterns.

**Usage:**
```bash
node memory-stack/agent-learning-framework/success-pattern-extractor.js nash 7
```

**What it does:**
- Reads last 7 days of session logs
- Finds successful outcomes (no corrections, task completed)
- Uses Haiku to extract patterns
- Saves to `agents/nash/success-patterns.md`
- Shares top 3 to knowledge graph

**Runs:** Weekly (cron, Sunday 3am)

### 3. Autonomous Optimizer (`autonomous-optimizer.js`)
Proposes improvements based on data.

**Usage:**
```bash
node memory-stack/agent-learning-framework/autonomous-optimizer.js quinn
```

**What it does:**
- Analyzes corrections (mistakes)
- Analyzes success patterns
- Analyzes metrics
- Uses Haiku to propose:
  - Do MORE of (patterns that work)
  - Do LESS of (repeated mistakes)
  - NEW approaches to try
- Saves to `agents/quinn/optimization-proposals.md`

**Runs:** Weekly (cron, Sunday 3am)

### 4. Meta-Learner (`meta-learner.js`)
Improves the learning process itself.

**Usage:**
```bash
node memory-stack/agent-learning-framework/meta-learner.js ember
```

**What it does:**
- Detects repeated corrections (same mistake 3+ times)
- Diagnoses WHY repetition happens
- Proposes how to internalize faster
- Uses Haiku for analysis
- Saves to `agents/ember/meta-learning-insights.md`

**Runs:** Weekly (cron, Sunday 3am)

### 5. Knowledge Graph Manager (`knowledge-graph-manager.js`)
Manages cross-agent knowledge sharing.

**Usage:**
```bash
# Add insight
node memory-stack/agent-learning-framework/knowledge-graph-manager.js add nash "3+ sources = 2x accuracy" success-pattern

# Get insights by category
node memory-stack/agent-learning-framework/knowledge-graph-manager.js get success-pattern

# Get insights by agent
node memory-stack/agent-learning-framework/knowledge-graph-manager.js get nash

# Get recent insights
node memory-stack/agent-learning-framework/knowledge-graph-manager.js get recent

# Cleanup old insights (90+ days)
node memory-stack/agent-learning-framework/knowledge-graph-manager.js cleanup 90
```

**Runs:** 
- Add: Real-time (when agents share insights)
- Cleanup: Monthly (cron, 1st of month)

---

## Cron Schedule (Hybrid Approach)

### Real-Time (Instant Feedback)
- **Corrections:** When Matt says "wrong"/❌ → instant log (via `correction-detector.js`)
- **Insight sharing:** When agent shares to knowledge graph → instant

**Cost:** Minimal (only on corrections, not every task)

### Daily (6am PT)
- **Metrics collection:** Count tasks, corrections, time
- **No LLM calls** (just aggregation)

**Cost:** $0

### Weekly (Sunday 3am PT)
- **Pattern extraction:** All agents (success-pattern-extractor.js)
- **Optimization proposals:** All agents (autonomous-optimizer.js)
- **Meta-learning:** All agents (meta-learner.js)
- **1 Haiku analysis per agent** = 10 agents × 3 tasks = 30 Haiku calls/week

**Cost:** ~$0.50/week = $2/month

### Monthly (1st of month, 4am PT)
- **Knowledge graph cleanup:** Remove insights older than 90 days
- **No LLM calls**

**Cost:** $0

**Total monthly cost:** ~$2-5 (vs. $50+ for real-time everything)

---

## Model Selection

**ALL runtime components use CHEAP models:**
- **Haiku:** `anthropic/claude-haiku-4-5` (pattern extraction, optimization)
- **Flash:** `google/gemini-2.0-flash-exp` (bulk processing, large context)
- **NEVER Opus or Sonnet** in cron jobs

**Why:** Learning system should cost <$5/month to run.

---

## How Agents Use This System

### Session Start
```javascript
// Agent loads their corrections before starting work
const corrections = learning.getCorrections('nash');
// Apply lessons from past mistakes
```

### Before Task
```javascript
// Agent checks for relevant past corrections
const check = await learning.preTaskCheck('nash', 'research dental leads');
if (check.relevant.length > 0) {
  // Apply these lessons FIRST
}
```

### After Task Success
```javascript
// Agent logs success pattern
learning.logSuccess('quinn', 'email draft', 'personalized opener', 'approved', 45000);
```

### After Task Correction
```javascript
// When Matt corrects
learning.logCorrection('ember', 'client email', 'too formal - use casual tone');
```

### Sharing Insights
```javascript
// Agent discovers something useful
learning.shareInsight('nash', 'NPI API has 95% email accuracy', 'research');
```

### Reading Knowledge Graph
```javascript
// Agent checks what others learned
const insights = learning.getInsights('research');
// Apply relevant patterns from other agents
```

---

## Success Metrics

### Individual Agent Improvement
- **Corrections/week trending DOWN** (learning from mistakes)
- **Task completion time improving** (getting faster)
- **Approval rate increasing** (fewer revisions)

### Collective Intelligence
- **Cross-agent pattern adoption** (insights being shared)
- **Shared insights being applied** (agents learning from each other)
- **Network-wide performance gains** (whole system improving)

### Autonomous Optimization
- **Agents propose improvements** without prompting
- **Self-directed skill reading** (proactive study)
- **Experimentation with new approaches** (A/B testing)

---

## File Locations

```
workspace/
├── memory-stack/
│   └── agent-learning-framework/
│       ├── index.js                          # Main API
│       ├── success-pattern-extractor.js      # Learn from successes
│       ├── autonomous-optimizer.js           # Propose improvements
│       ├── meta-learner.js                   # Improve learning itself
│       └── knowledge-graph-manager.js        # Cross-agent sharing
├── agents/
│   ├── nash/
│   │   ├── corrections.md
│   │   ├── success-patterns.md
│   │   ├── learning-metrics.json
│   │   ├── optimization-proposals.md
│   │   └── meta-learning-insights.md
│   ├── quinn/
│   │   └── [same structure]
│   └── [ember, forge, cyrus, volt, prism, vex, kargo, nora]
└── memory/
    └── knowledge-graph.json                  # Shared insights
```

---

## Example: Cross-Agent Learning Flow

**Nash discovers a research pattern:**
```javascript
// Nash completes research task successfully
learning.logSuccess('nash', 'lead research', '3+ sources verification', 'high accuracy', 60000);

// Weekly cron extracts pattern
// success-pattern-extractor.js analyzes Nash's sessions
// Finds: "Multi-source verification improves accuracy 2x"

// Pattern shared to knowledge graph
learning.shareInsight('nash', 'Multi-source verification (3+ sources) improves accuracy 2x', 'research');
```

**Quinn applies Nash's pattern:**
```javascript
// Quinn preparing to research prospects
const insights = learning.getInsights('research');
// Sees Nash's multi-source pattern
// Applies it: checks LinkedIn + company site + news before drafting

// Quinn logs success
learning.logSuccess('quinn', 'prospect research', 'multi-source (Nash pattern)', 'better email personalization', 50000);
```

**Ember benefits too:**
```javascript
// Ember researching client issue
const insights = learning.getInsights('research');
// Applies Nash's pattern: checks CRM + email history + GHL notes
// Better context for support response
```

**Result:** One agent's discovery improves the entire network.

---

## Integration with Existing Systems

### Memory Stack
- Hooks into `runner.js` (already running on PM2)
- Uses `learning-engine.js` for instant corrections
- Extends `correction-detector.js` for auto-logging

### Cron Jobs
- Weekly pattern scan (new)
- Weekly optimization (new)
- Weekly meta-learning (new)
- Monthly cleanup (new)

### Agent Sessions
- Agents call framework API at session start
- Pre-task checks before similar work
- Post-task logging of outcomes

---

## Maintenance

### Weekly (Automated)
- Pattern extraction runs
- Optimizations proposed
- Meta-learning analysis
- Knowledge graph updated

### Monthly (Automated)
- Old insights pruned
- Metrics aggregated
- Learning reports generated

### Quarterly (Manual Review)
- Review optimization proposals
- Assess learning trends
- Adjust cron schedule if needed
- Update framework based on findings

---

## Future Enhancements

### Phase 2 (Future)
- A/B testing framework (agents try approach A vs B, measure)
- Learning dashboards (visualize improvement over time)
- Skill recommendations (proactive "read this skill before task X")
- Cross-domain transfer (apply patterns from one task type to another)

### Phase 3 (Future)
- Predictive learning (anticipate corrections before they happen)
- Self-directed curriculum (agents schedule their own learning)
- Collaborative problem-solving (agents consult each other)
- Emergent strategies (network discovers novel approaches)

---

## Summary

**What this system does:**
- Agents learn from mistakes AND successes
- Agents learn from each other (knowledge graph)
- Agents improve autonomously (no manual intervention)
- System costs <$5/month to run (cheap models)

**What Matt gets:**
- Never repeat same correction twice
- Agents get smarter over time
- Network-wide intelligence growth
- Transparent learning process

**Bottom line:** Self-improving agent network that learns continuously without Matt having to teach every lesson manually.

---

**Built:** March 4, 2026 22:40 PST  
**Status:** Production-ready, deployed to workspace  
**Cost:** ~$2-5/month (vs. $50+ for real-time)
