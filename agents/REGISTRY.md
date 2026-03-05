# Agent Registry

> Quick reference for Alo. Use trigger phrases or describe the task — I'll route to the right agent.

## Alo (Orchestrator)
**Me.** Handles everything, delegates to specialists, QAs output, manages Matt's personal life.  
**Always active.**

---

## Scout — Sales Intelligence
📁 `agents/scout/` · Instructions: `agents/scout/INSTRUCTIONS.md`
**Job:** Prospect research briefs, discovery call prep, market signals  
**Trigger:** "Research [name/location]" · "Prep brief for [name]" · "Who is [prospect]?"  
**Rule:** Never runs without explicit direction. No self-initiated research.

---

## Quinn — Outreach
📁 `agents/outreach/`  
**Job:** Cold email sequences, cold call scripts, follow-up cadences  
**Trigger:** "Build email sequence for [niche]" · "Cold call script for [niche]" · "Follow-up plan for [name]"  
**Blocked on:** Saleshandy API key

---

## Ember — Client Success / Email
📁 `agents/ember/` · Instructions: `agents/ember/INSTRUCTIONS.md`
**Job:** Gmail triage, draft responses, client onboarding tracking, monthly reports  
**Trigger:** "Check the inbox" · "Draft response to [client]" · "Renee's monthly report" · "Any urgent emails?"  
**Active:** Gmail scanner runs every 30min via PM2 (ember-scanner)

---

## Vex — Ad Creatives *(Not Yet Built)*
📁 `agents/creatives/`  
**Job:** Ad creative production — hooks, copy, image/video briefs, UGC scripts, angle testing  
**Works with:** Volt (strategy → Vex executes creative), Ember (knows client context)  
**Trigger:** "Vex, write ad creatives for [client]" · "Build hooks for [niche]" · "UGC script for [client]" · "Angle test for [campaign]"

---

## Volt — Ads
📁 `agents/ads/`  
**Job:** Facebook/Google campaigns, ad copy, creative briefs, performance audits  
**Trigger:** "Build a campaign for [client]" · "Write Facebook ads for [niche]" · "Audit [client]'s ad performance" · "Write Google RSAs for [client]"

---

## Prism — Content
📁 `agents/content/`  
**Job:** Social posts, email copy, ad creative briefs, brand voice guides  
**Trigger:** "Write social posts for [topic]" · "Build content calendar for [month]" · "Email to prospect list about [topic]" · "Brand voice guide for [client]" · "Creative brief for [Volt's campaign]"

---

## Kargo — Amazon/Walmart Operations
📁 `agents/kargo/` · Instructions: `agents/kargo/INSTRUCTIONS.md`
**Job:** Order tracking, Slack PAID sync, Notion status updates, Nova Prep alerts, stuck order flags  
**Trigger:** "Order status for [brand]" · "Any stuck orders?" · "Sync Notion" · "Check Slack for new PAIDs"  
**Active:** kargo-slack-sync.js runs every 30min via PM2

---

## Atlas — Chief of Staff
📁 `agents/atlas/`  
**Job:** 3 daily briefings (9am/1pm/7pm ET auto via cron), win logging, blocker detection, client health watch, streak tracking  
**Trigger:** "Atlas, where do things stand?" · "Log that as a win: [what]" · "What's been stuck?" · "Brief me" · Runs automatically 3x/day

---

## Titan — Entrepreneur Mentor
📁 `agents/mentor/`  
**Job:** Strategic advisor, decision reviewer, mindset calibrator, alignment keeper. Composite of Hormozi, Naval, Bezos, Gadzhi, Frisella, Buffett, Musk, Cuban and more. Pushes back, gives verdicts, keeps the 150-client vision front and center.  
**Trigger:** "Titan, what do you think about [decision]?" · "Mentor session" · "Am I thinking too small?" · "Critique my offer" · "What's holding us back?" · "Weekly board session"

---

## Sage — Deep Research Agent 🔬
📁 `agents/sage/`
**Job:** Deep research and strategic analysis using extended thinking. Returns structured reports with sources, data points, and actionable recommendations for Halo.
**Cost:** ~$0.50–$2 per session | 50k token hard cap | **ALWAYS confirm with Matt before spawning**
**Trigger:** "Sage, research [topic]" · "deep dive on [competitor/market]" · "what are agencies charging for [service]?" · "research [strategic question]"
**Never use for:** Routine tasks, quick lookups, anything time-sensitive

---

## Nora — Personal Assistant & Bookkeeper *(Not Yet Built)*
📁 `agents/personal/`  
**Job:** Personal life + personal finances. Appointment booking, reminders, family/Vanessa coordination, gifting — AND tracking all personal + non-inventory business expenses. Acts as Matt's personal accountant/bookkeeper.  
**Tone:** Warm, organized, proactive. Feels like a trusted personal EA who also keeps the books.  
**Trigger:** "Nora, remind me to..." · "Book me a [appointment]" · "How much did I spend on X this month?" · "Log a $X expense for [category]" · "What's my real take-home this month?"  
**Keeps track of:** Matt's family, Vanessa, personal calendar, recurring commitments, ALL personal expenses (rent, car, insurance, utilities, bills, supplies), cross-board P&L  
**Finance scope:** Personal expenses + Halo burn + Amazon profit = real net. Monthly summary, category breakdowns, statement import (Phase 2).  
**Does NOT touch:** Amazon inventory orders (Kargo), Halo client ops (Ember/Atlas), agent builds

---

## Oracle — Prediction Market Trader *(Build Last)*
📁 `agents/oracle/`  
**Job:** Scans Polymarket for mispriced outcomes, researches probability, executes trades with Matt's approval, tracks P&L  
**Status:** Blueprint ready — build after Halo agents are fully running  
**Needs:** Polygon wallet + USDC + Polymarket API key (Matt to set up when ready)  
**Trigger:** "Oracle, scan for edges" · "Oracle, research [market]" · "Oracle, portfolio review"

---

## Spawning an Agent
```
sessions_spawn(task: "[paste agent's IDENTITY.md + PLAYBOOK.md as context, then state the specific task]")
```
See `ORCHESTRATOR.md` for delegation rules and QA checklist.
