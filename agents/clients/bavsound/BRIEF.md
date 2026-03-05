# Bavsound — Client Brief
*Created: March 3, 2026*

---

## Who They Are

**Bavsound** — BMW-specific car audio company. Sells premium audio systems designed for specific BMW models. Every product is vehicle-specific; you can't just buy any speaker and plug it in.

**Website:** bavsound.com
**Direct competitor:** bimmer-tech.net (Polish company — has had a VIN decoder since "the middle ages")

**Key Contacts:**
- **Tom Van Schingen** — Co-founder / decision maker. Technical, skeptical, process-driven. Hates Shopify. Top priority: inventory management.
- **Scott Newcomb** — Co-founder / ops/sales side. More relationship-driven. Top priority: bookkeeping (just fired their bookkeeper last week).

---

## The Core Problem

Customers don't know what audio system their BMW has. There are multiple BMW audio configurations:
- Standard Hi-Fi
- Harman Kardon (HK) Premium
- Others

The customer's car was **factory-built with one specific amplifier and impedance**. Bavsound's products are matched to that impedance — you can't just pick whichever you want.

**Current flow (broken):**
1. Customer visits site → selects year/make/model/body style from dropdown
2. Second dropdown: "What is your current audio system?" ← **this is where it breaks**
3. ~25–30% of customers don't know their audio system
4. Some customers intentionally select the system they *want* (not what they *have*)
5. Products are shown based on their selection

**Post-order VIN verification flow (manual, painful):**
1. Customer places order
2. Automated email: "Send us your VIN to verify your order"
3. If no response in 24–48h → human rep follows up manually
4. If still no response → order cancelled
5. Rep goes to **bmwtis.com** (BMW's own database, $270/mo subscription, no API) → types in VIN → verifies audio system code
6. If product is wrong → rep emails customer: "You bought for HK Premium but you have Standard Hi-Fi. Product is $100 cheaper — want us to switch it?"
7. Customer approves/cancels → order processed or refunded

**This entire flow is manual, slow, and error-prone.**

---

## The Solution They Want

**Phase 1: VIN Decoder**
Replace the dropdown with a VIN input field. Customer types their VIN → system auto-detects:
- Year / Make / Model / Body Style
- Factory audio system (Standard Hi-Fi, Harman Kardon, etc.)
→ Shows correct products immediately. No guessing, no wrong orders, no manual verification calls.

**Key technical details:**
- VIN contains encoded fragments that correspond to the audio system
- A previous developer had reverse-engineered some of these VIN fragments — Tom has doubts about accuracy
- **mdecoder.com** — independent site that can decode BMW audio system from VIN (no API, but exists)
- **bmwtis.com** — BMW's official database. $270/mo. No API. Most accurate source.
- **bimmer-tech.net** — competitor who solved this already. Unknown method. Likely taps an unofficial database.

**Phase 2: Inventory Management**
Tom's personal top priority. Details TBD — need their brain dump document.

**Phase 3: Bookkeeping / Accounting Dashboard**
Scott and Tom just fired their bookkeeper. Need: expense categorization, P&L visibility, Shopify → QuickBooks integration, KPI dashboards.

**Phase 4: Shopify Replacement (separate scope)**
Tom hates Shopify — wants to own their own e-commerce site and stop paying monthly fees. Also Shopify doesn't give them the reports they need.

---

## Agreed Scope & Pricing

- **Phase 1–3:** $7,500 + $750/mo (already quoted, Matt committed to this)
- **Shopify buildout:** Additional scope — Matt said "won't be triple or quadruple, I'm reasonable"
- Matt committed to having rough drafts / dashboard preview ready **by Friday**

---

## Next Steps (as of March 3, 2026)

- [ ] Matt sends invoice
- [ ] Tom/Scott send brain dump document (voice memo or Google Doc)
- [ ] Build rough dashboard with placeholder data so they can see what it looks like
- [ ] Research VIN decoder approach — can we reverse-engineer bimmer-tech.net? Is there an accessible BMW VIN → audio code database?
- [ ] Verify mdecoder.com's data quality
- [ ] Scope out Phase 1 build plan

---

## Key Quotes (for proposal/pitch use)

> "Our direct competitor has had a VIN decoder on their site since the Middle Ages. None of us in hundreds of years have been able to figure out how they do it."
— Tom Van Schingen

> "If you have to solve this with Zapier and whatever tech from back in the day... okay, we're an American business and we're gonna do it right."
— Tom Van Schingen

> "I hate Shopify. If we can build our own website and not pay Shopify hundreds of dollars every month — that would be great."
— Tom Van Schingen

---

## Personality Notes (for agent interactions)

**Tom:** Direct, time-constrained, process-oriented. Wants things done right, not fast. Skeptical of hype — won me over by being real about limitations. Respects competence. Goes deep on problems when engaged. Leads with inventory management as priority.

**Scott:** More relationship-focused. Warming up. Defers to Tom on technical/build decisions. Focused on bookkeeping urgency (just fired their bookkeeper).
