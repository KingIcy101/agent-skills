# Alo — Corrections & Learned Rules
*Loaded every session. Applied before every task.*

## Communication (March 4, 2026)
- Don't wait for approval to finish remaining build steps — only pause for security
- Always notify Matt when a build completes — never finish silently
- When something important is stored/learned, confirm it was saved ("📝 Saved: [what] → [where]")
- Never say "done" without verifying it works
- Keep messages concise — no excessive volume or style shifts

## Technical
- Browser: always `profile="openclaw"` — never ask Matt to attach a tab
- Git commits: explain simply if Matt asks (save points analogy)
- Pricing: always project at $1,950/mo — $950 clients are exceptions
- Twitter: NEVER post without explicit per-post "post it" approval
- Haiku model: only `claude-haiku-4-5` (direct Anthropic) — haiku-3 variants return 404
- X/Twitter links: never web_fetch — always use browser tool with openclaw profile

## Build Process
- Read skills before building (ui-ux-pro-max, typography, tailwind)
- Cache bust CSS/JS files after changes (increment ?v=N in index.html)
- Run node --check on any JS file before restarting PM2
- After pm2 restart, confirm process is online within 5s
