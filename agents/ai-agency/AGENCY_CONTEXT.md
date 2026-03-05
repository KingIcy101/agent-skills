# AI Systems Agency — Shared Context
_Built from Zora's specs + Alo's operational context. Last updated: 2026-03-01_

---

## Who's Building This

- **Matt Bender** — founder, vision, sales
- **Preston** — business partner
- **Zora** — AI agent, frontend architecture + component design
- **Alo** — AI agent, backend systems, dashboard builds, orchestration

---

## What This Is

An AI systems agency that builds and deploys AI-powered tools for businesses — chatbots, lead capture, appointment booking, automations. White-labeled client portals, custom AI personalities per industry.

Not consulting. Not strategy. **We build and run it for them.**

**Relationship to Halo Marketing:** Separate business. Halo Marketing = practitioner marketing (ads, websites, reminders). This agency = AI systems for any business vertical. Could live under the Halo umbrella as "Halo AI" or similar — name TBD. Different revenue stream, different clients, different product.

---

## Zora's Established Foundations

### Design System (DO NOT DEVIATE)

**Dark theme CSS variables:**
```css
:root {
  --bg-primary: #0a0a0f;
  --bg-secondary: #0c0c14;
  --bg-card: #12121a;
  --bg-hover: #1a1a24;
  --border: rgba(255, 255, 255, 0.06);
  --border-hover: rgba(255, 255, 255, 0.1);
  --text-primary: #ffffff;
  --text-secondary: #9ca3af;
  --text-muted: #6b7280;
  --accent: #6366f1;           /* default indigo, swapped per industry */
  --accent-light: #818cf8;
  --accent-dark: #4f46e5;
  --success: #10b981;
  --warning: #f59e0b;
  --error: #ef4444;
  --info: #3b82f6;
}
```

**Tailwind patterns (locked in):**
- Cards: `rounded-2xl bg-white/[0.02] border border-white/[0.06]`
- Primary button: gradient indigo, glow on hover
- Secondary button: `bg-white/5 border border-white/10`
- Inputs: `bg-black/30 border border-white/10`, focus ring indigo
- Badges: colored bg at 20% opacity, matching text color
- Live dot: `w-2 h-2 rounded-full bg-emerald-400 animate-pulse`

### Industry Color Themes (12 verticals mapped)
| Industry | Primary | Notes |
|---|---|---|
| Healthcare | `#10b981` Emerald | Clinics, chiros, medical |
| Legal | `#d4af37` Gold | Law firms |
| Home Services | `#f97316` Orange | HVAC, plumbing, contractors |
| E-commerce | `#ec4899` Rose | Online retail |
| SaaS | `#06b6d4` Cyan | Tech startups |
| Finance | `#3b82f6` Blue | Accounting, financial services |
| Education | `#8b5cf6` Purple | Schools, courses |
| Fitness | `#ef4444` Red | Gyms, studios |
| Restaurant | `#f59e0b` Amber | F&B |
| Real Estate | `#64748b` Slate | Brokers, agents |
| Automotive | `#dc2626` Red | Dealerships |
| Default | `#6366f1` Indigo | Generic / unset |

### Tech Stack (decided)
| Layer | Tool | Notes |
|---|---|---|
| Framework | Next.js 14 | App Router + Server Components |
| Styling | Tailwind CSS | Dark theme custom config |
| Auth | Clerk | Good free tier |
| Database | Supabase | Postgres + realtime |
| AI Routing | OpenRouter | Multi-model |
| Voice | Cartesia | Same stack as Alo |
| Icons | Lucide React | Clean, consistent |
| Deployment | Vercel | Git auto-deploys |

**Model routing strategy (cost optimization):**
- Haiku / Gemini Flash — routine queries, simple tasks (~$0.25/$1.25 per M tokens)
- Sonnet — main workhorse (~$3/$15 per M tokens)
- Opus — complex reasoning only, rare (~$15/$75 per M tokens)

> ⚠️ Note from Alo: OpenRouter does NOT support `openrouter/anthropic/claude-haiku-4-5` format — use `anthropic/claude-haiku-4-5` (direct Anthropic) to avoid 404s. Confirmed bug in our own infra.

---

## Core Product: Client Portal

### 4 Pages (spec complete)

**Dashboard (`/dashboard`)**
- 4 stat cards: Messages, Leads, Appointments, Revenue influenced
- Weekly/monthly performance chart
- Live activity feed (real-time AI actions)
- AI status indicator (pulse dot: online/offline)
- Today's schedule sidebar
- Quick actions panel
- AI insights section (smart recommendations)

**Chat (`/chat`)**
- Message thread, AI vs user styled differently (sides + colors)
- "AI is typing..." indicator
- Timestamps on all messages

**Training (`/training`)**
- List of recent AI conversations
- Expand full thread
- Thumbs up / down per AI message
- Flag for review + correction notes modal
- Filters: flagged / positive / negative / all

**Settings (`/settings`)**
- Business info form (name, industry, description)
- Notification toggles (email, SMS)
- AI personality slider: formal ↔ casual
- Billing section + upgrade CTA
- API keys (for developer clients)

### Reusable Components (built/specced by Zora)
1. **Stat Card** — metric + trend indicator (up/down/neutral)
2. **Live Activity Feed** — real-time action log with pulse dot
3. **ROI Calculator** — sliders → monthly/annual value output
4. **Integration Logo Grid** — 16 tools + "hundreds more via API"
5. **Booking Journey** — 4-step emotional funnel (see below)

---

## Booking / Lead Funnel (4 steps)

Philosophy: **Emotional, not transactional.**

1. **Pain Point** — "What's eating up your team's time?" (multi-select)
   - Answering same questions over and over
   - Following up with leads manually
   - Scheduling/rescheduling appointments
   - Data entry and admin work
   - Customer support requests

2. **Vision** — "Imagine if that was handled automatically..." (transition screen, brief copy)

3. **Business Info** — Industry dropdown, company size, current tools

4. **Book Call** — Calendly/Cal.com embed OR simple contact form

---

## ROI Calculator Logic (for sales calls + landing pages)

```js
monthlySavings = hoursPerWeek * hourlyRate * 4
missedRevenue  = missedLeads * avgDealValue * 0.3 * 4  // 30% close rate assumed
totalMonthly   = monthlySavings + missedRevenue
yearlyValue    = totalMonthly * 12
```

Slider defaults: 20 hrs/wk, $25/hr, 10 missed leads/wk, $500 avg deal

---

## Integration Stack to Display (16 tools)
CRM: Salesforce, HubSpot | Comms: Slack, Intercom | Scheduling: Google Calendar, Calendly | Payments: Stripe, QuickBooks | Support: Zendesk | E-commerce: Shopify | Field Service: ServiceTitan | Email: Mailchimp, Gmail | Voice/SMS: Twilio | Database: Airtable, Notion | Automation: Zapier

---

## Pricing Model

| Tier | Setup | Monthly | What's Included |
|---|---|---|---|
| Starter | $5,000 | $750/mo | Basic AI assistant, single channel, dashboard |
| Pro | $9,500 | $1,000/mo | Multi-channel, custom training, analytics, priority support |
| Enterprise | $25,000+ | $2,500/mo | Full custom build, dedicated support, SLA, integrations |

> 💬 **Alo's take on pricing:** The monthly retainers feel low relative to the setup fees and ongoing management. Halo Marketing charges $1,950/mo for marketing alone. An AI system that handles lead capture, support, booking, AND comes with a custom portal could justify $1,500–$2,500/mo even at the Pro tier. Worth discussing before this gets used in sales conversations.

---

## Open Questions / Things to Align On

- [ ] What's the target verticals to lead with? (Healthcare seems natural given Halo's client base)
- [ ] White-label or branded? Does every client portal say "Powered by [Agency Name]"?
- [ ] Agency name? Separate business from Halo Marketing but could be under Halo umbrella — "Halo AI" floated as option. TBD.
- [ ] Does the client portal live on the agency's domain or the client's?
- [ ] Onboarding flow — how does a new client get set up? Manual? Self-serve?
- [ ] Pricing finalized? (Alo flagged monthly retainers may be too low)
- [ ] What does "custom training" mean in practice? Who does it, how often?
- [ ] Is this separate from Halo Marketing, or do Halo clients get AI systems as an upsell?

---

## For When Alo + Zora Sync

Things to discuss:
1. Component ownership split — what's Zora building vs what's Alo building
2. Shared component library location (repo? shared workspace folder?)
3. How client data flows: portal → database → AI → back to portal
4. Authentication model — one Clerk instance per client or multi-tenant?
5. How AI training data (thumbs up/down in Training page) loops back to improve model
6. Voice channel integration (Cartesia) — is it part of the base product or add-on?
7. Pricing validation — both agents should align before Matt pitches

---

_Zora's original spec: `agents/ai-agency/BUILD_SPECS.md`_
_This context file: `agents/ai-agency/AGENCY_CONTEXT.md`_
