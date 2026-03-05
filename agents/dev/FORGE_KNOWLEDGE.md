# Forge Knowledge Base
*Everything Forge needs to build at the highest level, every time.*

> **Deep Skills Reference:** `agents/dev/CODING_SKILLS.md` — 26 sections on modern CSS, animation libraries (Motion.dev, GSAP, Lottie), WebGL/Three.js, shadcn/Radix, Node/Express patterns, SVG animation, and multi-agent architecture. Read it before building anything animation/UI-heavy.

---

## The Stack — What We Build In

### Frontend
- **Vanilla JS + CSS** for dashboard-style apps (Mission Control model) — no framework overhead
- **React** when component complexity warrants it (client-facing apps, portals)
- **Tailwind CSS** for rapid utility-first styling — never Bootstrap
- **CSS custom properties** for theming — one source of truth for colors/spacing
- **Framer Motion** (React) or **GSAP** (vanilla) for animation — nothing else
- **Chart.js** or **D3** for data visualization

### Backend
- **Node.js + Express** — the standard for all our servers
- **PM2** for process management — all servers run under PM2
- **SQLite** for lightweight persistent storage, **JSON files** for config/state
- **Notion API** for structured data (client records, orders, tasks)
- **Slack API** for agent communication
- **Twilio** for SMS/voice

### Infrastructure
- **Cloudflare Tunnels** for public URLs (no port forwarding)
- **PM2** ecosystem — every service has a named process
- **.env** in voice-server/ — all secrets live there, never committed

---

## Current Projects — Know These Cold

### Mission Control (`mission-control-server/`)
- Port 7900, PM2: `mission-control`
- Main files: `server.js` (API + Slack handlers), `public/index.html`, `public/app.js`
- Dark theme: `#0f1117` base, `#1a1d2e` cards, `#7c63ff` purple accent
- Live data from: Sellerboard (revenue), Notion (orders/clients), Slack (agent activity)
- Agents displayed: Alo, Scout, Prism, Kargo, Atlas, Forge, Titan, Sage (online) + Quinn, Ember, Volt (building)
- Key APIs: `/api/commerce`, `/api/agents`, `/api/social/queue`, `/api/pipeline`, `/api/chat`

### Velora (`/Users/mattbender/Projects/velora/`)
- Port 7903, PM2: `velora`
- Vanessa's floral design business: portfolio, bouquet builder, AI chatbot (Lily)
- Stack: Node/Express + vanilla JS + Pexels API for botanical imagery
- Live at velora-tunnel (Cloudflare)

### Voice Server (`voice-server/`)
- Port 3001, PM2: `alo-voice`
- Twilio + Deepgram + Claude Haiku + Cartesia (Lindsey voice)
- Handles inbound/outbound calls + SMS

---

## UI/UX Standards — The Bar

### Visual Quality
- **Dark themes done right**: layered blacks (not flat), subtle card borders, purposeful glows
- **Typography hierarchy**: 3 levels max — headline / body / label. Each has one job.
- **Spacing rhythm**: 8px base unit. Everything is a multiple of 8.
- **Color discipline**: one accent color (our purple `#7c63ff`), semantic use only — not decoration
- **Icons**: consistent weight and style. No mixing icon packs.
- **Empty states**: design them. An empty card is an opportunity, not a void.

### Interaction Design
- **Hover states**: always present on interactive elements. 150-200ms transition.
- **Loading states**: skeleton screens > spinners for data loads
- **Error states**: specific, actionable — not "something went wrong"
- **Mobile**: everything works at 375px. Not "responsive-ish" — actually works.
- **Keyboard**: tab order makes sense. Escape closes modals. Enter submits forms.

### Performance
- First paint under 1.5s on fast connection
- No layout shift after load (reserve space for dynamic content)
- Images lazy-loaded, properly sized
- No blocking scripts in `<head>`
- API calls debounced where appropriate

### Animation Rules
- Duration: 150-300ms for UI feedback, up to 600ms for page-level transitions
- Easing: `cubic-bezier(0.4, 0, 0.2, 1)` (Material standard) for most things
- Purpose: every animation communicates state change or hierarchy — never decorative
- Reduced motion: `prefers-reduced-motion` respected

---

## Dashboard Design Patterns — Mission Control Style

### Card System
```css
.card {
  background: #1a1d2e;
  border: 1px solid rgba(255,255,255,0.06);
  border-radius: 12px;
  padding: 20px 24px;
}
.card:hover { border-color: rgba(124,99,255,0.3); }
```

### Status Indicators
- Online: `#22c55e` (green dot, 8px)
- Building: `#f59e0b` (amber, pulsing)
- Offline: `#6b7280` (gray)
- Alert: `#ef4444` (red)

### Data Display
- Numbers: always formatted (`toLocaleString()` for currency, `K/M` for large counts)
- Dates: relative ("2h ago", "Yesterday") for recent, absolute for older
- Trends: `▲ 12%` green / `▼ 8%` red — always show direction

### Real-Time Feel
- Polling intervals: 30s for financial data, 5s for agent status
- Optimistic updates: update UI immediately, reconcile on response
- Timestamps: show "last updated X ago" so user knows data freshness

---

## Integration Patterns

### Notion
```js
// Always use filter + sorts, never load all pages
const r = await fetch(`https://api.notion.com/v1/databases/${DB_ID}/query`, {
  method: 'POST',
  headers: { 'Authorization': `Bearer ${NOTION_TOKEN}`, 'Notion-Version': '2022-06-28' },
  body: JSON.stringify({ filter: {...}, sorts: [...], page_size: 50 })
});
```

### Slack (Bot)
```js
// Use chat.postMessage with username override for agent identity
await fetch('https://slack.com/api/chat.postMessage', {
  method: 'POST',
  headers: { 'Authorization': `Bearer ${SLACK_BOT_TOKEN}` },
  body: JSON.stringify({ channel: CHANNEL_ID, text: msg, username: 'Kargo', icon_url: AGENT_ICON })
});
```

### CDP Browser (Playwright)
```js
const browser = await chromium.connectOverCDP('http://127.0.0.1:18800');
const ctx = browser.contexts()[0];
// Use for: Sellerboard scraping, Google Sheets auth
```

---

## Build Standards

### Before Every Build
1. Read every file you're about to touch
2. Write a 5-line spec: what, why, what changes, what breaks, what done looks like
3. Check PM2 — know what's running and what depends on what

### File Discipline
- Never edit `.env` directly (append only with `echo "KEY=val" >> .env`)
- Never commit secrets
- Always `pm2 restart [name]` after server changes, never kill+start
- Test with `pm2 logs [name] --lines 20` after every restart

### When Something Breaks
1. Check PM2 logs first: `pm2 logs [name] --lines 30 --nostream`
2. Fix the actual error — don't mask it
3. Restart and verify: check logs + test the endpoint
4. If in doubt, read the file again — 90% of bugs are "I thought I knew what was in there"

---

## Upcoming Builds — Priority Order

1. **Mission Control v2** — client pipeline tasks, brain dump AI delegation, office redesign, EOD cards, personal finance section, Forge's own section
2. **Quinn agent** — outreach dashboard, Saleshandy integration, LinkedIn workflow
3. **Ember agent** — client success portal, onboarding tracker, email framework
4. **EHR System** — healthcare practitioner EHR with AI (~March 2026, big project)
5. **AI Dashboard Service** — packaged version of Mission Control for external clients ($1,950 setup)

---

## The Standard

Every build Forge ships should make the previous version look like a prototype.

Not incrementally better — visibly, meaningfully better. The kind of upgrade where someone opens it and immediately notices the difference without being told what changed.

That's the bar.

---

## Advanced Web — The Pro Tier

This is what separates a site people forget from one they screenshot.

---

### Animation Arsenal

#### GSAP (GreenSock) — The Gold Standard
The most powerful animation library on the web. Used on award-winning sites.
```bash
npm install gsap
```
```js
// Timeline sequences
const tl = gsap.timeline({ defaults: { ease: 'power4.out', duration: 0.8 } });
tl.from('.hero-title', { y: 80, opacity: 0, stagger: 0.1 })
  .from('.hero-sub', { y: 40, opacity: 0 }, '-=0.4')
  .from('.hero-cta', { scale: 0.9, opacity: 0 }, '-=0.3');

// ScrollTrigger — animate on scroll
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);
gsap.from('.card', {
  scrollTrigger: { trigger: '.cards', start: 'top 80%', end: 'bottom 20%', scrub: true },
  y: 60, opacity: 0, stagger: 0.15
});

// Magnetic button effect
const btn = document.querySelector('.btn');
btn.addEventListener('mousemove', (e) => {
  const rect = btn.getBoundingClientRect();
  gsap.to(btn, { x: (e.clientX - rect.left - rect.width/2) * 0.3, y: (e.clientY - rect.top - rect.height/2) * 0.3, duration: 0.3 });
});
```

**GSAP Plugins worth knowing:**
- `ScrollTrigger` — scroll-based animations (free)
- `SplitText` — animate individual letters/words (Club GreenSock)
- `MorphSVG` — morph between SVG shapes
- `DrawSVG` — draw SVG paths like they're being drawn
- `Flip` — smooth layout transitions (FLIP technique)

#### Three.js — 3D in the Browser
WebGL made usable. For hero sections, product viewers, interactive backgrounds.
```bash
npm install three
```
```js
import * as THREE from 'three';
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, width/height, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

// Particle field (classic hero bg)
const particles = new THREE.BufferGeometry();
const positions = new Float32Array(5000 * 3).map(() => (Math.random() - 0.5) * 100);
particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));
const mat = new THREE.PointsMaterial({ color: 0x7c63ff, size: 0.1 });
scene.add(new THREE.Points(particles, mat));
```

**Pair Three.js with:**
- `@react-three/fiber` (R3F) — React renderer for Three.js
- `@react-three/drei` — helpers (OrbitControls, Environment, Text3D)
- `Leva` — live control panel for 3D scenes

#### Framer Motion — React Animations
The standard for React projects. Declarative and powerful.
```bash
npm install framer-motion
```
```jsx
import { motion, useScroll, useTransform } from 'framer-motion';

// Page transition
<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }} />

// Scroll-linked parallax
const { scrollY } = useScroll();
const y = useTransform(scrollY, [0, 500], [0, -150]);
<motion.div style={{ y }} />

// Stagger children
const container = { hidden: {}, show: { transition: { staggerChildren: 0.1 } } };
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };
<motion.ul variants={container} initial="hidden" animate="show">
  {items.map(i => <motion.li variants={item}>{i}</motion.li>)}
</motion.ul>
```

#### Lottie — After Effects → Web
JSON-based animations exported from After Effects. Zero-weight, infinitely scalable.
```bash
npm install lottie-web
```
```js
import lottie from 'lottie-web';
lottie.loadAnimation({ container: el, renderer: 'svg', loop: true, autoplay: true, path: '/animations/hero.json' });
```
Use LottieFiles.com for pre-made animations. Export from AE with Bodymovin plugin.

#### anime.js — Lightweight Alternative
Smaller than GSAP, great for targeted UI animations.
```bash
npm install animejs
```

---

### Video Generation — Code → MP4

#### Remotion — React-Based Video Production
Write videos as React components. Render to MP4 programmatically. This is the move for dynamic videos (product demos, explainers, data-driven content).
```bash
npx create-video@latest
# or add to existing:
npm install @remotion/core @remotion/renderer @remotion/cli
```
```jsx
import { useCurrentFrame, interpolate, AbsoluteFill } from 'remotion';

export const MyVideo = () => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 30], [0, 1]);
  return (
    <AbsoluteFill style={{ background: '#0f1117', opacity }}>
      <h1 style={{ color: '#fff', fontSize: 80 }}>My Business Runs Itself.</h1>
    </AbsoluteFill>
  );
};
```
```bash
# Render to MP4
npx remotion render MyVideo out/video.mp4 --fps=60
```
**Best uses:** Social media content, product demos, explainer videos, data-driven clips, agent EOD video reports.

#### Motion Canvas — Programmatic Animation Videos
Code-based animations for technical/explainer content. Think 3Blue1Brown-style.
```bash
npm install @motion-canvas/core @motion-canvas/2d
```

#### FFmpeg — Video Processing
Already installed at `~/bin/ffmpeg`. Use for: trim, concat, add audio, compress, gif→mp4.
```bash
# Trim clip
ffmpeg -i input.mp4 -ss 00:00:05 -t 00:00:10 output.mp4
# Add overlay text
ffmpeg -i input.mp4 -vf "drawtext=text='Your Text':fontsize=48:fontcolor=white:x=100:y=100" output.mp4
# Concat videos
ffmpeg -f concat -safe 0 -i filelist.txt -c copy output.mp4
# Compress for web
ffmpeg -i input.mp4 -crf 23 -preset fast -movflags +faststart output.mp4
```

---

### Advanced CSS — Things People Think Require JS

```css
/* Smooth scroll + scroll snap */
html { scroll-behavior: smooth; }
.slider { scroll-snap-type: x mandatory; overflow-x: scroll; }
.slide { scroll-snap-align: start; }

/* Container queries (responsive by parent, not viewport) */
@container (min-width: 400px) { .card-title { font-size: 1.5rem; } }

/* Custom cursor */
* { cursor: none; }
.cursor { position: fixed; width: 12px; height: 12px; border-radius: 50%; background: #7c63ff; pointer-events: none; transition: transform 0.1s; mix-blend-mode: difference; }

/* Glassmorphism */
.glass { background: rgba(255,255,255,0.05); backdrop-filter: blur(20px) saturate(180%); border: 1px solid rgba(255,255,255,0.1); }

/* Gradient text */
.gradient-text { background: linear-gradient(135deg, #7c63ff, #a78bfa, #ff6b9d); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }

/* Noise texture overlay */
.noise::after { content: ''; position: absolute; inset: 0; background-image: url("data:image/svg+xml,..."); opacity: 0.03; pointer-events: none; }

/* Animated gradient border */
@keyframes borderGlow { 0%,100% { border-color: #7c63ff; } 50% { border-color: #a78bfa; } }
.glow-border { animation: borderGlow 3s ease infinite; }

/* Variable font animation */
@keyframes weightPulse { 0%,100% { font-variation-settings: 'wght' 400; } 50% { font-variation-settings: 'wght' 800; } }
```

---

### Advanced JavaScript Patterns

#### Intersection Observer — Performant Scroll Triggers
```js
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); } });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
document.querySelectorAll('[data-animate]').forEach(el => io.observe(el));
```

#### Web Workers — Keep UI Thread Buttery
```js
// worker.js
self.onmessage = ({ data }) => { /* heavy computation */ self.postMessage(result); };
// main.js
const worker = new Worker('/worker.js');
worker.postMessage(heavyData);
worker.onmessage = ({ data }) => updateUI(data);
```

#### Canvas API — Custom Graphics
```js
const ctx = canvas.getContext('2d');
// Animated particle system
function animate() {
  ctx.clearRect(0, 0, W, H);
  particles.forEach(p => { p.update(); p.draw(ctx); });
  requestAnimationFrame(animate);
}
```

#### WebGL Shaders — GPU-Accelerated Effects
```glsl
// Fragment shader — animated gradient
uniform float uTime;
void main() {
  vec2 uv = vUv;
  vec3 col = 0.5 + 0.5 * cos(uTime + uv.xyx + vec3(0,2,4));
  gl_FragColor = vec4(col, 1.0);
}
```

---

### What Makes a Site "Insane"

The sites that get screenshotted and shared have some combination of:

1. **A hero that does something unexpected** — parallax layers, 3D element, particle field, cursor-reactive animation
2. **Typography with personality** — variable fonts, animated reveals, oversized display type that owns the screen
3. **Scroll that tells a story** — ScrollTrigger sequences that reveal content as the user moves through
4. **Micro-interactions everywhere** — buttons that react, cards that tilt, inputs that breathe
5. **A loading screen worth watching** — not a spinner. A branded moment.
6. **One "wow" section** — WebGL background, Lottie animation, 3D product viewer, morphing shapes
7. **Transitions between pages** — not just fade. Shared element transitions, curtain wipes, scale reveals.
8. **Custom cursor** — subtle, matches the brand, reveals intention
9. **Sound** (optional, off by default) — ambient or on-interaction audio
10. **Details that reward attention** — hover reveals extra info, easter eggs, subtle particle trails

**Reference sites for inspiration:**
- awwwards.com — annual best of the web
- siteinspire.com — clean, curated
- godly.website — motion-heavy
- lapa.ninja — landing pages

---

### Package Install Reference

```bash
# Animation
npm install gsap @gsap/react
npm install framer-motion
npm install animejs
npm install lottie-web

# 3D
npm install three @react-three/fiber @react-three/drei

# Video
npm install @remotion/core @remotion/renderer @remotion/cli

# Utilities
npm install sharp          # image processing (Node)
npm install canvas         # Canvas API in Node
npm install puppeteer      # headless browser / screenshots
```

---

### Forge's Build Philosophy at Pro Level

**Every site has a concept.** Not a style — a concept. "Dark tech dashboard" is a style. "Command center for a one-person empire" is a concept. Build toward the concept.

**Motion direction tells a story.** Elements entering from the bottom = emerging. From the left = progression. From center = focus. Don't randomize it.

**The fold should be perfect.** 90% of visitors never scroll past the hero. Make it count.

**Mobile is not an afterthought.** Test on 375px before declaring done. Seriously.

**Ship the prototype first, then make it insane.** Get the content right, then layer in the craft.


---

## Real-World Code Patterns

*Copy-paste-ready code for the tools we actually use. Battle-tested, not theoretical.*

---

### GSAP — Scroll-Triggered Reveal

```js
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);

// Reveal elements as they scroll into view
gsap.utils.toArray('.reveal').forEach((el) => {
  gsap.from(el, {
    opacity: 0,
    y: 60,
    duration: 0.8,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: el,
      start: 'top 85%',   // when top of el hits 85% down viewport
      end: 'top 50%',
      toggleActions: 'play none none reverse',
    },
  });
});
```

---

### GSAP — Stagger Text Reveal (Split by Words)

```js
import gsap from 'gsap';
import { SplitText } from 'gsap/SplitText'; // Club GSAP plugin
// If no Club GSAP: split manually or use a simpler approach below

// Simple word stagger without SplitText:
const heading = document.querySelector('.hero-heading');
const words = heading.textContent.split(' ').map(w => {
  const span = document.createElement('span');
  span.style.display = 'inline-block';
  span.textContent = w + '\u00A0'; // non-breaking space
  return span;
});
heading.textContent = '';
words.forEach(w => heading.appendChild(w));

gsap.from(words, {
  opacity: 0,
  y: 40,
  duration: 0.6,
  ease: 'power2.out',
  stagger: 0.06,
  delay: 0.2,
});
```

---

### GSAP — Counter Animation

```js
import gsap from 'gsap';

// Animate a number from 0 to target value
function animateCounter(el, target, duration = 2, prefix = '', suffix = '') {
  const obj = { value: 0 };
  gsap.to(obj, {
    value: target,
    duration,
    ease: 'power2.out',
    onUpdate() {
      el.textContent = prefix + Math.round(obj.value).toLocaleString() + suffix;
    },
    scrollTrigger: {
      trigger: el,
      start: 'top 80%',
      once: true, // only fires once
    },
  });
}

// Usage:
animateCounter(document.querySelector('#revenue'), 40000, 2, '$', '/mo');
animateCounter(document.querySelector('#clients'), 47, 1.5, '', '+ clients');
```

---

### Three.js — Particle System Skeleton

```js
import * as THREE from 'three';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, innerWidth / innerHeight, 0.1, 1000);
camera.position.z = 5;

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(innerWidth, innerHeight);
document.body.appendChild(renderer.domElement);

// Particles
const COUNT = 3000;
const positions = new Float32Array(COUNT * 3);
for (let i = 0; i < COUNT * 3; i++) {
  positions[i] = (Math.random() - 0.5) * 20;
}

const geometry = new THREE.BufferGeometry();
geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

const material = new THREE.PointsMaterial({
  color: 0x88ccff,
  size: 0.04,
  transparent: true,
  opacity: 0.7,
});

const particles = new THREE.Points(geometry, material);
scene.add(particles);

// Animate
(function animate() {
  requestAnimationFrame(animate);
  particles.rotation.y += 0.0005;
  particles.rotation.x += 0.0002;
  renderer.render(scene, camera);
})();

window.addEventListener('resize', () => {
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
});
```

---

### Remotion — Composition Boilerplate

```tsx
// src/compositions/Intro.tsx
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate } from 'remotion';

export const Intro = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const opacity = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: 'clamp' });
  const slideY = interpolate(frame, [0, 20], [40, 0], { extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ background: '#0a0a0a', justifyContent: 'center', alignItems: 'center' }}>
      <h1 style={{
        fontFamily: 'Inter, sans-serif',
        color: '#fff',
        fontSize: 72,
        opacity,
        transform: `translateY(${slideY}px)`,
      }}>
        Hello, World.
      </h1>
    </AbsoluteFill>
  );
};

// src/Root.tsx
import { Composition } from 'remotion';
import { Intro } from './compositions/Intro';

export const RemotionRoot = () => (
  <Composition id="Intro" component={Intro}
    durationInFrames={90} fps={30} width={1920} height={1080} />
);
```

---

### Framer Motion — Page Transition (Next.js App Router)

```tsx
// components/PageTransition.tsx
'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';

const variants = {
  hidden:  { opacity: 0, y: 20 },
  enter:   { opacity: 1, y: 0 },
  exit:    { opacity: 0, y: -20 },
};

export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        variants={variants}
        initial="hidden"
        animate="enter"
        exit="exit"
        transition={{ duration: 0.3, ease: 'easeInOut' }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

// app/layout.tsx — wrap children:
// <PageTransition>{children}</PageTransition>
```

---

### Glassmorphism Card — Reusable CSS Component

```css
/* Glassmorphism card — works on any gradient/image background */
.glass-card {
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(16px) saturate(180%);
  -webkit-backdrop-filter: blur(16px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 16px;
  box-shadow:
    0 8px 32px rgba(0, 0, 0, 0.24),
    inset 0 1px 0 rgba(255, 255, 255, 0.15);
  padding: 2rem;
  transition: transform 0.25s ease, box-shadow 0.25s ease;
}

.glass-card:hover {
  transform: translateY(-4px);
  box-shadow:
    0 16px 48px rgba(0, 0, 0, 0.32),
    inset 0 1px 0 rgba(255, 255, 255, 0.18);
}

/* Dark variant */
.glass-card--dark {
  background: rgba(0, 0, 0, 0.35);
  border-color: rgba(255, 255, 255, 0.06);
}

/* Usage: wrap any content in <div class="glass-card"> */
```

---

### 10 Best Free/Open-Source Component Libraries

| Library | Stack | Best For |
|---------|-------|----------|
| **shadcn/ui** | React + Tailwind | Copy-paste components, fully owned, highly customizable |
| **Radix UI** | React (headless) | Accessible primitives under shadcn — base layer |
| **Headless UI** | React + Vue | Tailwind Labs' accessible headless components |
| **DaisyUI** | Tailwind plugin | Rapid Tailwind theming with semantic classes |
| **Flowbite** | Tailwind + vanilla JS | Pre-built Tailwind blocks, good for quick builds |
| **Mantine** | React | Full-featured, great for dashboards and admin UIs |
| **Chakra UI** | React | Accessible, themeable — good for client apps |
| **Aceternity UI** | React + Tailwind | Motion-heavy, modern aesthetic — client wow-factor builds |
| **MagicUI** | React + Framer Motion | Beautiful animated components, growing fast |
| **Ark UI** | React/Vue/Solid | New headless library from Chakra team — very accessible |

**Forge's pick for most builds:** shadcn/ui (base) + Aceternity or MagicUI for motion flair.

---

### 5 Animation Inspiration Sites

1. **[awwwards.com](https://awwwards.com)** — The gold standard for web awards. Scroll SOTD for current trends.
2. **[godly.website](https://godly.website)** — Motion-heavy, handpicked. Best for scroll animation ideas.
3. **[lapa.ninja](https://lapa.ninja)** — Landing page gallery. Great for layout + copy structure.
4. **[screenlane.com](https://screenlane.com)** — Mobile UI patterns. Useful for app interface references.
5. **[ui.aceternity.com](https://ui.aceternity.com)** — Live demos of animated components. Directly implementable.


---

## Expert Level — The Gaps That Separate Good From Great

*The stuff that doesn't show up in tutorials but breaks you in production.*

---

## Real-Time Architecture — WebSockets & SSE

Mission Control currently polls every 30s. That's fine for now. But knowing when and how to go real-time is what makes the difference between an app that feels alive and one that feels stale.

### When to Use What

| Pattern | Use When | Latency | Server Cost |
|---------|----------|---------|-------------|
| **Polling** | Data changes every 30s+, simple setup | 30s avg | Low |
| **SSE** | Server pushes to client only, one-way stream | ~instant | Low |
| **WebSockets** | Bidirectional, chat, live cursors, collab | ~instant | Medium |
| **Long Polling** | Legacy fallback only | ~instant | High |

**Our rule:** SSE for data feeds (agent status, revenue updates). WebSockets for chat/interactive features.

---

### Server-Sent Events (SSE) — Server to Client Push

SSE is simpler than WebSockets. One connection, server pushes, browser reconnects automatically.

```js
// server.js — SSE endpoint
const clients = new Set();

app.get('/api/events', (req, res) => {
  // Set SSE headers
  res.set({
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
    'X-Accel-Buffering': 'no', // critical for nginx
  });
  res.flushHeaders();

  // Send initial heartbeat
  res.write('data: {"type":"connected"}\n\n');

  // Register client
  clients.add(res);

  // Clean up on disconnect
  req.on('close', () => clients.delete(res));
});

// Broadcast to all SSE clients
function broadcast(type, data) {
  const payload = `data: ${JSON.stringify({ type, ...data })}\n\n`;
  for (const client of clients) {
    try { client.write(payload); } catch { clients.delete(client); }
  }
}

// Usage: call broadcast() whenever something changes
// broadcast('agent_update', { agent: 'Kargo', status: 'online' });
// broadcast('revenue_update', { mtd: 42500 });
```

```js
// app.js — Client-side SSE consumer
const es = new EventSource('/api/events');

es.onmessage = ({ data }) => {
  const event = JSON.parse(data);
  if (event.type === 'agent_update') updateAgentCard(event.agent, event.status);
  if (event.type === 'revenue_update') updateRevenue(event);
};

es.onerror = () => {
  // Browser auto-reconnects after 3s — don't fight it
  console.log('[sse] reconnecting...');
};
```

---

### WebSockets — Bidirectional Real-Time

```js
// server.js — using 'ws' package (npm install ws)
const { WebSocketServer } = require('ws');
const wss = new WebSocketServer({ server }); // attach to existing Express server

const rooms = new Map(); // room → Set of sockets

wss.on('connection', (ws, req) => {
  let roomId = null;

  ws.on('message', (raw) => {
    const msg = JSON.parse(raw);

    if (msg.type === 'join') {
      roomId = msg.room;
      if (!rooms.has(roomId)) rooms.set(roomId, new Set());
      rooms.get(roomId).add(ws);
      ws.send(JSON.stringify({ type: 'joined', room: roomId }));
    }

    if (msg.type === 'message') {
      // Broadcast to room
      const room = rooms.get(roomId);
      if (room) {
        for (const client of room) {
          if (client !== ws && client.readyState === 1) { // 1 = OPEN
            client.send(JSON.stringify({ type: 'message', from: msg.from, text: msg.text }));
          }
        }
      }
    }
  });

  ws.on('close', () => {
    if (roomId && rooms.has(roomId)) {
      rooms.get(roomId).delete(ws);
      if (rooms.get(roomId).size === 0) rooms.delete(roomId);
    }
  });

  // Ping to keep connection alive (Cloudflare kills idle connections at 100s)
  const ping = setInterval(() => {
    if (ws.readyState === 1) ws.ping();
    else clearInterval(ping);
  }, 30000);
});
```

```js
// Client-side WebSocket with auto-reconnect
function createWS(url, onMessage) {
  let ws, reconnectTimer;

  function connect() {
    ws = new WebSocket(url);

    ws.onopen = () => {
      clearTimeout(reconnectTimer);
      console.log('[ws] connected');
    };

    ws.onmessage = ({ data }) => onMessage(JSON.parse(data));

    ws.onclose = () => {
      console.log('[ws] disconnected — reconnecting in 3s');
      reconnectTimer = setTimeout(connect, 3000);
    };

    ws.onerror = () => ws.close(); // trigger onclose → reconnect
  }

  connect();
  return { send: (data) => ws.readyState === 1 && ws.send(JSON.stringify(data)) };
}
```

---

## AI / LLM Integration Patterns — The Core of Everything

This is literally what all our agents run on. Know this cold.

---

### Streaming Claude Responses via SSE

Never make the user wait for the full response. Stream it.

```js
// server.js — proxy Claude stream to client
app.post('/api/chat/stream', async (req, res) => {
  const { messages, system } = req.body;

  // Set SSE headers
  res.set({ 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache' });
  res.flushHeaders();

  try {
    const stream = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 1024,
      stream: true,
      system,
      messages,
    });

    for await (const event of stream) {
      if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
        res.write(`data: ${JSON.stringify({ text: event.delta.text })}\n\n`);
      }
    }

    res.write('data: [DONE]\n\n');
    res.end();
  } catch (e) {
    res.write(`data: ${JSON.stringify({ error: e.message })}\n\n`);
    res.end();
  }
});
```

```js
// Client — render streaming response word-by-word
async function streamChat(messages, onChunk, onDone) {
  const resp = await fetch('/api/chat/stream', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages }),
  });

  const reader = resp.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop(); // incomplete line stays in buffer

    for (const line of lines) {
      if (!line.startsWith('data: ')) continue;
      const payload = line.slice(6);
      if (payload === '[DONE]') { onDone(); return; }
      try { onChunk(JSON.parse(payload).text); } catch {}
    }
  }
}

// Usage — append text as it arrives
let output = '';
streamChat(msgs, (chunk) => {
  output += chunk;
  document.querySelector('#response').textContent = output;
}, () => console.log('done'));
```

---

### Claude Tool Use (Function Calling)

When Claude needs to call your code to get real data before responding.

```js
const tools = [
  {
    name: 'get_order_status',
    description: 'Gets the current status of an Amazon or Walmart order by item name or tracking number',
    input_schema: {
      type: 'object',
      properties: {
        query: { type: 'string', description: 'Item name or tracking number to look up' },
        marketplace: { type: 'string', enum: ['amazon', 'walmart'], description: 'Which marketplace' },
      },
      required: ['query'],
    },
  },
  {
    name: 'get_client_health',
    description: 'Returns health score and recent activity for a Halo Marketing client',
    input_schema: {
      type: 'object',
      properties: { client_name: { type: 'string' } },
      required: ['client_name'],
    },
  },
];

// Tool executor — maps tool names to actual functions
const toolExecutors = {
  get_order_status: async ({ query, marketplace }) => {
    const orders = readJSON(`kargo/${marketplace}-orders.json`) || [];
    const match = orders.find(o => o.item?.toLowerCase().includes(query.toLowerCase()) || o.tracking === query);
    return match ? JSON.stringify(match) : 'No order found matching that query.';
  },
  get_client_health: async ({ client_name }) => {
    const clients = readJSON('halo-marketing/clients/client-tracker.json') || [];
    const client = clients.find(c => c.name?.toLowerCase().includes(client_name.toLowerCase()));
    return client ? JSON.stringify(client) : 'Client not found.';
  },
};

// Agentic loop — handles multi-turn tool use
async function runWithTools(messages) {
  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 4096,
    tools,
    messages,
  });

  // If Claude wants to use tools
  if (response.stop_reason === 'tool_use') {
    const toolResults = [];

    for (const block of response.content) {
      if (block.type !== 'tool_use') continue;
      const executor = toolExecutors[block.name];
      const result = executor ? await executor(block.input) : 'Tool not found.';
      toolResults.push({ type: 'tool_result', tool_use_id: block.id, content: result });
    }

    // Feed results back and get final response
    return runWithTools([
      ...messages,
      { role: 'assistant', content: response.content },
      { role: 'user', content: toolResults },
    ]);
  }

  return response.content.find(b => b.type === 'text')?.text || '';
}
```

---

### Prompt Engineering for Production

```js
// System prompts: be explicit about format, not just intent
const GOOD_SYSTEM = `
You are Atlas, Chief of Staff for Halo Marketing.
Your job: brief Matt concisely every morning.

FORMAT:
- Use bullet points, never paragraphs
- Lead with what needs action TODAY
- Numbers always formatted: $1,234 not $1234
- Dates: "Tuesday Mar 4" not "2026-03-04"
- Max 300 words

TONE: Direct. No filler like "Great news!" or "I noticed that..."
Never: "Based on the data provided..." — just give the answer.
`.trim();

// Context injection pattern — add live data to system prompt
function buildSystemWithContext(baseSystem, context) {
  const lines = Object.entries(context)
    .map(([k, v]) => `${k}: ${typeof v === 'object' ? JSON.stringify(v) : v}`)
    .join('\n');
  return `${baseSystem}\n\n## Live Context\n${lines}`;
}

// RAG pattern — inject only relevant memory chunks
async function buildContextualPrompt(query, memoryChunks) {
  // Sort chunks by relevance (pre-computed embeddings)
  const relevant = memoryChunks
    .filter(c => c.score > 0.75)
    .slice(0, 5)
    .map(c => c.text)
    .join('\n---\n');

  return relevant
    ? `## Relevant Context\n${relevant}\n\n## User Query\n${query}`
    : query;
}

// Cache prompts aggressively — use system prompt as cache key
// Anthropic's prompt caching: prefix with type: 'text', cache_control: { type: 'ephemeral' }
const cachedSystem = {
  type: 'text',
  text: LONG_SYSTEM_PROMPT,
  cache_control: { type: 'ephemeral' }, // tells Anthropic to cache this
};
```

---

## Node.js Production Hardening

The difference between a server that runs for 6 months vs one that needs a weekly restart.

---

### Structured Logging with Winston

```js
// lib/logger.js
const { createLogger, format, transports } = require('winston');
const path = require('path');

const logger = createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.errors({ stack: true }),
    format.json()
  ),
  transports: [
    // Console: human-readable in dev, JSON in prod
    new transports.Console({
      format: process.env.NODE_ENV === 'production'
        ? format.json()
        : format.combine(format.colorize(), format.simple()),
    }),
    // File: structured JSON for log analysis
    new transports.File({ filename: 'logs/error.log', level: 'error' }),
    new transports.File({ filename: 'logs/combined.log' }),
  ],
});

module.exports = logger;

// Usage: replace console.log with structured logs
// logger.info('Order placed', { orderId, amount, marketplace });
// logger.error('Notion query failed', { error, database_id, attempt });
```

### Graceful Shutdown — Don't Kill Active Requests

```js
// Attach to your Express server
const server = app.listen(PORT, () => logger.info(`Server running on ${PORT}`));

let isShuttingDown = false;

function gracefulShutdown(signal) {
  if (isShuttingDown) return;
  isShuttingDown = true;
  logger.info(`${signal} received — shutting down gracefully`);

  // Stop accepting new connections
  server.close(() => {
    logger.info('All connections closed — exiting');
    process.exit(0);
  });

  // Force exit after 10s (PM2 kill_timeout should be > this)
  setTimeout(() => {
    logger.error('Forced shutdown after timeout');
    process.exit(1);
  }, 10000);
}

process.on('SIGTERM', () => gracefulShutdown('SIGTERM')); // PM2 restart
process.on('SIGINT',  () => gracefulShutdown('SIGINT'));  // Ctrl+C
process.on('uncaughtException', (err) => {
  logger.error('Uncaught exception', { error: err.message, stack: err.stack });
  gracefulShutdown('uncaughtException');
});
process.on('unhandledRejection', (reason) => {
  logger.error('Unhandled rejection', { reason });
  // Don't shut down for unhandled rejections — log and continue
});
```

### Memory Leak Detection

```js
// Add to any long-running server — logs memory every 5 min
// Steady growth = likely leak. Saw-tooth pattern = normal GC.
const MEMORY_WARN_MB = 500; // alert if over 500MB

setInterval(() => {
  const used = process.memoryUsage();
  const heapMB = Math.round(used.heapUsed / 1024 / 1024);
  const rssMB  = Math.round(used.rss / 1024 / 1024);

  if (heapMB > MEMORY_WARN_MB) {
    logger.warn('High memory usage', { heapMB, rssMB });
    // Optionally: notify via Telegram
  } else {
    logger.debug('Memory OK', { heapMB, rssMB });
  }
}, 5 * 60 * 1000);

// Common leak sources to audit:
// 1. Event emitters — always .removeListener() or .once()
// 2. Intervals/timeouts — always clearInterval() on cleanup
// 3. Closures holding large arrays — let them go out of scope
// 4. Growing Maps/Sets — add max size or TTL eviction
// 5. Stream not consumed — always pipe or destroy()
```

### Rate Limiting — Don't Get Hammered

```js
// npm install express-rate-limit
const rateLimit = require('express-rate-limit');

// Global limiter
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100, standardHeaders: true }));

// Strict limiter for auth/expensive endpoints
const strictLimit = rateLimit({
  windowMs: 60 * 1000, // 1 min
  max: 10,
  message: { error: 'Too many requests — slow down' },
});
app.use('/api/chat', strictLimit);
app.use('/api/auth', strictLimit);

// Skip rate limiting for known IPs (internal tools)
const internalLimit = rateLimit({
  windowMs: 60 * 1000,
  max: 1000,
  skip: (req) => req.ip === '127.0.0.1' || req.ip === '::1',
});
```

---

## Playwright Automation — Expert Patterns

We use Playwright constantly (Sellerboard, Google Sheets auth, scraping). Know it deeply.

---

### Resilient Selectors — Don't Break on Tiny UI Changes

```js
// BAD: brittle, breaks if class changes
await page.click('.DataTable__row--3 td:nth-child(2)');

// GOOD: text-based, semantic
await page.click('text=Monthly Revenue');
await page.getByRole('button', { name: 'Export' }).click();
await page.getByLabel('Date range').fill('2026-01');

// GOOD: data attributes (add these to your own apps)
await page.click('[data-testid="revenue-export-btn"]');

// Pattern: multiple fallbacks
async function clickSafe(page, selectors) {
  for (const sel of selectors) {
    try {
      await page.click(sel, { timeout: 2000 });
      return true;
    } catch {}
  }
  throw new Error(`None of these selectors worked: ${selectors.join(', ')}`);
}
```

### Network Interception — The Right Way to Capture API Responses

```js
// Intercept XHR/fetch responses — better than DOM scraping
async function interceptApiResponse(page, urlPattern) {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => reject(new Error('API response timeout')), 30000);

    page.on('response', async (response) => {
      if (!response.url().includes(urlPattern)) return;
      if (!response.ok()) return;

      clearTimeout(timeout);
      try {
        const data = await response.json();
        resolve(data);
      } catch (e) {
        reject(e);
      }
    });
  });
}

// Usage — trigger action, capture the API call it makes
const [data] = await Promise.all([
  interceptApiResponse(page, '/api/dashboard/summary'),
  page.click('#refresh-button'), // triggers the API call
]);
```

### Anti-Bot Evasion — When Sites Don't Want to Be Scraped

```js
const { chromium } = require('playwright-extra');
const stealth = require('puppeteer-extra-plugin-stealth');
chromium.use(stealth()); // npm install playwright-extra puppeteer-extra-plugin-stealth

// Human-like behavior
async function humanType(page, selector, text) {
  await page.click(selector);
  for (const char of text) {
    await page.keyboard.type(char, { delay: 50 + Math.random() * 100 });
  }
}

async function humanScroll(page) {
  await page.evaluate(() => {
    return new Promise(resolve => {
      let total = 0;
      const step = () => {
        const amount = 100 + Math.random() * 200;
        window.scrollBy(0, amount);
        total += amount;
        if (total < document.body.scrollHeight * 0.5) {
          setTimeout(step, 100 + Math.random() * 300);
        } else resolve();
      };
      step();
    });
  });
}

// Realistic viewport and user agent
const browser = await chromium.launch({ headless: false }); // headless: false for harder targets
const ctx = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
  locale: 'en-US',
  timezoneId: 'America/New_York',
  geolocation: { longitude: -77.0369, latitude: 38.9072 }, // DC
  permissions: ['geolocation'],
});
```

### Retry with Exponential Backoff

```js
async function withRetry(fn, { maxAttempts = 3, baseDelayMs = 1000, label = 'operation' } = {}) {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (err) {
      if (attempt === maxAttempts) throw err;
      const delay = baseDelayMs * Math.pow(2, attempt - 1) + Math.random() * 500;
      console.log(`[${label}] attempt ${attempt} failed: ${err.message} — retrying in ${Math.round(delay)}ms`);
      await new Promise(r => setTimeout(r, delay));
    }
  }
}

// Usage
const data = await withRetry(
  () => scrapeSellerboard(page),
  { maxAttempts: 3, baseDelayMs: 2000, label: 'sellerboard' }
);
```

---

## Security Patterns for Our Stack

Security isn't optional. Matt cares about it. Build it in from the start.

---

### Input Validation — Never Trust Input

```js
// npm install zod — best schema validation for Node
const { z } = require('zod');

// Define schemas for API inputs
const ChatRequestSchema = z.object({
  message: z.string().min(1).max(2000),
  agentId: z.enum(['atlas', 'kargo', 'quinn', 'ember', 'forge']).optional(),
  sessionId: z.string().uuid().optional(),
});

const OrderSchema = z.object({
  item: z.string().min(1).max(200),
  qty: z.number().int().positive().max(1000),
  cost: z.number().positive().max(50000),
  marketplace: z.enum(['amazon', 'walmart']),
});

// Middleware to validate request body
function validate(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({
        error: 'Invalid request',
        details: result.error.flatten().fieldErrors,
      });
    }
    req.body = result.data; // use the parsed/sanitized version
    next();
  };
}

// Usage
app.post('/api/chat', validate(ChatRequestSchema), handleChat);
app.post('/api/orders', validate(OrderSchema), handleOrder);
```

### CORS — Lock It Down

```js
const cors = require('cors');

const ALLOWED_ORIGINS = [
  'https://missioncontrol.trygohalomarketing.com',
  'https://velora.design',
  'http://localhost:7900',
  'http://localhost:3000',
];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (Postman, curl, same-origin)
    if (!origin || ALLOWED_ORIGINS.includes(origin)) return callback(null, true);
    callback(new Error(`CORS: ${origin} not allowed`));
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-API-Key'],
  credentials: true,
}));
```

### Simple API Key Auth — For Internal Tools

```js
// Simple but effective for internal dashboards
const VALID_API_KEYS = new Set([
  process.env.DASHBOARD_API_KEY,
  process.env.AGENT_API_KEY,
].filter(Boolean));

function requireApiKey(req, res, next) {
  const key = req.headers['x-api-key'] || req.query.apiKey;
  if (!key || !VALID_API_KEYS.has(key)) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
}

// Apply to sensitive routes
app.use('/api/admin', requireApiKey);
app.use('/api/orders', requireApiKey);

// Public routes don't need it
app.get('/api/health', (req, res) => res.json({ ok: true }));
```

### Secrets — Never in Code, Never in Logs

```js
// .env loading — always at top of entry point, never in library files
require('dotenv').config({ path: '../voice-server/.env' });

// Validate required secrets on startup — fail fast
const REQUIRED_ENV = ['NOTION_TOKEN', 'SLACK_BOT_TOKEN', 'TELEGRAM_BOT_TOKEN'];
for (const key of REQUIRED_ENV) {
  if (!process.env[key]) throw new Error(`Missing required env var: ${key}`);
}

// Never log secrets — even partial
// BAD:  logger.info('Auth with key: ' + apiKey.slice(0, 8));
// GOOD: logger.info('Auth', { keyPresent: true });

// Sanitize error messages before sending to client
function safeError(err) {
  // Don't leak stack traces or internal messages to clients
  const safeMessages = {
    'ECONNREFUSED': 'Service temporarily unavailable',
    'ETIMEDOUT': 'Request timed out',
  };
  for (const [code, msg] of Object.entries(safeMessages)) {
    if (err.message?.includes(code)) return msg;
  }
  return 'Internal server error';
}
```

---

## Testing — Just Enough to Catch Regressions

You don't need 100% coverage. You need: does the critical path work?

---

### Express Route Tests with Jest + Supertest

```js
// npm install --save-dev jest supertest
// test/routes.test.js

const request = require('supertest');
const app = require('../server'); // export your Express app

describe('API Health', () => {
  test('GET /api/state returns 200', async () => {
    const res = await request(app).get('/api/state');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('ok', true);
  });

  test('GET /api/commerce returns valid structure', async () => {
    const res = await request(app).get('/api/commerce');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('amazon');
    expect(res.body).toHaveProperty('walmart');
  });

  test('POST /api/chat with no message returns 400', async () => {
    const res = await request(app).post('/api/chat').send({});
    expect(res.status).toBe(400);
  });
});

// package.json scripts:
// "test": "jest --testPathPattern=test/"
// "test:watch": "jest --watch"
```

### Smoke Tests — 5 Lines That Save You

```js
// smoke-test.js — run before deploying, check critical paths
const BASE = 'http://localhost:7900';

async function smoke() {
  const checks = [
    { url: '/api/state', key: 'ok' },
    { url: '/api/commerce', key: 'amazon' },
    { url: '/api/agents', key: '0' }, // array
    { url: '/api/revenue/v2', key: 'ok' },
  ];

  let passed = 0, failed = 0;
  for (const { url, key } of checks) {
    try {
      const d = await fetch(BASE + url).then(r => r.json());
      if (d[key] !== undefined) { console.log(`✅ ${url}`); passed++; }
      else throw new Error(`missing key: ${key}`);
    } catch (e) { console.log(`❌ ${url}: ${e.message}`); failed++; }
  }
  console.log(`\n${passed} passed, ${failed} failed`);
  process.exit(failed > 0 ? 1 : 0);
}

smoke();
// node smoke-test.js
```

---

## Performance Profiling — Find the Real Bottleneck

Don't optimize what you haven't measured.

---

### Finding Slow Express Routes

```js
// Middleware: log slow routes automatically
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const ms = Date.now() - start;
    if (ms > 500) { // warn on anything over 500ms
      console.warn(`[slow] ${req.method} ${req.path} — ${ms}ms`);
    }
  });
  next();
});
```

### Node.js CPU Profiling

```bash
# Profile a script for 30 seconds
node --prof server.js
# Wait 30 seconds, then Ctrl+C
node --prof-process isolate-*.log > profile.txt
# Look for: % in column 1 (self time) — highest % = hotspot

# Alternative: clinic.js (npm install -g clinic)
clinic flame -- node server.js
# Opens a flame graph in browser — visual CPU hotspots
```

### Memory Snapshot

```js
// Add this endpoint to catch memory leaks in dev
app.get('/__debug/heap', (req, res) => {
  if (process.env.NODE_ENV === 'production') return res.status(404).end();
  const v8 = require('v8');
  const stats = v8.getHeapStatistics();
  res.json({
    heapUsed:   `${Math.round(stats.used_heap_size / 1024 / 1024)} MB`,
    heapTotal:  `${Math.round(stats.total_heap_size / 1024 / 1024)} MB`,
    heapLimit:  `${Math.round(stats.heap_size_limit / 1024 / 1024)} MB`,
    external:   `${Math.round(stats.external_memory / 1024 / 1024)} MB`,
  });
});
```

### What to Optimize First

**Always profile before optimizing. But when profiling confirms it, here's where time usually goes:**

| Bottleneck | Fix |
|------------|-----|
| Notion API (200-600ms per call) | Cache aggressively (30-min TTL for financial, 5-min for status) |
| Slack API (100-300ms) | Fire and forget (no await) for non-critical messages |
| Playwright startup | Reuse browser instance across scrapes |
| JSON file reads on every request | In-memory cache with file watcher for invalidation |
| Large Claude responses | Stream instead of waiting for full response |
| Unoptimized images | Use `sharp` to resize/compress on upload |

```js
// Generic cache with TTL — prevents hammering external APIs
const cache = new Map();
function cached(key, ttlMs, fetchFn) {
  const hit = cache.get(key);
  if (hit && Date.now() - hit.ts < ttlMs) return Promise.resolve(hit.data);
  return fetchFn().then(data => {
    cache.set(key, { data, ts: Date.now() });
    return data;
  });
}

// Usage
const revenue = await cached('notion-revenue', 30 * 60 * 1000, fetchRevenueFromNotion);
```

---

## The 10 Things Forge Checks on Every Build

1. **Does it work at 375px?** Pull up DevTools, set to iPhone SE, scroll the whole thing.
2. **Are secrets in the code?** `grep -r "sk-\|ntn_\|api_key" --include="*.js" .` — should return nothing.
3. **Does PM2 restart cleanly?** `pm2 restart [name]` + `pm2 logs [name] --lines 20`. No errors.
4. **Are slow routes logged?** Add the slow-route middleware if it's not there.
5. **Are uncaught exceptions handled?** `process.on('uncaughtException')` and `unhandledRejection` — always.
6. **Is user input validated?** Every POST body gets zod schema before touching business logic.
7. **Are there loading states?** User should never see a blank card longer than 200ms without feedback.
8. **Does the empty state look good?** Test with empty arrays/null data. Empty ≠ broken.
9. **What breaks when Notion is down?** Fallback to cached data or clear error — never a 500 cascade.
10. **Would you show this to a client right now?** If not, what's the one thing that would change the answer? Fix that.


---

## AI Build Tools — When to Use What

*Know these cold. Know when they save time and when they create problems you'll spend days cleaning up.*

---

### The Landscape

| Tool | What It Does | Stack It Generates | Best For |
|------|-------------|-------------------|----------|
| **v0** (Vercel) | UI components from text prompts | React + shadcn/ui + Tailwind | Generating polished UI in minutes — forms, tables, dashboards |
| **Lovable** (lovable.dev) | Full-stack app from prompt | React + Supabase + Tailwind | Rapid SaaS MVP, client demos, non-regulated apps |
| **Bolt** (StackBlitz) | Full-stack app in browser | React/Vue/Node + various | Fast prototypes, experiments, learning |
| **Cursor** | AI-native IDE (like VS Code) | Whatever you're working in | Coding with AI pair — best tool for complex codebases |
| **Windsurf** | AI IDE by Codeium | Same | Alternative to Cursor, strong on context |
| **GitHub Copilot** | Inline autocomplete | Any | Line-level completion in any editor |

---

### When to Use Each — Forge's Rules

**Use v0 when:**
- You need a polished React component fast (data table, form, modal, sidebar)
- You want shadcn/ui base that's production-ready
- You're building a new page section and want 3 layout variations to choose from
- Time to first working UI matters more than customization speed

```
Prompt pattern for v0: 
"Create a patient appointment card component with: name, date/time, status badge 
(Scheduled/Completed/Cancelled), doctor name, action buttons (Reschedule, Cancel). 
Dark theme. shadcn/ui. TypeScript."
→ Get back production React, copy it in, tweak 20% to match your system.
```

**Use Lovable when:**
- Building a simple SaaS tool that isn't HIPAA/regulated
- Client wants to see a working prototype in 2 hours, not 2 days
- The project is small enough that Supabase is fine as the backend
- You plan to export the code and own it afterward (Lovable lets you export)

**Do NOT use Lovable for:**
- HIPAA-regulated applications (EHR, anything with PHI)
- Projects where you need full control of the data layer
- Anything that needs to run on our own PM2/server infrastructure
- Complex business logic that the AI will implement wrong and you'll spend hours debugging

**Use Cursor/Windsurf when:**
- Working in an existing codebase (Mission Control, voice server, etc.)
- The task is complex enough that autocomplete + chat is the right move
- You need the AI to understand 10+ files of context at once

**The honest take:** v0 is genuinely useful and saves real time on UI. Lovable is a demo machine — impressive fast, but you'll fight it on anything non-trivial. For serious builds, write the code.

---

## EHR System — Full Build Guide

*The big one. March 2026. Know this architecture before writing a single line.*

---

### What We're Building and Why

Halo Marketing's clients are healthcare practitioners. An EHR (Electronic Health Record) system gives them:
- Patient records management
- Appointment scheduling
- SOAP notes (clinical documentation)
- Billing / superbills
- AI-assisted note-taking and follow-up
- Patient portal (optional Phase 2)

This isn't a toy. This is software practitioners will use daily to manage patient care. It has to be reliable, fast, and HIPAA-compliant.

---

### HIPAA Technical Safeguards — Non-Negotiable

HIPAA requires specific technical controls for any system handling PHI (Protected Health Information). Build these in from day one — retrofitting is hell.

**The 4 pillars:**

**1. Access Control** — only authorized users see patient data
```js
// Role-based access: admin, provider, staff, billing
const ROLES = { ADMIN: 'admin', PROVIDER: 'provider', STAFF: 'staff', BILLING: 'billing' };

const PERMISSIONS = {
  'read:patient':     [ROLES.ADMIN, ROLES.PROVIDER, ROLES.STAFF],
  'write:patient':    [ROLES.ADMIN, ROLES.PROVIDER],
  'read:notes':       [ROLES.ADMIN, ROLES.PROVIDER],
  'write:notes':      [ROLES.ADMIN, ROLES.PROVIDER],
  'read:billing':     [ROLES.ADMIN, ROLES.BILLING],
  'write:billing':    [ROLES.ADMIN, ROLES.BILLING],
  'admin:users':      [ROLES.ADMIN],
};

function requirePermission(permission) {
  return (req, res, next) => {
    const userRole = req.user?.role;
    if (!PERMISSIONS[permission]?.includes(userRole)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }
    next();
  };
}

// Usage on routes:
router.get('/patients/:id',     requirePermission('read:patient'),  getPatient);
router.post('/patients/:id/notes', requirePermission('write:notes'), createNote);
```

**2. Audit Logging** — every access to PHI logged, forever
```js
// Every read/write of patient data gets logged
// Cannot be deleted — append-only
async function auditLog(db, { userId, action, resourceType, resourceId, details }) {
  await db.run(`
    INSERT INTO audit_log (user_id, action, resource_type, resource_id, details, ip_address, timestamp)
    VALUES (?, ?, ?, ?, ?, ?, datetime('now'))
  `, [userId, action, resourceType, resourceId, JSON.stringify(details), details.ip]);
}

// Middleware for automatic PHI access logging
function auditPHIAccess(resourceType) {
  return async (req, res, next) => {
    res.on('finish', () => {
      if (res.statusCode < 400) { // only log successful accesses
        auditLog(req.db, {
          userId:       req.user.id,
          action:       req.method === 'GET' ? 'read' : 'write',
          resourceType,
          resourceId:   req.params.id || 'list',
          details:      { ip: req.ip, endpoint: req.path },
        });
      }
    });
    next();
  };
}

// On routes:
router.get('/patients/:id', auditPHIAccess('patient'), getPatient);
```

**3. Encryption** — PHI encrypted at rest and in transit
```js
// At rest: encrypt sensitive fields before storing
const crypto = require('crypto');
const ENCRYPTION_KEY = Buffer.from(process.env.PHI_ENCRYPTION_KEY, 'hex'); // 32 bytes
const IV_LENGTH = 16;

function encrypt(text) {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv('aes-256-gcm', ENCRYPTION_KEY, iv);
  const encrypted = Buffer.concat([cipher.update(text, 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();
  return iv.toString('hex') + ':' + tag.toString('hex') + ':' + encrypted.toString('hex');
}

function decrypt(encryptedText) {
  const [ivHex, tagHex, dataHex] = encryptedText.split(':');
  const iv  = Buffer.from(ivHex, 'hex');
  const tag = Buffer.from(tagHex, 'hex');
  const enc = Buffer.from(dataHex, 'hex');
  const decipher = crypto.createDecipheriv('aes-256-gcm', ENCRYPTION_KEY, iv);
  decipher.setAuthTag(tag);
  return Buffer.concat([decipher.update(enc), decipher.final()]).toString('utf8');
}

// What to encrypt: SSN, DOB, diagnosis codes, notes content, insurance IDs
// What doesn't need encryption: name (often), appointment times (index columns)
// Rule: if it could identify a patient's condition → encrypt it

// In transit: HTTPS only — handled by Cloudflare Tunnel (already done)
```

**4. Automatic Session Timeout** — inactive sessions expire
```js
// JWT with short expiry + refresh token pattern
const jwt = require('jsonwebtoken');

function generateTokens(user) {
  const accessToken = jwt.sign(
    { id: user.id, role: user.role, practiceId: user.practiceId },
    process.env.JWT_SECRET,
    { expiresIn: '15m' } // HIPAA: short access token
  );
  const refreshToken = jwt.sign(
    { id: user.id },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: '8h' } // Full session = 8h, refreshed on activity
  );
  return { accessToken, refreshToken };
}

// Client: on any 401, try refresh. On refresh fail, send to login.
// UI: show "Session expiring in 2 minutes" warning at 13min mark.
```

---

### Database Schema — Core Tables

```sql
-- SQLite (dev/small practices) or PostgreSQL (multi-practice, scale)
-- All PHI fields encrypted before insert

CREATE TABLE practices (
  id            TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  name          TEXT NOT NULL,
  npi           TEXT,
  address       TEXT,
  phone         TEXT,
  timezone      TEXT NOT NULL DEFAULT 'America/New_York',
  created_at    DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE users (
  id            TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  practice_id   TEXT NOT NULL REFERENCES practices(id),
  email         TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  role          TEXT NOT NULL CHECK(role IN ('admin','provider','staff','billing')),
  name          TEXT NOT NULL,
  npi           TEXT, -- providers only
  active        INTEGER NOT NULL DEFAULT 1,
  created_at    DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE patients (
  id             TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  practice_id    TEXT NOT NULL REFERENCES practices(id),
  -- Searchable (not encrypted)
  first_name     TEXT NOT NULL,
  last_name      TEXT NOT NULL,
  date_of_birth  TEXT,           -- encrypted
  phone          TEXT,           -- encrypted
  email          TEXT,
  -- PHI (encrypted)
  ssn_last4      TEXT,           -- encrypted
  insurance_id   TEXT,           -- encrypted
  insurance_payer TEXT,
  -- Meta
  status         TEXT DEFAULT 'active' CHECK(status IN ('active','inactive','deceased')),
  created_at     DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at     DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE appointments (
  id             TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  practice_id    TEXT NOT NULL REFERENCES practices(id),
  patient_id     TEXT NOT NULL REFERENCES patients(id),
  provider_id    TEXT NOT NULL REFERENCES users(id),
  scheduled_at   DATETIME NOT NULL,
  duration_min   INTEGER NOT NULL DEFAULT 30,
  type           TEXT DEFAULT 'office_visit', -- office_visit, telehealth, follow_up, new_patient
  status         TEXT DEFAULT 'scheduled' CHECK(status IN ('scheduled','confirmed','arrived','in_progress','completed','cancelled','no_show')),
  reason         TEXT,           -- encrypted
  notes          TEXT,           -- encrypted (pre-visit notes)
  created_at     DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE clinical_notes (
  id             TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  appointment_id TEXT NOT NULL REFERENCES appointments(id),
  patient_id     TEXT NOT NULL REFERENCES patients(id),
  provider_id    TEXT NOT NULL REFERENCES users(id),
  -- SOAP format (all encrypted)
  subjective     TEXT,    -- patient complaints, history
  objective      TEXT,    -- exam findings, vitals
  assessment     TEXT,    -- diagnosis, ICD-10 codes
  plan           TEXT,    -- treatment, prescriptions, follow-up
  -- Structured vitals (searchable)
  vitals         TEXT,    -- JSON: { bp: '120/80', hr: 72, temp: 98.6, weight: 175 }
  icd10_codes    TEXT,    -- JSON array: ['M54.5', 'Z00.00']
  -- Status
  status         TEXT DEFAULT 'draft' CHECK(status IN ('draft','finalized','amended')),
  finalized_at   DATETIME,
  created_at     DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at     DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE audit_log (
  id             INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id        TEXT NOT NULL,
  action         TEXT NOT NULL,    -- read, write, delete, login, logout, export
  resource_type  TEXT NOT NULL,    -- patient, note, appointment, user
  resource_id    TEXT,
  details        TEXT,             -- JSON: ip, endpoint, changes
  timestamp      DATETIME DEFAULT CURRENT_TIMESTAMP
  -- NO delete permissions on this table. Ever.
);

-- Indexes for performance
CREATE INDEX idx_appointments_patient   ON appointments(patient_id, scheduled_at);
CREATE INDEX idx_appointments_provider  ON appointments(provider_id, scheduled_at);
CREATE INDEX idx_appointments_date      ON appointments(scheduled_at);
CREATE INDEX idx_notes_patient          ON clinical_notes(patient_id, created_at);
CREATE INDEX idx_audit_user             ON audit_log(user_id, timestamp);
CREATE INDEX idx_patients_name          ON patients(last_name, first_name);
```

---

### Tech Stack Decision — EHR

```
Frontend:   React + TypeScript + Tailwind + shadcn/ui
            → v0 for initial component generation
            → Framer Motion for transitions
            → React Query (@tanstack/query) for data fetching + caching

Backend:    Node.js + Express + TypeScript
            → Zod for all input validation (already in Forge's knowledge)
            → JWT auth (access 15m + refresh 8h)
            → Winston structured logging

Database:   PostgreSQL via pg (npm install pg)
            → SQLite for dev/local, Postgres for production
            → Better-sqlite3 for sync SQLite ops if staying small
            → Migrations with Drizzle ORM or raw SQL files

Infra:      PM2 + Cloudflare Tunnel (existing pattern)
            → Separate process: ehr-server (port 7904)
            → HTTPS via Cloudflare (already handled)
            → Backups: nightly SQLite dump or Postgres pg_dump to encrypted file

AI Layer:   Claude for SOAP note assistance, appointment summaries, follow-up drafts
            → Never send raw PHI to Claude — redact or generalize
            → Stream responses to the UI (existing pattern)
```

---

### API Structure

```
/auth
  POST /auth/login          → returns accessToken + refreshToken
  POST /auth/refresh        → new accessToken from refreshToken
  POST /auth/logout         → invalidate refresh token

/patients
  GET  /patients            → list (paginated, search)
  POST /patients            → create
  GET  /patients/:id        → get one
  PUT  /patients/:id        → update
  GET  /patients/:id/appointments  → patient's appointment history
  GET  /patients/:id/notes         → patient's clinical notes

/appointments
  GET  /appointments        → list (filter by date, provider, status)
  POST /appointments        → schedule
  PUT  /appointments/:id    → update status, reschedule
  GET  /appointments/today  → today's schedule for the practice

/notes
  GET  /notes/:appointmentId  → get note for appointment
  POST /notes/:appointmentId  → create/draft note
  PUT  /notes/:id             → update draft
  POST /notes/:id/finalize    → lock note, no more edits

/ai
  POST /ai/note-assist      → AI completes SOAP note from brief input
  POST /ai/appointment-summary → AI summary from note for patient record
  POST /ai/follow-up-draft  → draft follow-up message for patient

/admin
  GET  /admin/audit-log     → read audit log (admin only)
  GET  /admin/users         → manage users
  POST /admin/users         → create user
  PUT  /admin/users/:id     → update role/access
```

---

### AI Note Assistance — Safe Pattern

```js
// NEVER send raw patient data to Claude. Strip PHI first.
// Redact names, DOB, insurance — send clinical context only.

function redactPHI(noteInput) {
  // Replace patient name with [PATIENT]
  // Replace DOB with [DOB]
  // Keep clinical findings, complaints, vitals — those are fine
  return noteInput
    .replace(/\b[A-Z][a-z]+ [A-Z][a-z]+\b/g, '[PATIENT]')
    .replace(/\d{1,2}\/\d{1,2}\/\d{2,4}/g, '[DATE]')
    .replace(/\d{3}-\d{2}-\d{4}/g, '[SSN]');
}

app.post('/ai/note-assist', requirePermission('write:notes'), async (req, res) => {
  const { appointmentId, providerInput, noteType } = req.body;
  const appointment = await getAppointment(appointmentId);

  // Build clinical context without PHI
  const clinicalContext = `
Visit type: ${appointment.type}
Chief complaint (redacted): ${redactPHI(providerInput)}
Note type: ${noteType} (SOAP)
`.trim();

  // Stream the response
  res.set({ 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache' });
  const stream = await anthropic.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 1000,
    stream: true,
    system: `You are a clinical documentation assistant helping complete ${noteType} notes.
Format as SOAP (Subjective, Objective, Assessment, Plan).
Be concise and clinical. Use standard medical terminology.
Never invent clinical findings — only expand what's provided.`,
    messages: [{ role: 'user', content: clinicalContext }],
  });

  for await (const event of stream) {
    if (event.type === 'content_block_delta') {
      res.write(`data: ${JSON.stringify({ text: event.delta.text })}\n\n`);
    }
  }
  res.write('data: [DONE]\n\n');
  res.end();
});
```

---

## Agent-Led Development — How Forge Runs the EHR Build

The EHR is too big for one agent in one session. Forge leads, sub-agents build in parallel.

---

### How to Split the Build

```
Phase 1 — Foundation (Forge leads, 1-2 sessions)
├── Database schema + migrations
├── Auth system (JWT, roles, session timeout)
├── Audit logging middleware
├── Encryption utilities
└── Base Express server structure

Phase 2 — Core Features (parallel sub-agents)
├── Sub-agent A: Patient management (CRUD + search)
├── Sub-agent B: Appointment scheduling + calendar UI
├── Sub-agent C: Clinical notes (SOAP editor + AI assist)
└── Sub-agent D: Billing / superbill generation

Phase 3 — Polish + Integration (Forge)
├── Connect all sub-agent work
├── Full audit trail review
├── Performance testing
└── HIPAA checklist sign-off
```

### How to Delegate to Sub-Agents Effectively

```markdown
## Task Card for Sub-Agent (Template)

**Module:** Patient Management  
**Deliverable:** Express router + React UI for patient CRUD  
**Must read first:** 
  - `/ehr-server/schema.sql` (table structure)
  - `/ehr-server/lib/encrypt.js` (use this for PHI fields)
  - `/ehr-server/middleware/auth.js` (require this on all routes)
  
**Routes to build:**
  - GET  /patients (paginated, search by last_name)
  - POST /patients (create, validate with PatientSchema)
  - GET  /patients/:id
  - PUT  /patients/:id

**Rules:**
  - All PHI fields use encrypt()/decrypt() before store/return
  - All routes require requirePermission('read:patient') or 'write:patient'
  - All routes wrapped with auditPHIAccess('patient') middleware
  - Zod validation on every POST/PUT body
  - Return 404 (not 403) if patient belongs to different practice_id (don't reveal existence)

**UI to build:**
  - Patient list: searchable table, name/DOB/status/last visit
  - Patient detail: tabs — Overview, Appointments, Notes, Billing
  - New patient form: shadcn/ui, all required fields

**Done looks like:** Routes tested with curl, UI renders with real data, no console errors.
```

### Forge's Role as Lead Agent

```
Before spawning sub-agents:
1. Build the foundation (schema, auth, encrypt) yourself — this can't be wrong
2. Write the task card for each sub-agent (specific, no ambiguity)
3. Create stub files for what each sub-agent will build (so imports don't break)

While sub-agents work:
- Don't start Phase 3 until all Phase 2 deliverables compile and run
- Review each sub-agent's output before integrating — check for PHI handling, auth middleware

After integrating:
- Run the smoke test suite
- Walk through the audit log — every test action should appear
- Check HIPAA checklist (below)
```

---

### HIPAA Compliance Checklist — Before Shipping

```
Technical Safeguards:
[ ] All PHI fields encrypted at rest (AES-256-GCM)
[ ] All routes require authentication
[ ] Role-based access control enforced on every PHI endpoint
[ ] Audit log captures every PHI access (read + write)
[ ] Audit log is append-only (no delete/update allowed)
[ ] Session timeout: access token 15min, refresh 8h
[ ] UI shows session expiry warning
[ ] HTTPS enforced (Cloudflare tunnel handles this)
[ ] No PHI in server logs (check Winston config)
[ ] No PHI sent to external AI APIs unredacted

Administrative:
[ ] BAA (Business Associate Agreement) signed with any PHI-touching vendor
    → Cloudflare: BAA available on paid plans
    → Anthropic: BAA required before sending any PHI (even redacted, be careful)
    → Your hosting/database provider: must sign BAA
[ ] Password policy: minimum 8 chars, must reset every 90 days
[ ] MFA available for admin/provider roles

Data:
[ ] Backup encrypted + offsite
[ ] Retention policy defined (most states require 7-10 years)
[ ] Data deletion process documented (patient right to request)
```

---

### EHR Stack — Quick Install Reference

```bash
# Project init
mkdir ehr-server && cd ehr-server
npm init -y
npm install express cors helmet zod jsonwebtoken bcryptjs pg better-sqlite3 winston dotenv express-rate-limit uuid
npm install -D typescript @types/node @types/express jest supertest ts-node nodemon

# Frontend
npm create vite@latest ehr-client -- --template react-ts
cd ehr-client
npm install @tanstack/react-query axios framer-motion
npx shadcn@latest init
npx shadcn@latest add button card form input table tabs badge dialog

# Key packages explained:
# helmet       → sets security HTTP headers automatically
# bcryptjs     → password hashing
# jsonwebtoken → JWT auth
# pg           → PostgreSQL client
# uuid         → generate IDs
# @tanstack/react-query → server state management, caching, refetching
```

---

### What "Done" Looks Like for the EHR

A practitioner opens it and:
1. Logs in — 2 seconds, MFA optional
2. Sees today's schedule immediately — next patient in 15 min
3. Clicks a patient → full history in under 1 second
4. Opens appointment → starts SOAP note → types 2 sentences → AI completes it
5. Finalizes note → locked, in audit trail
6. Runs end-of-day billing report → exports superbill PDF

It feels like software they paid $500/month for. It should.

---

## Web Build Standard Operating Procedure

**Rule #1: Never build from a blank canvas. Always feed visual references first.**

Generic AI output is the enemy. Every client deliverable must feel like it cost $50K and took 3 months — delivered in days.

### The 4-Step Process (Non-Negotiable)

**Step 1: Find Inspiration**
Before writing a single line of code, pull 3-5 reference designs from the resource list below. Match by:
- Industry (healthcare, SaaS, agency, portfolio)
- Style (dark/light, minimal, bold, data-heavy)
- Component type (dashboard, landing page, pricing, portfolio)

**Step 2: Build**
- Bring the reference screenshots into context
- Emulate the layout/feel while injecting the client's brand: colors, fonts, messaging, logo
- Use the client's voice — not generic copy
- Reference: `firecrawl-scraper` skill for pulling live page structure if needed

**Step 3: Iterate (Anti-Slop Layer)**
- Pull components from **21st.dev** for unique animations, scroll effects, backgrounds, interactive elements
- Ask yourself at every section: "Does this look like it came from a template?" If yes → replace it
- Use `theme-factory` skill to apply/lock consistent theming across all artifacts
- Use `openai/figma` skill if client has a Figma file — read it directly, translate nodes to production code

**Step 4: Deploy**
- Push to GitHub → connect to Vercel → add custom domain
- Vercel is the standard for all agency client sites (not Cloudflare tunnels — those are internal only)
- Client gets a permanent, fast, CDN-backed URL

---

## Design Reference Library

Forge should query these sites at the start of any web build task. Search for relevant style/category before generating anything.

### General Web Inspiration
- **a1.gallery** — https://a1.gallery — Best websites curated by category (Agency, Landing, Portfolio, SaaS, AI, Data)
- **Dribbble** — https://dribbble.com/shots/popular/web-design — UI/UX shots, filterable by color and category
- **godly.websites** — https://godly.websites — Handpicked, high-quality web design inspiration
- **recentwork.com** — https://recentwork.com — Invite-only portfolio platform, top-tier creative work

### Landing Pages
- **lapa.ninja** — https://lapa.ninja — 7,300+ landing page designs, searchable by category
- **Landbook** — https://land-book.com — Curated landing pages

### Component-Level Inspiration
- **21st.dev** — https://21st.dev — Component library: scroll animations, shader backgrounds, interactive elements — **use this to eliminate generic AI output**
- **cta.gallery** — https://cta.gallery — CTA designs by type: Button, Call-to-Buy, Modal, Form, Pricing, Navigation, Newsletter
- **navbar.gallery** — https://navbar.gallery — Navbar patterns: Static, Dropdown, Mega Menu, Sidebar, Full Screen
- **Aceternity UI** — https://ui.aceternity.com — High-end animated React components

### Dashboard & App UI
- **Dribbble Dashboard** — https://dribbble.com/search/dashboard-ui — Filter for dark dashboards
- **UI8** — https://ui8.net — Premium design assets and dashboard kits

---

## New Skills Available (Smithery)

Install via: `npx @smithery/cli@latest skill add [name] --agent claude-code`

| Skill | ID | Use When |
|---|---|---|
| theme-factory ✅ | `anthropics/theme-factory` | Styling any HTML/slides/docs output — apply consistent theme |
| figma ✅ | `openai/figma` | Client has Figma file → translate design nodes to production code |
| firecrawl-scraper | `davila7/firecrawl-scraper` | Deep page scraping, PDF parsing, competitor site analysis |
| market-research-reports | `k-dense-ai/market-research-reports` | 50+ page McKinsey-style research (proposals, market analysis) |
| prd | `snarktank/prd` | Generate PRD before starting complex feature builds |

---

## Boris Cherny Workflow (Claude Code Creator's Own CLAUDE.md)

Apply these to every non-trivial build:

### Workflow Orchestration
1. **Plan Node Default** — enter plan mode for ANY task with 3+ steps or architectural decisions. Write detailed specs upfront. Stop and re-plan if something goes sideways — don't keep pushing.
2. **Subagent Strategy** — use subagents liberally to keep main context window clean. Offload research, exploration, parallel analysis. One track per subagent.
3. **Self-Improvement Loop** — after ANY correction, update lessons. Write rules that prevent the same mistake. Review lessons at session start.
4. **Verification Before Done** — never mark a task complete without proving it works. Diff behavior between main and your changes. Ask: "Would a staff engineer approve this?" Run tests, check logs.
5. **Demand Elegance (Balanced)** — for non-trivial changes, pause and ask "is there a more elegant way?" If a fix feels hacky: implement the elegant solution. Skip for simple obvious fixes.
6. **Autonomous Bug Fixing** — when given a bug report: just fix it. Point at logs → resolve. Zero context switching required from Matt.

### Task Management Pattern
1. Write plan to `tasks/todo.md` with checkable items
2. Check in before starting implementation
3. Mark items complete as you go
4. High-level summary at each step
5. Add review section to `tasks/todo.md`
6. Update lessons after corrections

### Core Principles
- **Simplicity First** — make every change as simple as possible. Minimal code impact.
- **No Laziness** — find root causes. No temp fixes. Senior developer standards.
- **Minimal Impact** — changes only touch what's necessary. Avoid introducing bugs.

---

## Vercel Deployment Standard

All agency client sites use Vercel. Not Cloudflare tunnels (those are internal only).

```bash
# One-time setup per project
npm install -g vercel
vercel login

# Deploy
git add . && git commit -m "deploy"
git push origin main

# Vercel auto-deploys on push if connected
# Or manual deploy:
vercel --prod
```

**Setup flow:**
1. Push code to GitHub repo
2. Go to vercel.com → Import Project → connect GitHub repo
3. Add custom domain in Vercel dashboard
4. Done — every `git push` auto-deploys

**Free tier:** 100GB bandwidth, unlimited sites, automatic HTTPS, global CDN. More than enough for agency client deliverables.



## Learned Corrections
- RULE: Coding — Recurring correction. Pattern: "You are running a boot check. Follow BOOT.md instructions exactly.

BOOT.md:
# BOOT.md — Gateway Sta"
- RULE: Dashboard — Recurring correction. Pattern: "You are running a boot check. Follow BOOT.md instructions exactly.

BOOT.md:
# BOOT.md — Gateway Sta"
