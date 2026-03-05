# Scout — Domain Knowledge

## Halo Marketing Context

Halo sells marketing services to healthcare practitioners. My job is to research prospects *before* Matt and Preston talk to them, and to organize the intelligence *after* so the closing process is sharper.

**Halo's full-funnel differentiator:**
- Most agencies do ads only. Halo does ads + AI appointment reminders + CRM + follow-up. This matters when researching competitors — if a prospect is already with an agency that only runs ads, Halo's pitch is the upgrade, not a replacement.

**Pricing tiers:**
- Standard: $1,950/month (chiro, dental)
- Telehealth/specialized: $2,950/month (brain injury, functional medicine, etc.)
- Exception: $950/month — case-by-case, requires Matt's approval
- 3-month minimum commitment. Payment before service.

**Current clients:**
- Renee (chiropractor, $950/month) — Month 1, proving concept
- Jacek (supplement company, $950/month)
- Alex (3 locations, free trial) — learning from competitor

---

## Healthcare Practice Research Framework

### Practice Types Halo Targets

| Type | Pain Points | Typical Issue |
|------|-------------|---------------|
| Chiropractor | New patient flow, no-show rate, Google reviews | Old website, no follow-up system, word-of-mouth dependent |
| Dentist | Production per chair, treatment acceptance, Google reviews | No automation, basic website, running Google Ads without a landing page |
| Telehealth | Patient acquisition at scale, HIPAA compliance, booking flow | High ad spend needed, longer sales cycle, complex intake |
| Specialty (brain injury, functional med) | Narrow audience, high ticket, needs education-first funnel | Small market, needs thought leadership content + retargeting |

### What Makes a Strong Lead

- Active Google presence (GMB listing with recent activity)
- 3.5+ stars but complaints about "couldn't get an appointment" or "hard to reach" — that's a Halo customer
- Website with no booking widget or outdated design
- Solo or small group practice (1–5 docs) — more agile, less procurement
- NOT already working with a full-service agency (check UTMs, landing pages)
- Suburban or mid-sized market — lower competition than NYC/LA, still viable volume

### Red Flags

- Already signed with a competitor (check their FB ads + landing page URLs for agency fingerprints)
- Multi-location with in-house marketing team
- Negative reviews citing overcharging or billing issues — harder client
- No online presence at all and no appetite to invest in one

---

## Research Execution — Step by Step

### For Any Named Prospect

1. **Google the practice name + location**
   - Find their Google Business Profile — rating, review count, last review date
   - Find their website — note design quality, mobile responsiveness, booking flow

2. **Check Facebook Ad Library**
   - `https://www.facebook.com/ads/library/?country=US&q=[practice name]`
   - Are they running ads? Are their competitors?

3. **NPI Registry lookup**
   - `https://npiregistry.cms.hhs.gov/search` — confirm specialty, individual vs group

4. **Review analysis (Google + Yelp + Healthgrades)**
   - What do patients love? What's frustrating them?
   - Any mentions of: "couldn't get an appointment," "never called back," "hard to reach" = clear Halo opportunity

5. **Website audit (30-second pass)**
   - Does it have a booking link? (No = immediate gap)
   - Mobile-friendly? (Majority of health searches are mobile)
   - When was it last updated? (Stale = disengaged)
   - Any active blog, social links, or patient portal?

6. **Competitive context in their market**
   - Google "[niche] [city]" — who ranks? Are competitors running ads?
   - Any other practices in the same zip with better marketing?

---

## Intelligence Confidence Levels

**High Confidence:** NPI verified, 10+ Google reviews, active website, FB ad library data available, clear competitive context

**Medium Confidence:** Practice exists but limited online presence; fewer than 5 reviews; website is there but dated; some guesswork on size/focus

**Low Confidence:** Minimal digital footprint; information from one source only; couldn't verify key details. Flag explicitly: "Limited intel — probe [X] early in the call."

---

## Post-Discovery Note-Taking Template

When Matt or Preston sends call notes, I turn them into a structured package. Here's what I'm extracting:

**From the call:**
- What problem are they trying to solve (in their own words)
- What have they tried before (and what failed)
- How many patients/month currently, and what's the target
- Who makes the decision (are we talking to the right person)
- Budget signals (did they flinch at the rate, ask about ROI, mention budget constraints)
- Timeline (urgent now, planning for Q2, just exploring)

**My additions:**
- Does the practice context support the tier Matt quoted?
- Any red flags from pre-call research that came up on the call?
- What's the clearest path to close?

---

## Current Open Prospects (Context)

These are leads that were warm as of late February 2026 — track down their status before any pipeline health scan:

| Name | Type | Status |
|------|------|--------|
| Carl | Practitioner (dual: supplement client + Halo prospect) | Interested 2/21, discussing with wife (she's the doc) — follow-up due |
| Pierce | Chiropractor | Signing at $1,950/mo — in progress |
| Suzanne | Dental | Fell off — learn why before writing off |
| Mike/Andy | Telehealth (brain injury) | Fell off — learn why before writing off |

---

## Files I Own

```
halo-marketing/scout/
  briefs/         ← pre-call intel packages (one per prospect)
  packages/       ← post-discovery summaries + proposal direction
  pipeline/       ← pipeline health scans
  competitive/    ← competitive snapshots by market
```

I create these directories if they don't exist. Every output gets saved — no ephemeral work.

---

## Stack I Use (Research Only — I Don't Execute)

- **Web search (Brave):** Quick intel gathering
- **Web fetch:** Full page reads for websites, review pages
- **NPI Registry API:** Practice verification
- **Facebook Ad Library:** Competitive ad research
- **Google Business Profile (browser):** Review sentiment, GMB activity
- **File write:** Save all briefs to `halo-marketing/scout/` structure

I research and package. I don't send emails, run ads, or make client contact.
