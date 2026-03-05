# Sellerboard Intel — Kargo Briefing
*Last updated: 2026-02-22 by Alo (full browser walkthrough)*

---

## Access
- URL: https://app.sellerboard.com
- Login: alo@gohalomarketing.com / AloRocks$101
- 2FA: DISABLED (confirmed)
- Session: persistent in OpenClaw managed browser

---

## 📊 Monthly P&L (Last 13 Months — Amazon)

| Month | Sales | Units | COGS | Fees | Shipping | Net Profit | Margin | ROI |
|-------|-------|-------|------|------|----------|------------|--------|-----|
| Feb 2026 (1-22) | $87,832 | 1,236 | $46,642 | $13,252 | $6,712 | $19,596 | 22.3% | 42.0% |
| Jan 2026 | $138,809 | 1,883 | $74,445 | $21,342 | $11,184 | $29,464 | 21.2% | 39.6% |
| Dec 2025 | $167,346 | 2,569 | $85,319 | $27,592 | $12,832 | $39,634 | 23.7% | 46.5% |
| Nov 2025 | $74,824 | 1,463 | $40,575 | $14,991 | $4,129 | $13,715 | 18.3% | 33.8% |
| Oct 2025 | $100,500 | 2,127 | $53,212 | $21,454 | $5,857 | $19,191 | 19.1% | 36.1% |
| Sep 2025 | $113,075 | 2,380 | $57,542 | $25,087 | $5,222 | $24,028 | 21.2% | 41.8% |
| Aug 2025 | $100,210 | 2,211 | $49,319 | $23,184 | $5,462 | $21,320 | 21.3% | 43.2% |
| Jul 2025 | $111,046 | 2,740 | $52,621 | $27,153 | $4,666 | $24,877 | 22.4% | 47.3% |
| Jun 2025 | $65,991 | 1,763 | $28,760 | $14,296 | $5,931 | $14,431 | 21.9% | 50.2% |
| May 2025 | $69,675 | 1,939 | $33,072 | $19,236 | $1,114 | $15,085 | 21.6% | 45.6% |
| Apr 2025 | $70,107 | 1,908 | $32,919 | $18,356 | $1,729 | $15,318 | 21.8% | 46.5% |
| Mar 2025 | $65,128 | 1,824 | $31,830 | $16,839 | $1,255 | $13,047 | 20.0% | 41.0% |
| Feb 2025 | $73,643 | 1,686 | $38,659 | $17,453 | $2,127 | $14,044 | 19.1% | 36.3% |
| **TOTAL** | **$1,238,193** | **25,729** | **$624,919** | **$260,238** | **$68,227** | **$263,756** | **21.3%** | **42.2%** |

**Key observations:**
- December is peak month ($167K sales, $39K profit)
- November is soft (likely pre-holiday lull)
- Margin is remarkably consistent: 19–24% range across all months
- ROI runs 33–50%, averages 42%
- Advertising cost = $0 (no PPC running — organic only)
- Refund rate ~2% (healthy)
- No Subscribe & Save subscriptions currently active (was running Sep–Jan, now 0)

---

## 🏪 COGS System — How It Works

### Two COGS Types:
1. **Constant** — Fixed dollar amount per unit, never changes
   - Used for: stable-price products where cost doesn't vary batch to batch
   - Enter amount directly in the COGS field

2. **By period/batch/marketplace** — Variable cost per purchase batch
   - Used for: most products (the majority)
   - Click the COGS value → opens batch modal
   - Add a new row with: date purchased, cost per unit, quantity
   - Sellerboard uses the right cost based on when units were sold
   - Supports different costs per marketplace (Amazon vs Walmart)

### Additional Cost Inputs:
- **Unsellable returns %** — % of returned items that can't be resold (adds to cost)
- **Shipping profile** — Outbound shipping cost (Default or custom)
- **Indirect expenses** — Fixed monthly overhead (currently $0 entered)
- **Variable expenses** — % or $ per unit for variable costs (currently $0 entered)

### ⚠️ COGS Gaps Found:
Several products have COGS = $0.00 (no cost entered), which inflates their margin numbers:
- B000W3QGW6 — NaturesPlus No Iron 90ct — $0 COGS (shows fake 70% margin)
- B07Q9FDMF3 — NaturesPlus GI Natural Probiotic — $0 COGS (69% fake margin)
- B09TQ7D1SZ — Bucked Up LFG Razzle Dazzle — $0 COGS
- Several others with $0.00

**Kargo action item:** Audit all products with $0 COGS and update with actual purchase cost.

---

## 🏆 Top Products by Volume (Feb 2026, Amazon)

| Rank | ASIN | Product | Units | Sales | Net Profit | Margin | ROI |
|------|------|---------|-------|-------|------------|--------|-----|
| 1 | B09SZQZ4B4 | BodyHealth PerfectAmino 300ct tablets | 86 | $6,631 | $1,965 | 30% | 61% |
| 2 | B06XPJPKRM | BodyHealth PerfectAmino 300 tablets (alt) | 79 | $6,081 | $1,577 | 26% | 51% |
| 3 | B0DVD9WS8V | BodyHealth PerfectAmino Unflavored 60srv | 71 | $6,120 | $2,015 | 33% | 76% |
| 4 | B0945VXQM3 | BodyHealth PerfectAmino Strawberry 60srv | 69 | $5,768 | $1,140 | 20% | 36% |
| 5 | B09SZQHYSL | BodyHealth PerfectAmino 150ct tablets | 50 | $2,118 | $381 | 18% | 35% |
| 6 | B081K5JCWD | Standard Process Multizyme 150ct | 42 | $1,995 | $344 | 17% | 30% |
| 7 | B09FVFV2C8 | NaturesPlus SOL GOLD Liquid 30oz | 42 | $2,192 | $171 | 8% | 12% |
| 8 | B09CDX45DM | BodyHealth PerfectAmino Lemon Lime 60srv | 36 | $2,844 | $805 | 28% | 56% |
| 9 | B0055CKAK8 | NaturesPlus SOL GOLD Multivitamin 180tab | 30 | $2,499 | $807 | 32% | 72% |
| 10 | B0FKPGG1Z4 | Momentous Vegan Omega-3 30srv | 30 | $1,485 | $131 | 9% | 13% |

### Star performers (high margin + high ROI):
- **B0DVD9WS8V** (Unflavored 60srv): 33% margin, 76% ROI ← top performer
- **B0BB853HL7** (PerfectAmino 600ct tablets): 33% margin, 78% ROI
- **B09YF6QPVH** (PerfectAmino Strawberry 120srv): 32% margin, 66% ROI
- **B0055CKAK8** (SOL GOLD 180tab): 32% margin, 72% ROI

### Dogs (low margin, watch or exit):
- **B09FVFV2C8** (SOL GOLD Liquid): 8% margin, 12% ROI
- **B0FKPGG1Z4** (Momentous Omega-3): 9% margin, 13% ROI
- **B09WWK4R2C** (Momentous Mag L-Threonate): 7% margin, 10% ROI
- **B00116B6FK** (BodyBio PC 8oz): 3% margin, 5% ROI ← likely losing money after overhead

---

## 📦 Product Catalog Summary

**Main brands carried:**
- **BodyHealth** — PerfectAmino line (dominant; tablets + powder in multiple flavors/sizes)
- **Standard Process** — Supplements (Multizyme, Drenamin, Ferrofood, Immuplex, etc.)
- **NaturesPlus** — Source of Life line (GOLD, No Iron)
- **Designs for Health** — Multiple SKUs (CoQnol, NeuroMag, DIM-Evail, GI Revive, etc.)
- **Klaire Labs / SFI Health** — Probiotics
- **BodyBio** — PC (Phosphatidylcholine), Butyrate, Liposomal Glutathione, TUDCA
- **PectaSol** — Modified Citrus Pectin (lime + unflavored)
- **Momentous** — Omega-3, Magnesium L-Threonate
- **Fairhaven Health** — Fertility supplements (FH Pro, Ovaboost)
- **Vibrant Health** — Green Vibrance, Maximum Vibrance
- **Bucked Up** — LFG Pre-workout
- **Essential Formulas** — Dr. Ohhira's Probiotics

**Total active Amazon ASINs visible:** 40+ (5 pages in products section)
**Fulfillment model:** Primarily FBM (Fulfilled by Merchant), some FBA

---

## 📊 Today's Snapshot (Feb 22, 2026)
- **Today:** $5,648 sales | 62 orders / 75 units | $1,552 net profit
- **Yesterday (Feb 21):** $4,346 sales | 55 orders / 59 units | $1,210 net profit
- **Month to date:** $87,832 sales | 1,148 orders / 1,236 units | $19,596 net profit

---

## 🛒 Walmart Section
- Sellerboard has a dedicated Walmart tab in the left nav (`/en/walmart/dashboard`)
- Integrated and active — Walmart data tracked separately
- Need to do a separate walkthrough of Walmart-specific data (pending)

---

## 🔧 Other Sellerboard Features Available
- **Inventory** — stock levels per product per fulfillment center
- **Cashflow** — projected payout schedule
- **Business Valuation** — estimated business value
- **Alerts** — 99+ pending alerts (need to review)
- **Money Back** — tracks Amazon reimbursements
- **Autoresponder** — email sequences (not configured)
- **PPC** — ad management (not connected; advertising API not set up)
- **LTV** — lifetime value by customer
- **Reports** — exportable data
- **QuickBooks** — integration available (not connected)

---

## ⚠️ Action Items for Kargo
1. **Review 99+ alerts** — could be pricing issues, listing problems, inventory alerts
2. **Fix $0 COGS products** — update actual purchase cost for accuracy
3. **Set up indirect expenses** — monthly overhead (storage, shipping supplies, etc.)
4. **Connect Advertising API** — so PPC costs show in P&L (if running ads)
5. **Audit Walmart dashboard** — confirm Walmart revenue tracking correctly
6. **Review "dogs"** — consider exiting low-margin/low-ROI products
7. **Watch FBM stock = 0** — multiple top sellers showing 0 FBM stock (reorder risk)


---

## 🛒 Walmart Section — Full Intel

### Walmart Dashboard Snapshot (Feb 22, 2026)
| Period | Sales | Orders/Units | Returns | Ad Cost | Net Profit |
|--------|-------|-------------|---------|---------|------------|
| Today (Feb 22) | $1,301 | 20 / 22 | 0 | $0 | $503 |
| Yesterday (Feb 21) | $2,345 | 36 / 43 | 1 | $0 | $1,045 |
| Month to date | $29,538 | 467 / 551 | 24 | -$573 | $10,819 |

**⚠️ Note:** Walmart refunds/fees data after 06/02/2026 may be incomplete (14-28 day delay per Walmart's update schedule). The Walmart Advertising API is NOT fully connected — ad costs show with delay and without product-level breakdown.

### Walmart Brand = Different from Amazon
Walmart carries **Ortho Molecular Products** predominantly (not BodyHealth/Standard Process/NaturesPlus). This is a completely separate catalog from Amazon.

### Walmart Products (Today's Sales)
| Walmart ID | Product | Price | Sales | Margin | ROI |
|-----------|---------|-------|-------|--------|-----|
| 65AKEUTZYRK9 | Ortho Spore IG Probiotic 90ct | $55.00 | $330 | 31% | 52% |
| 7HKUOJJ5AXIF | Orthomega 820 Omega-3 180ct | $103.99 | $207 | 29% | 53% |
| 201PERB4KSAH | Natural D-Hist 40ct | $56.90 | $113 | **54%** | **173%** |
| 3BH87XQWI0DF | Methyl B12 60ct | $45.00 | $90 | 34% | 67% |
| 4RCN5L18G991 | Orthomega 820 120ct | $76.95 | $76 | 40% | 90% |
| 11JOV8CGN6BE | Alpha Base No Iron 240ct | $76.90 | $76 | 46% | 117% |
| 4MHIN9DAZPSO | 5A EstroDIM 60ct | $69.90 | $69 | 36% | 73% |
| 36095BKW78Z8 | Reacted Magnesium 120ct | $64.50 | $64 | 48% | 129% |
| 6CAI6AK8MYBX | Digestzyme V 90ct | $62.00 | $62 | 48% | 132% |
| 63H8362TCLNR | Methyl CpG 60ct | $59.90 | $59 | 34% | 65% |
| 5FF3Q3NYMPQ9 | Reacted Magnesium 60ct | $45.00 | $45 | **62%** | **270%** |
| 5303597YPA6E | D-Hist Jr. 60 Chewable | $43.00 | $43 | 49% | 136% |
| 3S46DOJ3587Q | Chinet Crystal Cup 60ct | $32.00 | $32 | 17% | 30% |
| 74MZ8S21Y687 | Colgate Max Fresh 5pk | $29.95 | $29 | 73%* | 0%* |

*Colgate has $0 COGS entered — margins are fake. Chinet and Colgate are general merchandise (not supplements).

### Walmart vs Amazon Key Difference
**Walmart margins are significantly higher than Amazon (30–62% vs 18–33%)** because:
1. Lower Walmart fees (vs Amazon's ~15-20%)
2. No FBA storage or handling fees (FBM only)
3. Same COGS as Amazon

This means Walmart is the higher-margin channel. Worth prioritizing expansion there.

### Walmart Action Items
1. **Connect Walmart Advertising API** — get product-level ad attribution
2. **Fix $0 COGS items** — Colgate showing fake 73% margin (no cost entered)
3. **Expand Ortho Molecular catalog** — high margins across the line
4. **Watch the 14-28 day data delay** — recent numbers are estimates
5. **Monitor Reacted Magnesium 60ct** — 270% ROI is a star, ensure no stockout


---

## 📋 Kargo's Fulfillment Workflow

### Full Loop (in order):

1. **Create PO** — Kargo generates a purchase order for each practitioner/supplier
2. **Send PO to practitioner** — practitioner confirms and prepares the shipment
3. **Practitioner ships** — they email or text Matt the box dimensions (weight, length, width, height)
4. **Kargo generates shipping label** — via **Pirate Ship** (Matt's account), sends label to practitioner
5. **Practitioner ships to destination** — Matt's address or prep center
6. **Receive inventory** — check against PO
7. **Scan COGS from PO** — input cost per unit into Sellerboard as a new batch entry (By period/batch/marketplace)
8. **Update prep sheet** — log what came in, condition, ready-to-list status

### Key Details:
- **Labels tool**: Pirate Ship (pirateship.com) — need Matt's login or API access
- **Dimension source**: Practitioners text/email Matt the box specs → forward to Kargo
- **COGS entry**: After receiving inventory, open Sellerboard → Products → click COGS value → add batch row with: date, cost/unit, quantity
- **Practitioners = suppliers** (healthcare practitioners who hold the inventory)

### What Kargo Needs (To Do):
- [ ] Pirate Ship login/API access
- [ ] PO template (to standardize how POs are created and sent)
- [ ] Prep sheet template (to track incoming inventory)
- [ ] Process for receiving box dimensions (from Matt's texts/emails) and generating labels fast

