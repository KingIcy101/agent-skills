# Design Resources — Forge Reference Library

Use these at the START of any web/dashboard/landing build. Pull 3-5 references before writing code.

---

## Web Inspiration (General)
- **a1.gallery** — https://a1.gallery — Best websites, filterable by: Agency, Blog, Directory, Landing, One-page, Portfolio, Shop, Template, Waitlist, AI, Business, Data
- **godly.websites** — https://godly.websites — Handpicked high-quality web design
- **Dribbble** — https://dribbble.com/shots/popular/web-design — UI/UX shots by color + category
- **recentwork.com** — https://recentwork.com — Top-tier creative portfolios

## Landing Pages (7,300+)
- **lapa.ninja** — https://lapa.ninja — Largest landing page gallery; filters by category + font + color
- **Landbook** — https://land-book.com — Curated landing pages with tech stack info

## Component Inspiration
- **21st.dev** — https://21st.dev — **PRIMARY anti-slop tool.** Scroll animations, shader backgrounds, interactive components. Always check here before building any complex UI element.
- **Aceternity UI** — https://ui.aceternity.com — High-end animated React components
- **cta.gallery** — https://cta.gallery — CTAs by type: Button / Call-to-Buy / Download / Form / Modal / Navigation / Newsletter / Pricing
- **navbar.gallery** — https://navbar.gallery — Navbars by type: Static / Dropdown / Mega Menu / Sidebar / Search / Full Screen

## Portfolio & Creative
- **recentwork.com** — https://recentwork.com — Creative professional portfolios
- **Behance** — https://behance.net — Brand identities, motion, UX work

## Dashboard & App UI
- **Dribbble Dashboard** — https://dribbble.com/search/dashboard-ui
- **UI8** — https://ui8.net — Premium design kits (reference only, don't buy unless needed)

## AI-Specific
- **a1.gallery/ai** — https://a1.gallery/?category=ai — AI product landing pages specifically
- **Dribbble AI** — https://dribbble.com/search/ai-dashboard — AI dashboard UI patterns

---

## How to Use These

1. **Search by industry** — use the category filters on each site
2. **Screenshot 3-5 references** that match the client's vibe
3. **Bring screenshots into Claude Code context** with the prompt: "Emulate this layout/feel while using [client's brand colors, fonts, messaging]"
4. **Layer 21st.dev components** to replace any generic sections
5. **Apply theme-factory** to lock consistent styling across the whole build

---

## Quick Lookup — By Build Type

| Building... | Start here |
|---|---|
| SaaS landing page | lapa.ninja → filter "SaaS" |
| Healthcare/medical site | lapa.ninja → filter "Health" + a1.gallery |
| Agency portfolio | recentwork.com + godly.websites |
| Dashboard/app UI | Dribbble dashboard + Aceternity UI |
| Dark theme dashboard | Dribbble → filter dark + Mission Control patterns in FORGE_KNOWLEDGE.md |
| CTA section | cta.gallery → pick type |
| Navigation | navbar.gallery → pick pattern |
| AI product page | a1.gallery/ai |
| Client portal | Aceternity UI + 21st.dev |

---

## Dashboard Design References (Saved Examples)

### Dark Analytics Dashboard (Feb 27, 2026)
**Style:** Deep navy + neon glow (cyan/purple/green)
**Key patterns to steal:**
- Circular donut gauge cards for top KPIs (Revenue, Profit, Units, ROI) with animated glow rings
- Color-coded metric cards: red=negative, green=positive, blue=neutral — each with icon + % delta
- Area chart with gradient fill (revenue curve) + stacked bar chart in same row
- Data table with colored row highlights for categories
- Side panel for shipment/order status tracking (Status + Destination + Financials mini-bars)
- Circular progress indicators for fulfillment %
- Background: ~#0d0e1a (deep navy), cards: #1a1b2e, accents: #00d4ff (cyan), #7c3aed (purple), #22c55e (green)
**Best for:** Commerce dashboards, Amazon/Walmart analytics, FBA tracking, any data-heavy client build
**File saved:** /Users/mattbender/.openclaw/media/inbound/file_104---f0c8f46b-24cb-475f-8e67-cc950efbae1e.jpg
