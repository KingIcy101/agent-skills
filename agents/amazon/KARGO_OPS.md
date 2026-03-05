# Kargo Ops Notes
*Updated: 2026-02-25*

---

## ⚡ QUICK REFERENCE — Most Important Rules

### The Order of Operations (any payment confirmation)
```
Matt says "$X,XXX account/brand paid" or posts ✅
  → 1. Find Notion order → update Status to "Purchased"
  → 2. Find practitioner's sheet + correct brand tab → append product rows
  → 3. Add to prep-sheet-pending.json for Nova prep center
  → 4. Queue for Sellerboard COGS entry
  → 5. Post confirmation to #orders-amz-walmart
```

### Critical Formulas

**Ortho Molecular (Mike, 10% discount):**
```
D (10% off)       = C × 0.90
F (Total cost)    = D × E  (or C × 0.90 × E)
H (Markup total)  = F × 1.135
G (Markup/unit)   = H / E
Profit row        = H_total × 0.965 − F_total
```

**Ortho Molecular (Carol, 5% discount):**
```
D = C × 0.95
F = D × E
H = F × 1.135
G = H / E
```

**Carlson / Arthur Andrew (20% discount):**
```
D (After 20%) = C × 0.80
F (Total)     = D × E
```

**Seeking Health (Catherine, 7% discount):**
```
D (7% off) = C × 0.93
F (Total)  = D × E
```

**BodyHealth / Standard Process / Klaire / Metagenics / Most others:**
```
A=Date | B=Product | C=Wholesale | D=Units | E=Total(C×D)
Fill only A–E. Leave everything else blank.
```

### Critical Rules
1. **ONCE PER MONTH per brand per account** — no exceptions
2. **2026 prices ONLY** — never use pre-2026 Ortho prices (Ortho raised prices Jan 2026)
3. **CDP clipboard paste** — keyboard events silently drop in Google Sheets
4. **Read before write** — fetch last 3 rows via gviz, find append row, match existing format
5. **Never overwrite totals rows** — detect by col A/B containing "Total" or dark background row
6. **BodyHealth is flagging** — keep orders small and spaced
7. **DUFFLE "Matt Carlson" tab = LMNT** — not Carlson brand (rep's name was Carlson)

### Supplier Data Source of Truth
- **2026 prices**: `mission-control-server/supplier-data.json` (919KB, all practitioners' actual order history)
- **Target products/quantities**: `agents/amazon/kargo-targets.json`
- **Historical orders**: `agents/amazon/kargo-order-history.json`
- **Pending orders**: `agents/amazon/kargo-pending.json`

---

## Slack Channel Rules

Know every channel and why it exists. Post in the right one, every time.

**#orders-amz-walmart** (`C094RGF96K0`) — PURCHASING ACTIVITY ONLY:
- Order confirmations, PAID posts, Hafsa coordination
- Pipeline checks ("what's pending", "what needs placed")
- New order planning requests
- UPS/tracking updates
- Keep it clean — Hafsa lives here and needs to follow the thread

**#amazon-chat** (`C092CDYAU8N`) — GENERAL AMAZON CONVERSATION:
- Questions, intel, status checks, general sourcing talk
- Daily brief (posted here every morning at 9am ET)
- Anything that isn't a direct order action

**#walmart-channel** (`C092JMRGAS0`) — WALMART-SPECIFIC:
- Walmart inventory, listings, pricing questions

**#daily-task-updates** (`C092JGUNM5J`) — HAFSA'S EOD REPORT:
- Hafsa posts what she completed each day
- Read-only for Kargo — don't post here unless asked

**#new-brands-links** (`C0980SN1GLS`) — NEW BRAND RESEARCH:
- New brand opportunities and wholesale application alerts
- Where Kargo posts new brand alerts for Hafsa to act on

**#brands-to-call** — OUTREACH LIST:
- Brands Hafsa needs to contact for wholesale applications
- Post new sourcing targets here when in planning mode

**#goals-and-tasks** — TEAM VISIBILITY:
- High-level goals and task tracking
- Reference for what the team is working toward

**Rule:** Organized channels matter to Matt. Cluttering #orders with general chat is a mistake. If it's not a direct order action, it goes to #amazon-chat.

## UPS Tracking System

Every Notion order must have a UPS tracking number in the **Tracking** field once a label exists.
Kargo checks all active orders (Purchased + Ordering) daily, verifies delivery status, and drives the dashboard split.

**Three buckets — what drives each:**
- **No tracking** → Awaiting Label / Pickup (prac hasn't sent box dimensions, or label not created yet)
- **Tracking exists, not delivered** → In Transit (en route to prep center)
- **Tracking shows Delivered** → At Prep Center (arrived, being prepped for listing)

**Kargo's tracking responsibilities:**
1. When a label is created → immediately add tracking number to Notion Tracking field
2. Daily: scan for Purchased orders missing tracking for 3+ days → message Hafsa in `#orders-amz-walmart`
3. When UPS shows Delivered → noted in daily brief automatically. Dashboard updates itself.
4. Never estimate arrival without a tracking number — if no tracking, just say "awaiting pickup"

**Adding tracking to Notion (API):**
`PATCH /v1/pages/{notionId}` → `{ "properties": { "Tracking": { "rich_text": [{"text":{"content":"1Z..."}}] } } }`
Or tell Hafsa: "Can you add tracking [1Z...] to [Brand / Account] in Notion?"

**Files:**
- `mission-control-server/kargo-tracking-check.js` — daily checker, 4h cache
- `mission-control-server/kargo-tracking-cache.json` — cached UPS statuses (delivered = permanent)
- Run manually: `node mission-control-server/kargo-tracking-check.js`

**Dashboard:** `kargo-transit-revenue.js` uses tracking cache to split in-transit vs at-prep buckets.
Falls back to Qty Received column in prep sheet when no tracking data exists yet.

---

## Order Lifecycle — Complete End-to-End

When Matt says **"$[amount] [account] [brand], paid"** (or posts a ✅ in thread), here is the full chain Kargo runs:

### Step 1 — Match the Notion Order
```
Search Notion Amazon/Walmart DB for:
- Account name matches (fuzzy: "Mike" → account contains "Mike")
- Brand matches
- Amount within ±$50 of Matt's stated amount
- Status = "Needs Placed" or "Ordered" (not already "Done"/"Purchased")
- Date within last 14 days
```

**Found → update:**
```
PATCH /v1/pages/{notionId}
{
  "Status": "Purchased",    // or "Done" — check which value is used in that DB
  "Paid?": true,            // if the DB has a Paid checkbox
}
```

**Not found → create:**
```
POST /v1/pages
{
  "parent": { "database_id": "3eda6d0e1c0d4a54905b6cb478f78a45" },  // Amazon
  "properties": {
    "Name": { "title": [{"text":{"content":"[Account] [Brand] [date]"}}] },
    "Status": { "select": { "name": "Purchased" } },
    "Account": { "rich_text": [{"text":{"content":"[account name]"}}] },
    "Amount": { "number": [total amount] },
    "Date": { "date": { "start": "2026-02-25" } }
  }
}
```

**Do NOT ask Matt for the product list.** Pull from `kargo-pending.json` or match by account + brand + recent date.

### Step 2 — Log to Supplier Sheet
```
Find the practitioner's Google Sheet tab for that brand:
- Look up sheet ID from PRACTITIONER SHEET IDS below
- Find the correct tab name for that brand (TAB NAMES section below)
- Read last 3 rows to match format (gviz CSV fetch)
- Append new rows below last data row
- Use SHEET_FORMATS.md for exact column order and formulas
```

**Write method: CDP clipboard paste only**
```js
// Always use clipboard paste — keyboard events are silently dropped in Google Sheets
await page.evaluate(async (tsvData) => {
  await navigator.clipboard.writeText(tsvData);
}, tsvString);
await page.keyboard.press('Meta+V');
```

**Navigate to cell using Name Box:**
```js
const nameBox = page.locator('[id="a-name-box"]');
await nameBox.click();
await nameBox.fill('A47');  // target cell
await page.keyboard.press('Enter');
```

### Step 3 — Queue for Prep Center Sheet (Nova)
Append to `prep-sheet-pending.json`:
```json
{
  "notionId": "...",
  "supplier": "Mike",
  "brand": "Ortho Molecular",
  "date": "2026-02-25",
  "platform": "amazon",  // or "walmart"
  "products": [
    { "name": "Orthomega 820 180ct", "qty": 48, "cost": 47.65 }
  ]
}
```

### Step 4 — Queue for Sellerboard COGS
Mark order in COGS queue. Process: open Sellerboard Products page, search by ASIN (from `product-data.json`), add cost batch.

### Step 5 — Confirm in Slack
Post to `#orders-amz-walmart` (`C094RGF96K0`):
```
*$X,XXX.XX [Account] [Brand] PAID* ✅
```

---

## Order Confirmation Workflow (Primary Flow) — LEGACY

Matt's input: **"$[amount] [account], paid"** (or "not paid")

**Kargo's job:**
1. Search Notion for matching order (account + brand + approx amount + recent date)
   - Found → update status to Purchased + mark paid
   - Not found → create new Notion page with details
2. Log to supplier sheet → correct account tab
3. Queue for prep sheet → `prep-sheet-pending.json`
4. Queue for COGS → Sellerboard

**Do NOT ask Matt for the product list** — pull from Notion or kargo-pending.json.
Supplier sheet = source of truth for product-level detail. Notion = order-level tracker.

---

## Notion Field Reference

### Amazon Orders DB (`3eda6d0e1c0d4a54905b6cb478f78a45`)
| Field | Type | Notes |
|-------|------|-------|
| Name (title) | title | e.g. "Mike Ortho Feb 2026" |
| Status | select | "Needs Placed" / "Ordered" / "Purchased" / "Done" / "Purquinnd" |
| Accounting? | checkbox | false = COGS not yet in Sellerboard |
| Prep Update? | checkbox | false = Nova prep sheet not yet updated |
| Tracking | rich_text | UPS tracking number |
| Amount | number | Total dollar amount |
| Date | date | Order date |

**Status meanings:**
- `Needs Placed` = planned, not yet ordered
- `Ordered` = order submitted, awaiting payment
- `Purchased` / `Done` / `Purquinnd` = confirmed purchased → include in revenue calc
- `Accounting? = false` = COGS not in Sellerboard → Sellerboard margins for this order unreliable
- `Prep Update? = false` = prep center not notified → append to Nova sheet

### Walmart Orders DB (`19789dac5745808d9bc1d62dccd06a04`)
- Same structure, field names may vary slightly
- "Order Status" instead of "Status"

---

## Practitioner Sheet IDs (Known)

| Practitioner | Sheet ID | Source |
|---|---|---|
| **Mike** | `1NgLoJBbf1Ivrs2yUOnZDrBkEpxKJkyCynUHCz1Tj8Xs` | Confirmed |
| **Carl** | `1wxTzpMGNiMY10XPOaLbtL8jUr6km_vCT5GNwbrWHk90` | import-supplier-tabs.js |
| **Catherine** | `1Azcai4i4-tttgsJ9g99xlh64PIXaTaGes5Aaj73wh18` | import-supplier-tabs.js |
| **Lisa** | `1OtE9qLVjIbxu0Oiv3STHvqfvyGUSFzPHeFj7veHQtJg` | import-supplier-tabs.js |
| **DUFFLE (planning)** | `1oyDlwT7fB51s8AzM8LQhkNCQHRYTawtiEdIrCC-kqvM` | slack-socket.js |
| **Nova Prep Center** | `15bGErKdxpBouR22DDaOdnwf6lxu7NZZI-0QfKr8tAQk` | TOOLS.md |
| Rebecca | ❓ needs Matt | Open CDP browser, navigate to her sheet |
| Renee | ❓ needs Matt | Open CDP browser, navigate to her sheet |
| Suzanne | ❓ needs Matt | Open CDP browser, navigate to her sheet |
| Pierce | ❓ needs Matt | Open CDP browser, navigate to her sheet |
| Marco | ❓ needs Matt | Open CDP browser, navigate to her sheet |
| Carol | ❓ needs Matt | Open CDP browser, navigate to her sheet |
| Angelica | ❓ needs Matt | Open CDP browser, navigate to her sheet |

**How to find a missing sheet ID:** Open the Chrome browser in CDP (`http://127.0.0.1:18800`), navigate to Google Drive, find the sheet, extract the ID from the URL.

---

## Practitioner Brand Tab Names (from supplier-data.json)

These are the EXACT tab names as they appear in each practitioner's sheet:

### Mike
`OrthoMolecular` · `Bodyhealth` · `Standard Process` · `Metagenics` · `Klaire Lab` · `Numedica` · `Designs of Health`

### DUFFLE (Matt's main ordering sheet)
`Matt body Health` · `Matt's Ortho` · `Matt Carlson` (**= LMNT not Carlson!**) · `Matt Metagenics` · `MATT'S SP` · `Matt's Seeking health` · `Carlson Order` · `Econugenics` · `Body Bio` · `Arthur Andrew` · `NuMedica` · `NutriDyn` · `Apex` · `Fullscript` · `Designs of Health` · `LMNT` · `BodyHealth`

### Rebecca
`Ortho Orders` · `BodyBio` · `Bodyhealth`

### Suzanne
`CURRENT ORDERS` · `Ortho` · `Body Health` · `Ortho Molecular` · `Metagenics` · `Bodybio` · `Standard` · `Brand Sheet` · `LMNT` · `Standard Process` · `Allergy Research group` · `Berkeley` · `Apex` · `Numedica`

### Renee
`CURRENT ORDERS` · `Ortho` · `Body health` · `Econugenics` · `Ortho Molecular` · `Bodybio` · `Standard` · `Faireheaven` · `Momentous` · `Brand Sheet` · `Designs of Health` · `Metagenics.` · `Seeking Health` · `LMNT` · `Numedica` · `Apex` · `Bezwecken` · `Standard Process` · `Metagenics`

### Marco
`CURRENT ORDERS` · `Body Health` · `Ortho` · `Carlson` · `Klaire Labs` · `Brands Master` · `Standard` · `Energetix` · `Thorne` · `Metagenics.` · `FullScript` · `BodyBio` · `Perque`

### Carol
`Sheet1` · `Body Health` · `Ortho Molecular`

### Angelica
`Sheet1` · `Body Health` · `Klaire Labs` · `Ortho Molecular`

### Lisa
`Bodybio` · `Standard Process` · `Ortho` · `Metagenics` · `Klaire Labs` · `BodyHealth` · `Ortho Molecular` · `Thorne` · `Econugenics`

### Carl
`BodyHealth` · `Standard Process` · `Metagenics` · `Klaire Labs` · `Thorne` · `FullScript`

### Catherine
`Ortho` · `Designs of health` · `Standard Process` · `Body Health` · `Bodybio` · `Seeking Health` · `Ortho Molecular` · `Thorne` · `Metagenics.` · `Metagenics`

### Pierce
`Standard` · `Ortho` · `Brand Sheet` · `CURRENT ORDERS` · `Nutridyn` · `Klaire Lab` · `BodyHealth` · `Standard Process` · `Ortho Molecular` · `Numedica` · `Carlson` · `Metagenics.` · `Metagenics` · `Body bio`

---

## Tab Name → Brand Lookup

When an order comes in for a brand, use these tab names:

| Brand | Mike | DUFFLE | Rebecca | Suzanne | Renee | Marco | Carol | Angelica | Lisa | Carl | Catherine | Pierce |
|-------|------|--------|---------|---------|-------|-------|-------|----------|------|------|-----------|--------|
| Ortho Molecular | `OrthoMolecular` | `Matt's Ortho` | `Ortho Orders` | `Ortho Molecular` | `Ortho Molecular` | `Ortho` | `Ortho Molecular` | `Ortho Molecular` | `Ortho Molecular` | — | `Ortho Molecular` | `Ortho Molecular` |
| BodyHealth | `Bodyhealth` | `Matt body Health` | `Bodyhealth` | `Body Health` | `Body health` | `Body Health` | `Body Health` | `Body Health` | `BodyHealth` | `BodyHealth` | `Body Health` | `BodyHealth` |
| Standard Process | `Standard Process` | `MATT'S SP` | — | `Standard Process` | `Standard Process` | `Standard` | — | — | `Standard Process` | `Standard Process` | `Standard Process` | `Standard Process` |
| Metagenics | `Metagenics` | `Matt Metagenics` | — | `Metagenics` | `Metagenics` | `Metagenics.` | — | — | `Metagenics` | `Metagenics` | `Metagenics` | `Metagenics.` |
| Klaire Labs | `Klaire Lab` | — | — | — | — | `Klaire Labs` | — | `Klaire Labs` | `Klaire Labs` | `Klaire Labs` | — | `Klaire Lab` |
| Designs for Health | `Designs of Health` | `Designs of Health` | — | — | `Designs of Health` | — | — | — | — | — | `Designs of health` | — |
| Econugenics | — | `Econugenics` | — | — | `Econugenics` | — | — | — | `Econugenics` | — | — | `EcoNuge` |
| LMNT | — | `LMNT` | — | `LMNT` | `LMNT` | — | — | — | — | — | — | `LMNT` |
| Carlson | — | `Carlson Order` | — | — | — | `Carlson` | — | — | — | — | — | `Carlson` |
| BodyBio | — | `Body Bio` | `BodyBio` | `Bodybio` | `Bodybio` | `BodyBio` | — | — | `Bodybio` | — | `Bodybio` | `Body bio` |
| Seeking Health | — | `Matt's Seeking health` | — | — | `Seeking Health` | — | — | — | — | — | `Seeking Health` | — |
| Arthur Andrew | — | `Arthur Andrew` | — | — | — | — | — | — | — | — | — | — |
| NuMedica | `Numedica` | `NuMedica` | — | `Numedica` | `Numedica` | — | — | — | — | — | — | `Numedica` |
| NutriDyn | — | `NutriDyn` | — | — | — | — | — | — | — | — | — | `Nutridyn` |
| Thorne | — | — | — | — | — | `Thorne` | — | — | `Thorne` | `Thorne` | `Thorne` | — |
| Faireheaven | — | — | — | — | `Faireheaven` | — | — | — | — | — | — | `FairHaven` |
| Apex | — | `Apex` | — | `Apex` | `Apex` | — | — | — | — | — | — | `Apex Energetix` |

**Notes:**
- `—` = that practitioner doesn't have that brand tab (or not yet confirmed)
- Tab names are case-sensitive and must be URL-encoded for gviz fetch
- DUFFLE "Matt Carlson" = LMNT products — the rep's name was Carlson. Use "LMNT" column for those products.

---

## Gviz Read Pattern (Before Any Write)

```js
// Always read the sheet tab first to find append row and verify format
async function readSheetTab(page, sheetId, tabName) {
  const url = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(tabName)}`;
  const csv = await page.evaluate(async (url) => {
    const r = await fetch(url, { credentials: 'include' });
    return r.ok ? r.text() : null;
  }, url);
  return csv;  // Parse with CSV parser to get rows/columns
}

// Find the append row: last row where column A or B has content
// Skip rows where all columns are empty (blank separator rows are OK to skip over)
// Never overwrite a totals row (detected: col A contains "Total" or col B contains "Total")
```

---

## CDP Browser Access

**Rule: Always self-sufficient. Never ask Matt to open a browser or attach a tab.**

- URL: `http://127.0.0.1:18800` — existing Google session, already logged in
- Playwright: `const { chromium } = require('/Users/mattbender/.nvm/versions/node/v25.6.1/lib/node_modules/openclaw/node_modules/playwright');`
- Connect: `const browser = await chromium.connectOverCDP('http://127.0.0.1:18800');`
- Get page: `const page = (await browser.contexts()[0].pages())[0];`
- Sheet writes: clipboard paste ONLY (`navigator.clipboard.writeText` + `Meta+V`) — keyboard typing is silently dropped
- New tab: `Shift+F11` → double-click tab to rename → `Meta+A` → type name → Enter
- Browser tool alternative: `browser(action="open", profile="openclaw", targetUrl="...")`
- Get page: `const page = (await (browser.contexts()[0]).pages())[0];`

---

## Sellerboard COGS — Exact Entry Workflow

When `Accounting? = false` on a Notion order, Kargo enters the unit COGS into Sellerboard.

### What unit cost to enter per brand:
```
Ortho Molecular:
  Unit COGS = F/E (Total cost / Units) where F = wholesale × discount × E
  That is: wholesale_price × (1 - discount%) per unit
  Example: Orthomega 820 180ct at 10% off = $47.65 × 0.90 = $42.89/unit COGS

BodyHealth:
  Unit COGS = wholesale price (column C) — no discount typically
  Example: PerfectAmino 300ct = $38.95/unit

Standard Process / Metagenics / Klaire / Designs for Health / most others:
  Unit COGS = wholesale price (column C) — straightforward

Carlson (20% off):
  Unit COGS = wholesale × 0.80
  Example: Max Omega 2000 180ct = $67.20 × 0.80 = $53.76/unit

Arthur Andrew (20% off):
  Unit COGS = wholesale × 0.80

Seeking Health (7% off):
  Unit COGS = wholesale × 0.93
```

### Sellerboard COGS entry steps:
1. Open Sellerboard → Products page → search by ASIN or product name
2. Click the COGS value for that product
3. Select "Add batch" / "By period"
4. Enter: date = order date, cost/unit = calculated above, quantity = units ordered
5. Save
6. After all products for that Notion order are entered:
   `PATCH /v1/pages/{notionId}` → `{ "Accounting?": { checkbox: true } }`

**ASIN lookup:** `agents/amazon/product-data.json` — search by product name to find ASIN

### What "COGS" means for our margin math:
- This is what we PAID per unit (wholesale, after discount)
- NOT including the PayPal markup or any other fee
- Sellerboard adds FBA/FBM fees on top separately
- Our actual cost is higher by ~3.5% (PayPal) but Sellerboard can't track that directly

---

## Nova Prep Center Sheet — Exact Columns

**Sheet ID:** `15bGErKdxpBouR22DDaOdnwf6lxu7NZZI-0QfKr8tAQk`

**Amazon Prep Sheet tab columns:**
```
A: Date (leave blank — warehouse fills)
B: ASIN (leave blank — warehouse fills)
C: Item Name (REQUIRED — exact product name)
D: Qty Ordered (REQUIRED — units ordered)
E: Qty Received (leave blank — warehouse fills)
F: SKU (leave blank)
G: List Price (leave blank)
H: Buy Cost (REQUIRED — wholesale unit price)
I: Tracking (leave blank — add after label created)
J: Notes (optional — e.g. "BodyHealth PerfectAmino 300ct")
```

**Walmart Prep Sheet tab columns:**
```
A: Date (leave blank)
B: Walmart ID (leave blank)
C: Supplier (REQUIRED — e.g. "Ortho Molecular")
D: Item Name (REQUIRED)
E: Qty Ordered (REQUIRED)
F: Q-Received (leave blank)
G: Qty Recv'd (leave blank)
H: COG / Buy Cost (REQUIRED — unit cost)
I: Tracking (leave blank)
J: Size/Color (leave blank)
K: Bundles (leave blank)
```

**Before each order section, add a header row:**
```
col C = "[Account] [Brand] [Month]"  (e.g. "Mike Ortho Feb 2026")
— all other columns blank in this row
```

**After writing:** `PATCH /v1/pages/{notionId}` → `{ "Prep Update?": { checkbox: true } }`

---

## Sheet Writing

**Full format reference:** `agents/amazon/SHEET_FORMATS.md` — column-by-column guide for every brand across all practitioners. READ THIS before writing to any sheet.

**Key rule:** Always fetch-then-append. Read the last 3 rows of the target tab first, match the existing format exactly.

**Ortho Molecular writer:** `mission-control-server/kargo-ortho-sheet.js`
- Mike's sheet: `1NgLoJBbf1Ivrs2yUOnZDrBkEpxKJkyCynUHCz1Tj8Xs`
- Tabs: OrthoMolecular, Bodyhealth, Standard Process, Numadica, Designs of Health, Metagenics, Enzyme Science, Klaire Labs
- Mike Ortho format: Date | Product | Wholesale | 10% Off | Units | Total | Markup+PayPal | Total w/ Markup | PAID
- Formula: D=C×0.9, F=C×0.9×E, H=F×1.135, G=H/E, profit row = H_total×0.965−F_total
- API: `POST /api/kargo/write-ortho-order`
- Slack trigger: `@Kargo log this to Mike's sheet`

**2026 Ortho prices:** All updated in `kargo-ortho-sheet.js` + SUPPLIER_INTEL.md. Ortho raised prices Jan 2026. Use supplier-data.json (practitioner Google Sheets) as source of truth — never use pre-2026 prices.

**Other brands:** Basic format is `Date | Product | Wholesale | Units | Total` — only 5 columns. Details per brand in SHEET_FORMATS.md.

**Logged (2/24/26):** Mike Ortho — 11 rows, 156 units, prices corrected to 2026 rates on 2/25/26 ✅

---

## Markup Rules

Per-brand per-account — never universal.
- Mike / Ortho Molecular: 10% percentage + PayPal 3.5%
- Most others: flat dollar rate (check Mike's sheet formulas)
- Always: `(wholesale + flat_markup) × 1.035` or `wholesale × (1 + pct) × 1.035`

---

## Order Planning Data

- `kargo-appendix.json` — per-brand intelligence, velocity, stock, urgency (refreshes daily 6am ET cron)
- `kargo-order-history.json` — 206 historical orders (brand/account combos, avg amounts, frequency)
- `kargo-targets.json` — Ortho monthly targets (47 products)
- `kargo-pending.json` — unconfirmed orders awaiting ✅ (format below)
- `kargo-order-log.json` — planned orders, enforces once-per-month rule
- `brand-routing.json` — primary/secondary account routing per brand abbreviation
- `prep-sheet-pending.json` — orders queued for Nova prep center sheet append

### kargo-pending.json format
```json
[
  {
    "account": "Mike",
    "brand": "Ortho Molecular",
    "date": "02/23",
    "totalAmount": 3852,
    "discountPct": 0.10,
    "logged": true,
    "loggedAt": "2026-02-24",
    "products": [
      { "name": "Orthomega 180", "qty": 24 },
      { "name": "Spore IG",      "qty": 12 }
    ],
    "notes": "any caveats"
  }
]
```

### brand-routing.json abbreviations
| Abbrev | Brand |
|--------|-------|
| BH | BodyHealth |
| DFH | Designs for Health |
| ECO | Econugenics |
| KLAIRE | Klaire Labs |
| FAIRHAVEN | Faireheaven |
| ORTHO | Ortho Molecular |
| SP | Standard Process |
| METAGENICS | Metagenics |
| ARTHUR_ANDREW | Arthur Andrew |
| BODYBIO | BodyBio |

**Note:** brand-routing.json reflects order history patterns from Slack. SUPPLIER_INTEL.md has the authoritative routing priority rules — use SUPPLIER_INTEL.md over brand-routing.json when they conflict.

---

## Slack Channel IDs
- Orders: `C094RGF96K0` (#orders-amz-walmart)
- Amazon: `C092CDYAU8N`
- Daily: `C092JGUNM5J`
- Walmart: `C092JMRGAS0`
- New Brands: `C0980SN1GLS` (#new-brands)
- Hafsa: `@U092H36CT7F`

## Practitioners
Renee, Pierce, Mike, Carol, Suzanne, Rebecca, Angelica, Marco, Carl, Lisa, Catherine

## Key Slack Triggers
- `@Kargo plan orders` → full brand plan + auto-writes Ortho to sheet
- `@Kargo log this to Mike's sheet` → writes Ortho order from thread context
- `@Kargo new brand: [Name]` → posts to #new-brands, tags Hafsa to apply through ALL practitioners
- ✅ in thread → fires post-purchase flow (Notion update, prep sheet log)

## Order Tracking Thresholds
- Orders ≥ 2026-02-23: flag if no tracking after 3 days
- Orders before 2026-02-23: flag if 30+ days old with no tracking
