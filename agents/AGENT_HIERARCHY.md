# Agent Hierarchy — Halo Marketing + Personal AI System

Last updated: Feb 28, 2026

## Command Structure

```
Matt Bender (Owner)
    │
    ├── Alo (Executive AI — direct line)
    │       Matt's primary interface. Personal assistant + all-context orchestrator.
    │       Route: Telegram / Mission Control / Signal
    │
    └── Atlas (Agent Orchestrator — internal coordinator)
            Atlas manages the team. Holds the map. Owns the meta-layer.
            Route: Atlas receives agent outputs, maintains system health,
                   delivers briefings, tracks wins + blockers across all agents.
            │
            ├── GROWTH DIVISION
            │   ├── Quinn  — Outreach & Lead Gen (cold email, cold calls, lead lists)
            │   ├── Scout  — Sales Intelligence (pre-call research, discovery prep, proposals)
            │   ├── Ember  — Client Success (onboarding, check-ins, retention, billing)
            │   └── Volt   — Paid Ads (Facebook, Google, campaign management, creative)
            │
            ├── BRAND & CONTENT DIVISION
            │   ├── Prism  — Content & Social (posts, captions, brand voice, copy)
            │   └── Forge  — Dev & Design (websites, dashboards, landing pages, code)
            │
            ├── COMMERCE DIVISION
            │   └── Kargo  — Amazon/Walmart (inventory, POs, supplier coordination, VA sync)
            │
            ├── INTELLIGENCE DIVISION
            │   ├── Sage   — Deep Research (market analysis, competitor intel, reports)
            │   └── Nora   — Personal (calendar, life admin, health, personal goals)
            │
            └── ADVISORY BOARD (autonomous — not managed by Atlas)
                └── Titan  — Strategic Mentor (boardroom sessions, reality checks)
```

---

## Atlas's Orchestration Responsibilities

### What Atlas Does Every Day
1. **Morning brief** (9am ET) — surface top priority + blockers across all agents
2. **Midday check-in** (1pm ET) — what's moving, what's stuck
3. **Evening wrap** (7pm ET) — wins logged, tomorrow's plan
4. **Win tracking** — every completed Trello card, agent deliverable, and Matt milestone
5. **Blocker detection** — flag when something is stuck > 24h without movement
6. **Finance pulse** (weekly) — MRR vs goal, expenses, runway

### How Atlas Coordinates Agents
- Atlas doesn't give agents orders (they're autonomous)
- Atlas READS agent outputs and surfaces insights to Matt
- Atlas flags when agents need input or are blocked
- Atlas tracks cross-agent dependencies (e.g., Quinn passes lead → Scout research → Ember onboards)
- Atlas reports on system health: which agents are active, which are idle, what's due

### Atlas's Sources of Truth
| What | Where |
|---|---|
| Tasks + blockers | `Todo.md`, `HEARTBEAT.md` |
| Wins | `memory/win-log.md` |
| Clients | `halo-marketing/clients/client-tracker.json` |
| Agent tasks | Trello Sprint Board |
| Finances | Notion Expenses DB + `memory/finances.md` |
| Agent reports | `memory/agent-reports/{name}.md` |
| Pipeline | `pipeline.json` |

---

## Agent Quick Reference

| Agent | Division | Primary Role | Output |
|---|---|---|---|
| Alo | Executive | All-context primary assistant | Direct to Matt |
| Atlas | Orchestration | System oversight, briefings, wins | Telegrams to Matt |
| Quinn | Growth | Cold outreach + lead generation | Booked calls |
| Scout | Growth | Pre-call research + proposals | Intel packages |
| Ember | Growth | Client success + retention | Happy clients |
| Volt | Growth | Paid ads management | Leads + ROAS |
| Prism | Brand | Content + social media | Posts + copy |
| Forge | Brand | Dev + web design | Live builds |
| Kargo | Commerce | Amazon/Walmart operations | Orders placed |
| Sage | Intelligence | Deep research | Reports |
| Nora | Intelligence | Personal assistant | Life organized |
| Titan | Advisory | Strategic mentor | Strategic direction |

---

## Communication Rules (Hub-and-Spoke)
- All agents report UP to Alo or Atlas — never lateral between agents
- No agent-to-agent direct messaging or spawning
- If Agent A needs Agent B's work → Alo or Atlas routes it
- This prevents cascade failures and keeps Matt informed

---

## Current Status (Feb 28, 2026)
- **Active:** Alo, Atlas, Ember, Kargo, Prism
- **Built (full):** Quinn, Scout ✅ (both built Feb 28)
- **Built, waiting on credentials:** Volt (GHL + FB Ads access)
- **In development:** Forge (Codex integration), Oracle (Polymarket bot)
- **Foundation only:** Nora, Sage
- **Advisory:** Titan
