# DELEGATION-FLOWS.md
## Agent Routing Reference + Capability Map

This file is my reference for how tasks flow through the system. Read this when routing decisions, debugging delegations, or planning new integrations.

---

## Routing Map (ATLAS_ROUTE_MAP)

| Keywords | Agent | Role |
|---|---|---|
| research, brief, intel, look up, prospect, pre-call, who is | **Scout** | Sales intelligence |
| cold email, outreach, linkedin, sdr, lead, follow up prospect, find leads | **Quinn** | Outreach |
| client email, check in, renee, jacek, alex, client response, onboard | **Ember** | Client success |
| ads, campaign, ghl, gohighlevel, landing page, facebook, google ads | **Volt** | Paid media |
| post, linkedin, social, content, write, draft, caption, copy | **Prism** | Content/social |
| order, amazon, walmart, supplement, sellerboard, prep center, nova | **Kargo** | Commerce |
| build, code, fix, debug, script, feature, technical | **Forge** | Dev |
| remind, schedule, personal, calendar, appointment, life admin | **Nora** | Personal ops |
| *(no match)* | **Atlas** | Coordination fallback |

---

## Capability Gaps (things I can route but can't yet execute)

### 🔴 Call Review Workflow
- **Trigger words**: "call review", "sales call review", "review calls", "listen to calls"
- **What's missing**: Call recording source (Gong/Fireflies/Aloware recording), review agent workflow, scheduled trigger
- **Owner when built**: Forge (build) → Scout (review logic)

### 🟡 Scheduled Task Triggers
- **Trigger words**: "at 5pm", "tonight", "tomorrow at", time expressions
- **What's missing**: Natural language time parser → cron trigger → task injection
- **Owner when built**: Atlas (orchestration) + Nora (scheduling)

### 🔴 SMS Outreach
- **Trigger words**: "send sms", "text [client/prospect/lead]", "sms blast"
- **What's missing**: A2P 10DLC approval (PENDING — campaign CM46249100768a6f8c6ee84b707995a8be), SMS n8n/Twilio workflow
- **Owner when built**: Volt (Halo outreach) or Quinn (SDR follow-ups)

### 🟡 Social Media API Posting
- **Trigger words**: "post on instagram", "post on facebook", "post on twitter", "tweet"
- **What's missing**: Meta Business API credentials, Twitter API write access, Prism posting workflow wired to APIs
- **Owner when built**: Prism

### 🔴 GHL CRM Automation
- **Trigger words**: "ghl", "go high level", "pipeline stage", "move to stage"
- **What's missing**: GHL Location API key (Matt to provide), webhook/API endpoint wiring
- **Owner when built**: Volt

### 🟡 Notion Write Automation
- **Trigger words**: "notion", "update notion", "add to notion"
- **What's missing**: Notion delegation write endpoint, page/DB ID mapping
- **Owner when built**: Kargo (commerce DBs) or Atlas (general)

### 🟡 Slack Channel Posting
- **Trigger words**: "slack", "post in slack", "send to #"
- **What's missing**: Slack bot token with chat:write scope, channel ID mapping
- **Owner when built**: Kargo (Hafsa comms) or Atlas (internal comms)

---

## Delegation Flow (End-to-End)

```
Matt types in Delegation Panel
  → POST /api/atlas/delegate
    → atlasAutoRoute() → keyword match → agent name
    → detectCapabilityGap() → checks for missing infra
    → Writes to: Atlas inbox.json, pending-executions.json, agent queue
    → Returns: { entry, capability_gaps }
  → UI shows: routing result toast + (if gaps) amber warning card
  → Heartbeat picks up pending-executions.json every 15 min
    → Alo executes task (research, write, build, etc.)
    → Marks done via POST /api/atlas/pending/:id/done
```

## Brain Dump Flow (Planned — Not Yet Built)
```
Matt sends morning message or uses Brain Dump panel
  → POST /api/braindump (not yet built)
    → Haiku reads all items
    → Classifies each: "delegatable" vs "Matt's action"
    → Delegatable items → auto-route same as delegation flow
    → Matt's action items → surfaced back in a clean list
  → Morning Telegram nudge at 8:30am PST (cron job)
```

---

## Agent Communication Rules
- **No lateral agent communication** — all agents report through Atlas/Alo only
- **Hub-and-spoke model** — Atlas is the only coordinator
- **Execution loop**: Alo checks `agents/atlas/pending-executions.json` on every heartbeat

---

*Last updated: 2026-02-28 | Auto-used by Alo for routing decisions*
