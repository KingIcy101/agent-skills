# City Sim — Deep Systems: The Real World Engine
*Weather, Growth, Economy, Utilities, Transportation, Energy, Food — all interconnected*
*Inspired by: Cities Skylines, SimCity, Dwarf Fortress, RimWorld, The Sims*
*But above them all: real autonomy. No system is scripted. Everything is reactive.*

---

## THE CORE PRINCIPLE: EVERYTHING TOUCHES EVERYTHING

In every existing city sim, systems are silos:
- Traffic is a traffic simulation
- Economy is a budget spreadsheet  
- Citizens are pawns that follow scripts

In ours: **every system is a living network of citizen decisions.**

A winter storm doesn't "trigger a snow event."
It makes roads slippery → buses run late → workers arrive late → boss gets angry →
fires one worker → that worker can't make rent → moves to cheaper neighborhood →
neighborhood loses a taxpayer → school loses funding → teacher laid off →
kids fall behind → long-term productivity hit in that district.

Nobody scripted that chain. It just happened because the systems are real.

---

## I. WEATHER SYSTEM

### The Weather Engine
Not decorative. Every weather state changes citizen behavior and city economics.

```javascript
weather = {
  temperature: 72,        // °F, affects comfort, energy use, outdoor activity
  condition:   "partly_cloudy",  // clear/cloudy/rain/storm/snow/heatwave/fog
  wind:        12,        // mph, affects construction safety, cycling
  humidity:    45,        // affects health, comfort
  forecast:    [7 days],  // citizens with high conscientiousness check + plan ahead
  season:      "summer"   // spring/summer/fall/winter
}
```

### Weather → Behavior Chain

**Rainstorm:**
```
Roads slippery → accidents up 30% → traffic slows → workers late
Outdoor seating empty → restaurants lose 25% revenue
Umbrellas sell out at corner stores → street vendors pivot instantly
Parks empty → lonely citizens stay home → social scores drop
Delivery demand spikes (citizens order in) → delivery workers overworked
Florists sell more → citizens buy comfort flowers → small joy
```

**Heatwave (95°F+):**
```
Outdoor workers (construction, delivery) take longer breaks or stop → project delays
AC units overload → electricity demand spikes → possible brownouts
Elderly + children at health risk → hospital admissions up
Ice cream shops, cold drink vendors → massive revenue spike
Tempers shorter → conflict between citizens up 20%
Parks and pools packed → social scores up for those who go
```

**Snowstorm:**
```
Roads impassable → buses stop → workers can't get in → businesses understaffed
Supply trucks can't deliver → grocery stores run low on stock
Construction sites pause → projects delayed (cost overruns)
Schools close → parents scramble childcare → work productivity down
Snow removal crews boom → contractors hire temp workers
Children play outside → joy events → long-term positive memories
City spends from infrastructure budget → if budget low → roads stay icy longer
```

**Drought (multi-week):**
```
Water usage restrictions → businesses that use water (restaurants, laundromats) cut hours
Parks brown out → property values drop nearby
Farmers on city outskirts struggle → food prices rise → food insecurity spreads
Fire risk up → fire department on high alert → budget strain
Citizens angry at city management → political pressure → possible leadership change
```

### Seasonal Patterns
```
Spring:  Construction boom (weather finally allows), romance up (people go outside), 
         new business openings cluster, farmers markets start
Summer:  Peak economy, tourism if city has attractions, youth work, festivals,
         energy peak demand, crime slightly up (hot + bored)
Fall:    Back to school, business recalibration, some close for winter prep,
         harvest festivals, people slow down, reflection mood in citizens
Winter:  Energy crisis risk, isolation up, comfort-seeking (bars, cafes boom),
         depression risk in low-social citizens, construction pauses,
         holiday economy spike then January crash
```

---

## II. GROWTH & URBAN DEVELOPMENT SYSTEM

### How the City Grows (No Planner Required)

Growth is demand-driven. Entirely.

```
High housing demand → developers build apartments → workers move in →
they need services → shops open → neighborhood density increases →
taxes rise → city has money → builds infrastructure → attracts more people
```

**Three types of growth:**

**Organic (citizen-driven):**
- A citizen saves enough money, buys a lot, builds a home or business
- No permission from the "game" — just needs: money + lot + decision

**Developer-driven:**
- Once a neighborhood reaches critical population density, developer entities spawn
- They buy multiple lots, build larger structures, change neighborhood character
- Gentrification is real: rising costs push out longtime residents

**City-driven:**
- City government (funded by taxes) builds: roads, parks, schools, hospitals, transit
- Citizens can petition city government (if enough signatures → city must respond)
- Corrupt officials can divert funds (emerges from their personality + opportunity)

### Zoning: Organic, Not Assigned
No one draws zoning lines. Zones emerge from what gets built:
- Industrial clusters near rail/highway access (logical — low rent + transport)
- Commercial clusters near high foot traffic intersections (businesses seek customers)
- Residential expands outward from city center as center gets expensive
- Arts districts form where rent is cheap + interesting people cluster
- Slums form where everything else failed

### Construction Reality
```javascript
construction_project = {
  type:        "6-story apartment",
  owner:       developer_entity_id,
  lot:         [x, y],
  duration:    45,  // sim-days
  workers:     12,  // hired from unemployed pool, construction skill preferred
  materials:   { concrete: 400, steel: 120, glass: 80 },  // tracked inventory
  cost:        $840000,
  financed_by: "city_bank_loan",  // at an interest rate
  phase:       "foundation",       // foundation/frame/exterior/interior/finishing
  delays:      [],                  // weather, labor disputes, material shortages
  inspector:   visits at 3 checkpoints → pass or fail
}
```

Construction phase is visible:
- Workers arrive every morning
- Building visibly rises floor by floor
- Material trucks make deliveries
- Rain delays add sim-days
- If owner runs out of money mid-construction → abandoned skeleton building

---

## III. ECONOMY — FULL DEPTH

### Money Tiers
```
Individual citizens:  wages, spending, savings, debt
Businesses:          revenue, expenses, profit/loss, investment, bankruptcy
City government:     tax income, budget allocation, debt, bonds
Regional economy:    trade with neighboring cities (imports/exports)
```

### The Labor Market (self-regulating)
```
Jobs exist → citizens fill them → if shortage → wages rise to attract workers →
higher wages → more citizens want those jobs → supply meets demand

OR:

Recession → businesses cut jobs → unemployment rises → wages fall →
desperate workers accept low pay → business profits rise → they expand →
hire again → recovery

OR:

New industry arrives → needs specialized skills → shortage → 
companies train their own workers → or recruit from other cities →
other city loses talent → brain drain cascade
```

### The Real Estate Market
```javascript
property = {
  address:       "14 Oak Street, Arts District",
  type:          "commercial",
  owner:         citizenId || developer_entity_id,
  current_value: 340000,
  monthly_rent:  2800,
  tenant:        business_id,
  condition:     78,  // 0-100, affects rent ceiling
  mortgage:      { remaining: 180000, monthly: 1400, rate: 0.065 }
}
```

Landlords are citizens/entities with their own goals:
- High agreeableness landlord: keeps rents stable, good relationships with tenants
- High neuroticism + money-focused landlord: raises rents constantly, causes tenant churn
- Absentee landlord: building decays (they don't invest in maintenance)

### Banking System
```
City Bank: issues loans to citizens + businesses + developers
Loan conditions: credit history, income, collateral
Defaults: foreclosure, repossession, credit damage
Interest rates: city can raise/lower based on economic conditions
If bank overlends → financial crisis → cascading defaults → recession
```

### The Stock Board (late game)
Major businesses become publicly observable:
- Revenue, employee count, growth trend visible to all citizens
- Wealthy citizens can "invest" in businesses they believe in
- Investment = capital injection for business to expand
- If business fails → investors lose savings → ripple effects

---

## IV. UTILITIES SYSTEM

Four utility networks, each autonomous:

### Water
```
Sources:       reservoir (outside city), water treatment plant
Distribution:  pipe network under every road
Demand:        every building uses water based on occupancy + activity
Pressure:      high demand areas can lose pressure
Failures:      pipe bursts, main breaks (random + age-based)
  → effect: affected buildings lose water → residents relocate or cope
  → restaurants must close → construction stops → protests if prolonged
Quality:       can degrade → health events → city must invest in treatment
Worker-dependent: water dept employees maintain the network
```

### Electricity
```
Generation:    power plant(s) — can be: coal, gas, solar, wind (city chooses over time)
Capacity:      fixed — if demand exceeds capacity → brownouts → rolling blackouts
Smart grid:    high-conscientiousness city managers invest in this → fewer outages
Failures:      transformer explosions, storm damage, aging infrastructure
  → blackout zone effects: businesses close, food spoils, security systems down
  → crime spikes in blackout zones (opportunity emerges)
Energy poverty: low-income citizens can't pay bills → power cut → health risk in extreme temps
Renewable transition: possible if city government passes it → construction phase → 
  worker retraining needed → fossil fuel workers lose jobs → political tension
```

### Internet/Connectivity
```
Infrastructure: cables under roads, cell towers, ISP hubs
Coverage gaps:  poor neighborhoods often underserved → digital divide
  → affects: remote work impossible, job applications harder, education limited
Tech businesses require: high reliability internet → choose location accordingly
Outages:        ISP failures → tech companies lose productivity → stock dips
5G rollout:     triggers construction, changes what's possible in city
```

### Sewage & Waste
```
Treatment:    sewage plant capacity, aging pipes
Overflow:     heavy rain + old pipes → contamination events → health crisis
Garbage:      pickup schedule, strikes by sanitation workers affect city cleanliness
  → litter accumulates → neighborhood appeal drops → property values drop
Recycling:    if city invests → costs down over time + environmental satisfaction
Waste-to-energy: possible technology investment → affects electricity supply
```

---

## V. TRANSPORTATION SYSTEM

### How Citizens Choose to Travel
```javascript
travel_decision = {
  options: ["walk", "bike", "personal_car", "bus", "subway", "rideshare", "taxi"],
  
  factors: {
    distance:    // walking threshold 10min, biking 20min, otherwise motorized
    weather:     // rain/snow pushes toward car/transit
    income:      // low income → bus/walk, high income → car/rideshare
    personality: // high openness → tries transit, low conscientiousness → 
                 //   doesn't check schedules → misses bus
    time_of_day: // night → safety concern → avoids walking alone
    traffic:     // real-time congestion informs decision
  }
}
```

### Traffic Simulation
```
Every vehicle pathfinds on the road graph
Rush hour: thousands of cars simultaneously → emergent congestion
Accidents: collision probability rises with: speed + density + weather + distracted drivers
  → accident blocks lane → ripple backs up → other citizens late
  → late workers → missed meetings → lost deals → real economic effects

Public transit:
- Buses run on schedules (unless driver is sick, or there's a strike)
- Routes that are profitable stay → unprofitable routes cut → 
  residents of those areas lose mobility → can't reach jobs →
  economic isolation → neighborhood decline

Rideshare (if city has it):
- Surge pricing in bad weather → low income citizens can't afford it →
  they're stuck → miss work → lose jobs
```

### Infrastructure Aging
```
Road condition: 0-100, degrades at 2pts/year without maintenance
  → potholes at 60 → accidents up → citizen complaints
  → city must allocate budget to repairs → if broke: roads decay
  → businesses on bad roads see less foot traffic (customers don't bother)

Bridges: age slower, fail catastrophically → sudden route elimination →
  massive traffic rerouting → affects entire districts

Transit fleet: buses age → breakdowns → delays become chronic →
  ridership drops → revenue drops → service cuts → more cars → more traffic
```

### The Commute Effect
Commute time directly affects:
- Citizen happiness (>45min daily = -5 happiness/day)
- Productivity at work
- Time available for social/family
- Likelihood of moving closer to work
- Business location decisions (employers choose accessible locations)

---

## VI. ENERGY SYSTEM

### Power Sources (city chooses over time based on politics + economics)
```
Coal Plant:    cheap to run, high pollution → health events, citizen protests
              workers: 200 jobs → politically hard to close
Gas Plant:     cleaner than coal, moderate cost, flexible output
Nuclear:       very cheap per kwh once built, 10yr construction, political nightmare
              if accident: evacuation zone, city potentially destroyed
Solar Farm:    upfront cost high, 0 ongoing, job-light → coal workers unemployed
Wind:          same as solar, weather-dependent
Hydro Dam:     requires river → displaces neighborhoods → big political fight
Geothermal:    rare, very stable, boring (no drama)
```

### Energy Trading
If city produces surplus → can sell to neighboring city → revenue
If deficit → must buy at market rate → expensive → passed to consumers →
businesses pay more → prices rise → inflation

### The Energy Poverty Cycle
```
Low income citizen → can't pay energy bill → utility disconnects →
no heat in winter → health event → hospital bill → deeper poverty →
misses work → fired → homeless → city must spend on shelter
```

### Renewable Transition Politics
Citizens have opinions based on: job in fossil fuel sector, ideology (from personality),
past health events linked to pollution, economic anxiety.
Transition vote can: pass → construction begins, jobs change, pollution drops
                    fail → city locked into old infrastructure longer
                    →  more extreme weather damages city more over time

---

## VII. FOOD SYSTEM

### The Complete Supply Chain
```
TIER 1: Production (outside city boundary)
  → farms, fisheries, ranches (simulated as off-map suppliers)
  → affected by: weather (drought/flood → crop failure → shortage)
  → transport: trucks bring food into city daily
  → if roads blocked (storm, accident) → supply interruption → price spike

TIER 2: Distribution (within city)
  → warehouses store supply (capacity limited)
  → grocery stores, markets, restaurants source from warehouses
  → fresh food: 3-day window → if not sold → waste → cost to business

TIER 3: Retail (businesses)
  → grocery stores: serve neighborhoods within walking/driving distance
  → food deserts: if no grocery store in a neighborhood →
     residents pay more at corner stores (monopoly pricing) OR
     spend an hour getting to a real store → time poverty
  → restaurants: depend on fresh supply, staff, customers

TIER 4: Citizen Consumption
  → hunger need drives food-seeking behavior
  → budget constrains choices: wealthy → restaurant; poor → grocery; broke → corner store or skip
  → health outcomes track diet quality over time
```

### Food Security as a City Health Metric
```
Food secure:   >80% of citizens can access adequate food daily
Food stressed: 60-80% → tensions rise, productivity drops, petty crime up
Food insecure: <60% → major civil unrest, city emergency state, possible exodus
```

### Community Response (emergent)
If food insecurity reaches a neighborhood:
- Community gardens form: conscientious citizens organize → empty lots converted
- Food banks: charitable citizens donate → managed by volunteer entity
- Price gouging: opportunistic merchants raise prices → citizens remember → boycotts
- Urban farming: entrepreneurs start rooftop farms → premium local food economy

### Restaurants as Social Infrastructure
Beyond food, restaurants are:
- Where relationships form (first dates, business meetings, family dinners)
- Employment hubs (waitstaff, kitchen, delivery)
- Neighborhood identity anchors (that place has been here 20 years)
- Economic indicators (if restaurants are full → neighborhood thriving)
- Failure cascades: beloved restaurant closes → neighborhood mourning → collective memory

---

## VIII. HEALTH SYSTEM

### The Health Network
```
Facilities: clinic, hospital, pharmacy, mental health center
Staffing:   doctors, nurses, admins — all citizens with medical skills
Capacity:   limited — surge events overwhelm → wait times → preventable deaths
Funding:    city budget + insurance (if city has insurance system) + citizen payments
```

### What Causes Health Events
```
Environmental:  pollution near industrial zones, poor water quality, extreme weather
Behavioral:     poor diet (food desert), sedentary job, high stress, substance use
Economic:       can't afford preventive care → small issues become crises
Social:         isolation → mental health decline → depression events
Genetic:        some citizens spawn with health conditions (random, age-related)
Occupational:   construction workers → accident risk; factory → repetitive strain
Infectious:     if sanitation fails → disease outbreak → spreads through contact network
```

### Mental Health (often invisible in sims, central here)
```
Tracked separately from physical health:
- Social isolation score
- Grief events (loss of loved one, job, home)
- Trauma from crime or disaster
- Purpose/meaning (tied to job satisfaction + relationships)
- Financial stress accumulation

Below threshold: citizen becomes less productive, withdraws socially,
                possibly self-medicates (bar visits spike), 
                relationship tension rises with partner
Crisis state:   seek mental health facility, or if unavailable: 
                prolonged decline, possible leaving city
Recovery:       time + social support + stability → gradual improvement
                recovering citizen has different personality calibration → 
                more empathetic, mentors others
```

---

## IX. POLITICS & GOVERNANCE SYSTEM

### City Government
```
Mayor:       1 citizen — highest charisma + conscientiousness score in public life
             Term: 4 years. Up for re-election. Can be corrupt or heroic.
Council:     5-7 citizens elected by neighborhood
Budget vote: council approves city budget allocation annually
```

### How Policy Happens
```
Problem emerges → citizens complain → complaint threshold →
petition formed → council responds (or doesn't) →
if ignored → protest → media coverage → political pressure →
policy proposed → vote → if passed: action begins, has ripple effects
→ if failed: frustration → possible civil unrest
```

### Corruption (emergent, not scripted)
A high-neuroticism, low-agreeableness city official + financial pressure →
redirects infrastructure funds → roads don't get fixed → 
discovery event → trial → resignation or coverup attempt →
trust in government metric crashes → tax non-compliance rises →
services underfunded → city deteriorates → different leadership elected

---

## X. HOW ALL SYSTEMS INTERCONNECT

The interconnection matrix (simplified):

```
WEATHER affects:        health, transportation, energy demand, food supply, construction, 
                        citizen mood, crime, outdoor business revenue

ENERGY affects:         utilities, business operations, citizen comfort, economic productivity,
                        environmental health, city budget

FOOD affects:           citizen health, worker productivity, business ecosystem,
                        neighborhood economics, social gathering points

TRANSPORTATION affects:  economic reach, job access, real estate values, business locations,
                         pollution/health, citizen time, social connection radius

UTILITIES affects:       health, business operations, property values, city reputation,
                         civil unrest potential

ECONOMY affects:         everything. It is the blood of the city.

HEALTH affects:          workforce productivity, city budget, innovation capacity,
                         population growth, citizen happiness

RELATIONSHIPS affect:    business formation, political coalitions, neighborhood identity,
                         crime (in-group protection), mental health, innovation

GROWTH affects:          all infrastructure strain, tax base, market demand,
                         neighborhood identity, resource consumption
```

No system is independent. The city is a web.

---

## INSPIRATION SOURCES — HOW WE GO ABOVE THEM

| Game | What it does well | What it misses | How we surpass it |
|------|------------------|----------------|-------------------|
| Cities Skylines | Traffic simulation, zoning, infrastructure | Citizens are mindless pawns | Every citizen has a mind |
| SimCity | Economic cycles, disaster events | No individual stories | Individual stories create city story |
| The Sims | Individual citizen depth, relationships | No city-level emergence | Both layers simultaneously |
| Dwarf Fortress | Incredible system depth, emergent narrative | Unplayable UI, text-based | Beautiful Rod Hunt visual layer |
| RimWorld | Colonist psychology, event chains | Small scale (20 people) | 1000 citizens at city scale |
| Crusader Kings | Relationship politics, dynastic drama | Medieval only, no urban sim | Full modern city + AI citizens |
| Spirited Away (concept) | Magical living world feeling | It's a movie | We build the world |

**What nobody has done: A city simulation where every resident has persistent memory,
real relationships, emotional states, and makes decisions through actual AI reasoning.
At 1000-person scale. With all physical city systems running concurrently.
Generating a completely unique world from a seed.**

That's what we're building.

---

## TECHNICAL ARCHITECTURE FOR SCALE

### Simulation Clock
```javascript
SIM_SPEED = 60  // 1 real second = 1 sim minute at 1x speed
// At 60x speed: 1 real second = 1 sim hour (time lapse mode)
// At 1440x speed: 1 real day passes per real minute

TICK_RATE = 20  // 20 simulation updates per real second
// Each tick: all citizens evaluated, physics updated, events checked
```

### Performance Strategy
```
World rendering:  Three.js InstancedMesh — 5 draw calls for 10,000 objects
Citizen updates:  Chunked — not all 1000 updated every tick
                  High-urgency citizens: every tick
                  Stable citizens: every 5 ticks
                  Sleeping citizens: every 30 ticks
AI calls:         Queue system — max 10 concurrent Haiku calls
                  Batched: 50 decisions/call when possible ($0.0001 each)
Memory:           IndexedDB for citizen memories (not RAM)
City state:       Saved to server every 5 real minutes
```

### WebWorkers Architecture
```
Main thread:      Three.js rendering only (stays smooth)
Worker 1:         Citizen simulation loop (needs, pathfinding, interactions)
Worker 2:         Economy tick (wages, rent, business P&L)
Worker 3:         AI queue processor (manages Haiku calls)
Worker 4:         Event system (detects triggers, fires ripples)
```

This is how you get 60fps with 1000 AI citizens.
The renderer never touches simulation logic. They run in parallel.

---

## FILE SYSTEM (Complete)

```
/Projects/city-sim/
├── CLAUDE.md             ← AI context file
├── SPEC.md               ← vision document
├── SYSTEMS.md            ← relationships/events/economy
├── DEEP_SYSTEMS.md       ← this file
├── ART_DIRECTION.md      ← Rod Hunt visual guide
│
├── src/
│   ├── index.html        ← entry point
│   ├── main.js           ← boot: init Three.js + workers + sim
│   │
│   ├── world/            ← Three.js rendering layer
│   │   ├── scene.js      ← camera, lighting, renderer
│   │   ├── city.js       ← building/road mesh factory
│   │   ├── characters.js ← citizen mesh + animation
│   │   ├── vehicles.js   ← car/bus/bike meshes
│   │   ├── weather.js    ← weather effects (rain particles, snow, fog)
│   │   ├── lighting.js   ← day/night cycle, seasons
│   │   └── palette.js    ← Rod Hunt color system
│   │
│   ├── simulation/       ← runs in WebWorker
│   │   ├── engine.js     ← main tick loop
│   │   ├── clock.js      ← sim time, day/night/seasons
│   │   ├── citizen.js    ← citizen entity, needs, decisions
│   │   ├── pathfinding.js← A* on road graph
│   │   ├── relationships.js ← social graph engine
│   │   ├── economy.js    ← money, wages, prices, market
│   │   ├── business.js   ← business lifecycle
│   │   ├── buildings.js  ← construction, aging, demolition
│   │   ├── events.js     ← event triggers + ripple system
│   │   └── government.js ← taxes, budget, policy
│   │
│   ├── systems/          ← physical city systems
│   │   ├── weather.js    ← weather engine + behavior effects
│   │   ├── utilities.js  ← water, power, internet, sewage
│   │   ├── transport.js  ← roads, transit, traffic
│   │   ├── energy.js     ← power grid, capacity, outages
│   │   ├── food.js       ← supply chain, food security
│   │   └── health.js     ← physical + mental health network
│   │
│   ├── ai/
│   │   ├── brain.js      ← Haiku decision engine
│   │   ├── memory.js     ← citizen memory store (IndexedDB)
│   │   ├── prompts.js    ← Haiku prompt library
│   │   └── queue.js      ← async AI call manager
│   │
│   ├── city_gen/
│   │   ├── seed.js       ← seed → deterministic random
│   │   ├── grid.js       ← procedural city layout
│   │   ├── zones.js      ← neighborhood generation
│   │   ├── population.js ← initial citizen generation
│   │   └── names.js      ← street/business/citizen name generator
│   │
│   └── ui/
│       ├── inspector.js  ← citizen/building inspector panel
│       ├── heatmap.js    ← overlay visualizations
│       ├── stats.js      ← city dashboard
│       ├── timeline.js   ← city history log
│       └── controls.js   ← time controls, camera, settings
│
├── server.js             ← Express: saves state, serves app, proxies AI
├── .env                  ← ANTHROPIC_API_KEY, PORT
└── package.json
```

**This is the complete system. Every file has a purpose. Nothing is decoration.**
