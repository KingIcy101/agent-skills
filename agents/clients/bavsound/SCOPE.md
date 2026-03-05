# Bavsound — Scope of Work
*Draft — March 3, 2026*

---

## Phase 1: VIN Decoder + Correct Product Matching
**Priority: Highest (replaces broken current flow)**

### Deliverables
- VIN input field on product pages (replaces year/make/model/audio dropdowns)
- VIN decode engine: year → make → model → body style → **audio system code**
- Product matching logic: audio system code → correct Bavsound product(s)
- Build storage: save customer's car + selected system (account or session)
- Optional: rep verification dashboard — see pending VINs, confirm before processing

### Technical Approach (to be validated)
1. NHTSA free VIN API (`vpic.nhtsa.dot.gov`) → year/make/model/body style
2. Audio system code lookup → needs research:
   - Option A: Reverse-engineer bimmer-tech.net's approach
   - Option B: Use mdecoder.com data (scrape/manual mapping)
   - Option C: Build VIN fragment lookup table from existing BMW data
   - Option D: Automate bmwtis.com lookups (human-assisted, $270/mo)
3. Store VIN → audio code mapping table internally (maintain + grow over time)

### Open Questions
- How accurate is the previous developer's VIN fragment reverse-engineering?
- Does mdecoder.com have a usable data structure we can work with?
- Can we reverse-engineer bimmer-tech.net's decoder approach?

---

## Phase 2: Inventory Management
**Priority: Tom's #1**

*Details pending brain dump document from Tom/Scott*

---

## Phase 3: Bookkeeping / Finance Dashboard
**Priority: Urgent (just fired bookkeeper)**

### Likely deliverables
- Expense categorization (import bank/card statements)
- P&L visibility
- Shopify sales data integration
- QuickBooks sync (if needed)
- KPI dashboard (revenue, margin, top products, etc.)

*Details pending brain dump document*

---

## Phase 4: Shopify Replacement *(Additional Scope)*
**Priority: Medium-term**

- Custom e-commerce site (own their platform, no Shopify fees)
- Proper reporting/analytics built in
- VIN decoder integrated natively
- Estimated: additional $X,XXX (TBD based on complexity)

---

## Pricing Summary

| Phase | Included In | Notes |
|-------|------------|-------|
| 1–3 | $7,500 + $750/mo | Committed |
| 4 (Shopify) | Additional scope | "Won't be triple or quadruple" |

**Invoice:** To be sent by Matt
**Start:** Upon payment + brain dump received

---

## Timeline
- Rough dashboard preview: By Friday March 7
- Phase 1 build: TBD pending VIN research
- Full Phase 1 delivery: TBD
