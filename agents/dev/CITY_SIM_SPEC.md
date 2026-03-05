# Autonomous City Simulation — Full Spec
*Brainstormed: March 3, 2026*

## The Vision
A living city that no one controls. Citizens wake up, go to work, fall in love, 
get into arguments, build businesses, move neighborhoods — all on their own.
Not scripted. Not random. **Emergent.** 

The city learns. Citizens remember. Relationships form and break.
Buildings get built because demand exists. Shops close because no one goes.
Crime happens because someone is desperate. Communities form because people are lonely.

Nobody told them to. It just happens.

---

## What Makes This Different From Every Other City Sim

| Every other sim | This |
|----------------|------|
| Citizens follow preset routines | Citizens have goals + make decisions |
| Events are scripted | Events emerge from agent interactions |
| City "grows" on a schedule | City grows because citizens need things |
| NPCs have fixed relationships | Relationships evolve based on interactions |
| AI controls everything | AI IS everything — each citizen thinks |

---

## Architecture: Three Layers

### Layer 1 — The World (Rendering + Physics)
**Stack: Three.js + WebGL**
- Procedurally generated city grid: blocks, streets, zones
- Buildings rendered as 3D boxes (low-poly, stylized — not realistic)
- Cars/pedestrians as small meshes moving along paths
- Day/night cycle (affects behavior — people sleep, nightlife activates)
- Camera: isometric top-down, zoomable, pannable
- Runs in browser at 60fps targeting 500-1000 active agents

### Layer 2 — The Simulation Engine (Rules + Physics)
**Stack: JavaScript simulation loop, no framework**

The sim runs on a tick system (1 tick = ~1 sim-minute):
- Each tick: every agent evaluates their state + picks an action
- Pathfinding: A* algorithm on the road grid
- Zoning: Residential / Commercial / Industrial / Parks / Mixed
- Economy: jobs have wages, stores have prices, rent exists
- Time: 24h cycle, 7-day week, seasons (affects mood, behavior)
- Random events: weather, accidents, power outages, festivals

### Layer 3 — The Brain (AI Decision Making)
**This is the magic part.**

Two tiers of intelligence:

**Tier 1 — Fast/cheap decisions (every tick, 1000 agents):**
Rule-based engine. Each citizen has a "needs vector":
```
needs = {
  hunger: 0-100,
  sleep: 0-100,  
  social: 0-100,
  money: 0-100,
  purpose: 0-100,  // job satisfaction
  safety: 0-100
}
```
Actions are chosen based on highest unfulfilled need:
- Hunger > 70 → pathfind to nearest restaurant/grocery
- Sleep > 80 → go home
- Social < 30 → seek out friend/go to bar/park
- Money < 20 → look for work / ask for help
- Purpose < 40 → consider changing jobs / starting business

**Tier 2 — Deep decisions (Claude Haiku, triggered rarely):**
Life events that need real reasoning:
- Should I leave my job? (evaluates relationships, finances, satisfaction)
- Do I like this person? (builds from interaction history)
- Should I start a business here? (evaluates neighborhood demand)
- How do I feel about what just happened? (emotional processing)

Haiku call cost: ~$0.001 each. 1000 citizens, 1 deep decision/day = ~$1/day.
This is the line between simulation and life.

---

## Citizens — What Makes Each One Real

Each citizen is an entity with:

### Identity (set at spawn)
```javascript
citizen = {
  id: uuid,
  name: "Marcus Chen",
  age: 34,
  personality: {
    openness: 0.7,       // tries new things
    conscientiousness: 0.5,  // reliability, work ethic
    extraversion: 0.3,   // introvert — prefers small groups
    agreeableness: 0.8,  // kind, trusting
    neuroticism: 0.4     // emotional stability
  },
  backstory: "...",      // short paragraph, generated once by Claude Haiku
  skills: ["coding", "cooking"],
  home: buildingId,
  job: jobId || null,
  money: 2400,
}
```

### Memory (builds over time)
- Last 50 significant events stored
- Relationship map: {citizenId: {trust, affection, history[]}}
- Places visited, experiences, trauma, joy
- This is what makes the AI decisions meaningful — Haiku reads the memory

### Daily Life Loop
```
wake up → check needs → decide action → pathfind → arrive → interact → update state → repeat
```
Simple. But multiplied by 1000 citizens with different personalities and memories = emergent complexity.

---

## Relationships — The Social Graph

Citizens interact when they:
- Work at the same place
- Live near each other
- Visit the same locations repeatedly
- Get introduced by mutual friends
- Random encounters (coffee shop, street corner)

Each interaction updates the relationship:
- Shared positive experience → +affection
- Conflict over resource → -trust  
- Repeated contact → familiarity
- Shared trauma (flood, fire, crime) → deep bond
- Ghosting/ignoring → -affection over time

Relationships enable:
- **Friendships**: visit each other, share resources, emotional support
- **Romance**: form households, have children (new citizens spawned)
- **Business partnerships**: co-found shops, share employees
- **Feuds**: avoid each other, spread negative reputation, conflict escalation
- **Community**: neighborhoods develop identity from relationships

---

## The Economy — Self-Regulating

**Jobs exist because buildings need workers.**
Buildings get built because citizens need them.
Businesses succeed or fail based on actual demand.

Cycle:
1. Citizens need food → demand for restaurants
2. Entrepreneur citizen notices demand → builds restaurant
3. Restaurant needs workers → job posts appear
4. Citizens with low money/purpose take jobs
5. Restaurant succeeds → entrepreneur earns money → maybe expands
6. Too many restaurants → some fail → workers laid off → ripple effects

No city planner. No preset economy. Just supply, demand, and individual decisions.

**Currency flows:**
- Citizens earn wages from jobs
- Spend on: food, housing, entertainment, goods
- Pay taxes to city (city funds public services)
- City funds: roads, parks, schools, police, emergency services
- Poverty → crime → neighborhood decline → property values drop → businesses leave

---

## Events — Emergent, Not Scripted

**Spontaneous events** emerge from agent states:
- 3 citizens argue over parking → heated confrontation → witnesses take sides
- Business owner can't make payroll → lays off workers → 5 citizens suddenly unemployed
- New park built → neighborhood social scores rise → more kids born in area → school needed

**Random catalysts** (seeded, not scripted):
- Natural disaster (flood zone, earthquake) → mass displacement → city must adapt
- Economic boom in one sector → workers migrate → housing shortage → rent spikes
- Charismatic citizen gains following → community leader → political dynamics emerge
- Disease outbreak → behavioral changes → economic slowdown

**Ripple effects** are the point. One event causes ten. Ten cause a hundred. The city breathes.

---

## Visual Design

**Style: Low-poly isometric. Like a living painting.**
- Color palette shifts with time of day (warm dawn, bright day, blue dusk, neon night)
- Buildings have visible activity: lights in windows, smoke from restaurants, cars outside
- Citizens are tiny but distinguishable — color-coded by mood/need state
- Traffic density visible on roads
- Green areas pulse gently (parks, trees)
- Crime zones have visual tension (darker, fewer people)

**UI overlay:**
- Click any citizen → see their name, needs, current thought, relationship map
- Click any building → see occupants, owner, economic status
- Time controls: pause, 1x, 5x, 10x speed
- Stats panel: population, GDP, happiness, crime, employment
- Heatmap mode: overlay shows wealth, happiness, crime, density

---

## Technical Build Plan

### Phase 1 — The World (~1 week)
- Three.js scene: city grid, basic buildings, roads
- Camera controls: pan, zoom, rotate
- Day/night lighting cycle
- 50 citizens walking around randomly (no AI yet, just pathfinding)

### Phase 2 — The Simulation (~2 weeks)
- A* pathfinding on road grid
- Needs vector for each citizen
- Rule-based decisions (no AI, pure rules)
- Basic economy: jobs, wages, spending
- 200 citizens, stable 60fps

### Phase 3 — The Intelligence (~2 weeks)
- Claude Haiku integration for deep decisions
- Memory system (last N events stored)
- Relationship graph building from interactions
- Emergent events from agent collisions
- 500 citizens

### Phase 4 — Social Dynamics (~1 week)
- Romance → household formation → children
- Business founding by citizen-entrepreneurs  
- Community/neighborhood identity forming
- Crime emerging from economic desperation
- News system: major city events broadcast

### Phase 5 — Polish + Scale (~1 week)
- UI: click-to-inspect citizens/buildings
- Heatmaps, stats panel
- Time controls
- 1000 citizens at 60fps (WebWorkers for sim, Three.js for render)
- Shareable city seed (same seed = same starting conditions)

---

## Token/Cost Estimate

| Component | Cost |
|-----------|------|
| Haiku for citizen deep decisions | ~$1/day with 1000 citizens |
| Haiku for event narration | ~$0.50/day |
| Initial backstory generation (1000 citizens) | ~$2 one-time |
| **Total running cost** | **~$1.50/day** |

Build cost (Codex + Claude Code):
- Phase 1-2: ~$15 (pure code, no AI calls)
- Phase 3-5: ~$20 (more complex)
- **Total build: ~$35, ~7 weeks**

---

## What This Could Become

1. **Art project** — livestream the city, watch it evolve, name citizens
2. **Research tool** — study emergent social dynamics, economics
3. **Game** — let users inject themselves as citizens, own property, build businesses
4. **Product** — sell city seeds, let people set parameters, watch their city grow
5. **Demo for AI Systems Agency** — "this is what we build" — the most impressive demo possible

The AI Systems Agency angle is real: 
*"We build systems that think. Here's a city where every resident has a mind."*

---

## What We Need to Start

1. ✅ Three.js knowledge (in CODING_SKILLS.md)
2. ✅ Claude Haiku integration (already built in voice server)
3. ✅ Agent architecture (we have 13 agents — same pattern)
4. ✅ Codex + Claude Code for the build
5. ⬜ Dedicated project directory: `/Users/mattbender/Projects/city-sim/`
6. ⬜ 30-min scoping call with Matt to decide: browser-first or Electron?
7. ⬜ Art direction: low-poly minimalist or more detailed?

---

## The North Star

When this is done, you should be able to:
1. Open the city
2. Click on a random citizen named "Sofia Reyes"
3. See that she's a 28-year-old baker, slightly lonely, recently had a falling out with her neighbor
4. Watch her walk to the market, bump into someone she met at the park last week
5. Watch them talk. Watch her mood shift.
6. Close the tab. Come back tomorrow. 
7. Find out Sofia opened a bakery. Her neighbor apologized. She's happy.

Nobody told her to do any of that. She just lived.

**That's the goal.**
