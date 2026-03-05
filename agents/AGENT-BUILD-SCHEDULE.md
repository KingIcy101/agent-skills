# Agent Build Schedule

**Standard:** Every agent follows `agents/BUILD_STANDARD.md` — no exceptions. Shared Brain loads first, personality defined before build starts, tested to feel like a real person before launch.
**Rule:** One agent per day. Full build means: identity, playbook, Slack integration, real data wired in, tested against realistic messages.
**Realistic time:** 4–8 hours per agent. Kargo is the benchmark.

---

## Current Status

| Agent | Status | Notes |
|-------|--------|-------|
| Kargo | ✅ Live | Slack bot, order planning, pending tracking, Notion sync. Ongoing refinement. |
| Prism | 🟡 Partial | Voice guide built, Social Studio live. Needs Instagram/TikTok + auto-schedule. |
| Atlas | 🟡 Partial | Morning brief cron works. Needs real orchestration hooks + expense tracking. |
| Quinn | 🔴 Shell | Has playbook. No Slack bot, no live outreach integration. |
| Volt | 🔴 Shell | Has identity. No campaign mgmt, no live ad data pulled. |
| Ember | 🔴 Shell | Has identity. No client onboarding flow, no monthly reporting. |
| Scout | 🔴 Shell | Has identity. No pre-call research automation. |
| Titan | 🟡 Partial | Morning challenge cron works. Deeper strategy sessions need more work. |
| Oracle | ⏳ Backlog | Build last — after Halo agents are running. |

---

## Priority Build Order (Halo-first)

### 🔴 Day 1 — Quinn (Outreach)
**Why first:** Drives new revenue. More clients = everything else matters.
**What to build:**
- Slack bot in `#outreach` or `#sales` channel
- Cold email sequence builder (uses Saleshandy templates)
- Lead scoring from NPI Registry leads (500 VA chiros + dentists already scraped)
- Daily outreach summary → posts to Slack automatically
- CTA: books discovery call → hands off to Scout for pre-call research

**Pre-req Matt provides:** Saleshandy API key or login, Aloware login (for call scripts)

---

### 🔴 Day 2 — Volt (Ads)
**Why second:** Better client results = retention + referrals. Renee and Pierce need this.
**What to build:**
- Slack bot for ad briefings + performance questions
- Campaign brief generator (input: client, niche, budget → output: full FB/Google brief)
- Ad copy generator (headlines, body text, CTAs) — trained on healthcare ad swipe file
- Performance check hook: pull metrics from GHL or manually reported stats
- Alert if ROAS drops below threshold

**Pre-req Matt provides:** GHL access, FB Ads Manager access (read-only at minimum)

---

### 🔴 Day 3 — Ember (Client Success)
**Why third:** Renee and Pierce are live. Someone needs to own their experience.
**What to build:**
- Slack bot for client questions + check-in prep
- Onboarding flow generator (input: client name, niche → output: full onboarding doc)
- Monthly report template (auto-pulls from GHL pipeline data)
- Churn risk detection: flag if no contact in 14 days
- Referral ask trigger: fires at 30-day client milestone

**Pre-req Matt provides:** GHL Location API key (still the main blocker)

---

### 🟡 Day 4 — Atlas (Upgrade)
**Why fourth:** Once Quinn, Volt, Ember are live, Atlas needs to orchestrate them.
**What to build:**
- Pipeline → agent routing (Atlas sees a new lead → kicks Quinn)
- Daily ops digest: Quinn outreach count, Volt ad alerts, Ember client health
- Expense tracker live from Notion → alerts when burn spikes
- Weekly board report for Matt (every Sunday evening)

---

### 🟡 Day 5 — Prism (Complete)
**Why fifth:** Twitter is live. Instagram/TikTok need connecting.
**What to build:**
- Instagram API integration (Meta Graph API)
- TikTok API integration
- Auto-draft Mon/Wed/Fri content suggestions (Prism writes, Matt approves before post)
- Content calendar view in Social Studio (fill in scheduled posts)

**Pre-req Matt provides:** Instagram Business account + Facebook App, TikTok developer account

---

### 🔴 Day 6 — Scout (Sales Intel)
**Why sixth:** Supports Quinn and Matt's discovery calls.
**What to build:**
- Pre-call research automation: input prospect name/website → output full brief in 2 min
- NPI Registry lookup integration
- Competitor analysis (what's their current agency doing?)
- Post-discovery packager: notes → CRM entry + follow-up recommendation

---

## After Halo Agents Are Live

- **Oracle** — prediction market trader (needs wallet + Polymarket API)
- **Kargo refinements** — Google Sheets write, better fuzzy matching, full Ortho targets

---

## Notes
- Don't start a build without the necessary API keys/access from Matt
- Each build day: define personality first → load Shared Brain → wire domain data → build Slack bot → test against realistic messages → document
- Kargo is the reference build — see `mission-control-server/server.js` handleMention for the pattern
- See `agents/BUILD_STANDARD.md` for the full build checklist and system prompt template
- Log progress in `memory/YYYY-MM-DD.md` at end of each build day
- The Shared Brain (`agents/SHARED_BRAIN.md`) is the single source of truth for how all agents behave as people — update it there, every agent inherits it
