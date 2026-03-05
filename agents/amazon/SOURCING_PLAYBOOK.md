# Kargo — Sourcing Playbook
*How to find, evaluate, and source products for the Amazon/Walmart operation.*
*Updated: 2026-02-24*

---

## The Business Model

This is **practitioner supplement sourcing** — not retail arbitrage.

**The core edge:** Practitioner-only brands (Ortho Molecular, BodyHealth, Standard Process, Klaire Labs, Designs for Health, Metagenics, etc.) require a licensed healthcare practitioner to open a wholesale account. The general public can't buy these brands wholesale. We partner with practitioner offices — chiropractors, doctors, naturopaths, dentists — who let us use their license and office to get approved for wholesale accounts. Without that practitioner relationship, we can't access the brands at all.

**This means:**
- Every new brand we want to carry needs a practitioner to apply for the account
- We apply through ALL our practitioners — not just one — to maximize ordering capacity
- More accounts = more monthly ordering volume = more revenue
- When a new brand is found, Hafsa applies through every practitioner account simultaneously

**What we source:** Health products only — practitioner-grade supplements, health foods, wellness products — that a practitioner office could legitimately get a wholesale account for. No general consumer goods. No random retail products.

Kargo's sourcing job is two-layered:

1. **Restock existing winners** — known SKUs, known accounts, known margins. Kargo manages this with targets, velocity, and account availability.
2. **Find new brands** — reverse source Amazon to identify practitioner supplement brands with strong velocity that we can add to our portfolio. Alert Hafsa to apply for accounts across ALL practitioners.

---

## Tool 1: Keepa

**What it does:** Tracks price history, BSR (Best Sellers Rank), offer counts, and buy box ownership for every Amazon product. Updated hourly. 3.1B+ items tracked.

**API:** Yes — programmatic access via API key. Returns full product history per ASIN.
- Key data: `salesRank`, `offerCount`, `buyBoxPrice`, `newPrice`, `monthlySold` (estimated)
- API key needed: get from keepa.com account → integration

**How to read a Keepa chart:**
- **Sales Rank (BSR):** Lower = more sales. Drops in BSR = sales happening. Frequent drops = high velocity.
- **New Price:** Track price stability. Stable price = healthy listing. Collapsing price = competition flooding in.
- **Offer Count:** Rising sellers = race to bottom incoming. Falling sellers = opportunity or dying product.
- **Buy Box:** Who holds it and what % of the time. If Amazon holds buy box 60%+ = hard to compete.
- **90-day avg BSR:** Key number. For supplements, BSR < 5,000 in health category = strong seller.

**Green flags for sourcing:**
- BSR drops consistently (not one-time spike) — means steady sales
- Multiple FBA sellers on listing = proven demand
- Price stable over 90+ days = healthy margin environment
- Amazon NOT holding buy box = competition is open
- Rank improving month over month

**Red flags:**
- Amazon is the primary seller (they'll undercut everyone)
- Price crashing over past 90 days
- Rank deteriorating despite low price — dying product
- Extremely high offer count with tight price spread

**Keepa for reverse sourcing:**
- Pull BSR history for a target ASIN → estimate monthly units sold
- Formula: Health/Beauty category, BSR 1,000 ≈ 300-500 units/month (rough estimate)
- Use `monthlySold` field from API when available

---

## Tool 2: SellerAmp SAS

**What it does:** All-in-one FBA analysis tool — Chrome extension + mobile app + web app.
- ROI calculator (input cost → shows required sale price for target ROI %)
- Storefront search — see every product a seller is selling
- Keepa chart embedded
- Max cost calculator — shows the max you can pay to hit ROI target
- History of all products you've analyzed

**No direct API** for product data — it's a Chrome extension tool. Use it manually for product analysis. For bulk programmatic analysis, use Keepa API directly.

**How Kargo uses it:**
- When evaluating a new product: pull ASIN into Selleramp → get profitability snapshot immediately
- Storefront search: input a competitor seller → see all products they're moving → find their brands → reverse source those brands

---

## Tool 3: SourceDart (sourcedart.io)

**Matt's own tool** — Walmart sourcing. Built to find profitable Walmart products.
- API access: Matt provides credentials/key
- Integrate for Walmart product discovery and sourcing opportunities
- Primary use: identify Walmart products with good margins that aren't saturated

---

## Reverse Sourcing Methodology

Reverse sourcing = start from a product/seller on Amazon, work backward to find the supplier.

### Step 1: Find a profitable seller or product
- Search for a category (e.g., supplements, health)
- Use Keepa or Jungle Scout to find products selling 300-1,000 units/month
- Filter: no Amazon as seller, multiple FBA sellers, stable pricing

### Step 2: Reverse into the brand
- Click on a seller doing volume → view their storefront (Storefront Search in Selleramp)
- See what brands they're carrying
- Identify brands with multiple high-velocity products

### Step 3: Evaluate the brand for our model
- Can we access it through a practitioner account?
- Is it a supplement brand that requires practitioner licensing?
- What's the wholesale price vs. Amazon sell price? (target: 20%+ margin after fees)
- Is there room for our accounts at current competition level?

### Step 4: Find the supplier
- Google "[Brand name] wholesale account" or "[Brand name] distributor"
- Check brand's website for "become a retailer" or "practitioner portal"
- For practitioner brands: need a licensed practitioner to open the account (that's Matt's edge)
- Cold call or email the brand directly — introduce as a licensed practitioner's purchasing partner

### Step 5: Validate before committing
- Run ASIN through Keepa: confirm 90-day BSR trend, price stability
- Run through Selleramp: confirm ROI at our expected cost
- Check for IP complaints or restricted brand flags
- Confirm no Amazon lock-in (brand selling direct at unbeatable price)

---

## Sourcing Criteria — What Makes a Good Buy

| Factor | Threshold | Why |
|--------|-----------|-----|
| BSR (Health category) | < 10,000 preferred, < 5,000 ideal | Indicates real velocity |
| Monthly units | 300+ | Enough volume to matter |
| Margin after all costs | > 20% | PayPal, shipping, FBA fees eat quickly |
| ROI | > 30% | Minimum threshold for capital efficiency |
| Amazon on listing | No | Can't win buy box against Amazon |
| Price stability (90d) | < 15% swing | Collapsing price = broken listing |
| Offer count trend | Stable or falling | Rising sellers = margin squeeze incoming |

---

## Our Brands — Sourcing Rules

### Ortho Molecular
- Monthly targets file: `kargo-targets.json`
- Volume discounts: 72+ units = 5% off, 144+ = 10% off
- Accounts: Suzanne, Renee, Rebecca, Pierce, Mike, Marco, Carol
- PayPal 3.5% on every order. Mike's markup: 10%.
- Spread orders across accounts — once per month per account per brand

### BodyHealth
- ⚠️ CRITICAL FLAGGING RISK — orders must stay small and spaced
- Case sizes: 300ct/150ct/powders = 24/case, 600ct = 12/case
- Accounts: Mike, Suzanne, Renee, Carol, Angelica, Rebecca (overflow)
- Top mover: PerfectAmino 300ct ($38.95 wholesale, 20-33% margins)

### Standard Process / MediHerb
- Shared restock list across: Carl, Lisa, Catherine, Pierce, Mike, Marco
- Orders split across accounts intentionally

### Klaire Labs, Designs for Health, Metagenics, etc.
- Account-specific — see SUPPLIER_INTEL.md for per-account rules

---

## New Brand Discovery Workflow

When Kargo identifies a potential new brand through reverse sourcing:

**Qualification checklist (before alerting Hafsa):**
1. ✅ Health/supplement/wellness product — practitioner office could legitimately have wholesale account
2. ✅ Brand requires practitioner license for wholesale (this is the edge — if anyone can get an account, it's not worth it)
3. ✅ Strong velocity: BSR < 10,000 in health category, steady drops over 90 days
4. ✅ Not already in our portfolio (check SUPPLIER_INTEL.md)
5. ✅ Margins look viable: Amazon sell price vs likely wholesale = 20%+ margin
6. ✅ Amazon is NOT the primary seller on the listing

**Once qualified — post to #new-brands Slack channel:**
```
🆕 New Brand Alert: [Brand Name]

Why it's interesting:
- BSR: [rank] | Category: [health subcategory]
- Est. monthly units: [X] | Velocity: [trending up/stable]
- Sample products: [top 2-3 ASINs with prices]
- Wholesale likely through: [distributor/brand direct]

Action needed @Hafsa:
Apply for wholesale account through ALL practitioners:
[list all active practitioners]

Apply link / contact: [brand website or distributor portal]
```

**Channel ID:** `C0980SN1GLS` (#new-brands) — Kargo is already in it

**Important:** Always apply through ALL practitioners simultaneously — not just 1. More approved accounts = higher monthly ordering ceiling.

---

## Keepa API Integration (To Build)

```javascript
// When Keepa API key available:
// GET https://api.keepa.com/product?key=KEY&domain=1&asin=ASIN&stats=90
// Returns: salesRank history, price history, offer count, estimated sales
// Use for: velocity calculation, sourcing validation, price trend analysis
```

Required: Matt's Keepa API key from keepa.com dashboard.

---

## Sourcing Intelligence Loop (Kargo's Job)

1. **Weekly:** Scan top 20 products by velocity (Sellerboard) → check if any are near stockout → flag for reorder
2. **Monthly:** Review targets vs placed (kargo-targets.json) → identify gaps → build order plan
3. **Ongoing:** When Matt or Hafsa find new products → run Keepa + Selleramp analysis → verdict: buy/pass/investigate
4. **Proactive:** If BSR on an existing SKU starts improving → flag potential increase in order qty
