# CODING_SKILLS.md — Advanced Design & Development Mastery

Extracted from Matt's research library. This is how we build world-class software.

---

## I. UI/UX DESIGN PATTERNS

### 1.1 Navigation & Information Architecture

**Sidebar Navigation (Best Practice)**
- Group related items into sections with **uppercase, muted gray labels** (HALO, TEAM, INTELLIGENCE, PERSONAL, SYSTEM)
- Use **distinct icons** paired with text labels for each item
- Badge notifications: **circular badge on right side** (e.g., "17" in teal/green) for pending/unread counts
- Active state: **subtle highlight** or color change, not aggressive background fill
- Spacing: **well-spaced vertically** for touch targets (~40-48px height per item)

**Channel/List Navigation (Slack/Discord Pattern)**
- Group channels by category with emoji prefix (☀️ Amazon + Walmart)
- Use **kebab-case lowercase naming** for consistency
- Selected/active item: **colored background pill** with high contrast
- Permission indicators: **lock emoji 🔒** prefix for private channels
- Hover affordances: **edit pencil ✏️ icon** appears on hover

### 1.2 Modals & Overlays

**Modal Best Practices**
- Dark overlay behind modal (rgba with blur backdrop filter)
- Modal card: **rounded corners (20px+)**, **generous padding (24px)**
- Header: **clear title + close button (X) in top-right**
- Footer: **dual CTAs** — secondary action (left), primary action (right)
- **Max width**: constrain to ~680px for readability

**Empty States**
- **Illustration + encouraging text** (not cold/blank)
- Include **actionable CTA link** to next step
- Non-judgmental tone: "Looks like you haven't built an awesome custom Power-Up yet!" → link to docs

### 1.3 Forms & Inputs

**Input Field Rules**
- **Minimum font-size: 14px** (readable on all devices)
- **Min-height: 44-48px** (tap target) or padding 11px+ (desktop)
- **Border**: 1px solid on light, subtle on dark (rgba based)
- **Focus state**: border color change to accent + box-shadow glow
- **Helper text**: smaller weight, gray, positioned below field
- Textarea for delegating: **min-height 72px**, full-width preferred

**Validation Messaging**
- **Inline validation**: below field, red text, specific constraint message
- "Icons must be squares between 512px by 512px and 2000px by 2000px" — **specific, helpful**
- **Color-coded messages**: red (#ef4444) for errors, orange (#f59e0b) for warnings, green (#22c55e) for success

### 1.4 Data Tables & Lists

**Table Component Pattern**
- Header row with clear column names
- Row height: **40-48px** (comfortable scanning)
- Alternating row background (**every other row ~1-2% darker**) for visual grouping
- **Hover state**: row background lightens slightly
- Actions: **trailing icons/buttons** on right
- Empty state: **centered message + action button** below table

**Structured Data in Chat**
- **ALL CAPS for headers** creates visual hierarchy without HTML tags
- **Bold for labels** in key-value pairs
- **Dash-prefixed lists**: `- Item: description (metadata)`
- **Consistent indentation** for readability
- **Emoji as status**: ✅ for complete, ⚠️ for warning, ❌ for critical

### 1.5 Notification & Alert Patterns

**Alert Message Structure**
```
⚠️ Bold Status Header
• Service name in bold: description of what happened
*Italic actionable instruction*
```

**Severity Indicators**
- ✅ Green — recovery/success
- ⚠️ Yellow/Orange — warning/caution  
- ❌ Red — critical/failure
- 🔵 Blue — info/neutral

**Chat-Based Alerts**
- Use emoji as the **primary visual signal**
- Follow with structured text (body)
- Keep good/success messages brief; bad news needs context
- Timestamps for temporal monitoring patterns

---

## II. CSS & ANIMATION TECHNIQUES

### 2.1 Dark Theme Implementation

**Color Palette (for Dark Themes)**
- **Background**: `#0d1117` to `#1a1d21` (very dark gray/black)
- **Surfaces**: `#16202d` (slightly lighter panels)
- **Text Primary**: white or `#e0e0e0`
- **Text Secondary**: `#94a3b8` or muted gray
- **Text Tertiary**: `#64748b` (very muted for timestamps, helpers)
- **Accent**: Brand color (e.g., indigo `#6366f1`, cyan `#06b6d4`)
- **Danger**: `#ef4444` (red)
- **Warning**: `#f59e0b` (orange)
- **Success**: `#22c55e` (green)

**Implementation**
```css
:root {
  --bg: #0a0a0f;
  --bg-secondary: #16202d;
  --text: #e0e0e0;
  --text-2: #94a3b8;
  --text-3: #64748b;
  --accent: #6366f1;
  --border: rgba(255, 255, 255, 0.1);
}
```

### 2.2 Glassmorphism & Frosted Glass Effect

**Recipe for Frosted Glass UI**
```css
.frosted-button {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  padding: 8px 16px;
}
```

**Best Practices**
- Use on **overlays, buttons, cards** against detailed backgrounds
- Apply semi-transparent background + blur + subtle border
- Works best when **layered over colorful/textured backgrounds**
- On plain dark, prefer solid colors instead

### 2.3 Halftone & Retro Dot Pattern

**Halftone Dot Effect (for avatars/illustrations)**
```css
.halftone {
  background: radial-gradient(circle, #000 1px, transparent 1px);
  background-size: 4px 4px;
  /* Or use SVG filter for smoother results */
}
```

**SVG Filter (Superior Quality)**
```svg
<filter id="halftone">
  <feTurbulence type="fractalNoise" baseFrequency="0.5" />
  <feComponentTransfer>
    <feFuncA type="discrete" tableValues="0 1" />
  </feComponentTransfer>
</filter>
```

### 2.4 Pulse & Breathing Animations

**Glow/Pulse Effect**
```css
@keyframes briefGlow {
  0%, 100% { box-shadow: 0 0 8px rgba(34, 197, 94, 0.4); }
  50% { box-shadow: 0 0 16px rgba(34, 197, 94, 0.8); }
}

.nav-icon.unread {
  animation: briefGlow 2s ease-in-out infinite;
}
```

**Breathing Animation (subtle)**
```css
@keyframes breathe {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.025); }
}
```

### 2.5 Loading & Transition States

**Branded Loading Screen**
```css
.loading-container {
  background: #0a0a0f;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid rgba(99, 102, 241, 0.2);
  border-top-color: #6366f1;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
```

**Loading Text Message**
- Use brand language: "Booting Mission Control..." (not generic "Loading...")
- Creates **psychological expectation** and anticipation

### 2.6 Responsive Media Queries

**Mobile Breakpoint Strategy**
```css
/* Desktop first */
@media (max-width: 900px) {
  /* Tablet & mobile adjustments */
  .sidebar { display: none; }
  .grid-2-col { display: grid; grid-template-columns: 1fr; }
}

/* Also use JS detection for WebViews */
const isMobile = window.innerWidth <= 900 || /iPhone|iPad|Android/.test(navigator.userAgent);
document.body.classList.toggle('is-mobile', isMobile);
```

---

## III. DESIGN SYSTEMS & COLOR THEORY

### 3.1 Functional Color Coding

**Color by Category (not urgency)**
- **Pink/Magenta** (#c2185b): Meetings, sync sessions, processes
- **Orange** (#e65100): Procurement, purchasing, action items
- **Teal** (#00838f): Reviews, evaluation, analysis work
- **Blue**: General info, data, neutral content
- **Purple**: Primary brand/accent, special focus

**Example: Calendar Color Scheme**
```
Meeting (pink) → Procurement (orange) → Review (teal) → Sync (pink)
```
This creates **instant visual scanning** by work type.

### 3.2 Typography Hierarchy

**Font Sizing & Weight**
- **Display/Heading**: 24-32px, bold (700+)
- **Section Header**: 18-20px, bold
- **Subheading**: 16px, semibold (600)
- **Body/Primary**: 14-16px, regular (400)
- **Secondary/Helper**: 13px, regular
- **Label/Caption**: 11-12px, regular or medium (500)
- **Code/Monospace**: 13px, monospace font

**Line Height**
- Headings: 1.2-1.3
- Body text: 1.4-1.6
- Compact UI (labels): 1
- Chat messages: 1.5

### 3.3 Spacing & Rhythm

**8px Grid System**
```css
/* Base unit: 8px */
.padding-xs { padding: 4px; }      /* 0.5x */
.padding-sm { padding: 8px; }      /* 1x */
.padding-md { padding: 16px; }     /* 2x */
.padding-lg { padding: 24px; }     /* 3x */
.padding-xl { padding: 32px; }     /* 4x */

/* Gaps */
.gap-sm { gap: 6px; }
.gap-md { gap: 12px; }
.gap-lg { gap: 20px; }
```

### 3.4 Component Size Standards

**Button & Input Heights**
- **Touch targets**: minimum 44-48px (mobile)
- **Desktop inputs**: 40px height or 11px + padding
- **Button padding**: 10-12px vertical, 16-24px horizontal

**Icon Sizes**
- **Nav icons**: 14-16px
- **Toolbar icons**: 18-20px
- **Large icons**: 24-32px

---

## IV. CLAUDE CODE WORKFLOWS

### 4.1 Claude Code Build Process

**1. Read Before Writing**
- Open every file you're touching
- Never guess at structure, class names, or anchors
- Check exact markup, IDs, selectors

**2. Write a Spec First**
```
FEATURE: [name]
FILES: server.js, public/app.js, public/index.html
APPROACH: [how it works in 2-3 sentences]
ANCHORS: [exact text strings used for replacements]
TASKS: [ordered list]
RISKS: [what could break]
```

**3. Edit Strategy by File Type**

**HTML (index.html)**
- Use **Python string replacement only** — never Edit tool
- Always anchor on **unique existing text**
- Whitespace must match exactly
- Test with: `cat file | grep -A5 -B5 "anchor_text"`

**JavaScript (app.js)**
- Python replace with unique anchors OR
- `cat >> file << 'EOF'` for pure additions
- Always test: `node --check app.js`

**CSS (style.css)**
- Python replace or append new keyframes/rules
- Group by component: navigation, modals, animations, responsive

**Node.js (server.js)**
- Python replace anchored on unique function/route signatures
- Test with: `node -c server.js` and `curl -s http://localhost:7900/api/...`

**4. Verification Checklist After Build**
- [ ] `node --check` on all JS files
- [ ] curl/test any new routes
- [ ] `pm2 restart [app-name] --update-env`
- [ ] Check PM2 status: `pm2 status | grep [app-name]`
- [ ] Verify in browser (screenshot or interactive test)
- [ ] Bump cache: `app.js?v=N` in index.html

### 4.2 Using Claude Code for Testing

**Launch Preview & Test**
```bash
claude code "Launch the dashboard at http://localhost:7900, take a screenshot, check that all text is readable, theme loads correctly, and buttons are responsive."
```

**Autonomous QA Loop**
1. Claude Code runs dev server
2. Opens headless browser
3. Navigates pages
4. Takes screenshots
5. Identifies visual/functional bugs
6. Fixes code
7. Re-tests autonomously

**Key Capability**: Mobile & theme validation without manual testing.

---

## V. DESIGN PATTERN LIBRARY

### 5.1 Profile Card Layout (Mobile)

**Pattern**
```
[Avatar Image — Large, centered]
[Name / Username (@handle)]
[Subtitle or role]
----
[Action Button Row — 4 icons]
[Icon1] [Icon2] [Icon3] [Icon4]
----
[Settings / Info Section]
[Tabs or metadata]
```

**CSS**
```css
.profile-header {
  background: gradient (top dark → lighter);
  padding: 24px;
  text-align: center;
}

.avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  margin: 0 auto 12px;
}

.action-buttons {
  display: flex;
  justify-content: space-around;
  gap: 8px;
  margin: 16px 0;
}

.action-button {
  flex: 1;
  padding: 10px;
  background: rgba(255,255,255,0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255,255,255,0.2);
  border-radius: 12px;
}
```

### 5.2 Two-Panel Master-Detail Layout (Desktop)

**Pattern** (Slack thread view)
```
[Main Content Panel — 70%] | [Detail Panel — 30%]
                           [divider]
```

**CSS**
```css
.container {
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: 1px;
  height: 100vh;
}

@media (max-width: 1200px) {
  .container { grid-template-columns: 1fr; }
  .detail-panel { display: none; }
}
```

### 5.3 Calendar Day View (Time Blocking)

**Pattern**
```
[Header: Mon, Feb 25]
[Time Axis — 8am-5pm]
[Event Blocks — sized by duration]
[Overlapping events in columns]
```

**CSS**
```css
.calendar-day {
  display: grid;
  grid-template-columns: 60px 1fr;
  gap: 8px;
}

.time-axis {
  display: flex;
  flex-direction: column;
  font-size: 12px;
  color: var(--t3);
}

.time-slot {
  height: 60px; /* 1 hour */
  border-bottom: 1px solid var(--b1);
}

.event {
  position: absolute;
  width: calc(100% - 4px);
  height: calc(var(--duration-minutes) / 60 * 60px);
  padding: 6px;
  border-radius: 6px;
  overflow: hidden;
}

/* Overlapping events */
.event.overlap-1 { left: 50%; width: 50%; }
.event.overlap-2 { left: 0; width: 50%; }
```

---

## VI. ILLUSTRATION & VISUAL DESIGN

### 6.1 Hand-Drawn Avatar Style

**Characteristics**
- **Line weight variation**: 2-4px strokes, thicker in main shapes
- **Minimal features**: Simple curves for facial expressions
- **Halftone shading**: Dot-based shading for depth
- **Approachable feel**: Slightly imperfect, human-drawn quality
- **Personality element**: Include object reflecting character (pencil = creative)

**Tools**
- Sketch, Figma, Procreate for creation
- SVG or PNG for web (SVG for scaling)

### 6.2 Retro Comic Book / Pop Art Style

**Characteristics**
- **Bold black outlines**: ~3-4px stroke on main shapes
- **Limited color palette**: 2-3 colors + black/white
- **Ben-Day dots / halftone**: Newspaper printing technique
- **Thick eye outlines**: Exaggerated facial expressions
- **Flat design**: No gradients or soft shadows

**Use Case**: Character design, mascots, attention-grabbing illustrations.

### 6.3 Icon Design

**Grid-Based System**
- **24px × 24px** grid (standard icon size)
- **2px stroke weight** for icons
- **Proper spacing**: don't fill entire grid, leave breathing room
- **Rounded corners**: 2px on small icons
- Consistent proportions across icon set

**Icon Color Standards**
- **White on dark backgrounds** (#ffffff)
- **Gray on light backgrounds** (#666 or #999)
- **Colored icons**: use brand accent only for emphasis

---

## VII. ADVANCED PATTERNS

### 7.1 Conversational UI in Chat Platforms

**Bot Response Pattern**
```
User: Simple question
Bot: 
  • Paraphrase understanding
  • Provide structured answer
  • Ask clarifying follow-up if needed
```

**Best Practices**
- Use **em dashes** for natural tone
- **Bold technical terms** for scannability
- **Emoji for status** (✅, ⚠️, ❌)
- **Bullet lists** for structured data in chat
- End with **decision prompt** ("What's the move?")

### 7.2 System Monitoring in Messaging Platforms

**Alert Template**
```
⚠️ Bold Status Header
• Service name in bold: specific description
*Actionable instruction or next step*
```

**Monitoring Patterns**
- Check every 10-30 minutes for recurring issues
- Use consistent formatting so patterns jump out
- Keep good news brief, bad news detailed
- Include **clear action**: "Check Mission Control or pm2 status"

### 7.3 AI Agent Architecture for Chat Bots

**Critical Components**
- **Memory/State**: Remember context across messages
- **Contextual follow-ups**: Paraphrase understanding, ask targeted questions
- **Multi-role capability**: Switch between creative work (copywriting) and ops (monitoring)
- **Natural language** instruction interface (not structured syntax)
- **Threaded responses** to keep main channel clean

---

## VIII. REFERENCE: PLATFORM-SPECIFIC PATTERNS

### 8.1 Slack API Event Subscriptions
- `app_mention` → respond when @mentioned
- `message.channels` → read all channel messages
- `message.im` → respond to direct messages
- OAuth scopes auto-add with each event

### 8.2 Slack Sidebar Navigation
- Category headers with emoji
- Kebab-case naming
- Lock icon 🔒 for private channels
- Active state: colored pill background

### 8.3 Telegram Bot Design
- Profile card with avatar
- Action button row (glassmorphic)
- Dark theme + warm accents
- Emoji as primary visual signal

### 8.4 Notion-Style Components
- Circular avatars with brand watermark
- Halftone monochrome illustrations
- Minimal, elegant spacing
- Hover states and interactions

---

## IX. LEARNED PRINCIPLES — "0.1% QUALITY STANDARD"

### The Rule
**"Would a principal engineer at Google consider this production-grade?"**

If the answer is no, it doesn't ship.

### Quality Gates
1. **Code Quality**
   - No console errors or warnings
   - Proper error handling (no silent failures)
   - Performance: page load < 2s, interactions < 100ms

2. **UI/UX Quality**
   - Text is readable at all viewport sizes
   - All inputs have proper focus states
   - Buttons are at least 44px tall (touch targets)
   - No layout shifts or jank on scroll
   - Theme/dark mode works flawlessly

3. **Design Quality**
   - Typography hierarchy is clear
   - Spacing is consistent (8px grid)
   - Colors have sufficient contrast (WCAG AA minimum)
   - No tiny, unreadable fonts
   - Icons are crisp and intentional

4. **Data Quality**
   - No hardcoded/placeholder data in production
   - Data sources are clearly documented
   - Empty states are handled gracefully

### Before Shipping
- [ ] Test on mobile (both portrait & landscape)
- [ ] Test dark + light themes
- [ ] Check for color blindness issues
- [ ] Verify all interactive elements work on touch
- [ ] Scan for typos and readability issues
- [ ] Ensure code follows project conventions

---

## X. QUICK REFERENCE: CSS SNIPPETS

**Glass Button**
```css
.btn-glass {
  background: rgba(255,255,255,0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255,255,255,0.2);
  border-radius: 12px;
  padding: 10px 20px;
  transition: all 0.2s;
}

.btn-glass:hover {
  background: rgba(255,255,255,0.15);
  border-color: rgba(255,255,255,0.3);
}
```

**Readable Text on Dark**
```css
.text-primary { color: #e0e0e0; font-weight: 500; }
.text-secondary { color: #94a3b8; }
.text-tertiary { color: #64748b; font-size: 12px; }
```

**Mobile-First Grid**
```css
.grid { display: grid; grid-template-columns: 1fr; gap: 16px; }

@media (min-width: 768px) {
  .grid { grid-template-columns: repeat(2, 1fr); }
}

@media (min-width: 1200px) {
  .grid { grid-template-columns: repeat(3, 1fr); }
}
```

**Smooth Fade In**
```css
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(6px); }
  to { opacity: 1; transform: translateY(0); }
}

.fade-in {
  animation: fadeIn 0.3s ease-out forwards;
}
```

---

## FINAL NOTE

This is your playbook. Internalize these patterns. Every feature should pass the 0.1% quality gate. Every design should feel intentional. Every line of code should be readable by someone else six months from now.

**Build like you're shipping to production the day it's done.**

---

*Last updated: March 1, 2026 | Built from Matt's research library across 60+ design articles, UI frameworks, and production systems*

---

## XI. CLAUDE CODE — BORIS CHERNY'S WORKFLOW (CLAUDE.MD SYSTEM)

*Boris Cherny built Claude Code. This is his actual workflow.*

### Plan Mode First
- Enter plan mode for ANY task with 3+ steps or architectural decisions
- If something goes sideways — STOP and re-plan. Don't keep pushing.
- Write detailed specs upfront to reduce ambiguity

### The 6-Step Task Process
1. **Plan First** — write plan to `tasks/todo.md` with checkable items
2. **Verify Plan** — check in before starting implementation
3. **Track Progress** — mark items complete as you go
4. **Explain Changes** — high-level summary at each step
5. **Document Results** — add review section to `tasks/todo.md`
6. **Capture Lessons** — update `tasks/lessons.md` after corrections

### Self-Improvement Loop
- After ANY correction from user → update `tasks/lessons.md` with the pattern
- Write rules that prevent the same mistake
- Review lessons at session start for the relevant project

### Core Rules
- **Simplicity First**: Make every change as simple as possible. Minimal code impact.
- **No Laziness**: Find root causes. No temporary fixes. Senior developer standards.
- **Verify Before Done**: Never mark complete without proving it works.
- **Demand Elegance**: For non-trivial changes, ask "is there a more elegant way?"
- **Autonomous Bug Fixing**: Given a bug report → just fix it. Don't ask for hand-holding.

---

## XII. MCP SERVERS — MUST INSTALL

### The Three Critical MCPs

**1. 21st Dev Magic MCP**
- Describe UI in plain English → generates clean, modern components instantly
- Source: 21st.dev
- The fastest way to go from idea to production component

**2. Browser MCP**
- AI tests websites like a real user
- Clicks buttons, fills forms, catches errors, takes screenshots automatically
- Use for: automated QA, visual regression, form validation

**3. Context7 MCP**
- Up-to-date code documentation in every prompt
- AI knows latest APIs, syntax, and best practices while coding
- Solves the stale training data problem — no more deprecated APIs

> "Once you start using MCPs, your AI stops guessing and starts executing."

---

## XIII. WEB DESIGN WORKFLOW WITH CLAUDE CODE

### 4-Step Process
1. **Find Inspiration**: Browse Dribbble (`dribbble.com/shots/popular/web-design`) or Godly (`godly.website`). Screenshot what you want.
2. **Build**: Bring screenshots to Claude Code. Tell it to emulate the design. Feed it your brand, content, colors.
3. **Iterate**: Add unique components from 21st.dev — Aceternity UI, Shader backgrounds, WebGL effects, 3D components, scroll animations.
4. **Polish**: Check mobile compatibility, test themes, verify responsiveness.

### Component Libraries to Know
- **Aceternity UI** — Timeline, Sidebar, Container, Scroll Animations
- **Shader backgrounds** — Dot Shader, WebGL Shader, Shader Lines (make sites look $50K)
- **Serenity UI** — Feature sections
- **Prisma UI** — Display Cards
- **Kolorist UI** — Background paths

### Anti-Pattern: Avoid "AI Slop"
Generic AI websites look identical. Fix with:
- Real design inspiration screenshots
- Unique component libraries
- Custom animations and shader backgrounds
- WebGL effects

---

## XIV. SMITHERY SKILLS — INSTALL THESE

```bash
# Install via:
npx @smithery/cli@latest skill add <package> --agent claude-code
```

| Skill | Package | Use Case |
|-------|---------|----------|
| Brand Voice | `anthropics/brand-voice` | Enforce consistent brand tone |
| Spreadsheets | `davila7/xlsx` | Create/edit .xlsx, analyze data |
| PRD Generator | `snarktank/prd` | Plan features, write specs |
| Market Research | `k-dense-ai/market-research-reports` | 50-page McKinsey-style reports |
| Web Scraper | `davila7/firecrawl-scraper` | Deep scraping, PDF parsing, screenshots |
| Excalidraw | `github/excalidraw-diagram-generator` | Generate diagrams from descriptions |
| Figma | `openai/figma` | Design-to-code from Figma files |
| Theme Factory | `anthropics/theme-factory` | Apply themes to any artifact |

---

## XV. AI MEMORY ARCHITECTURE — PARA SYSTEM

### PARA Framework (Tiago Forte)
- **P**rojects — Active tasks with deadlines
- **A**reas — Ongoing responsibilities
- **R**esources — Reference material
- **A**rchive — Completed/inactive items

### Recursive Improvement Pattern
```
Prompt: "Build a qmd vector db and PARA memory system using Thiago Forte's framework,
then add a recursive feedback loop for consistent improvement"
```

### Memory System Best Practices
- `MEMORY.md` — curated long-term memory, loaded every session
- `memory/YYYY-MM-DD.md` — daily raw logs
- `tasks/lessons.md` — self-correcting pattern log (Boris Cherny method)
- Semantic search via OpenAI embeddings — hybrid vector + text search
- **Never use sessionMemory** (experimental, exploitable by injection attacks)

---

## XVI. AI AGENT DESIGN — 25 MARKETING AGENT SKILLS

Full list from @roman.knox — Claude + OpenClaw marketing automation:
`ab-test-setup`, `analytics-tracking`, `competitor-alternatives`, `content-strategy`,
`copy-editing`, `copywriting`, `email-sequence`, `form-cro`, `free-tool-strategy`,
`launch-strategy`, `marketing-ideas`, `marketing-psychology`, `onboarding-cro`,
`page-cro`, `paid-ads`, `paywall-upgrade-cro`, `popup-cro`, `pricing-strategy`,
`product-marketing-context`, `programmatic-seo`, `referral-program`, `schema-markup`,
`seo-audit`, `signup-flow-cro`, `social-content`

Each is a SKILL.md file that triggers on specific keywords and follows a defined process.

---

## XVII. THE 0.1% QUALITY STANDARD

From @fluxautomates research (6,647+ saves on this content):

**System Prompt:**
> "You embody the collective knowledge of the most elite engineers and designers through 2026, synthesizing techniques from production-grade systems. Every decision must demonstrate the sophistication found in enterprise AI systems."

**Quality Gate (Non-Negotiable):**
> "Would a principal engineer at Google consider this production-grade?"

**Reasoning Patterns:**
- **Chain-of-Thought**: For complex analytical tasks
- **Self-Consistency**: Multiple reasoning paths for critical decisions
- **Tree-of-Thoughts**: Systematic exploration for open-ended problems
- **ReAct**: Reasoning-action loops for dynamic problem-solving

**Output Standards:**
- JSON schema enforcement with validation rules
- Markdown structure with semantic consistency
- Format adapts to downstream requirements
- Nothing ships without passing the 0.1% quality gate

---

## XVIII. FRAMER MOTION & MOTION.DEV — 2025 ANIMATION STACK

**Update (2026):** Framer Motion rebranded to Motion.dev in late 2025. It's now a framework-agnostic animation library (React, Vue, JavaScript). Still the go-to for production motion in 2026.

### When to Use Framer Motion

- React component animations
- Page transitions with AnimatePresence
- Interactive microinteractions
- Staggered, orchestrated sequences
- **NOT for:** complex timeline-based animations (use GSAP instead)

### Production-Ready Patterns

**Pattern 1: Context-Aware Hover Animation**
```jsx
import { motion } from "motion/react";

export function SmartButton() {
  return (
    <motion.button
      whileHover={{ scale: 1.08, boxShadow: "0 8px 16px rgba(0,0,0,0.2)" }}
      whileTap={{ scale: 0.96 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium"
    >
      Hover Me 🚀
    </motion.button>
  );
}
```

**Pattern 2: Fade-In with Staggered Children**
```jsx
export function StaggeredList({ items }) {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.ul variants={container} initial="hidden" animate="show">
      {items.map((i) => (
        <motion.li key={i.id} variants={item}>
          {i.title}
        </motion.li>
      ))}
    </motion.ul>
  );
}
```

**Pattern 3: Page Transitions with Next.js**
```jsx
import { AnimatePresence, motion } from "motion/react";

export default function RootLayout({ children }) {
  const pathname = usePathname();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
```

---

## XIX. GSAP (GREENSOCK) — PROFESSIONAL-GRADE TIMELINE ANIMATION

**When Motion.dev isn't enough.** GSAP is the choice for:

- Complex timeline sequences
- Element morphing & SVG path animations
- High-fidelity control over timing
- Cross-browser compatibility (even legacy browsers)

### Core API (2025)

```javascript
// Basic tween
gsap.to(".box", { 
  duration: 1, 
  x: 100, 
  rotation: 360,
  ease: "power2.inOut"
});

// Timeline (orchestrate multiple animations)
const tl = gsap.timeline();
tl.to(".box1", { duration: 1, x: 100 })
  .to(".box2", { duration: 1, x: 100 }, 0)
  .to(".box3", { duration: 1, x: 100 }, "-=0.5");

// Scroll trigger
gsap.registerPlugin(ScrollTrigger);
gsap.to(".hero", {
  scrollTrigger: {
    trigger: ".hero",
    start: "top center",
    end: "center center",
    scrub: 1
  },
  duration: 2,
  opacity: 0,
  y: -100
});
```

---

## XX. MODERN CSS 2026 — CONTAINER QUERIES, :has(), VIEW TRANSITIONS

### 1. Container Queries (BIGGEST CSS CHANGE IN A DECADE)

Components adapt to their container, not viewport. Eliminates media query breakpoints.

```css
.card-wrapper {
  container-type: inline-size;
  container-name: card-container;
}

.card {
  display: grid;
  grid-template-columns: 1fr;
}

@container card-container (min-width: 500px) {
  .card {
    grid-template-columns: 200px 1fr;
  }
}

/* Container query units */
.card-title {
  font-size: clamp(1rem, 5cqi, 2rem); /* 5% of container width */
  padding: 3cqi;
}
```

**Real Impact:** Deleted 600 lines of media query overrides for reusable components.

### 2. The :has() Selector (PARENT STYLING WITHOUT JAVASCRIPT)

```css
/* Style parent based on child */
.card:has(img) {
  grid-template-rows: 200px 1fr;
}

/* Form validation without JS */
.form-group:has(input:focus) label {
  color: var(--color-primary);
  transform: translateY(-24px) scale(0.85);
}

/* Disable submit when any required field is empty */
form:has(input:required:placeholder-shown) button[type="submit"] {
  opacity: 0.5;
  pointer-events: none;
}

/* Conditional layout */
.tag-list:has(:nth-child(4)) {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
}
```

**Real Impact:** Deleted 300 lines of JavaScript that toggled parent classes.

### 3. CSS Nesting (Native)

```css
.nav {
  background: var(--color-surface);
  padding: 1rem;

  /* No & needed for elements */
  ul {
    display: flex;
    gap: 1rem;
  }

  a {
    color: var(--color-text);

    &:hover {
      color: var(--color-primary);
    }
  }
}
```

### 4. oklch() & color-mix() — Smart Colors

```css
:root {
  --color-primary: oklch(55% 0.25 260);
  --color-primary-light: oklch(75% 0.15 260);
}

.button:hover {
  background: color-mix(in oklch, var(--color-primary), black 15%);
}
```

**Real Impact:** 900-line color system → 80 lines of CSS.

### 5. Scroll-Driven Animations (Zero JavaScript)

```css
.progress-bar {
  animation: grow-progress linear;
  animation-timeline: scroll();
}

@keyframes grow-progress {
  from { transform: scaleX(0); }
  to { transform: scaleX(1); }
}
```

**Real Impact:** Deleted 45KB animation library (AOS), smoother performance.

### 6. View Transitions API

```css
@view-transition {
  navigation: auto;
}

::view-transition-old(root) {
  animation: fade-out 0.2s ease-out;
}

::view-transition-new(root) {
  animation: fade-in 0.3s ease-in;
}
```

---

## XXI. THREE.JS & WEBGL FOR DASHBOARDS

When to use: Interactive 3D data viz, real-time financial dashboards, particle systems.

```javascript
import * as THREE from 'three';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight);
const renderer = new THREE.WebGLRenderer({ antialias: true });

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Performance: Use instanced rendering for 10K+ objects
const instancedGeometry = new THREE.InstancedBufferGeometry();
const mesh = new THREE.InstancedMesh(geometry, material, 10000);
scene.add(mesh);
```

---

## XXII. SHADCN/UI & RADIX — 2025 DESIGN SYSTEMS

**Key Shift:** shadcn/ui components live IN YOUR CODEBASE. This changes architecture.

### Folder Structure
```
components/
  ├─ ui/        # Raw shadcn (don't edit often)
  ├─ primitives/ # AppButton, FormInput (your wrappers)
  └─ blocks/    # PricingCard, Dashboard (compositions)
```

### Pattern 1: Create Primitive Wrappers

```tsx
// components/primitives/AppButton.tsx
import { Button } from "@/components/ui/button";

export function AppButton(props) {
  return (
    <Button
      className="font-medium tracking-tight"
      {...props}
    />
  );
}
```

### Pattern 2: Design Token Layer

```css
:root {
  --color-brand: oklch(55% 0.25 260);
  --space-md: 1rem;
  --ease-out: cubic-bezier(0.16, 1, 0.3, 1);
}
```

### Pattern 3: Compose Blocks

```tsx
export function PricingCard({ plan }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{plan.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-4xl font-bold">${plan.price}</div>
      </CardContent>
      <CardFooter>
        <Button className="w-full">{plan.cta}</Button>
      </CardFooter>
    </Card>
  );
}
```

---

## XXIII. NODE.JS/EXPRESS API BEST PRACTICES 2026

### Standard Response Format

```typescript
interface ApiResponse<T> {
  status: 'success' | 'error';
  data?: T;
  error?: { code: string; message: string };
  timestamp: number;
}

app.get('/api/users/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    res.status(200).json({
      status: 'success',
      data: user,
      timestamp: Date.now()
    });
  } catch (e) {
    res.status(404).json({
      status: 'error',
      error: { code: 'NOT_FOUND', message: 'User not found' },
      timestamp: Date.now()
    });
  }
});
```

### Centralized Error Handler

```typescript
// Register at BOTTOM of app
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.statusCode || 500).json({
    status: 'error',
    error: { code: err.code || 'INTERNAL_ERROR', message: err.message },
    timestamp: Date.now()
  });
});
```

### Performance Production Checklist

- ✅ Compression middleware
- ✅ Rate limiting
- ✅ Connection pooling (database)
- ✅ Cache headers for static data
- ✅ Avoid synchronous operations (fs.readFileSync, etc)
- ✅ Use async/await, never callbacks
- ✅ Monitor token usage in multi-agent systems

---

## XXIV. SVG & LOTTIE ANIMATIONS

### SVG Path Morphing (GSAP)

```javascript
gsap.to("#icon", {
  attr: { d: newSvgPath },
  duration: 0.5,
  ease: "power2.inOut"
});
```

### Lottie (After Effects → Web)

```jsx
import Lottie from 'lottie-react';
import animation from './animation.json';

export function LoadingAnimation() {
  return <Lottie animationData={animation} loop autoplay />;
}
```

**Performance:** Lottie = 70% smaller than GIF, scales infinitely, interactive.

---

## XXV. MULTI-AGENT AI SYSTEMS (2026)

Google's Eight Design Patterns:

1. **Sequential Pipeline** — Agent A → B → C
2. **Coordinator Pattern** — Router dispatches to specialists
3. **Parallel Execution** — All agents work simultaneously
4. **Hierarchical** — Team leaders manage subgroups
5. **Human-in-the-loop** — Agents escalate edge cases
6. **Negotiation** — Agents propose compromises
7. **Shared memory** — Short-term (conversation) + long-term (knowledge)
8. **Observability** — Track every decision and why

### When to Build Multi-Agent Systems

✅ Complex workflows with multiple specialists
✅ Parallel processing of independent tasks
✅ Supply chain, customer service automation
✅ Research and analysis pipelines

❌ Simple single-agent tasks
❌ Real-time latency-critical (coordination adds 500ms)
❌ Small budgets (tokens costs compound 15×)

### Cost Control

Multi-agent systems use 15× more tokens but 90% better quality.

**Strategies:**
- Match model size to task (small models for validation)
- Implement caching (don't re-analyze same data)
- Set token budgets and kill runaway agents

---

*Updated: March 2, 2026 | Deep research on 2025-2026 latest techniques compiled*
*Topics: Motion.dev, GSAP, Modern CSS (container queries, :has(), view transitions), Three.js/WebGL, shadcn/ui, Node/Express, SVG/Lottie, Multi-Agent Systems*

---

## XXVII. Vibe-Coder Tool Stack (March 2026)
*From @om_patel5 — tools every AI builder should know*

### Already in our stack ✅
- **Claude AI** — coding + debugging (that's us)
- **OpenRouter** — LLM API routing (we use this)
- **Vercel** — frontend hosting + deployment (in our agency stack)
- **Supabase** — backend + database + auth (locked for calendar app)
- **GitHub** — code hosting + version control
- **Perplexity** — AI search for dev queries (we have web_search)
- **Figma** — UI/UX design (we have the Figma MCP skill)
- **OpenClaw** — listed as "Experimental AI agent framework" (that's what runs us 🔥)

### High-priority additions for our stack
- **v0 (v0.dev)** — Vercel's AI UI component generator. Describe a component, get production React+Tailwind code instantly. USE FOR: rapid prototyping of calendar UI components, agency client dashboards. Free tier available.
- **bolt.new** — Prompt-to-app generator. Full stack apps from one prompt. Good for: spinning up quick demos before handing to Codex/Claude Code for polish.
- **RevenueCat** — Subscription payment management. Handles App Store + Play Store + web subscriptions in one SDK. USE FOR: calendar app monetization (Free/Pro/Teams tiers). Saves building billing from scratch.
- **Convex (getconvex.com)** — Realtime backend for apps. Replaces Express+JSON with live-syncing database. USE FOR: calendar app multi-user sync, live event updates across devices.
- **fal.ai** — AI media generation APIs (images, video, audio). Fast + cheap. USE FOR: AI-generated banner images, event thumbnails, social content in Prism.
- **Exa AI (exa.ai)** — AI-powered search API. Better than raw web search for dev queries. USE FOR: Scout research, competitor intel, content ideation.
- **Mintlify** — AI documentation generator. Auto-generates docs from code. USE FOR: when we open-source or sell the calendar app, instant pro docs.
- **Warp (warpdev)** — AI-powered terminal. Smarter than standard terminal, AI inline suggestions. Matt should try this as his daily driver.

### Coding agents (alternatives to Claude Code + Codex)
- **Cursor** — AI code editor (VS Code fork). Best for: interactive coding sessions where you want to stay in an editor. We use Claude Code instead but Cursor has better inline suggestions.
- **Windsurf (windsurf_ai)** — AI code editor by Codeium. Similar to Cursor. Free tier.
- **Cline** — AI coding agent as VS Code extension. Runs Claude/GPT inside VS Code.
- **Zencoder** — AI coding agent platform. Multi-agent code generation.
- **CodeRabbit** — Automated AI code reviews on GitHub PRs. Useful once we have a real repo with PRs.

### Security + Quality
- **Snyk** — Security code analysis. Scans for vulnerabilities. Add to CI/CD when we deploy calendar publicly.
- **Sourcegraph** — AI codebase search + understanding. Useful for large repos (app.js is getting there).

### For the calendar app specifically
Priority order for integration:
1. **RevenueCat** — monetization layer when we go to market
2. **Convex** — replace local JSON storage with realtime backend for multi-user
3. **v0** — generate polished UI components faster
4. **Vercel** — deploy the web version publicly
5. **Mintlify** — docs for when we open-source or sell API access

---

## XXVIII. Complete Vibe-Coder Tool Stack (Full 48-tool audit)
*@om_patel5 — every tool cross-referenced against our stack*

### Already in our stack ✅
Claude AI, OpenRouter, Vercel, Supabase, GitHub, Figma (MCP skill), Perplexity, OpenClaw (that's us 🔥)
RevenueCat, Convex, v0, bolt.new, fal.ai, Exa AI, Mintlify, Warp, Snyk, CodeRabbit, Sourcegraph — added earlier tonight

### New additions from full scan:

**Code Editors / IDEs**
- **Zed** (zed.dev) — blazing fast lightweight code editor written in Rust. Snappier than VS Code for large files. Worth trying for app.js at 11K lines.
- **Windsurf AI** (codeium's editor) — full AI code editor, free tier. Alternative to Cursor. Good for when Claude Code isn't the right tool.
- **Cline** — AI coding agent INSIDE VS Code. Runs Claude/GPT inline. Closest thing to Claude Code but in VS Code.
- **Aider** — terminal-based AI pair programmer. `aider --model claude-3-5-sonnet` in any project dir. Good for quick CLI-driven edits without spawning a full session.

**AI App Builders (rapid prototyping)**
- **Lovable** (lovable.dev) — AI builds full web apps from description. Good for: quick client-facing demo pages, landing pages before handing to Claude Code for polish.
- **Rork** — AI mobile app builder. Relevant when we want native iOS/Android version of calendar or city sim.
- **Vibe Code App** — AI mobile app builder, similar to Rork. Alternative.
- **Antigravity** — agentic IDE, autonomous coding. Similar to Codex but different execution model.

**AI Code Quality**
- **Qodo AI** — AI code review + test generation. Writes tests for your code automatically. USE FOR: calendar app before we ship publicly.
- **Pieces** — AI code snippet manager. Saves and retrieves useful code patterns across sessions. Good for storing our Rod Hunt Three.js patterns, event system patterns.
- **Tabnine** — AI autocomplete, runs locally (privacy-first). Good if we ever need offline AI coding.
- **Codeium** — free AI autocomplete. The company behind Windsurf.

**Deployment + Infrastructure**
- **Replit** — cloud coding + instant deployment. USE FOR: quick demos to share with clients (no server needed). Matt can share a Replit link and client sees live app instantly.
- **Netlify** — hosting + deployment (alternative to Vercel). Free tier generous. Good for static sites.
- **GitLab** — GitHub alternative with built-in CI/CD pipelines. Not needed now but relevant at team scale.

**AI Research + Intelligence**
- **Cognition Labs / Devin** — the original "AI software engineer." Full autonomous coding agent. Expensive ($500/mo) but relevant to know — our Codex + Claude Code stack is better value.
- **Open Interpreter** — open-source local AI that can run code, browse web, manage files. Like a local version of what Alo does. Interesting for offline/private builds.
- **Manus AI** — general AI agent for productivity tasks. Less coding-focused.
- **Google AI Studio** — Google's prototyping environment. Gemini models free tier. USE FOR: testing Gemini vs Claude on specific tasks.
- **Noah AI** — AI builder for onchain/Web3 apps. Relevant if we ever touch blockchain.

**Design**
- **Dribbble** — design inspiration library. USE FOR: visual references before briefing Claude Code on UI. Better than Google Images for UI patterns.
- **Canva** — design + graphics. USE FOR: marketing assets for calendar app launch, Halo Marketing client assets.
- **NanoBanana** — AI image generation. Alternative to Midjourney.
- **Midjourney** — best-in-class AI image generation. USE FOR: city sim character concepts, marketing assets.

**Web3 (lower priority for us)**
- **Rainbow** — Web3 wallet integration. Only relevant if we build blockchain features.

### Priority Ranking for Our Stack

**Use NOW:**
1. Aider — terminal AI pair programming for quick edits
2. Zed — try as editor for large files (app.js, city sim)
3. Dribbble — reference before every UI build
4. Replit — instant client demos

**Use for calendar app launch:**
5. Qodo AI — generate tests before shipping
6. Lovable — landing page for calendar product
7. Netlify — host the public web version

**Use for city sim:**
8. Midjourney — concept art, Rod Hunt style references
9. Pieces — save Three.js + simulation code patterns

**Monitor (not yet):**
10. Rork/Vibe Code — when we do mobile
11. Devin — when budget allows, compare against our stack
12. Google AI Studio — benchmark Gemini on specific tasks

---

## XXIX. Complete 48-Tool Reference — Full Detail (Claude Code + Alo)
*Every tool fully documented. Low priority tools included — use when the situation calls for it.*
*Last updated: March 2, 2026*

---

### 1. Claude AI (claude.ai / Anthropic)
- **What:** Best-in-class AI for coding, debugging, architecture
- **How we use it:** Claude Code sessions, inline reasoning, complex problem solving
- **API:** `anthropic/claude-sonnet-4-6` (main), `anthropic/claude-haiku-4-5` (fast/cheap)
- **Key pattern:** `ANTHROPIC_API_KEY=... claude --dangerously-skip-permissions -p "prompt"`

### 2. Cursor (cursor.ai)
- **What:** VS Code fork with AI deeply embedded. Best for interactive coding sessions.
- **How to use:** Download, open project, Cmd+K for inline edits, Cmd+L for chat
- **When to use:** When Matt wants to code interactively himself with AI assist
- **Models:** Can use Claude or GPT-4 as backend
- **vs Claude Code:** Cursor = interactive human-driven; Claude Code = autonomous agent

### 3. Replit (replit.com)
- **What:** Cloud coding + instant shareable deployment. No local setup required.
- **How to use:** replit.com → New Repl → paste code → Run → share URL
- **USE FOR:** Client demos. "Here's a live link" beats "clone this repo." Instant.
- **Free tier:** Generous. One click deploy, public URL included.
- **Key feature:** Multiplayer — multiple people edit same file live

### 4. Vercel (vercel.com)
- **What:** Best frontend hosting. Git push = automatic deploy.
- **How to use:** `npm i -g vercel` → `vercel` in any project → live URL
- **USE FOR:** Calendar app production deploy, AI Systems Agency client portals
- **Key features:** Edge functions, preview deployments per PR, analytics
- **Our stack:** Next.js + Vercel = default for agency client builds

### 5. GitHub (github.com)
- **What:** Code hosting + version control + CI/CD
- **Our repos:** All Projects/ directories should be pushed here
- **CI/CD:** GitHub Actions for auto-test + deploy on push
- **USE FOR:** All serious projects. Not using GitHub = no history = dangerous.

### 6. NanoBanana
- **What:** AI image generation tool
- **When to use:** Quick concept images, lower budget than Midjourney
- **Alternative to:** Midjourney for non-critical assets

### 7. Midjourney (midjourney.com)
- **What:** Best AI image generation. Cinematic, painterly, incredibly detailed.
- **How to use:** Discord bot (`/imagine prompt`) or midjourney.com
- **USE FOR:** City sim character concepts (Rod Hunt style refs), marketing assets, hero images
- **Key prompts for Rod Hunt style:** `isometric city illustration, flat shading, vibrant saturated colors, tiny characters, rod hunt style --ar 16:9 --v 6`
- **Cost:** $10/mo basic, $30/mo standard (unlimited)

### 8. Rainbow (rainbow.me)
- **What:** Web3 wallet SDK for connecting Ethereum wallets in web apps
- **How to use:** `npm install @rainbow-me/rainbowkit wagmi` → wrap app in providers
- **When to use:** If we ever build blockchain features (NFTs, crypto payments, Web3 gating)
- **Low priority:** Only relevant for Web3 projects

### 9. RevenueCat (revenuecat.com)
- **What:** Subscription billing SDK. Handles App Store, Play Store, and Stripe in one.
- **How to use:** `npm install react-native-purchases` or web SDK
- **USE FOR:** Calendar app Pro tier. One SDK = iOS + Android + web subscriptions all managed together
- **Key feature:** Paywall builder, subscription analytics, entitlement management
- **Pricing:** Free up to $2.5K MRR, then 1%

### 10. Lovable (lovable.dev)
- **What:** AI builds full web apps from description. Generates React + Tailwind.
- **How to use:** lovable.dev → describe what you want → iterate in chat → export or deploy
- **USE FOR:** Quick client-facing landing pages, MVP demos before handing to Claude Code
- **vs bolt.new:** Lovable = more polished UI; bolt = faster raw generation

### 11. Rork (rork.app)
- **What:** AI mobile app builder. Prompt → native iOS/Android app.
- **How to use:** rork.app → describe app → generates React Native code
- **When to use:** When we want a mobile version of the calendar or city sim viewer
- **Low priority:** Until we decide to go mobile

### 12. Dribbble (dribbble.com)
- **What:** Design inspiration + discovery. Best UI/UX reference library.
- **How to use:** Search for what you're building before writing any code
- **USE FOR:** Every UI build — search "dark dashboard", "calendar app dark", "city sim UI" before briefing Claude Code
- **Key rule:** 10 minutes on Dribbble before any new UI = 2x better output quality

### 13. v0 (v0.dev)
- **What:** Vercel's AI UI component generator. Describe → get React + Tailwind component.
- **How to use:** v0.dev → describe component → copy shadcn-compatible code
- **USE FOR:** Calendar event modal, dashboard widgets, any reusable UI component
- **Key feature:** Generates accessible, production-quality code. Not toy code.
- **Free tier:** 200 generations/mo

### 14. Zed (zed.dev)
- **What:** Blazing fast code editor written in Rust. Much faster than VS Code on large files.
- **How to install:** `brew install zed`
- **When to use:** When app.js hits 15K+ lines and VS Code starts lagging
- **AI features:** Built-in AI assistant, inline completions
- **Key advantage:** Opens instantly, zero lag on large files

### 15. Zencoder (zencoderai.com)
- **What:** AI coding agent platform. Enterprise-focused multi-agent code generation.
- **When to use:** Large team codebases with complex requirements
- **Low priority:** Overkill for our current scale

### 16. Codeium (codeium.com)
- **What:** Free AI code autocomplete. Works in VS Code, Zed, JetBrains, etc.
- **How to install:** VS Code extension → search "Codeium"
- **When to use:** Free alternative to GitHub Copilot. Good for completions while manually editing.
- **Note:** Company behind Windsurf

### 17. Tabnine (tabnine.com)
- **What:** AI code completion that can run locally (privacy-first).
- **How to install:** VS Code extension → search "Tabnine"
- **When to use:** If we ever need offline AI coding (sensitive client code, air-gapped systems)
- **Key feature:** Local model option — no code leaves machine

### 18. Supabase (supabase.com)
- **What:** Open-source Firebase alternative. PostgreSQL + Auth + Realtime + Storage.
- **How to use:** supabase.com → new project → `npm install @supabase/supabase-js`
- **USE FOR:** Calendar app multi-user backend, AI Systems Agency client portals
- **Key features:** Row-level security, real-time subscriptions, built-in auth
- **Our stack:** Supabase + Next.js + Vercel = locked for agency builds

### 19. ChatGPT (chat.openai.com)
- **What:** OpenAI's general AI assistant
- **When to use:** Second opinion on architecture decisions, quick research
- **vs Claude:** Claude wins on coding; ChatGPT has more tool integrations

### 20. Aider (aider.chat)
- **What:** Terminal-based AI pair programmer. Works in any directory with git.
- **How to use:** `pip install aider-chat` → `aider --model claude-3-5-sonnet` in project dir
- **USE FOR:** Quick targeted edits without spinning up full Claude Code session
- **Key feature:** Reads the whole codebase, makes changes across multiple files, auto-commits
- **Pattern:** `aider --model anthropic/claude-sonnet-4-6 --file public/app.js --message "fix the drag bug"`

### 21. Bolt (bolt.new)
- **What:** Prompt-to-full-stack-app generator. Runs in browser, instant deploy.
- **How to use:** bolt.new → describe app → iterate → export to GitHub
- **USE FOR:** Spinning up initial scaffolding before handing to Claude Code
- **Key feature:** Full stack (frontend + backend + DB) from one prompt

### 22. Noah AI (trynoah.ai)
- **What:** AI builder specifically for onchain/Web3 apps
- **When to use:** If we build any blockchain-connected features
- **Low priority:** Only for Web3 use cases

### 23. Antigravity
- **What:** Agentic IDE — autonomous coding agent with project management
- **When to use:** Alternative to Claude Code for large autonomous builds
- **Monitor:** Keep an eye on this as a Codex alternative

### 24. Qodo AI (qodo.ai)
- **What:** AI code review + automatic test generation
- **How to use:** VS Code extension or CLI → `qodo test` on any file → generates tests
- **USE FOR:** Before shipping calendar app publicly — run on all core functions
- **Key feature:** Understands intent, not just syntax — tests what the code SHOULD do

### 25. Snyk (snyk.io)
- **What:** Security vulnerability scanning for code + dependencies
- **How to use:** `npm install -g snyk` → `snyk test` in any project
- **USE FOR:** Before any public launch — scan for known CVEs in dependencies
- **Key feature:** Fixes vulnerabilities automatically with one command

### 26. Pieces (pieces.app)
- **What:** AI-powered code snippet manager with context awareness
- **How to use:** Desktop app → save code snippets → search by concept not just keywords
- **USE FOR:** Save our reusable patterns: Rod Hunt Three.js setup, event system boilerplate, Express API patterns, drag-to-create logic
- **Key feature:** Remembers WHERE you saved a snippet from (URL, file, conversation)

### 27. Mintlify (mintlify.com)
- **What:** AI documentation generator. Generates docs from code comments + structure.
- **How to use:** mintlify.com → connect GitHub repo → auto-generates docs site
- **USE FOR:** Calendar app docs when we launch, AI Systems Agency API docs
- **Key feature:** Docs update automatically when code changes

### 28. Perplexity (perplexity.ai)
- **What:** AI search engine with citations. Better than Google for dev queries.
- **When to use:** "How does Three.js InstancedMesh work with dynamic updates?" → Perplexity
- **vs web_search:** Perplexity synthesizes; web_search returns raw links

### 29. GitLab (gitlab.com)
- **What:** GitHub alternative with built-in CI/CD, more DevOps features
- **When to use:** When we need CI/CD pipelines without GitHub Actions complexity
- **vs GitHub:** GitLab has better built-in pipelines; GitHub has better community/integrations

### 30. Sourcegraph (sourcegraph.com)
- **What:** AI-powered codebase search and understanding at scale
- **How to use:** sourcegraph.com → connect repos → natural language search across all code
- **USE FOR:** When mission-control-server codebase gets too big to grep manually
- **Key feature:** "Find all places where we handle drag events" → returns every relevant file

### 31. CodeRabbit (coderabbit.ai)
- **What:** AI code review bot for GitHub PRs
- **How to use:** Install GitHub App → every PR gets AI review comments automatically
- **USE FOR:** Once we have a real development flow with PRs (team scale)
- **Key feature:** Understands business context, not just syntax errors

### 32. Convex (convex.dev)
- **What:** Realtime backend platform. TypeScript functions + live-syncing database.
- **How to use:** `npm install convex` → define functions → automatic realtime sync
- **USE FOR:** Calendar app — replace local events.json with live multi-device sync
- **Key feature:** No REST API needed. Functions are reactive — UI updates automatically.
- **vs Supabase:** Convex = simpler realtime; Supabase = more features + SQL power

### 33. fal.ai (fal.ai)
- **What:** Fast AI media generation APIs. Images, video, audio. Very fast inference.
- **How to use:** `npm install @fal-ai/client` → `fal.run("model/endpoint", { prompt })`
- **USE FOR:** AI-generated event thumbnails, city sim concept art generation, social content
- **Key feature:** Fastest image generation available. Flux/SDXL models at 2-3 sec/image.
- **Cost:** Pay per generation, very cheap (~$0.003/image)

### 34. OpenRouter (openrouter.ai)
- **What:** Single API for 100+ LLMs. Route between Claude, GPT, Gemini, Llama seamlessly.
- **We already use this:** `openrouter/anthropic/claude-sonnet-4-6` format
- **Key pattern:** Use for cost optimization — route cheap tasks to Haiku, complex to Sonnet

### 35. Exa AI (exa.ai)
- **What:** AI-native search API. Semantic search, not keyword matching.
- **How to use:** `npm install exa-js` → `exa.search("query", { numResults: 10 })`
- **USE FOR:** Scout research agent, competitor intelligence, content research
- **vs Brave Search:** Exa finds semantically related content; Brave finds exact keyword matches

### 36. Cognition Labs / Devin (cognition.ai)
- **What:** The original "AI software engineer." Fully autonomous — reads docs, writes code, tests, deploys.
- **Cost:** $500/month. Expensive.
- **When to use:** Large autonomous builds when Codex isn't available
- **vs our stack:** Claude Code + Codex is better value. Devin is more autonomous but less controllable.
- **Monitor:** Worth trying on one project when budget allows

### 37. Canva (canva.com)
- **What:** Design + graphics platform. Templates, drag-and-drop, brand kits.
- **How to use:** canva.com → create design → download or share
- **USE FOR:** Halo Marketing client assets, social posts, pitch decks, onboarding docs
- **Key feature:** Brand kit — upload Matt's colors/fonts, all designs stay on-brand

### 38. Figma (figma.com)
- **What:** Professional collaborative UI/UX design tool. Industry standard.
- **We have:** Figma MCP skill (`~/.openclaw/workspace/.agents/skills/openai-figma/SKILL.md`)
- **USE FOR:** Wireframing new features before building, client design reviews
- **Key feature:** Dev mode — inspect any element for exact CSS values

### 39. Netlify (netlify.com)
- **What:** Hosting + deployment. Generous free tier. Great for static + JAMstack sites.
- **How to use:** `npm install -g netlify-cli` → `netlify deploy`
- **USE FOR:** Halo Marketing landing pages, calendar app public version, any static site
- **vs Vercel:** Netlify = better for static/marketing sites; Vercel = better for Next.js apps

### 40. Google AI Studio (aistudio.google.com)
- **What:** Google's AI prototyping environment. Free access to Gemini models.
- **How to use:** aistudio.google.com → test prompts → get API key → `@google/generative-ai`
- **USE FOR:** Benchmarking Gemini vs Claude on specific tasks, free tier experiments
- **Key models:** Gemini 1.5 Pro (long context — 1M tokens), Gemini Flash (fast + cheap)
- **When beats Claude:** Gemini 1.5 Pro's 1M context window useful for huge codebases

### 41. Open Interpreter (openinterpreter.com)
- **What:** Open-source local AI that can run code, browse web, manage files. Like a local Alo.
- **How to use:** `pip install open-interpreter` → `interpreter` → chat naturally
- **When to use:** Offline/private builds, air-gapped environments, teaching others
- **vs Alo:** Less capable but runs 100% locally, no API costs

### 42. Warp (warp.dev)
- **What:** AI-powered terminal. Smarter autocomplete, inline AI, command history search.
- **How to install:** warp.dev → download → replace Terminal
- **USE FOR:** Matt's daily terminal. Huge quality-of-life improvement over default terminal.
- **Key features:** Block-based output (copy any command output easily), AI inline help

### 43. Cline (github.com/cline/cline)
- **What:** AI coding agent as VS Code extension. Claude/GPT inside your editor.
- **How to install:** VS Code → Extensions → search "Cline"
- **When to use:** When you want Claude Code capabilities but staying in VS Code
- **vs Claude Code:** Cline = inside editor, interactive; Claude Code = terminal, more autonomous

### 44. Windsurf (windsurf.ai)
- **What:** Full AI code editor by Codeium. Cascade = their agentic AI (like Claude Code but in GUI)
- **How to use:** windsurf.ai → download → open project → use Cascade for autonomous edits
- **When to use:** Alternative to Claude Code when you want a GUI. Free tier available.
- **Key feature:** "Flows" — autonomous multi-step code changes with rollback

### 45. Manus AI (manus.im)
- **What:** General AI agent for productivity. Can browse web, run code, manage files.
- **When to use:** Research tasks, automations, document generation
- **vs Alo:** Manus is standalone; Alo is embedded in our whole system

### 46. Vibe Code App (vibecodeapp.com)
- **What:** AI mobile app builder. Similar to Rork.
- **When to use:** Quick mobile prototypes, client demos on phone
- **vs Rork:** Different UI, similar capability. Try both.

### 47. OpenClaw (openclaw.ai)
- **What:** That's us. AI agent framework running on Matt's Mac mini.
- **We already know this one.** 🔥

### 48. Google DeepMind (deepmind.google)
- **What:** Google's AI research division. Produces models like Gemini Ultra, AlphaCode.
- **Relevant products:** Gemini API (via Google AI Studio), AlphaCode for competitive programming
- **When to use:** If a task needs Gemini-specific capabilities (huge context, Google integrations)

---

## Quick-Access Reference Card (For Claude Code reads)

```
BUILD UI FAST:       v0.dev → component → paste into project
DEPLOY FAST:         Vercel (Next.js) or Netlify (static)
SHARE DEMO:          Replit → paste → share link
MONETIZE:            RevenueCat (subscriptions) 
REALTIME BACKEND:    Convex (simple) or Supabase (full-featured)
AI IMAGES:           fal.ai (fast/cheap) or Midjourney (best quality)
DESIGN REFERENCE:    Dribbble first, always
TERMINAL AI:         Warp (daily driver) or Aider (targeted edits)
CODE EDITOR:         Zed (fast) or Windsurf (AI-first) or VS Code + Cline
SECURITY SCAN:       Snyk before any public launch
TESTS:               Qodo AI auto-generation
DOCS:                Mintlify auto-generation
AI SEARCH:           Exa AI (semantic) or Perplexity (synthesis)
WEB3:                Rainbow (wallet) or Noah AI (full Web3 apps)
CONCEPT ART:         Midjourney — rod hunt style prompts in CITY_SIM_ART_DIRECTION.md
```
