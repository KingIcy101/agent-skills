# Halo Calendar — Standalone App Spec
*Written: March 3, 2026*

## Vision
A standalone calendar app — macOS-native via Electron, also deployable as a web app — that competes directly with Akiflow, Cron, and Notion Calendar. Built to be productized and sold. First user: Matt. First market: Halo Marketing's AI Systems Agency clients.

**Tagline:** *The calendar that thinks like you do.*

---

## Competitive Landscape

| App | Strength | Weakness |
|-----|----------|----------|
| Akiflow | Task + calendar unified, drag UX | Expensive ($15/mo), no AI |
| Cron | Beautiful, GCal native | No tasks, no AI, limited views |
| Notion Calendar | Integrated with Notion | Slow, no time blocking |
| Fantastical | macOS polish, NLP | No task stacking, subscription |
| Motion | AI scheduling | Ugly, inflexible, feels robotic |

**Our edge:** AI-native scheduling + task stacking + beautiful macOS UI + built-in focus block intelligence + cheap or free tier.

---

## Core Features (MVP — Phase 1-3)

### Time Grid
- Day / 3-day / Week / Month views
- 6am–11pm default visible range, scrollable to midnight
- Slot height configurable (compact / comfortable / spacious)
- Now-line: red dot + line, smooth real-time update
- Today column: subtle accent tint in week view

### Event Types (STACKED)
All three types render side-by-side when they overlap — never hidden:
- **Meetings**: solid border-left, semi-transparent fill, clock icon
- **Tasks**: dashed border-left, checkmark prefix, can be marked done inline
- **Focus Blocks**: diagonal stripe fill, lock icon, auto-protects from scheduling conflicts

### Drag UX (Akiflow-quality)
- **Drag to create**: click-drag on empty slot → ghost block grows → release → modal pre-filled
- **Drag to reschedule**: grab any event, move to new time or day
- **Resize**: drag bottom edge to extend/shorten
- **Cross-day drag**: drag event from one day column to another in week view
- **Snap**: 15-minute increments, hold Shift for 5-minute
- **Visual feedback**: tooltip showing new time range while dragging

### NLP Command Bar
- Type: "Discovery call Thursday 2pm 45 min" → instant preview → Enter to confirm
- Understands: relative dates, duration, recurrence ("every Monday 9am"), focus block intent
- Powered by Claude Haiku (fast + cheap)

### Google Calendar Sync (two-way)
- OAuth2, reads + writes GCal events
- Local blocks layered on top of GCal events
- Conflict detection across both sources
- Color mapping: GCal colors → our palette

### Task Integration
- Tasks live in the same timeline as events
- Can be dragged from a sidebar task list onto the time grid
- Completion persists (strikes through, moves to done section)
- Optional: sync with Notion tasks via API

---

## Phase 2 Features (Post-MVP)

### AI Scheduling Assistant
- "Find me 2 hours for deep work this week" → scans calendar + suggests slots
- "Schedule all my tasks for this week" → auto-places tasks in available windows
- Daily morning brief: "Here's how your day looks. You have a conflict at 2pm."
- Powered by Claude Sonnet (slightly slower but richer reasoning)

### Smart Focus Protection
- Detects back-to-back meetings → suggests buffer time
- Warns when you're scheduling during your historically productive hours
- Optional: block scheduling during protected focus windows

### Meeting Templates
- Save recurring meeting types (Discovery Call, Standup, etc.)
- One-click create from template with pre-filled title/duration/color/video link
- Auto-attach Zoom/Meet link

### Calendar Profiles
- Halo Marketing profile (red palette, business hours)
- Personal profile (purple palette, flexible hours)
- Toggle between profiles or view merged

---

## Phase 3: macOS App (Electron)

### Native Features
- Menu bar icon: click → mini day view popover
- Keyboard shortcut (Cmd+Shift+K): open full calendar from anywhere
- macOS notifications: reminders 10 min before events
- Spotlight integration: search events
- Touch bar support (MacBook)
- Dark/light mode follows system

### Distribution
- Mac App Store (requires Apple Developer account - $99/yr)
- OR direct download DMG (faster, no Apple review)
- Auto-update via electron-updater

---

## Phase 4: Monetization

### Pricing
- **Free**: 1 calendar, no GCal sync, no AI, 30 events/month
- **Pro ($8/mo)**: Unlimited events, GCal sync, NLP, AI scheduling, all views
- **Teams ($12/user/mo)**: Shared calendars, scheduling links, team overlay view

### AI Systems Agency Play
- White-label version for agency clients ($500 setup + $50/mo)
- Embed in their dashboard (like we're doing in Mission Control)
- Custom branding, their calendar + CRM events in one view

---

## Tech Stack

```
Frontend:   React 18 + Tailwind CSS + Framer Motion
Backend:    Node.js + Express (API server)
Database:   SQLite (local), Supabase (cloud sync/multi-user)
Auth:       Clerk (web) / macOS Keychain (Electron)
AI:         Anthropic API (Haiku for NLP, Sonnet for scheduling)
GCal:       Google Calendar API v3
Desktop:    Electron 28+ with electron-builder
Build:      Vite + electron-vite
Deploy:     Vercel (web), DMG/App Store (macOS)
```

---

## Build Phases & Token Estimates

| Phase | Scope | Agent | Tokens Est | Cost Est | Days |
|-------|-------|-------|-----------|----------|------|
| 1 | Project scaffold + time grid + day/week views | Codex | ~400K | ~$2 | 1 |
| 2 | Event stacking + all drag UX + resize | Codex | ~500K | ~$2.50 | 1 |
| 3 | GCal OAuth + two-way sync + conflict detection | Codex | ~400K | ~$2 | 1 |
| 4 | NLP bar + AI scheduling + templates | Claude Code | ~600K | ~$4 | 2 |
| 5 | Electron wrapper + menu bar + notifications + polish | Codex | ~500K | ~$2.50 | 2 |
| 6 | Auth + multi-user + Supabase + pricing page | Claude Code | ~700K | ~$5 | 3 |
| **TOTAL** | | | **~3.1M tokens** | **~$18-25** | **~10 days** |

*Costs based on Codex ($0.40/1M input, $1.60/1M output) + Claude Code (Sonnet pricing ~$3/$15 per M)*

**Reality check:** 10 days of focused building with Codex + Claude Code running in parallel = a real product that could charge $8/mo and compete. Akiflow charges $180/yr. If we get 100 paying users = $9,600 ARR passively.

---

## What We Need to Start

1. ✅ Claude Code authenticated (done — via API key)
2. ⬜ Codex access (Matt mentioned getting it going — needed for parallel builds)
3. ⬜ 30-min scoping call / chat with Matt to lock Phase 1 scope
4. ⬜ Decide: web-first or Electron-first (recommend web-first, Electron wrapper later)
5. ⬜ Google Cloud project for GCal OAuth credentials

---

## Notes
- Mission Control calendar is the prototype/proving ground
- Everything we build there gets ported to the standalone app
- The calendar could be the killer feature of AI Systems Agency's client portal
- Matt's color-coding system (Halo=red, Personal=purple, Amazon=gold) becomes a template users can clone
