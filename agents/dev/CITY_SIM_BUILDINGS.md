# City Sim — Buildings: Generation + Construction System
*Every building is unique. You can build anything. Watch it rise brick by brick.*

---

## WORLD GENERATION: Every City is Different

Buildings are NOT the same across worlds. The seed determines everything.

```
Seed 4829 → corner of Oak + 5th → "The Blue Corner Cafe" (narrow 2-story, teal facade)
Seed 7731 → same corner       → "Meridian Coffee Roasters" (wide single story, brick red)
Seed 1002 → same corner       → vacant lot (no one built here yet)
```

What the seed determines per building:
- Name (procedurally generated from neighborhood identity + type)
- Size (footprint + floors, within type range)
- Architectural style (modern, brick, glass, industrial, art deco...)
- Color (from the Rod Hunt neighborhood palette for that zone)
- Age (older buildings in established neighborhoods, new in growth areas)
- Condition (0-100, tied to owner's investment behavior)
- Current tenant / use
- History (how many owners, what it used to be)

The same building types exist in every world (cafes, apartments, factories)
but no two buildings are ever identical. You could play for 2 years and never
see the same building twice across different seeds.

### Historic Buildings
In older neighborhoods, some buildings have been there since the city started.
They have plaques. Citizens know them. "The Reyes Building has been on this
corner for 40 years." Demolishing one pisses off the whole neighborhood.

---

## THE BUILD MENU (User-Initiated Construction)

As a player, you can commission new buildings. Browse by category,
preview the impact, place on a lot, watch it rise.

### Building Categories

**Residential**
```
Starter Home      — 1-2 floors, 1 family unit, 7 sim-days to build
Townhouse Row     — 3 floors, 4 units, 12 sim-days
Mid-Rise Apt      — 8 floors, 24 units, 3 sim-weeks
High-Rise Tower   — 30 floors, 120 units, 6 sim-weeks
Luxury Condos     — 12 floors, premium, 4 sim-weeks
```

**Commercial**
```
Corner Shop       — 1 floor, 5 sim-days
Restaurant Space  — 2 floors, 8 sim-days
Office Building   — 6 floors, 2.5 sim-weeks
Retail Mall       — 3 floors wide, 4 sim-weeks
Hotel             — 15 floors, 5 sim-weeks
Skyscraper        — 40+ floors, 8 sim-weeks
```

**Industrial**
```
Warehouse         — wide, 1-2 floors, 10 sim-days
Factory           — large footprint, 3 sim-weeks
Distribution Hub  — huge, 4 sim-weeks
```

**Civic**
```
Park              — no construction, instant (landscaping crew: 3 days)
School            — 3 sim-weeks, unlocks child education system
Hospital          — 4 sim-weeks, increases health capacity
Police Station    — 2 sim-weeks, reduces crime in radius
Fire Station      — 10 sim-days
Community Center  — 2 sim-weeks, boosts social scores in area
Library           — 2 sim-weeks, increases education + purpose
```

**Infrastructure**
```
Power Plant       — 6 sim-weeks, massive, smoke stack visible
Solar Farm        — 4 sim-weeks (lots of panels = visible installation)
Water Tower       — 2 sim-weeks
Bus Depot         — 3 sim-weeks
Transit Station   — 4 sim-weeks, changes neighborhood immediately
Bridge            — 5 sim-weeks, massive construction event
```

### Placement System
1. Select building type from menu
2. Ghost footprint follows your cursor over the city
3. Eligible lots highlight green (vacant + correct zoning)
4. Hover shows: cost, construction time, projected impact on neighborhood
5. Click to place → budget deducted → construction begins

---

## CONSTRUCTION: BRICK BY BRICK

This is the centerpiece. You watch it happen in real time (at sim speed).

### The 7 Phases (all visible in Three.js)

**Phase 1: Site Preparation** (1-2 sim-days)
```
What you see:
- Existing structure (if any) demolished → debris particles
- Survey crew: 2 workers with measuring equipment, placing markers
- Fencing appears around the perimeter (orange safety mesh)
- Signage: "[BUILDING NAME] — COMING SOON"
- Earth-moving vehicles arrive if needed

What can go wrong:
- Surveyor finds underground obstruction → 1-day delay
- Neighbor files complaint → 2-day planning review
```

**Phase 2: Excavation + Foundation** (3-7 sim-days for large buildings)
```
What you see:
- Excavator digs down (pit visible below grade level)
- Foundation walls formed: concrete poured
- Workers in hard hats, high-vis vests moving around site
- Concrete mixer trucks arriving on schedule
- Foundation slab appears, cures overnight (workers leave, site quiet)

What can go wrong:
- Rain: concrete can't pour → weather delay
- Ground conditions poor → engineers called → replanning → 3-day delay
- Concrete delivery delayed (supply chain issue) → stall
```

**Phase 3: Steel Frame / Structure** (varies: 1 day for small, 1 week/3 floors for tall)
```
What you see:
- For tall buildings: crane arrives (massive visual change to skyline)
- Steel beams lifted into place, connected by ironworkers
- Each day: 1-3 new floors of skeleton appear
- You can see through the frame — city visible through the bones
- Workers on every floor, tiny figures against the structure
- At 5pm: workers leave, bare skeleton stands in the evening light

What can go wrong:
- High winds: crane operations stop (>25mph wind = no crane)
- Worker injury: site shutdown for safety review (1-2 days)
- Steel delivery delayed: frames halt mid-floor
- One of the workers is a citizen you know — they might mention it at home
```

**Phase 4: Exterior — Walls, Windows, Facade** (1-2 sim-weeks)
```
What you see:
- Scaffolding wraps the entire building (aluminum grid mesh)
- Exterior panels/brick/glass installed floor by floor
- Building starts looking like itself — style emerges
- Windows installed: building changes from skeleton to structure
- Color becomes visible for the first time
- Night: scaffolding lit by work lights, building glows

What can go wrong:
- Material substitution: cheaper facade chosen if budget running low
  → affects property value, aesthetics, neighborhood character
- Scaffolding collapse event (rare, triggers safety investigation)
- Weather: painting/sealing work stops in rain
```

**Phase 5: Interior + Systems** (1 sim-week)
```
What you see:
- Exterior mostly done, but work lights visible inside at all hours
- Specialized crews: electricians, plumbers, HVAC workers coming and going
- Delivery trucks: appliances, fixtures, materials
- Building is closed — you can't see inside yet
- Quieter on the outside but active within

What can go wrong:
- Electrical inspection failure: rewiring required → 3-day delay
- Plumbing issue discovered → replanning → cost overrun
- HVAC worker shortage → contractor scrambles to find replacements
```

**Phase 6: Finishing + Inspection** (2-4 sim-days)
```
What you see:
- Scaffolding removal — this is dramatic. Building revealed fully for first time.
- Landscaping crew: trees planted, sidewalk finished, signage installed
- Clean-up crew sweeps site
- City inspector visits → pass or fail
  - Fail: red tag on door, work continues, 3-5 day delay
  - Pass: certificate of occupancy issued → opening can proceed

What can go wrong:
- Inspector is corrupt → 'pass' for money OR unfair fail for rivals
- Final punch list items (small fixes) extend timeline
- Tenant backs out during construction → building opens vacant
```

**Phase 7: Opening** (1 sim-day — the payoff)
```
For residential:
- Moving trucks arrive, families carry boxes inside
- Lights go on in apartments, curtains appear
- Children play outside on day 1
- New residents start integrating into neighborhood

For commercial:
- GRAND OPENING event
- Staff arrives early, sets up
- Curious citizens from the neighborhood come by
- News spreads through the social graph
- Owner posts a sign, stands at the door greeting people
- First review written by a citizen

For civic:
- Ribbon cutting (mayor + council, if you built it as city)
- Community gathers — it's an event
- Immediate effect on neighborhood metrics
```

---

## CONSTRUCTION WORKERS AS REAL CITIZENS

Workers are pulled from the unemployed pool. They have names, personalities, lives.

```javascript
construction_crew = {
  foreman:     { citizenId: "james-okafor", skill: 87, wage: $28/hr },
  workers: [
    { citizenId: "marco-reyes",  skill: 62, wage: $22/hr, role: "framer" },
    { citizenId: "dev-patel",    skill: 45, wage: $18/hr, role: "laborer" },
    // ...more workers based on project size
  ],
  schedule: "7am-5pm weekdays, 7am-12pm Saturday",
  weatherSensitive: ["framing", "concrete", "crane"],
  safetyRecord: 94
}
```

**They have real lives:**
- Marco works the construction site 7am-5pm, goes home to Sofia and the kids
- If Sofia's bakery is struggling and Marco's wages are low → tension at home
- If Marco gets injured on site → medical event, family stress, income gap
- Dev Patel is young, this is his first real job → gaining skill points daily
- The foreman James is 52, knows everyone, mentors the younger workers
- They talk to each other → relationships form on the job site

**Their days:**
- 6:30am: leave home
- 7:00am: arrive at site, sign in
- 12:00pm: lunch break (some go to nearby cafe — foot traffic boost)
- 5:00pm: sign out, go home
- Weekend: optional overtime (at 1.5x pay, some accept, some don't based on personality)

**Strike mechanics:**
If wages too low OR site conditions unsafe → workers complain →
if not addressed → work slowdown → possible walkout →
project delays → cost overruns → city/developer pressure →
negotiate: wage increase OR project stalls indefinitely

---

## VISUAL DETAIL (Three.js Implementation)

### Progressive Geometry Building
Each phase is a different mesh state:

```javascript
building_mesh_states = {
  0: null,                          // empty lot
  1: { foundation: true },         // concrete slab at grade
  2: { foundation, frame: floor_1_only },
  3: { foundation, frame: floors_1_to_N },  // grows per day
  4: { foundation, frame_full, exterior: partial },
  5: { full_exterior, scaffolding: false },
  6: { complete, lights_on: false },
  7: { complete, lights_on: true, occupied: true }
}
```

**Per-day update:**
Every sim-morning, construction buildings update their mesh.
If frame phase: add one more floor of geometry.
This means you literally watch a 30-floor tower rise over 10 sim-days.

### Scaffolding Mesh
Thin aluminum-colored lattice wrapping the building exterior.
Goes up in Phase 3, removed in Phase 6.
The reveal moment (scaffolding drops) is cinematic — building color + style
exposed fully for the first time.

### Crane
For buildings 6+ floors: a tower crane spawns next to the building.
- Rotates slowly in real time
- Arm extends above the building under construction
- Scale relative to building height
- Removed once exterior complete
- Multiple cranes on the skyline = city in growth mode (beautiful)

### Worker Animations
- Small capsule figures (Rod Hunt character scale)
- Phase-appropriate clustering: foundation = near base, framing = all levels, interior = gone
- Lunch break: figures walk toward nearest food vendor at 12pm
- End of day: figures walk toward roads, disperse home

### Night on a Construction Site
- Work lights: warm amber glow at top and corners of scaffolding
- Crane beacon: red blinking light at peak
- Interior lights during Phase 5 (interior work at odd hours)
- Quiet, atmospheric — one of the best visuals in the sim

---

## THE EXPERIENCE OF WATCHING IT

Day 1: You drop a hotel on an empty lot by the waterfront.
        Workers arrive. Site gets fenced off. A sign goes up.

Day 3: Foundation poured. It's just a concrete rectangle. But it's yours.

Day 7: Steel frame rising. The crane appeared overnight. It changes the skyline.
        You can see through the bones of the building. Workers are tiny specks.

Day 18: Scaffolding wrapped. Windows being installed. The building is starting to
         have a face. You can see what it will be.

Day 28: Scaffolding drops.
         The reveal.
         Glass and steel, catching the morning light.
         People on the street stop and look up.

Day 30: Ribbon cutting. The city's first luxury hotel opens.
         48 new jobs. Citizens from across the city apply.
         The neighborhood changes. Property values rise.
         A tourist district starts to form.

None of this was scripted. You placed the building.
The city responded.

---

## DEMOLITION (the other direction)

Buildings can also come down.

```
Natural: aging building reaches critical condition → collapse risk →
  city condemned it → demolition order → controlled demolition crew →
  debris cleared → vacant lot again

Planned: you (or a developer) decide to tear down and build bigger →
  occupants must relocate → relocation events (displaced families, closed businesses)
  → people remember "there used to be a diner here" in their memory
  → demolition crew → rubble phase → clean lot

Disaster: fire, explosion, storm damage → partial or total collapse →
  emergency demolition → hazmat if industrial building →
  neighborhood mood crashes

Historic building demolition: massive protest event,
  citizens with high agreeableness try to block it,
  mayor takes political damage,
  memory of the building persists in citizens who knew it
```

---

## LANDMARK BUILDINGS (late-game unlock)

After a city reaches certain milestones, special builds unlock:

```
Stadium:         crowds on game days, massive foot traffic, noise events
Concert Hall:    evening events, culture score, attracts artists
University:      graduates skilled citizens, attracts young people
Airport:         tourism, trade, new citizen arrivals
Skyscraper HQ:   major employer, defines skyline, economic anchor
Central Market:  food hub, community gathering, artisan economy
Museum:          culture score, tourism, archive of city history
```

Each one is a multi-sim-week project with full construction visibility
and changes the city meaningfully when it opens.
