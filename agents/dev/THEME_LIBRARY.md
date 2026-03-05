# THEME_LIBRARY.md — Design Themes for Forge

8 complete design themes. Each includes CSS variables, font pairings, and use cases.
Forge loads this before any web build to pick the right visual direction.

---

## How to Use

1. Pick the theme that matches the client/project vibe
2. Copy the `:root` block into your CSS
3. Use the variable names consistently throughout
4. Load the Google Fonts link in `<head>`

---

## Theme 1: Obsidian
**Vibe:** Deep charcoal + electric blue. Premium tech. Dashboards, SaaS, AI products.
**Best for:** Mission Control, agency client dashboards, B2B tech tools

```css
/* Google Fonts: import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@400;600&display=swap') */

:root {
  /* Backgrounds */
  --bg:       #0d0e14;
  --s1:       #13141c;
  --s2:       #1a1b26;
  --s3:       #21232f;

  /* Text */
  --text:     #e8eaf0;
  --t2:       #9497a8;
  --t3:       #5c5f72;

  /* Accent (electric blue) */
  --accent:       #4f8ef7;
  --accent-light: #7aabff;
  --accent-dark:  #2d6fd4;
  --accent-dim:   rgba(79,142,247,.12);

  /* Borders */
  --b1:       rgba(255,255,255,.07);
  --b2:       rgba(255,255,255,.12);

  /* Status */
  --green:    #22d3a0;
  --yellow:   #f5b731;
  --red:      #ff5e6c;
  --blue:     #4f8ef7;
  --purple:   #8b7ffd;

  /* Typography */
  --font-sans: 'Inter', -apple-system, sans-serif;
  --font-mono: 'JetBrains Mono', monospace;
}
```
**Font pairing:** Inter 400/700/900 + JetBrains Mono for code/metrics

---

## Theme 2: Velora
**Vibe:** Ivory + gold + dark brown. Luxury, design, interior, events. Timeless and warm.
**Best for:** Velora dashboard, interior design clients, wedding/event businesses

```css
/* Google Fonts: import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400&family=Jost:wght@300;400;500;600;700&display=swap') */

:root {
  /* Backgrounds */
  --bg:       #faf8f2;
  --s1:       #f4f0e8;
  --s2:       #ede8dc;
  --s3:       #e4ddd0;

  /* Text */
  --text:     #1a1410;
  --t2:       #5c4d3a;
  --t3:       #9c8970;

  /* Accent (gold) */
  --accent:       #b8933a;
  --accent-light: #d4aa55;
  --accent-dark:  #8f6f28;
  --accent-dim:   rgba(184,147,58,.12);

  /* Borders */
  --b1:       rgba(26,20,16,.08);
  --b2:       rgba(26,20,16,.14);

  /* Status */
  --green:    #4a7c59;
  --yellow:   #b8933a;
  --red:      #8b1a2a;
  --blue:     #3a5c8b;
  --purple:   #6b4d8b;

  /* Burgundy secondary */
  --burgundy: #8b1a2a;

  /* Typography */
  --font-sans: 'Jost', sans-serif;
  --font-display: 'Playfair Display', Georgia, serif;
}
```
**Font pairing:** Playfair Display (headings) + Jost 300/400/600 (body)

---

## Theme 3: Forest
**Vibe:** Deep forest green + cream + moss. Health, wellness, nature, integrative medicine.
**Best for:** Health clinic sites, wellness apps, naturopathic practitioners

```css
/* Google Fonts: import url('https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,600;0,700;1,400&family=DM+Sans:wght@400;500;600;700&display=swap') */

:root {
  --bg:       #0f1a12;
  --s1:       #152019;
  --s2:       #1d2b20;
  --s3:       #243528;

  --text:     #e8ede5;
  --t2:       #8fa88a;
  --t3:       #5a7059;

  --accent:       #4a9e6b;
  --accent-light: #6dba88;
  --accent-dark:  #337a51;
  --accent-dim:   rgba(74,158,107,.12);

  --b1:       rgba(255,255,255,.07);
  --b2:       rgba(255,255,255,.12);

  --green:    #4a9e6b;
  --yellow:   #c4a84a;
  --red:      #c45a5a;
  --blue:     #4a7a9e;
  --purple:   #7a5a9e;

  --cream:    #f0ece0;

  --font-sans: 'DM Sans', sans-serif;
  --font-display: 'Lora', Georgia, serif;
}
```
**Font pairing:** Lora (headings/italic) + DM Sans 400/600 (body)

---

## Theme 4: Midnight
**Vibe:** Deep navy + purple + silver. SaaS, software, B2B. Polished and trustworthy.
**Best for:** Software company landing pages, B2B SaaS, tech agency sites

```css
/* Google Fonts: import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Space+Grotesk:wght@400;500;600;700&display=swap') */

:root {
  --bg:       #080c18;
  --s1:       #0e1428;
  --s2:       #151c35;
  --s3:       #1c2442;

  --text:     #e4e8f4;
  --t2:       #8892b4;
  --t3:       #505878;

  --accent:       #7c5cfc;
  --accent-light: #9e82ff;
  --accent-dark:  #5c3ce0;
  --accent-dim:   rgba(124,92,252,.12);

  --b1:       rgba(255,255,255,.07);
  --b2:       rgba(255,255,255,.12);

  --green:    #3ed9a0;
  --yellow:   #f0c040;
  --red:      #f05060;
  --blue:     #40a0f0;
  --purple:   #7c5cfc;
  --silver:   #c0c8e0;

  --font-sans: 'Space Grotesk', sans-serif;
  --font-mono: 'Inter', sans-serif;
}
```
**Font pairing:** Space Grotesk (headings) + Inter (body text)

---

## Theme 5: Ember
**Vibe:** Warm dark + amber + rust. Bold agency work, creative studios, personal brands.
**Best for:** AI agency sites, creative portfolios, bold brand identities

```css
/* Google Fonts: import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=Inter:wght@400;500;600&display=swap') */

:root {
  --bg:       #100c08;
  --s1:       #1a140e;
  --s2:       #241c14;
  --s3:       #2e2418;

  --text:     #f0e8e0;
  --t2:       #a8907a;
  --t3:       #6a5848;

  --accent:       #e07830;
  --accent-light: #f09050;
  --accent-dark:  #c06020;
  --accent-dim:   rgba(224,120,48,.12);

  --amber:    #f5b040;
  --rust:     #c04820;

  --b1:       rgba(255,255,255,.07);
  --b2:       rgba(255,255,255,.12);

  --green:    #60c080;
  --yellow:   #f5b040;
  --red:      #e04040;
  --blue:     #4080e0;
  --purple:   #9060e0;

  --font-sans: 'Syne', sans-serif;
  --font-body: 'Inter', sans-serif;
}
```
**Font pairing:** Syne 700/800 (display headings) + Inter 400/500 (body)

---

## Theme 6: Slate
**Vibe:** Cool gray + teal + white. Corporate, clean, professional. Easy to read.
**Best for:** Corporate client sites, law firms, financial services, clean dashboards

```css
/* Google Fonts: import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap') */

:root {
  --bg:       #f8fafb;
  --s1:       #f0f4f7;
  --s2:       #e4eaef;
  --s3:       #d8e0e8;

  --text:     #1a2433;
  --t2:       #4a5c6e;
  --t3:       #7a8e9e;

  --accent:       #1a7f8e;
  --accent-light: #2a9eae;
  --accent-dark:  #0f6070;
  --accent-dim:   rgba(26,127,142,.10);

  --b1:       rgba(26,36,51,.08);
  --b2:       rgba(26,36,51,.14);

  --green:    #1a8f5a;
  --yellow:   #c08a1a;
  --red:      #c03030;
  --blue:     #1a5f9e;
  --purple:   #6a3a9e;
  --teal:     #1a7f8e;

  --font-sans: 'Inter', -apple-system, sans-serif;
}
```
**Font pairing:** Inter only — use weight variation for hierarchy (400/600/800)

---

## Theme 7: Rose
**Vibe:** Blush + burgundy + warm white. Beauty, events, weddings, women's brands.
**Best for:** Wedding planners, beauty brands, feminine product sites, boutique agencies

```css
/* Google Fonts: import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Karla:wght@400;500;600;700&display=swap') */

:root {
  --bg:       #fdf8f6;
  --s1:       #f8f0ec;
  --s2:       #f0e4de;
  --s3:       #e8d8d0;

  --text:     #2a1818;
  --t2:       #6e4040;
  --t3:       #a87878;

  --accent:       #8b1a2a;
  --accent-light: #b03040;
  --accent-dark:  #660f1c;
  --accent-dim:   rgba(139,26,42,.10);

  --blush:    #e8a8a0;
  --rose:     #c86070;

  --b1:       rgba(42,24,24,.08);
  --b2:       rgba(42,24,24,.14);

  --green:    #4a7a50;
  --yellow:   #a88030;
  --red:      #8b1a2a;
  --blue:     #3a5a8b;
  --purple:   #6a3a8b;

  --font-sans: 'Karla', sans-serif;
  --font-display: 'Cormorant Garamond', Georgia, serif;
}
```
**Font pairing:** Cormorant Garamond italic (headings) + Karla 400/600 (body)

---

## Theme 8: Solar
**Vibe:** Deep black + gold + orange. Premium luxury tech. High-end product launches.
**Best for:** Luxury product sites, premium SaaS, high-ticket agency positioning

```css
/* Google Fonts: import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@400;500;600;700;800&display=swap') */

:root {
  --bg:       #050505;
  --s1:       #0c0c0c;
  --s2:       #141414;
  --s3:       #1c1c1c;

  --text:     #f4f0e8;
  --t2:       #a09070;
  --t3:       #605040;

  --accent:       #d4922a;
  --accent-light: #f0b040;
  --accent-dark:  #a86e18;
  --accent-dim:   rgba(212,146,42,.10);

  --gold:     #d4922a;
  --orange:   #e06020;

  --b1:       rgba(255,255,255,.06);
  --b2:       rgba(255,255,255,.10);

  --green:    #40c080;
  --yellow:   #f0b040;
  --red:      #e04040;
  --blue:     #4080d0;
  --purple:   #8060d0;

  --font-sans: 'Inter', sans-serif;
  --font-display: 'Bebas Neue', Impact, sans-serif;
}
```
**Font pairing:** Bebas Neue (all-caps display headers) + Inter 400/700 (body)

---

## Quick Selection Guide

| Theme | Background | Accent | Personality | Client Type |
|---|---|---|---|---|
| Obsidian | Dark charcoal | Electric blue | Tech, premium | SaaS, dashboards |
| Velora | Ivory/cream | Gold | Luxury, warm | Interior design, events |
| Forest | Dark green | Sage green | Natural, calm | Health, wellness |
| Midnight | Deep navy | Purple | Corporate, polished | B2B, software |
| Ember | Warm dark | Amber/rust | Bold, creative | Agencies, brands |
| Slate | Light gray | Teal | Clean, professional | Corporate, finance |
| Rose | Blush/white | Burgundy | Romantic, soft | Beauty, weddings |
| Solar | Pure black | Gold/orange | Ultra-premium | Luxury, high-ticket |

---

## Forge Rules for Theme Usage

1. Always match theme to client brand/industry — never use Obsidian for a wedding planner
2. Dark themes: use opacity-based borders (rgba), never solid gray
3. Light themes: test contrast ratios — --t3 on --bg must be readable
4. Font pairings are non-negotiable — don't mix and match themes' fonts
5. Status colors (green/yellow/red) should never clash with the accent color
6. When in doubt: Obsidian (dark) or Slate (light) — both are versatile and safe
