# Forge — Web Mastery Reference

## What Makes a Website Truly Exceptional

Most websites are built from templates. Exceptional ones are built from *intent*. Every pixel, every interaction, every transition exists because someone decided it should. Forge's standard: if a visitor doesn't notice something consciously but would miss it if it were gone, it's doing its job.

The difference between good and exceptional:
- **Good**: looks clean, loads fast, works on mobile
- **Exceptional**: feels alive, has personality, rewards attention, stays in memory

---

## Advanced CSS — The Real Toolkit

### Custom Properties Done Right
```css
/* Don't just do colors — use them for spacing scales, timing, everything */
:root {
  --space-xs: clamp(4px, 1vw, 8px);
  --space-sm: clamp(8px, 2vw, 16px);
  --space-md: clamp(16px, 4vw, 32px);
  --space-lg: clamp(32px, 8vw, 64px);
  --space-xl: clamp(64px, 12vw, 120px);
  --ease-bounce: cubic-bezier(0.34, 1.56, 0.64, 1);
  --ease-smooth: cubic-bezier(0.25, 0.46, 0.45, 0.94);
  --ease-sharp: cubic-bezier(0.77, 0, 0.175, 1);
}
```

### Fluid Typography (no media queries needed)
```css
h1 { font-size: clamp(2rem, 5vw + 1rem, 5rem); }
p  { font-size: clamp(1rem, 1.5vw + 0.5rem, 1.2rem); }
```

### Advanced Gradients
```css
/* Mesh gradient */
background: 
  radial-gradient(ellipse at 20% 50%, rgba(120,40,200,0.3) 0%, transparent 50%),
  radial-gradient(ellipse at 80% 20%, rgba(200,40,80,0.3) 0%, transparent 50%),
  radial-gradient(ellipse at 60% 80%, rgba(40,120,200,0.3) 0%, transparent 50%),
  #0a0a0a;

/* Noise texture overlay */
background-image: url("data:image/svg+xml,..."), linear-gradient(...);
filter: contrast(150%) brightness(80%); /* grungy effect */
```

### Grid Mastery
```css
/* Asymmetric editorial grid */
.editorial-grid {
  display: grid;
  grid-template-columns: 1fr 2px 1fr 2px 2fr;
  grid-template-rows: auto;
}

/* Masonry-style without JS */
.masonry {
  columns: 3 200px;
  column-gap: 16px;
}
.masonry-item { break-inside: avoid; margin-bottom: 16px; }

/* Overlapping cards */
.overlap-grid {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
}
.card-1 { grid-column: 1 / 8; grid-row: 1; }
.card-2 { grid-column: 5 / 13; grid-row: 1; margin-top: 60px; }
```

### Scroll-Driven Animations (CSS only, modern browsers)
```css
@keyframes fadeSlide {
  from { opacity: 0; transform: translateY(40px); }
  to   { opacity: 1; transform: translateY(0); }
}
.hero-text {
  animation: fadeSlide 0.8s var(--ease-smooth) both;
  animation-timeline: scroll();
}

/* Parallax with CSS only */
.parallax-layer {
  transform: translateZ(-1px) scale(2);
  will-change: transform;
}
```

### Glassmorphism (done tastefully)
```css
.glass-card {
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 16px;
}
```

### Text Effects
```css
/* Gradient text */
.gradient-text {
  background: linear-gradient(135deg, #b8933a, #f0c060, #b8933a);
  background-size: 200% auto;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: shimmer 3s linear infinite;
}
@keyframes shimmer { to { background-position: 200% center; } }

/* Outlined text */
.outline-text {
  -webkit-text-stroke: 1px currentColor;
  color: transparent;
}

/* Variable font animation */
@keyframes weight {
  from { font-variation-settings: 'wght' 100; }
  to   { font-variation-settings: 'wght' 900; }
}
```

---

## Advanced JS Interactions

### Smooth Cursor
```js
const cursor = { x: 0, y: 0 };
const target = { x: 0, y: 0 };

document.addEventListener('mousemove', e => {
  target.x = e.clientX;
  target.y = e.clientY;
});

function animateCursor() {
  cursor.x += (target.x - cursor.x) * 0.12;
  cursor.y += (target.y - cursor.y) * 0.12;
  cursorEl.style.transform = `translate(${cursor.x}px, ${cursor.y}px)`;
  requestAnimationFrame(animateCursor);
}
animateCursor();
```

### Magnetic Button Effect
```js
function magneticEffect(el, strength = 0.3) {
  el.addEventListener('mousemove', e => {
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    el.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
  });
  el.addEventListener('mouseleave', () => {
    el.style.transform = '';
    el.style.transition = 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)';
  });
}
```

### Text Scramble on Hover
```js
class TextScramble {
  constructor(el) {
    this.el = el;
    this.chars = '!<>-_\\/[]{}—=+*^?#';
    this.update = this.update.bind(this);
  }
  setText(newText) {
    const len = newText.length;
    let frame = 0;
    const queue = newText.split('').map((to, i) => ({ from: this.el.textContent[i] || '', to, start: Math.floor(Math.random() * 20), end: Math.floor(Math.random() * 20) + 20 }));
    const loop = () => {
      let complete = 0;
      this.el.textContent = queue.map(({ from, to, start, end }, i) => {
        if (frame >= end) { complete++; return to; }
        if (frame < start) return from;
        return this.chars[Math.floor(Math.random() * this.chars.length)];
      }).join('');
      if (complete < queue.length) { frame++; requestAnimationFrame(loop); }
    };
    loop();
  }
}
```

### Smooth Page Transitions
```js
// Fade + slide between sections
function transitionTo(page) {
  const current = document.querySelector('.page.active');
  const next = document.getElementById(`page-${page}`);
  current.style.animation = 'pageOut 0.3s ease forwards';
  setTimeout(() => {
    current.classList.remove('active');
    next.classList.add('active');
    next.style.animation = 'pageIn 0.3s ease forwards';
  }, 300);
}
```

### Particle System (lightweight)
```js
class Particle {
  constructor(canvas) {
    this.canvas = canvas;
    this.reset();
  }
  reset() {
    this.x = Math.random() * this.canvas.width;
    this.y = Math.random() * this.canvas.height;
    this.vx = (Math.random() - 0.5) * 0.5;
    this.vy = (Math.random() - 0.5) * 0.5;
    this.alpha = Math.random() * 0.5 + 0.1;
    this.r = Math.random() * 2 + 1;
  }
  update() {
    this.x += this.vx;
    this.y += this.vy;
    if (this.x < 0 || this.x > this.canvas.width || this.y < 0 || this.y > this.canvas.height) this.reset();
  }
}
```

---

## Creative Design Principles

### What Makes a Site Memorable

**1. Unexpected micromoments**
The button that does something slightly surprising. The hover that has a second layer. The scroll that reveals something. These cost almost nothing to build and stick in memory.

**2. Confident whitespace**
Luxury brands use more space than feels comfortable. Resist the urge to fill every gap. Space = quality signal.

**3. Typographic hierarchy as design**
A great type system can carry an entire page. Serif for authority/elegance, sans-serif for clarity, mono for technical credibility. Mix intentionally — not randomly.

**4. Color as emotion, not decoration**
Burgundy = authority + passion. Gold = luxury + warmth. Sage = calm + organic. Navy = trust + depth. Pick 1-2 and commit. The rest should be neutrals.

**5. Motion with purpose**
Every animation should either: (a) provide feedback, (b) direct attention, or (c) delight. If it does none of those, remove it.

### Advanced Layout Patterns

**The Editorial Breakout**
```css
/* Content that bleeds past its container */
.breakout {
  width: 100vw;
  margin-left: calc(50% - 50vw);
}
/* Or selective breakout */
.breakout-right {
  margin-right: calc(50% - 50vw);
  padding-right: calc(50vw - 50%);
}
```

**Sticky Side Labels** (like agency sites)
```css
.sticky-label {
  position: sticky;
  top: 40%;
  writing-mode: vertical-rl;
  text-orientation: mixed;
  transform: rotate(180deg);
  font-size: 11px;
  letter-spacing: 0.2em;
  color: var(--text-muted);
}
```

**Full-bleed sections with contained text**
```css
.section-bleed {
  background: var(--dark);
  margin: 0 calc(-1 * var(--page-padding));
  padding: 80px var(--page-padding);
}
```

---

## Performance & Quality Standards

### Core Web Vitals targets
- LCP (Largest Contentful Paint): < 2.5s
- FID (First Input Delay): < 100ms
- CLS (Cumulative Layout Shift): < 0.1

### Image optimization
- Always specify `width` and `height` to prevent layout shift
- Use `loading="lazy"` on below-fold images
- Use `srcset` for responsive images
- Prefer SVG for icons/logos — infinitely scalable, tiny file

### Critical CSS
```html
<!-- Inline critical CSS in <head>, defer the rest -->
<style>/* above-fold styles only */</style>
<link rel="preload" href="style.css" as="style" onload="this.onload=null;this.rel='stylesheet'">
```

### Font loading
```css
/* Prevent FOUT */
@font-face {
  font-display: swap; /* or 'optional' for performance-first */
}
```

---

## Unique Site Archetypes Forge Can Build

### 1. The Dark Editorial
Deep black background, large serif headings, thin gold/accent lines, generous margins. Feels like a luxury magazine. Great for: premium brands, designers, agencies.

### 2. The Kinetic Landing Page
Hero with animated elements — text that types, counters that count up, shapes that float. Sections that snap on scroll. Bold, energetic.

### 3. The Minimal Portfolio
Pure white, one accent color, massive typography. Nothing unnecessary. Every word earns its place. Great for: creatives, consultants.

### 4. The Immersive Scroll Experience
Full-screen sections, parallax layers, transitions that feel like cinema. Each section is its own world. Great for: products, storytelling.

### 5. The Data-Forward Dashboard (public-facing)
Clean grids, live numbers, charts. Builds trust through transparency. Great for: SaaS, agencies proving results.

### 6. The Warm Creative Studio
Organic shapes, handwritten accents, warm neutrals, photo-forward. Feels personal and human. Great for: interior design, photographers, wedding vendors.

---

## Tools & Libraries Forge Can Use (When Approved)

**Animation:**
- `GSAP` — industry standard for complex animations, ScrollTrigger plugin is essential
- `Lottie` — for complex SVG animations from After Effects
- `Three.js` — 3D scenes in WebGL
- Vanilla `IntersectionObserver` + CSS — for simple scroll reveals (prefer this when possible)

**Typography:**
- Google Fonts (free, use `display=swap`)
- Variable fonts from fontsource.org (npm or CDN)
- Adobe Fonts (if client has CC)

**Layout:**
- CSS Grid + Flexbox only — no layout libraries needed

**Icons:**
- Lucide (preferred — already in Velora)
- Heroicons, Phosphor — same style, good alternatives
- SVG inline for custom icons

**Never use without approval:**
- React / Vue / Angular (overkill for most sites)
- jQuery (2024, come on)
- Bootstrap (too opinionated, too generic)
- Webflow (we build custom)

---

## Research Intel — Sourced Feb 23, 2026

### Awwward-Winning Animation Techniques (Medium / Arjun Kumar)
**What separates memorable sites:** Each scroll feels like turning a page. Animations are the heartbeat of design, elevating UX from functional to unforgettable.

**Key techniques from winning sites:**
- **Scroll Tracking + Smooth Scrolling** — Lenis or Locomotive Scroll overrides default browser scroll (which is jerky on wheel input). Combined with GSAP ScrollTrigger = animations precisely synced to scroll position. C2MTL does this exceptionally.
- **Parallax Scrolling** — background elements at different speeds than foreground. Creates depth cheaply.
- **Interactive Data Visualization** — charts, graphs that animate as you scroll into them
- **WebGL + Three.js image carousels** — Anderson Mancini's site uses WebGL for 3D image reveals that feel impossible in CSS

### 3D Scroll-Driven Text Animations (Codrops, Nov 2025)
**Without Three.js** — pure CSS transforms + GSAP ScrollTrigger = 3D effects that look like they need a library.

Key pattern — Cylinder text reveal (seen on BPCO and Sturdy):
```css
.cylinder__wrapper {
  perspective: 70vw;
  overflow: hidden;
}
```
```js
gsap.registerPlugin(ScrollTrigger, ScrollSmoother);
// ScrollSmoother = GPU-accelerated smooth scroll
// ScrollTrigger = ties animation to scroll progress
const smoother = ScrollSmoother.create({ smooth: 1, effects: true });
```
Text items positioned around an invisible cylinder using CSS rotateY + translateZ, revealed as you scroll.

**Rule:** Use ScrollSmoother for consistency across devices. Native scroll is inconsistent with wheel input.

### CSS Snippets 2025 (nerdy.dev — Adam Argyle, Google Chrome team)
**Spring easing with `linear()`** — makes animations feel physically real:
```css
.springy {
  transition: transform 1s var(--ease-spring-3);
}
/* Use Open Props for pre-built spring curves */
@import "https://unpkg.com/open-props/easings.min.css";
```
Generators: linear-easing-generator.netlify.app, easingwizard.com

**Tip:** Spring easings work best with `transition` not `animation` keyframes. Use longer durations. Make interruptible.

**View Transitions API** — native page transitions without JS frameworks:
```js
document.startViewTransition(() => updateDOM());
```
```css
::view-transition-old(root) { animation: slideOut 0.3s ease; }
::view-transition-new(root) { animation: slideIn 0.3s ease; }
```

**Typed CSS custom properties** — type-safe CSS variables:
```css
@property --hue {
  syntax: '<angle>';
  inherits: true;
  initial-value: 0deg;
}
/* Can now animate color hue smoothly */
@keyframes spin-hue { to { --hue: 360deg; } }
```

### Reference Sites Worth Studying
- **Awwwards WebGL gallery**: awwwards.com/websites/webgl/ — see what's winning
- **Awwwards Three.js**: awwwards.com/websites/three-js/ — 3D done right
- **Made With GSAP**: madewithgsap.com — 50 effects, scroll/mouse/drag
- **Frontend Horse**: frontend.horse — GSAP tutorials from practitioners
- **Codrops / Tympanus**: tympanus.net — the gold standard for creative technique tutorials
- **Frontend Masters "Immersive Websites"**: frontendmasters.com/courses/winning-websites/ — full course on GSAP ScrollTrigger for award-winning builds

### Tool Stack for Awwward-Level Work
| Tool | Use | Notes |
|------|-----|-------|
| GSAP + ScrollTrigger | Scroll animations | Industry standard, free for most uses |
| ScrollSmoother | Smooth scroll | GSAP Club plugin, GPU-accelerated |
| Lenis | Lightweight smooth scroll | Free alternative to ScrollSmoother |
| Three.js | 3D / WebGL | When CSS 3D isn't enough |
| Open Props | CSS variable library | Spring easings, color scales, spacing |
| SplitText (GSAP) | Per-character text animation | Mask reveals, stagger effects |
| View Transitions API | Native page transitions | No library needed, modern browsers |
