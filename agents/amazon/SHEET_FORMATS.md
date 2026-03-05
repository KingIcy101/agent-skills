# SHEET_FORMATS.md — Supplier Sheet Format Reference
**For Kargo: How to write order rows to any practitioner's Google Sheet**
*Last updated: 2026-02-25 — derived from supplier-data.json analysis of all practitioners*

---

## GOLDEN RULE
Before writing to any sheet, READ the last 3 rows of that tab first (via gviz CSV fetch).  
Match the existing format exactly — don't invent columns.  
Always append below the last row. Never overwrite.

---

## ORTHO MOLECULAR — FULL VISUAL + FORMULA REFERENCE
*(Derived from live inspection of Mike's OrthoMolecular tab, Feb 2026)*

### Complete Column Layout (9 columns: A–I)

| Col | Header | Content | Formula | Format | Style |
|-----|--------|---------|---------|--------|-------|
| A | Date | Date of order | Raw value | MM/DD/YY or MM/DD | Center, **BOLD**, Poppins 12pt |
| B | Product | Product name | Raw value | Plain text | Center, normal, Poppins 12pt |
| C | Wholesale Price | Wholesale unit cost | Raw value | $XX.XX | Center, normal |
| D | 10% Off / 5% Off | Discounted unit price | `=C*0.9` (or raw) | $XX.XX | Center, normal |
| E | Units | Quantity ordered | Raw integer | Integer (no $) | Center, normal |
| F | Total | Total cost (discounted) | `=D*E` | $X,XXX.XX (comma) | Center, normal |
| G | Markup Price + PayPal Fee | Per-unit price Mike charges | `=D*1.135` | $XX.XX | Center, **ORANGE BOLD** |
| H | Total with Markup | Total revenue Mike collects | `=G*E` | $X,XXX.XX (comma) | Center, normal |
| I | PAID / blank | Payment status or blank | Raw value | Plain text | Center, normal |

**Col G is the most visually distinctive column — orange text, bold, stands out from the black of every other column.**

---

### Row Styling Reference

#### HEADER ROW (one per section)
```
Background:  BLACK (#000000)
Text color:  WHITE (#FFFFFF)
Font:        Poppins 12pt, BOLD
Alignment:   CENTER for all columns
Content:     Date | Product | Wholesale Price | 10% Off | Units | Total | Markup Price + PayPal Fee | Total with Markup | PAID
```
→ Note: Col D header changes: "5% Off" for Dec 2025, "10% Off" for Jan 2026+
→ Note: Col G header text may appear in **ORANGE/AMBER** even on the black background — it's styled differently to match the data rows

#### BLANK ROW (after header row)
```
Background:  White (empty row — row 20 in Jan section, row 34 in Feb section)
Content:     All blank
Purpose:     Visual spacer between header and data rows (ONLY in Jan/Feb sections, not Dec)
```

Wait — actually Dec has NO blank row after the header. Check the section structure:
- **Dec:** Header (row 1) → Data rows (rows 2–14) → Totals (rows 15–16) → Blank sep (rows 17–18)
- **Jan:** Header (row 19) → Blank row (row 20) → Data rows (rows 21–30) → Totals (rows 31–32) → Next section
- **Feb:** Header (row 33) → Data rows (rows 34+) → Totals

#### DATA ROWS
```
Background:  WHITE (default — no fill)
Text color:  BLACK for cols A, B, C, D, E, F, H, I
             ORANGE/AMBER for col G (Markup per unit) — bold
Font:        Poppins 12pt, normal weight (except col A dates = BOLD; col G = BOLD)
Alignment:   CENTER for all columns
```

**Number formatting:**
- Col C (Wholesale): `$XX.XX` — dollar sign, 2 decimals, no comma
- Col D (Discounted): `$XX.XX` — dollar sign, 2 decimals, no comma
- Col E (Units): plain integer, no dollar sign
- Col F (Total): `$X,XXX.XX` — dollar sign, 2 decimals, **WITH comma** for thousands
- Col G (Markup/unit): `$XX.XX` — dollar sign, 2 decimals, no comma
- Col H (Markup total): `$X,XXX.XX` — dollar sign, 2 decimals, **WITH comma** for thousands

**Blue hyperlinks in product names:**
Some product size/count descriptors are hyperlinked (appear blue): "40ct", "180ct", "(180ct)", "120ct", "240 Count", "30ct", "60ct". The rest of the product name stays black. These are NOT added by Kargo — they appear in the original sheet from the practitioner.

#### TOTALS SECTION (two rows at end of each section)
```
ROW A — Label row:
  Background: Default white (or possibly dark cols E/F — unclear from analysis)
  Col I: "Profit to you" text (right-aligned or center)
  All other columns: blank

ROW B — Values row:
  Background: White
  Col E: =SUM(E_first_data:E_last_data)    ← total units (integer)
  Col F: =SUM(F_first_data:F_last_data)    ← total cost ($X,XXX.XX)
  Col G: blank
  Col H: =SUM(H_first_data:H_last_data)    ← total with markup ($X,XXX.XX)
  Col I: =H_total*0.965-F_total            ← profit after PayPal 3.5% fee
```

**Profit formula explained:**
`=H_total × 0.965 − F_total`
- H_total × 0.965 = total markup revenue minus 3.5% PayPal fee
- F_total = total cost paid to Ortho Molecular
- Result = Mike's net profit on the order

#### SECTION SEPARATOR
```
Blank row(s) between each order section (Dec→Jan, Jan→Feb)
After Jan totals: one blank row, then "Product" label row, then Feb header
```

---

### Formulas — Exact Syntax

```
D (discount per unit):  =Cn*0.9    (10% off)  OR  =Cn*0.95  (5% off, Dec 2025)
F (total cost):         =Dn*En
G (markup per unit):    =Dn*1.135
H (markup total):       =Gn*En     (or =Fn*1.135 — same result)

Totals row:
  E total:  =SUM(E_start:E_end)
  F total:  =SUM(F_start:F_end)
  H total:  =SUM(H_start:H_end)
  I profit: =H{totals_row}*0.965-F{totals_row}
```

**Note:** Some D cells are raw values (pre-calculated by original data entry) rather than formulas. Either is fine — the result is the same. Use formulas when adding new rows for consistency.

---

### Markup Rate Logic

**Why 1.135?**
Mike pays Ortho (after discount) → then charges the buyer (Matt/Kargo) 13.5% on top.
- 10% off price × 1.135 = Mike's asking price per unit
- Then Matt also pays PayPal: buyer total × 0.035 fee on top
- So Matt's net received: H_total × 0.965 (96.5% of the markup total)
- Matt's actual cost: F_total (the discounted wholesale × units)
- Matt's profit: H × 0.965 − F

**The 0.965 in the profit formula = (1 - 0.035 PayPal fee rate)**

---

### Section Layout (Mike's OrthoMolecular tab, current state)

```
Row 1:      Dec 2025 header (BLACK BG, "5% Off")
Rows 2–14:  Dec 2025 data (13 products)
Row 15:     Dec totals labels → blank + "Profit to you" in col I
Row 16:     Dec totals values → 115 units | $2,492.93 cost | $2,829.33 markup | $237.38 profit
Rows 17–18: Blank separator rows
Row 19:     Jan 2026 header (BLACK BG, "10% Off")
Row 20:     Blank
Rows 21–30: Jan 2026 data (10 products)
Row 31:     Jan totals labels → "Profit to you" in col I
Row 32:     Jan totals values → 108 units | $3,502.26 cost | $3,975.06 markup | $333.68 profit
Row 33:     Feb 2026 header (BLACK BG, "10% Off")
Rows 34–44+: Feb 2026 data
Row N:      Feb totals labels
Row N+1:    Feb totals values
```

---

### Discount Rates by Account/Period

| Account | Period | Rate | Col D formula |
|---------|--------|------|---------------|
| Mike | Dec 2025 | 5% off | =C*0.95 |
| Mike | Jan 2026+ | 10% off | =C*0.9 |
| Carol | All 2026 | 5% off | =C*0.95 |
| Rebecca | All | 10% off | =C*0.9 |
| Renee | All | 10% off | =C*0.9 |
| Suzanne | All | 10% off | =C*0.9 |
| Pierce | All | 10% off | =C*0.9 |
| DUFFLE | All | 10% off | =C*0.9 |
| Marco | All | 10% off | =C*0.9 |

**Volume tiers (Ortho official):** 72+ units = 5% off, 144+ units = 10% off
→ Most accounts order 100-150+ units so they get 10% by default

---

### TSV Template for Writing a New Order Section

When Kargo writes a new month to Mike's sheet via clipboard paste, use this TSV structure:

**Header row (cols A–I):**
```
Date\tProduct\tWholesale Price\t10% Off\tUnits\tTotal\tMarkup Price + Paypay Fee\tTotal with Markup\tPAID
```

**Data row (cols A–I) — use formulas for D, F, G, H:**
```
02/23\tOrthomega 820 (180ct)\t47.65\t=C{n}*0.9\t24\t=D{n}*E{n}\t=D{n}*1.135\t=G{n}*E{n}\t
```

**Totals label row:**
```
\t\t\t\t\t\t\t\tProfit to you
```

**Totals values row:**
```
\t\t\t\t=SUM(E{first}:E{last})\t=SUM(F{first}:F{last})\t\t=SUM(H{first}:H{last})\t=H{totals}*0.965-F{totals}
```

**Note:** Google Sheets will automatically apply the existing cell styles (black header BG, orange col G) IF the rows were paint-formatted from existing sections. When writing fresh rows via clipboard paste, the VALUE appears correctly but the STYLING won't be applied automatically.

---

### Styling Application (Paint Format)

After writing data rows via clipboard paste, apply styles by running paint-format from an existing styled row. The key styles to copy:
- **Header row style:** Copy from row 1 → apply to new header row
- **Data row style:** Copy from row 2 → apply to all new data rows (to get Poppins font + col G orange)
- **Totals row style:** Copy from row 15 (labels) and row 16 (values)

**Limitation:** Paint format via Playwright is imperfect for font changes. If font doesn't transfer: flag to Hafsa for manual touch-up.

---



---

## UNIVERSAL BASE FORMAT (applies to ~90% of all sheets)

| Col | Field | Notes |
|-----|-------|-------|
| A | Date | MM/DD/YY format (e.g. "02/23/26") |
| B | Product | Exact product name from prior rows in that sheet |
| C | Wholesale Price | `$XX.XX` — use 2026 price from SUPPLIER_INTEL.md or supplier-data.json |
| D | Units | Integer |
| E | Total | `$XX.XX` — Wholesale × Units |
| F | (blank or PayPal fee) | Leave blank unless template has a label here |
| G | Profit | Usually blank — Hafsa/practitioner fills |
| H | Fulfilled | Leave blank or "N/A" |
| I | PAID | Leave blank |

**Write rule:** Fill A–E only. Leave F+ blank unless the tab's header explicitly names those columns.

---

## BRAND-SPECIFIC FORMATS

### 1. ORTHO MOLECULAR — MOST COMPLEX, MOST IMPORTANT

Each practitioner's Ortho tab has slight variations. Check the header row first.

**Mike / OrthoMolecular** — 9 columns:
```
Date | Product | Wholesale | 5% Off | Units | Total | Markup+PayPal | Total w/Markup | PAID
```
- Col D (5% Off) = C × 0.95 (Dec 2025 was 5%; Jan 2026+ switched to 10%)
- Actually check the header — if it says "10% Off", use C × 0.90
- Col F (Total) = D × E (using exact unrounded D × E)
- Col G (Markup+PayPal fee per unit) = F × 1.135 / E = round(C × discount × 1.135, 2)
- Col H (Total w/Markup) = F × 1.135
- Col I = blank (Profit is only in the totals row, formula =H_total×0.965-F_total)

**Carol / Ortho Molecular** — 9 columns (5% off):
```
Date | Product | Wholesale | 5% Off | Units | Total | Markup Price | Total | PAID
```
- Same structure as Mike but Carol uses 5% off permanently
- Col D = C × 0.95, Col F = D × E, Col G = markup per unit, Col H = G × E

**Suzanne / Ortho Molecular** — 9 columns (10% off):
```
Date | Product | Wholesale | After 10% | Units | Total | Markup Price | Total | Fulfilled
```
- Col D = C × 0.90, Col F = D × E (but uses exact: C × 0.9 × E)
- Col G = markup price per unit
- Col H = G × E

**Renee / Ortho Molecular** — 10 columns (10% off + separate PayPal column):
```
Date | Product | Wholesale | After 10% | Units | Total | Markup Price | PayPal Price | Total | Fulfilled | PAID
```
- Col D = C × 0.90
- Col F (Total cost) = D × E
- Col G (Markup Price per unit) = wholesale + markup%
- Col H (PayPal Price per unit) = G with PayPal adjustment
- Col I (Total with PayPal) = H × E

**Rebecca / Ortho Orders** — 12+ columns (10% off + MAP + 35% markup columns):
```
Date | Product | Wholesale | 10% Off | Units | Total | MAP | MAP×Units | 35%off Price | Total w/Markup | (PayPal fee) | (Total after PayPal)
```
- Col D = C × 0.90
- Col G (MAP) = Ortho's MAP price per unit
- Col H (MAP×Units) = MAP × E
- Col I (35%off Price) = Wholesale × 0.65 (35% off MAP)
- Rebecca has markup on top — see SUPPLIER_INTEL.md for her markup rate

**Pierce / Ortho Molecular** — old-style (desired price + wholesale columns):
```
Date | Product | Desired Price | Units | Total | blank | Profit | Fulfilled | blank | Wholesale Price | 10%off
```
- Pierce's newer 2026 orders show cleaner format, check latest rows

**Discount rates by account (Ortho):**
- Mike: 10% off (144+ units) — used 5% earlier, now 10%
- Rebecca: 10% off (always, then adds her own markup)
- Renee: 10% off  
- Suzanne: 10% off
- Carol: 5% off
- Pierce: 10% off
- DUFFLE (Matt's main): 10% off

**Ortho 2026 prices:** See SUPPLIER_INTEL.md. Key ones: Orthomega 820 180ct=$47.65, OrthoMune=$25.85, Methyl CpG=$22.85, Spore IG=$30.25, Diaxinol=$27.85, D-Hist 40ct=$12.80.

---

### 2. BODYHEALTH — SIMPLE

**All practitioners** (Angelica, Carol, Mike, Suzanne, Rebecca, Pierce, Catherine, Lisa) use nearly identical format:
```
Date | Product | Wholesale Price / Vendor Price | Units | Total | (blank) | (blank) | (blank) | PAID
```
- Only fill: A (date), B (product), C (wholesale), D (units), E (total = C×D)
- Leave everything after E blank
- Some have "PAID" header in col I — leave blank

**2026 BodyHealth prices** (from supplier-data.json):
- Perfect Amino 300ct Non Coated: $38.95
- Perfect Amino 300ct Coated: $38.95  
- Perfect Amino 150ct: $21.50 (some show $21.38 — check latest)
- Perfect Amino 600ct: $73.15
- Perfect amino powder 30 servings: $21.85
- Perfect amino powder 60 servings (Berry/Unflavored/Vanilla): $39.90
- Perfect amino powder Strawberry 120 serving: $74.01

---

### 3. STANDARD PROCESS — SIMPLE

**All practitioners:**
```
Date | Product | Wholesale Price | Units | Total | (blank) | Profit | Fulfilled | PAID
```
OR newer format (Mike):
```
Date | Product | Wholesale | Markup Price | Units | Total | Total With Profit | PAID
```
- Only fill: A, B, C, D, E
- Mike's SP uses "Markup Price" and "Total With Profit" — leave blank unless you know the markup

---

### 4. METAGENICS — TWO FORMATS

**Old planning sheet format** (Carl, Marco, Lisa):
```
Date | Product | Desired Price | Units | Total | SKU | Fulfilled | Notes
```
- Col C = desired price (what you want to charge or pay)

**Modern order sheet format** (Mike, Renee, Catherine, Suzanne, Pierce):
```
Date | Product | Wholesale Price | Units | Total | (blank) | Profit | Fulfilled | PAID
```
- Only fill: A, B, C, D, E
- Some have SKU in a later column — leave blank

---

### 5. CARLSON — 20% OFF

**Marco, Pierce:**
```
Date | Product | Wholesale | 20% Off | Markup Price | PAID Units | Total
```
- Col D = C × 0.80 (20% off)
- Col E (Markup Price) = leave blank (practitioner fills)
- Col F (PAID Units) = quantity
- Col G (Total) = D × F (discounted × units)

**2026 Carlson prices (Marco, 02/05/26):**
- Elite EPA Gems 120ct: $56.94
- Maximum Omega 2000 Lemon 180ct: $67.20
- Very Finest Fish Oil 1600mg Lemon 16.9oz: $33.00
- Very Finest Fish Oil 1600mg Orange 16.9oz: $33.00

---

### 6. ARTHUR ANDREW — 20% OFF

**DUFFLE:**
```
Date | Product | Wholesale Price | After 20% | Units | Total
```
- Col D = C × 0.80
- Col F = D × E

---

### 7. KLAIRE LABS — SIMPLE

**All practitioners:**
```
Date | Product | Wholesale Price | Units | Total | (blank) | Profit | Fulfilled | PAID
```
- Only fill: A, B, C, D, E

**2026 Klaire prices (Pierce, 02/13/26):**
- Ther-Biotic Complete 60ct: $28.99
- Ther-Biotic Complete 120ct: $51.99
- Ther-Biotic Complete Powder 2.25oz: $49.49

---

### 8. DESIGNS OF HEALTH — SIMPLE

**Most practitioners:**
```
Date | Product | Wholesale Price | Units | Total | (blank) | Fulfilled | PAID
```
- Only fill: A, B, C, D, E
- Some tabs (Catherine) show: `Date | Wholesale | Units | Total | blank | Profit | Fulfilled | PAID`

**2026 Designs of Health prices (Catherine, 01/23/26):**
- GI Revive powder: $40.00
- DIM-Evail 120ct: $32.25
- Digestzymes 90ct: $20.00 (note: differs from $35.75 for 180ct)

---

### 9. ECONUGENICS — SIMPLE WITH PAYPAL

**Most practitioners:**
```
Date | Product | Wholesale | Units | Total | PayPal fee | Profit | Fulfilled | PAID
```
- Col F = PayPal transaction fee (fixed ~$4.77–$7.55)
- Only fill: A, B, C, D, E — leave F+ blank

**2026 Econugenics prices (Renee, 01/22/26):**
- PectaSol Powder Unflavoured 90 serving: $72.00
- PectaSol 270 capsules: $52.20
- PectaSol Chewables: $40.80
- PectaSol Powder 90 serving: $72.00 (unflavoured) / $78.00 (Berry Infusion)

---

### 10. SEEKING Health — 7% DISCOUNT (ONGOING)

**Catherine:**
```
Date | Product | Wholesale Price | 7% Off | Units | Total | Profit | Fulfilled | PAID
```
- Col D = C × 0.93 (7% off)
- Col F = D × E

---

### 11. APEX / APEX ENERGETIX — SIMPLE

**All practitioners:**
```
Date | Product | Wholesale Price | Units | Total | (blank) | Profit | Fulfilled | PAID
```
- Only fill: A, B, C, D, E

---

### 12. BODYBIO — SIMPLE

**Most practitioners:**
```
Date | Product | Wholesale Price | Units | Total | (blank) | Profit | Fulfilled | PAID
```
- Only fill: A, B, C, D, E

---

### 13. LMNT — SIMPLE

**Most practitioners:**
```
Date | Product | Wholesale Price | Markup | Units | Total | Markup Total | Profit | Fulfilled | PAID
```
- Col D = Markup price (per unit with markup, e.g. $24.30 for $22.50 product)
- Col E = Units
- Col F = Total (Wholesale × Units)
- Col G = Total (Markup × Units)
- Only fill: A, B, C, D (markup), E, F, G — leave rest blank

---

### 14. NUMEDICA — SIMPLE

**All practitioners:**
```
(date) | Product | Wholesale Price | Quantity | Markup Total | Fulfilled | blank | Paid
```
- Col A or row label = date (format varies: "1-16-26" or "01/16/26")
- Only fill: date field, B, C, D, E (Total = C × D)

---

### 15. NUTRIDYN — SIMPLE

```
Date | Product | Wholesale Price | Units | Total
```
- Simplest format: A, B, C, D, E only

---

## FORMULA GUIDE — FILL ORDER

**Step 1:** Read the header row of the tab  
**Step 2:** Match column positions to the patterns above  
**Step 3:** Fill:
1. A = Date (MM/DD/YY)
2. B = Product name (match exactly to previous rows for consistency)
3. C = Wholesale price (ALWAYS from 2026+ orders in supplier-data.json or SUPPLIER_INTEL.md)
4. If discount column exists: = C × (1 - discount%)
5. Units column = quantity
6. Total = (discounted price) × units
7. Everything else = blank unless you're 100% sure

**Never guess** at markup, profit, or PayPal columns — leave blank for the practitioner/Hafsa to fill.

---

## HOW TO READ A SHEET BEFORE WRITING

```js
// Fetch current tab data via gviz (works in logged-in Playwright browser)
const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(TAB_NAME)}`;
const csv = await page.evaluate(async (url) => {
  const r = await fetch(url, { credentials: 'include' });
  return await r.text();
}, url);
// Parse CSV, find last non-empty row, append below it
```

---

## TOTALS ROWS

Some sheets have a totals row (Ortho sheets especially). These are dark-background rows with SUM formulas. **Never overwrite them.** Check for them when finding the append position.

Totals row detection: last row where col A or B contains "Total", "TOTAL", or is blank but col E–H have values > 0.

---

## KEY SHEET IDs

| Practitioner | Sheet ID | Notes |
|---|---|---|
| Mike | `1NgLoJBbf1Ivrs2yUOnZDrBkEpxKJkyCynUHCz1Tj8Xs` | OrthoMolecular tab + others |
| Carl | `1wxTzpMGNiMY10XPOaLbtL8jUr6km_vCT5GNwbrWHk90` | BH, SP, Metagenics, Klaire, Arthur Andrew |
| Catherine | `1Azcai4i4-tttgsJ9g99xlh64PIXaTaGes5Aaj73wh18` | Multiple brands |
| Lisa | `1OtE9qLVjIbxu0Oiv3STHvqfvyGUSFzPHeFj7veHQtJg` | SP, Ortho, Metagenics, Klaire, BH |
| Planning sheet (DUFFLE) | `1oyDlwT7fB51s8AzM8LQhkNCQHRYTawtiEdIrCC-kqvM` | Matt's main ordering sheet |
| Nova Prep Center | `15bGErKdxpBouR22DDaOdnwf6lxu7NZZI-0QfKr8tAQk` | Amazon + Walmart prep tracking |

*Note: Rebecca, Renee, Mike, Suzanne, Carol, Pierce, Marco, Angelica — IDs in supplier-data.json*

---

## COMMON MISTAKES TO AVOID

1. **Using pre-2026 prices** — Ortho raised prices Jan 2026. Always verify from 2026+ entries.
2. **Wrong discount rate** — Check header. Mike Ortho is 10% (not 5% — that was Dec 2025).
3. **Writing to the wrong tab** — Each brand has its own tab. Match brand name to tab name.
4. **Overwriting totals rows** — Read the sheet first, find the append row carefully.
5. **Calculating G/H columns for Ortho manually when wrong** — Use formula: H = F × 1.135 exactly.
6. **Currency format issues** — Write as plain number (e.g. 47.65), let the sheet apply $format via cell formatting.
7. **Date format** — Use MM/DD/YY not MM/DD/YYYY. "02/23/26" not "02/23/2026".
