# Forge — Developer Playbook

## How I Build (Always)

### 1. Read Before Writing
Before touching any file, I read it. Never guess at structure, class names, or anchors. Reading takes two minutes. A bad assumption costs two hours.

### 2. Write the Spec First
Every feature gets a build brief before a line of code:
```
FEATURE: [name]
FILES: [which files change]
APPROACH: [how it works]
ANCHORS: [exact text used for Python replacements]
TASKS: [ordered list]
RISKS: [what could break]
```

### 3. File Editing Rules (Non-Negotiable)
- **index.html files:** Python `html.replace(exact_anchor, new_str, 1)` ONLY. Never Edit tool. Read exact text first. Whitespace drift from prior edits breaks matching.
- **app.js / style.css:** Python replace OR `cat >> file << 'EOF'` for pure additions
- **server.js:** Python replace anchored on unique existing lines
- **New files:** Write directly

### 4. Verify After Building
- Curl the API route if it's a backend change
- Screenshot or evaluate DOM if it's a UI change
- `pm2 logs [app] --lines 20 --nostream` for errors
- `pm2 restart [app]` after every change

### 5. Log Everything
Update `BUILD_LOG.md` with every shipped feature.

---

## Tech Stack

### Mission Control Dashboard
- **Path:** `/Users/mattbender/.openclaw/workspace/mission-control-server/`
- **Stack:** Node.js + Express, vanilla HTML/CSS/JS
- **Port:** 7900 | **PM2:** `mission-control` | **Tunnel:** `mc-tunnel`
- **Key files:** `server.js`, `public/index.html`, `public/app.js`, `public/style.css`
- **Data:** Notion API (cached), Sellerboard scraper, pipeline.json, brain-dump.json

### Velora Dashboard (Vanessa's)
- **Path:** `/Users/mattbender/Projects/velora/`
- **Stack:** Node.js + Express, vanilla HTML/CSS/JS
- **Port:** 7902 | **PM2:** `velora` | **Tunnel:** `velora-tunnel`
- **Data:** JSON files in `data/` — projects, clients, vendors, palettes, flowers, arrangements, config, emails, love-notes
- **Key patterns:**
  - `$()` = `document.getElementById()`
  - `navigateTo(page)` = SPA router
  - `window.lucide.createIcons()` must be called after any dynamic HTML insert
  - Tab switching: `switchTab(name)` looks for `id="tab" + capitalize(name)` — names must match exactly
  - Theme system: `data-theme` on `<html>`, CSS variables, `setTheme(name)`

### Velora Website
- **Path:** `/Users/mattbender/Projects/velora-site/`
- **Stack:** Node.js + Express, static HTML/CSS/JS
- **Port:** 7903 | **PM2:** `velora-site` | **Tunnel:** `velora-site-tunnel`
- **API routes:** `/api/contact`, `/api/lily` (AI chatbot)
- **Fonts:** Playfair Display (headings), Jost (body)
- **Colors:** `--accent: #b8933a` (gold), burgundy `#8B1A2A`, bg `#faf8f2`

### Voice Server
- **Path:** `/Users/mattbender/.openclaw/workspace/voice-server/`
- **Stack:** Node.js, Twilio, Deepgram, Anthropic, Cartesia
- **PM2:** `alo-voice`
- **Model:** `claude-haiku-4-5` ONLY — other Haiku variants return 404 on Matt's account

### Slack Bot (Kargo)
- **Path:** `mission-control-server/slack-socket.js`
- **PM2:** `slack-socket`
- **Key files:** `kargo-ortho-sheet.js`, `kargo-markup-history.js`, `kargo-appendix.js`

---

## Agent Worker Templates

### UI Worker
```
Task: [component name]
Files: [index.html, app.js, style.css]
Rules: Python replace for HTML, append for CSS/JS
Verify: screenshot + DOM eval
```

### API Worker
```
Task: [route name]
Files: [server.js]
Rules: Python replace anchored on // SPA fallback or unique line
Verify: curl the endpoint
```

### Integration Worker
```
Task: [service name]
Files: [server.js + any new files]
Rules: read full server.js first, add to .env
Verify: end-to-end test with real data
```

---

## Code Conventions

### Node.js / Express
- `require()` not ES modules — all existing code uses CommonJS
- Error handling: `try/catch` on every async route, always `res.json({error})` not crash
- JSON data: `readJSON()` and `writeJSON()` helper pattern (already in Velora)
- Routes go before `// SPA fallback`

### Vanilla JS (frontend)
- `const $ = id => document.getElementById(id)` — use this, don't re-declare
- `esc(str)` for HTML escaping — use in all template literals with user data
- Module-level variables for data caches (`let projectsData = []`)
- `window.lucide.createIcons()` after every dynamic HTML insert in Velora

### CSS
- CSS variables for all colors — never hardcode
- Mobile-first: base styles for mobile, `@media (min-width: 768px)` for desktop
- No emojis in Velora/dashboard — Lucide SVG icons only
- `transition: all 0.2s` on interactive elements

### No-go List
- No frameworks (React, Vue, etc.) unless explicitly approved
- No npm packages without checking if something already works
- No `innerHTML` with unsanitized user input
- No `eval()`
- No hardcoded API keys — always `.env`

---

## PM2 Reference
```bash
pm2 list
pm2 restart [name]
pm2 logs [name] --lines 30 --nostream
pm2 stop [name]
```

Current processes:
- `alo-voice` (0) — voice call system
- `mission-control` (1) — main dashboard
- `mc-tunnel` (2) — dashboard tunnel
- `sb-scraper` (3) — Sellerboard scraper (stopped)
- `health-monitor` (4) — health monitor (stopped)
- `slack-socket` (5) — Kargo Slack bot
- `velora` (6) — Vanessa's dashboard
- `velora-tunnel` (7) — dashboard tunnel
- `velora-site` — Vanessa's website
- `velora-site-tunnel` — website tunnel

---

## Common Pitfalls

1. **index.html Edit tool fails** — whitespace drift from prior edits breaks exact matching. Python replace.
2. **Lucide icons don't appear** — forgot `window.lucide.createIcons()` after inserting HTML
3. **Tab panels invisible** — `capitalize()` is case-sensitive. `tabVisionBoard` !== `tabVisionboard`. Names must match.
4. **Grid items collapse to 2px** — CSS Grid `overflow: hidden` + no `min-height` = rows collapse. Always set `min-height`.
5. **Reveal animation hides elements** — `.reveal` starts at `opacity: 0`. Don't put this class on elements that should always be visible.
6. **Claude model errors** — only `claude-haiku-4-5` works on Matt's API account.
7. **`canWriteToSheet()` cooldown** — Kargo has a 20-min write cooldown. Don't bypass it.
8. **Tunnel URLs change on restart** — never hardcode tunnel URLs. Read from `mc-url.txt` or PM2 logs dynamically.

---

## 📊 EOD Reporting

**File:** `memory/agent-reports/forge.md`

```
**Date:** YYYY-MM-DD
**Status:** Active | Standby

## ✅ Completed Today
## 🔄 In Progress
## 📋 Planned Next
## 🚧 Blockers
```

## 🔒 Communication Rules

Report up only — to Alo or Atlas. Don't message other agents directly. Flag dependencies in output and let Alo coordinate.
