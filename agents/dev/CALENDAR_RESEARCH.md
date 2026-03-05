# Calendar & Time-Blocking App Research
**Goal:** Build a custom calendar + time-blocking system inside a personal dashboard.  
**Date:** March 2026  
**Researched by:** Alo

---

## Overview: The Landscape

The market has consolidated around a few distinct philosophies:

| Philosophy | Apps | Core Bet |
|---|---|---|
| **Manual Precision** | AkiFlow | You control every block, keyboard-driven |
| **Full AI Autopilot** | Motion | AI owns your schedule, you just add tasks |
| **Intelligent Layer** | Reclaim.ai | AI enhances your existing calendar without replacing it |
| **Mindful Ritual** | Sunsama | Slow down, plan intentionally, avoid burnout |
| **Unified Connector** | Morgen | Ideal-week templates + approve-first AI planning |
| **Native Calendar Polish** | Fantastical, Notion Calendar | Best-in-class UX on top of standard calendar data |

---

## App Breakdowns

---

### 1. AkiFlow
**Tagline:** "World's #1 Time-Blocking App"  
**Price:** $19/mo (annual) — no free plan  
**Platforms:** Web, Mac, Windows, iOS/Android (beta)

#### Key Features
- **Universal Inbox** — pulls tasks from Gmail, Slack, Notion, Todoist, Asana, GitHub, Linear, and 30+ more into one inbox
- **Command Bar (Cmd+K)** — access anything: schedule tasks, search, quick-add, no mouse required
- **Natural language capture** — type "30min deep work tomorrow morning" and it parses it
- **Drag-to-calendar time blocking** — pull tasks from inbox and drop onto any time slot
- **Rituals** — configurable morning planning, evening review, weekly planning sessions built into the app's flow
- **Focus Sessions** — Pomodoro timer + website blocking + per-task time tracking
- **Availability sharing** — send a link that shows your free slots without exposing full calendar

#### What Makes It Unique
AkiFlow is the keyboard-power-user's calendar. The combination of a fast command bar + universal task inbox is unmatched. You get surgical control over every block without the chaos of AI rescheduling things without warning. It's the tool that makes you feel like a wizard at your desk.

#### UI/UX Patterns Worth Stealing
- **Split-pane layout**: inbox on left, week calendar on right — always visible simultaneously
- **Cmd+K command bar** for instant access to any action (modal over everything)
- **Edge-dragging to resize blocks** — drag the bottom edge of a calendar block to extend/shrink duration
- **Snooze tasks** — defer inbox items with a date, they disappear until relevant
- **Batch scheduling** — select multiple tasks, schedule them sequentially with one action
- **Color-coded categories** that persist from task inbox → calendar block
- **"Today" and "Upcoming" filters** that reduce visual noise

#### Weaknesses
- No AI automation — fully manual scheduling
- No real project management or task dependencies
- Mobile app still in beta (desktop-first product)
- Expensive with no free tier
- No collaboration features

---

### 2. Motion
**Tagline:** "AI that plans your perfect day"  
**Price:** $19/mo (individual, annual) — 7-day trial  
**Platforms:** Web, Mac, Windows, iOS, Android

#### Key Features
- **AI Auto-Scheduling** — give a task a duration, deadline, and priority; Motion finds the best slot and places it
- **Auto-Reflow** — when a meeting drops on a blocked time slot, Motion automatically moves the displaced task to the next available window
- **Work Rules / Focus Windows** — define "no meetings before 10am" or "deep work: 9–11am daily" and AI respects it
- **Smart Booking Links** — scheduling pages that enforce your work rules (hours, buffer time, max meetings/day)
- **Project Management** — task dependencies, timelines, team workload balancing
- **AI Task Creation** — describe work in plain English, AI breaks it into tasks and schedules them
- **Capacity Alerts** — warns when you're overbooked before it becomes a crisis

#### What Makes It Unique
Motion is the most aggressive bet on AI taking over scheduling decisions entirely. The key differentiator is auto-reflow: when your day explodes, Motion picks up the pieces automatically without you touching anything. Best-in-class for people with volatile, meeting-heavy schedules who want to stop thinking about logistics.

#### UI/UX Patterns Worth Stealing
- **"Scheduled" vs "Unscheduled" task views** — clear separation between what's on the calendar and what's floating
- **Task card with inline duration field** — set how long something takes right on the card, not in a separate modal
- **Priority tiers (P1–P4)** — simple priority system that feeds AI scheduling decisions
- **Automatic deadline countdowns** on task cards (e.g., "Due in 2 days")
- **Work rules interface** — visual time grid where you block out personal time/focus windows
- **"Reschedule to tomorrow"** one-click action on any block

#### Weaknesses
- Loss of control — AI reshuffles feel opaque and sometimes wrong
- Can't pin a task to a specific time reliably (AI may move it)
- Expensive ($34/mo monthly, $19 annual)
- Task management UI is secondary to calendar
- Users who want exact control find it frustrating

---

### 3. Reclaim.ai
**Tagline:** "AI Calendar for Work & Life"  
**Price:** Free tier (limited); paid from $8/mo  
**Platforms:** Web only (Google Calendar + Outlook overlay — no native mobile app)  
**Acquired by Dropbox (2024)**

#### Key Features
- **Focus Time (Proactive/Reactive)** — AI defends blocks of deep work time; Proactive fills your week ahead of time, Reactive fills gaps only when meetings pile up
- **AI Habits** — recurring rituals (lunch, workout, reading) that get auto-scheduled in the best available slots and flex around real meetings
- **Priority-Based Scheduling (P1–P4)** — higher-priority items can bump lower-priority blocks; lower-priority items get rescheduled to next available slot
- **Buffer Time** — auto-inserts travel/recovery time before/after meetings
- **Smart Scheduling Links** — share availability with controls over buffer, meeting types, max meetings per day
- **Calendar Sync** — sync multiple Google/Outlook accounts with real-time conflict detection
- **Task Integration** — connects with Asana, Jira, ClickUp, Linear, Todoist, Google Tasks; imports tasks and schedules them automatically
- **Team Scheduling** — coordinate shared focus time across a team

#### What Makes It Unique
Reclaim doesn't replace your calendar — it's an intelligent layer on top. The Habits feature is genuinely novel: you define a recurring activity (e.g., "90-min deep work, weekdays, 8–11am window") and Reclaim finds the best slot every day, moving it if a meeting invades. It's set-and-forget time protection. The Priority system is also distinct — P1 blocks are nearly untouchable; P4 blocks get bumped automatically, no drama.

**Real-world impact claimed:** 7.6 hrs/week reclaimed, 880M+ conflicts auto-rescheduled across user base.

#### UI/UX Patterns Worth Stealing
- **Habits configuration panel** — simple form: activity name, duration, time window, frequency, priority, show as busy/free
- **Proactive vs Reactive mode toggle** — users choose how aggressively to protect focus time
- **"Smart 1:1" meeting type** — AI finds the best shared slot for recurring team meetings without back-and-forth
- **Buffer time visualization** — calendar shows pre/post meeting buffers as distinct colored blocks
- **Flexible scheduling window** — "schedule this task anytime Mon–Fri between 8am and noon" rather than a specific time

#### Weaknesses
- No native mobile app (web only)
- Basic task management (relies on integrations for real PM)
- Can be confusing to set up initially
- Limited manual scheduling — it's all AI, so control freaks struggle
- Google Calendar-centric until Outlook support launched in Aug 2025

---

### 4. Sunsama
**Tagline:** "Calm, intentional daily planning"  
**Price:** $16–20/mo — 14-day trial  
**Platforms:** Web, Mac, Windows, iOS, Android

#### Key Features
- **Daily Planning Ritual (guided, 10–15 min)** — each morning, a structured flow: review yesterday → see today's meetings → pull tasks from integrations → set time estimates → schedule blocks → set a daily intention
- **Evening Shutdown Ritual** — reflect on what got done, roll unfinished tasks to tomorrow, close the workday mentally
- **Unified Calendar + Task View** — drag tasks directly onto calendar; everything in one timeline
- **Time Estimates per Task** — set how long each task should take; Sunsama shows your "planned hours" vs available hours to prevent overloading
- **Daily Hour Cap** — set a daily max (e.g., 7 hours) and Sunsama warns when you exceed it
- **Weekly Review** — guided weekly planning session with reflection prompts
- **Integration Pull** — imports from Asana, Notion, ClickUp, Trello, Jira, GitHub, Todoist, Linear, Gmail, Slack
- **Channel Focus** — group tasks by project/tool and batch-plan by channel

#### What Makes It Unique
Sunsama is a philosophy as much as a tool. It's built around the belief that overwork and reactive task-chasing are the real productivity problems — and the solution is a daily ritual of intentional choice. The app doesn't automate; it guides. The 10–15 minute morning ritual is the core differentiator. No other app does this as a first-class experience. It's basically a mindfulness practice for your calendar.

#### UI/UX Patterns Worth Stealing
- **Guided morning flow as a modal sequence** — step-by-step planning wizard you run through, then dismiss
- **Planned hours counter** — running total of how many hours you've scheduled today (e.g., "5.5 / 7 hrs")
- **Task-level time estimate field** — set expected duration inline on each task
- **Workday Shutdown button** — explicit action to end the day and trigger reflection
- **Daily intention text field** — one sentence describing today's focus/theme
- **Yesterday's tasks in sidebar** — easy to roll unfinished items forward
- **Calm color palette** — intentionally low-stimulation UI, no red alerts or gamification

#### Weaknesses
- No AI automation — fully guided but manual
- Requires buying into the ritual; skipping it makes the tool feel pointless
- Expensive for a non-AI product
- No project management or task dependencies
- Limited power-user customization

---

### 5. Morgen
**Tagline:** "AI Daily Planner for Calendars & Tasks"  
**Price:** Free tier; paid ~$9–15/mo  
**Platforms:** Web, Mac, Windows, Linux, iOS, Android

#### Key Features
- **Frames (Ideal Week Templates)** — define recurring time blocks for "Deep Work," "Meetings," "Life Admin," etc. as a template overlay on your week; these guide the AI Planner
- **AI Planner (Approve-First)** — unlike Motion's fully automatic scheduling, Morgen proposes a day plan based on your Frames and tasks; you preview and approve before anything lands on the calendar
- **Multi-Calendar Unified View** — connect Google, Outlook, iCloud across personal/work accounts in one view
- **Task Integration** — Notion, Linear, ClickUp, Todoist, Obsidian and more; tasks appear in sidebar alongside calendar
- **Scheduling Links + Open Invites** — share availability with built-in buffers and travel time auto-calculated
- **Buffer + Travel Time** — auto-inserts prep/travel time before/after events
- **Calendar Propagation** — sync events across calendars (personal → work, etc.) while keeping details private

#### What Makes It Unique
Morgen sits between the manual control of AkiFlow and the full automation of Motion. The **Frames system** is genuinely clever: you design your ideal week once (Monday morning = deep work 9–11am, etc.), and the AI uses that as a constraint when proposing schedules. You never feel ambushed by unexpected reshuffling. The approve-first philosophy is also underrated — it keeps humans in the loop without sacrificing the time savings of AI planning.

#### UI/UX Patterns Worth Stealing
- **Frames overlay** — translucent "ideal week" template visible behind real events; shows what your week *should* look like vs what it does
- **AI plan preview modal** — before committing the schedule, see a proposed day plan and accept/edit/reject individual blocks
- **Energy-aware scheduling** — option to mark time blocks as high/low energy and match task types accordingly
- **Travel time auto-calculation** — set a physical location on an event, Morgen adds commute blocks automatically
- **"Available slots" visualization** — clearly shows free time between meetings in a compact strip

#### Weaknesses
- AI features still maturing (less proven than Motion's)
- Task management relies entirely on integrations
- Less polished mobile experience vs AkiFlow or Fantastical
- Smaller community/user base = fewer third-party tutorials

---

### 6. Notion Calendar (formerly Cron)
**Tagline:** "The calendar built for how you work"  
**Price:** Free (included with Notion)  
**Platforms:** Web, Mac, iOS, Android

#### Key Features
- **Notion Database Integration** — view Notion DB records as calendar events; filter/sort by properties
- **Multi-account Google Calendar support** — overlay multiple calendars cleanly
- **Time Zone World Clock** — built-in timezone viewer for scheduling across regions
- **Event Preparation** — meeting cards show attendees, Notion docs, and agenda before the event
- **Keyboard-First Design** — heavy use of keyboard shortcuts for navigation and event creation
- **Clean, Dense UI** — minimal visual noise, high information density

#### What Makes It Unique
Cron (before Notion acquired it) was beloved for its clean, keyboard-friendly UI — it felt like what Google Calendar would be if designed by a great product team. After acquisition, Notion integration is the main value-add. For Notion users, it's a natural calendar layer. The multi-timezone view is notably good for remote teams.

#### UI/UX Patterns Worth Stealing
- **Week view density** — small font, compact event blocks, very information-dense without feeling cluttered
- **Mini calendar in sidebar** — month thumbnail for navigation alongside week view
- **Multi-timezone strip** — show 2–3 timezones simultaneously below the hour markers
- **Hover previews** — hover any event to see full details without clicking in
- **Keyboard navigation** — arrow keys to move between days/weeks; `n` for new event; `/` for quick actions

#### Weaknesses
- Feature-thin compared to competitors — no time-blocking tools, no task management, no AI scheduling
- Too tightly coupled to Notion ecosystem
- Missing natural language input that Fantastical has
- No offline support
- Disappointed many former Cron fans who expected more post-acquisition

---

### 7. Fantastical
**Tagline:** "The calendar and tasks app you won't be able to live without"  
**Price:** Free (limited); Premium $4.75/mo (annual)  
**Platforms:** Mac, iOS, iPad, Apple Watch — Apple ecosystem only

#### Key Features
- **Best-in-class Natural Language Parsing** — "Lunch with Sarah next Tuesday at Nobu, remind me 1hr before" just works; now uses Apple Intelligence for even more complex parsing
- **DayTicker** — compact horizontal day strip at top for quick day jumping
- **Multi-calendar View** — overlay Google, iCloud, Outlook, Exchange, and more in one beautiful interface
- **Liquid Glass Design (iOS 26)** — uses latest Apple design language; deeply native feel
- **Task + Reminders Integration** — tasks alongside events in the same view
- **Weather Integration** — weather for the day visible in calendar header
- **Meeting Proposals** — suggest multiple time slots via email link
- **Widgets** — excellent home screen/lock screen widgets across all Apple devices

#### What Makes It Unique
Fantastical is the gold standard of calendar *feel* on Apple platforms. No other app matches its natural language input — you can type in an event the way you'd describe it to a human and it parses correctly 95% of the time. It's the "pure calendar" done right: no task management aspirations, no AI scheduling — just events, beautifully displayed and easily created. The DayTicker is a UI gem.

#### UI/UX Patterns Worth Stealing
- **Natural language input bar** — top-level, always visible, parse as you type and show parsed result in real-time below
- **DayTicker** — scrollable horizontal strip of days at top; tap any to jump to it; shows event dot indicators
- **Split view: mini-month + week grid** — left: month calendar for navigation, right: week/day detail
- **Event type parsing** — automatically detects video call links (Zoom, Meet, Teams) and adds "Join" button to event
- **Color-blind-friendly calendar distinction** — distinct shapes + colors for overlapping calendars
- **"Propose Times" flow** — select multiple free slots, generates a shareable link; recipient picks one

#### Weaknesses
- Apple ecosystem only — no Windows/Android/Web
- Premium tier required for most useful features
- No time-blocking or task management features
- No AI scheduling
- Interface can feel dated for non-Apple-native users

---

## Other Apps Worth Noting

### SkedPal
- Manual + AI hybrid; offline-capable; gates AI scheduling behind paid tier
- Good for offline workers; smaller user base

### Routine
- Blends journaling, notes, and planning in minimal interface
- Good for thinkers who like to write alongside scheduling

### Structured (iOS)
- Visual timeline-based day planner; extremely clean drag-drop UI
- Great mobile-first time-blocking reference

### TimeBloc
- Simple, beautiful time-blocking mobile app
- Good for studying the core time-blocking UX in isolation

### Cal.com (open source)
- Open-source Calendly competitor; scheduling links with full API
- Relevant if building custom scheduling link features

---

## UI/UX Pattern Synthesis

The best ideas from across the market, categorized for our build:

### 📥 Capture & Inbox
- **Universal task inbox** (AkiFlow) — pull from external tools, email, Slack into one place
- **Natural language input** (Fantastical) — always-visible input bar, parse as you type
- **Global hotkey** to add tasks from anywhere in the OS

### 📅 Calendar View
- **Split layout: task panel + week calendar** (AkiFlow) — always visible simultaneously
- **Dense, minimal week view** (Notion Calendar/Cron) — maximum information, minimum chrome
- **DayTicker horizontal scroll** (Fantastical) — compact day navigation strip
- **Mini-month sidebar** for navigation alongside detail view
- **Multi-timezone strip** (Notion Calendar) — show 2–3 timezones below hour markers
- **Hover previews** on events — details without clicking

### ⏱️ Time Blocking
- **Drag task onto calendar to create block** (Sunsama, AkiFlow)
- **Edge-drag to resize block duration** (AkiFlow)
- **Planned hours counter** (Sunsama) — "4.5 / 7 hrs today"
- **Daily hour cap warning** (Sunsama) — prevent overloading the day
- **Task-level time estimate field** — set duration inline on each task card
- **Buffer time visualization** (Reclaim) — distinct colored blocks between events
- **Priority tiers (P1–P4)** (Motion, Reclaim) — simple, visual, feeds scheduling logic

### 🤖 AI & Automation
- **Approve-first AI plan** (Morgen) — AI proposes, human approves; no surprise reshuffles
- **Ideal week Frames** (Morgen) — define your week template once; AI uses it as a constraint
- **Auto-reflow** (Motion) — reschedule bumped tasks automatically
- **Habit scheduling** (Reclaim) — recurring rituals find their own best slot each day
- **Proactive vs Reactive focus time modes** (Reclaim)
- **Priority-based bumping** (Reclaim) — P4 blocks yield automatically to P1

### 🧘 Planning Rituals
- **Guided morning planning flow** (Sunsama) — step-by-step modal wizard
- **Daily intention field** (Sunsama) — one-sentence focus for the day
- **Workday Shutdown button** (Sunsama) — explicit close-of-day action
- **Roll-forward unfinished tasks** (Sunsama) — carry yesterday's incomplete items forward

### ⌨️ Speed & Power User
- **Cmd+K command bar** (AkiFlow) — modal over everything, search + act
- **Keyboard-first navigation** (Notion Calendar) — arrow keys, single-key shortcuts
- **Batch scheduling** (AkiFlow) — schedule multiple tasks in one action
- **Snooze tasks** — defer to a future date, disappear until then

### 🔗 Scheduling Links
- **Smart availability links** (Reclaim, Morgen, AkiFlow) — share calendar availability with controls
- **Buffer auto-calculation** (Morgen) — add prep/travel time automatically
- **Multi-slot proposals** (Fantastical) — suggest 3 options, invitee picks

---

## Best Ideas to Steal for Our Build

**Priority 1 — Core UX (build these first):**
1. **Split-pane layout** — task inbox on left, week calendar on right, always both visible
2. **Drag-to-calendar time blocking** with edge-resize
3. **Planned hours counter** — real-time "X / 8 hrs scheduled today"
4. **Task time estimate field** — set duration on each task, not just the block
5. **Natural language quick-add** — "30min deep work tomorrow 9am" parsed live
6. **Cmd+K command bar** — instant access to any action

**Priority 2 — Ritual Layer (differentiate the product):**
7. **Guided daily planning flow** — morning modal that walks through: yesterday's rollover → meetings → task selection → scheduling
8. **Workday shutdown ritual** — explicit end-of-day reflection + close
9. **Daily intention field** — one focus sentence pinned at top of the day view
10. **Ideal week template (Frames)** — define recurring time categories as a week overlay

**Priority 3 — Intelligence Layer (if we add AI):**
11. **Habits system** — recurring activities that auto-find the best slot each day
12. **Priority tiers + automatic bumping** — P1–P4 with visual indicators
13. **Approve-first AI scheduling** — AI proposes daily plan, user reviews before committing
14. **Focus time defense** — automatically protect X hours/week of deep work

**Priority 4 — Polish:**
15. **Buffer blocks** between meetings (auto or manual)
16. **Multi-timezone strip**
17. **Hover previews on events**
18. **Snooze tasks to a future date**

---

## Competitive Gaps (Opportunities for Our Build)

1. **No app does rituals + power-user speed together** — Sunsama is calm but slow; AkiFlow is fast but has no ritual layer. There's room for a tool that does both.
2. **Most AI scheduling is opaque** — Motion surprises users with reshuffles. An approve-first AI (Morgen's approach) is underused and liked.
3. **Mobile experience is universally weak** — even the best apps have mediocre mobile. If we're building a dashboard, going mobile-native could differentiate.
4. **No app visualizes your week's "shape" well** — the ideal week Frames concept (Morgen) is underexplored; showing your week template vs actual is a powerful visual.
5. **Reflection data is unexplored** — Sunsama has shutdown rituals but no analytics on how well you kept to your plan over time. A "planned vs actual" chart would be novel.

---

*Research compiled March 2026 | Sources: G2, Morgen blog, ProductiveWithChris, Focuzed, max-productive.ai, Reclaim.ai, Fantastical.app, app store reviews*
