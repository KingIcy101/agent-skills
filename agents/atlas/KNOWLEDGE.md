# Atlas — Agent Knowledge Base

This is the routing brain. Every task that comes through Atlas gets matched against this file to find the right agent. Read it before routing anything.

---

## Agent Roster — Full Capabilities & Routing Logic

### 🌟 Alo — Chief AI Assistant
**Role:** Main interface. Matt's right hand. Final decision layer.  
**Good for:** Anything that needs Matt's direct input, cross-agent synthesis, final answers, big picture decisions, anything that doesn't clearly fit elsewhere  
**Routing signal:** "Tell Alo," "urgent," "needs Matt," personal context questions  
**Files:** `SOUL.md`, `USER.md`, `MEMORY.md`  
**Status:** Always online

---

### 🎯 Quinn — Outreach & Sales  
**Role:** Fills the pipeline. Cold email, LinkedIn outreach, SDR hiring, lead qualification  
**Good for:**  
- Write/send cold email sequences  
- LinkedIn InMail campaigns  
- Lead list building from NPI Registry or other sources  
- SDR screening + Colombian applicant review  
- Follow-up sequences for prospects (Suzanne, Mike/Andy, Carl)  
- Cold call scripts for Irene  
**NOT for:** Client management after close (that's Ember), paid ads (that's Volt)  
**Routing signal:** "reach out," "cold email," "follow up with prospect," "SDR," "LinkedIn," "lead list," "Quinn"  
**Files:** `agents/outreach/`  
**Status:** Building (needs Saleshandy API key)  
**Blocker:** Saleshandy API key from Matt

---

### 🛡️ Ember — Account Management  
**Role:** Keeps clients happy. Email responses, check-ins, escalations, onboarding support  
**Good for:**  
- Responding to client emails from alo@gohalomarketing.com  
- Check-in messages to Renee, Jacek, Alex  
- Flagging at-risk clients (results dropping, no response, contract renewal coming)  
- Drafting client-facing reports  
- Escalating cancellation risk to Matt/Atlas  
**NOT for:** New client acquisition (that's Quinn), ad management (that's Volt)  
**Routing signal:** "email client," "check in with," "Renee," "Jacek," "Alex," "client response," "Ember"  
**Files:** `agents/account/`  
**Status:** Online

---

### ⚡ Volt — Paid Ads & Performance  
**Role:** Ad performance, creative, campaign management, GoHighLevel setup  
**Good for:**  
- Facebook/Google ad campaigns for clients  
- Ad creative briefs  
- GoHighLevel landing page setup  
- Campaign performance reports  
- A2P 10DLC tracking (SMS campaign status)  
**NOT for:** Client relationship management (Ember), outreach (Quinn)  
**Routing signal:** "ads," "campaign," "GoHighLevel," "landing page," "GHL," "Facebook," "Google ads," "Volt"  
**Files:** `agents/ads/`  
**Status:** Building (needs GHL API key + FB Ads access)  
**Blocker:** GHL Location API key from Matt + Facebook Ads access

---

### 🎨 Prism — Social Media & Content  
**Role:** Social media content, writing help, LinkedIn posts, copy  
**Good for:**  
- LinkedIn post drafts for Matt/Preston  
- Social media content calendar  
- Writing assistance (grammar, copy, revisions)  
- Content ideas for Halo Marketing  
**NOT for:** Cold email (Quinn), client deliverables (Volt), paid ads  
**Routing signal:** "post," "LinkedIn," "social," "content," "write this," "draft," "caption," "Prism"  
**Files:** `agents/social/`  
**Status:** Online

---

### 📦 Kargo — Commerce & Orders  
**Role:** Amazon/Walmart order management, Notion tracking, Nova sheet updates  
**Good for:**  
- Processing supplement/product orders  
- Updating Nova Prep Center sheet  
- Sellerboard tracking and COGS updates  
- Checking Notion order statuses  
- Flagging orders that need to be placed  
- Supplier intel and order frequency tracking  
**NOT for:** Halo Marketing work, client management  
**Routing signal:** "order," "Amazon," "Walmart," "supplement," "Sellerboard," "prep center," "Nova," "Kargo"  
**Files:** `agents/amazon/`  
**Status:** Online

---

### 🔭 Scout — Sales Intelligence  
**Role:** Pre-call research, prospect intel, competitive analysis, discovery call prep  
**Good for:**  
- Prospect research briefs (website, ads, reviews, red flags)  
- Pre-call packages for Matt/Preston  
- Competitive landscape snapshots  
- Pipeline health scans  
- Post-discovery session notes  
**NOT for:** Direct prospect contact (Quinn), closing calls (Matt/Preston)  
**Routing signal:** "research," "look up," "prep for call," "who is," "brief on," "Scout," "intel"  
**Files:** `agents/sales/`  
**Status:** Online  
**Output:** `halo-marketing/scout/briefs/` and `halo-marketing/scout/packages/`

---

### 🔧 Forge — Builder  
**Role:** Code, infrastructure, builds, technical execution  
**Good for:**  
- Building new features (Mission Control, tools, scrapers)  
- Debugging code issues  
- Infrastructure setup  
- iMac native app build  
- Technical research + feasibility  
**NOT for:** Content, outreach, client management  
**Routing signal:** "build," "code," "fix," "debug," "script," "feature," "Forge"  
**Files:** `agents/builder/`  
**Status:** Online

---

### 🌸 Nora — Personal Assistant  
**Role:** Life admin, scheduling, reminders, personal tasks  
**Good for:**  
- Calendar management  
- Personal reminders  
- Life admin tasks  
- Scheduling meetings  
- Personal finance tracking (non-Halo)  
**NOT for:** Business outreach, agent coordination, Halo ops  
**Routing signal:** "remind me," "schedule," "personal," "calendar," "Nora"  
**Files:** `agents/personal/`  
**Status:** Online

---

### 🔮 Oracle — Research & Intelligence  
**Role:** Market research, competitive intel, data analysis  
**Good for:**  
- Market research reports  
- Competitive landscape analysis  
- Data synthesis across sources  
- Polymarket / prediction tracking  
- Information deep dives  
**Routing signal:** "research," "what's the market," "analyze," "Oracle"  
**Files:** `agents/oracle/` (in development)  
**Status:** Building

---

### 📊 Titan — Data & Analytics  
**Role:** Numbers, reporting, financial analysis, dashboards  
**Good for:**  
- Financial modeling  
- Revenue projections  
- Data analysis  
- Reports and dashboards  
- Expense breakdowns  
**Routing signal:** "numbers," "financial," "report," "Titan," "analyze the data"  
**Files:** `agents/titan/` (in development)  
**Status:** Building

---

### 🧙 Sage — Knowledge  
**Role:** SOPs, documentation, Notion management, training materials  
**Good for:**  
- Writing SOPs  
- Notion database management  
- Onboarding docs  
- Knowledge base maintenance  
**Routing signal:** "SOP," "document," "Notion," "process," "Sage"  
**Status:** Building

---

## Routing Decision Tree

When a task comes in, Atlas applies this logic:

```
Is this urgent + needs Matt's input?
  → Escalate to Alo immediately

Is this about prospect research / pre-call intel?
  → Scout

Is this about finding new prospects / cold outreach?
  → Quinn

Is this about existing client relationships / email response?
  → Ember

Is this about ads / GoHighLevel / campaign management?
  → Volt

Is this about social content / writing / LinkedIn posts?
  → Prism

Is this about Amazon/Walmart orders / Sellerboard?
  → Kargo

Is this about code / builds / technical fixes?
  → Forge

Is this a personal task / scheduling / reminder?
  → Nora

Is this about data / financials / reports?
  → Titan

Is this about research / market intel?
  → Oracle

Can't determine? → Route to Alo
```

---

## Cross-Agent Dependencies (Critical)

These handoffs need Atlas's attention — when one triggers, the other needs to know:

| Trigger | Who Needs to Know | Why |
|---------|------------------|-----|
| Quinn books a discovery call | Scout | Pre-call intel brief needed |
| Volt reports low ad performance | Ember | Client may be at risk — check in before they complain |
| Volt reports new client launch | Kargo | Supplement order may be incoming |
| Renee/Jacek billing date within 3 days | Ember | Prep renewal conversation |
| New Halo client signed | Volt + Ember + Kargo | Launch ads, manage relationship, handle supplements |
| Scout delivers a brief | Matt/Preston | They need to see it before the call |
| Colombian applicant screened | Quinn → Matt | Green-lit applicants need Matt's approval |
| Order needs to be placed | Kargo → Matt | Matt approves; VA executes |

---

## Active Blockers by Agent (as of Feb 28, 2026)

| Agent | Blocker | Who Can Unblock |
|-------|---------|----------------|
| Quinn | Saleshandy API key | Matt |
| Volt | GHL Location API key + FB Ads access | Matt |
| Kargo | Slack bot token missing scope | Matt |
| Alo | GHL Location API key (for GHL integration) | Matt |
| Mission Control | A2P 10DLC (SMS for Alex) | Twilio carrier vetting (automated) |

---

## Current Client Status

| Client | Type | MRR | Status | Agent Owner |
|--------|------|-----|--------|-------------|
| Renee | Chiro | $950 | Active | Ember |
| Jacek | Supplements | $950 | Active | Ember |
| Alex | Chiro x3 | $0 (trial) | Trial | Volt |
| Pierce | Chiro | $1,950 (pending) | Signing | Matt |

**Total Halo MRR: $1,900 | Goal: $300,000 | Gap: $298,100 (~148 more clients)**

---

## Live Data Sources

| Data | Where | How to Access |
|------|-------|--------------|
| Agent reports | `memory/agent-reports/{id}.md` | Read directly |
| Task board | `mission-control-server/todo.json` | Read + `/api/tasks` |
| Pipeline | `mission-control-server/pipeline.json` | Read + `/api/pipeline` |
| Win log | `memory/win-log.md` | Read directly |
| Client tracker | `halo-marketing/clients/client-tracker.json` | Read + `/api/clients` |
| Notion expenses | Notion API (DB: `2e289dac574580ebaea6f7cc01954f47`) | `/api/finances` |
| Amazon/Walmart orders | Notion (DB: `3eda6d0e1c0d4a54905b6cb478f78a45`) | Kargo |
| Sellerboard | `sellerboard-data.json` | `/api/commerce` |
| Memory / daily notes | `memory/YYYY-MM-DD.md` | Read directly |
