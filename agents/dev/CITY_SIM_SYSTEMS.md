# City Sim — Living Systems Bible
*The complete rulebook for how the world works*

---

## Core Philosophy

Every city generated from a different seed is a completely different world.
Different people, different relationships, different history, different economy.
Two people could run this app for a year and never see the same city twice.

The simulation doesn't tell stories. It creates conditions. Stories emerge.

---

## THE SEED SYSTEM — No Two Cities Alike

Every city starts with a single seed number (like Minecraft).

```javascript
seed = 4829301  // or "matt-city-1" hashed

// Seed determines:
- Street grid layout + block sizes
- Starting neighborhood zones
- Which citizens spawn + their personalities
- Which businesses exist at start
- Economic starting conditions
- Weather patterns for the year
- Which random events are weighted higher
```

Same seed = same city, deterministic. Different seed = completely different world.
Users can share seeds. "Play seed 4829301 — this one has a crime epidemic in year 2."

---

## CITIZEN SYSTEMS

### Life Stages
```
Baby (0-3):      born to citizen couple, no agency, cared for by parents
Child (4-12):    goes to school, plays, forms first friendships
Teen (13-17):    school + part-time jobs possible, identity forming, first romance
Young Adult (18-25): moves out, gets first real job, active social life
Adult (26-55):   career, relationships, possibly starts family/business
Middle Age (56-69): established, mentors others, health starts declining
Elderly (70+):   retired, wisdom, health issues, visits park, dies eventually
```

Death is natural. New citizens are born. Population stays roughly stable unless economy fails.

### The Needs Vector (drives all decisions)
```javascript
needs = {
  hunger:    { value: 0-100, decay: 2/hr,  threshold: 70 },  // find food
  sleep:     { value: 0-100, decay: 4/hr,  threshold: 80 },  // go home
  social:    { value: 0-100, decay: 1/hr,  threshold: 30 },  // seek people
  money:     { value: 0-∞,   critical: 0                 },  // find work
  purpose:   { value: 0-100, decay: .5/hr, threshold: 35 },  // job satisfaction
  safety:    { value: 0-100, varies                       },  // avoid danger zones
  health:    { value: 0-100, age-dependent                },  // seek medical help
  love:      { value: 0-100, varies by personality        }   // seek connection
}
```

Each tick: check highest-urgency need → pick action → pathfind → execute → update needs.

### Personality (Big Five — set at birth, shapes everything)
```javascript
personality = {
  openness:          0.7,  // tries new restaurants, new jobs, moves neighborhoods
  conscientiousness: 0.5,  // shows up on time, saves money, keeps appointments
  extraversion:      0.3,  // seeks social situations vs stays home
  agreeableness:     0.8,  // resolves conflicts peacefully, trusts others
  neuroticism:       0.4   // emotional swings, anxiety, impulsive spending
}
```

A highly neurotic, low-conscientiousness citizen will: quit jobs impulsively, 
spend beyond their means, get into arguments, have volatile relationships.
A highly conscientious, low-extraversion citizen: stays at one job 20 years,
saves money, has 3 close friends, never causes drama.

### Skills (earned + innate)
```
cooking, business, charisma, technical, creative, athletic,
caregiving, construction, driving, leadership, negotiation
```
Skills affect: what jobs available, how fast they get promoted, 
whether their business succeeds, how their relationships develop.
Skills improve through use. A cook who works 5 years becomes a chef.

### Memory (the soul of the citizen)
Each citizen stores their last **100 significant events**, weighted by emotional impact:

```javascript
memory = [
  { event: "lost_job", at: timestamp, emotion: -0.8, details: "laid off from Apex Corp" },
  { event: "met_person", at: timestamp, emotion: 0.4, citizenId: "marcus-chen" },
  { event: "argument", at: timestamp, emotion: -0.6, citizenId: "neighbor-id" },
  { event: "opened_business", at: timestamp, emotion: 0.9, buildingId: "sofia-bakery" },
  { event: "child_born", at: timestamp, emotion: 1.0, childId: "new-citizen-id" },
  ...
]
```

This memory feeds into Claude Haiku when deep decisions are needed.
Haiku reads the last 20 events + current needs + relationships and decides:
"Should Sofia leave her job and open that bakery she's been thinking about?"

---

## RELATIONSHIP SYSTEMS

### Relationship Types
```
Family:    parent/child, siblings, grandparent — permanent, deep
Romantic:  crush → dating → committed → married → divorced/widowed
Friend:    acquaintance → friend → close friend → best friend
Work:      colleague, mentor/mentee, boss/employee, rivals
Neighbor:  neutral, friendly, feud
Community: local legend, trusted elder, troublemaker (reputation)
```

### How Relationships Form
Citizens interact when they:
- Work same building (strongest trigger — 8hrs/day together)
- Live on same block (passive daily exposure)
- Frequent same location (coffee shop, park, bar, gym)
- Introduced by mutual connection (+trust boost)
- Random street encounter (low probability but it happens)
- Crisis together: fire, accident, storm — instant deep bond

### Relationship Score System
```javascript
relationship = {
  trust:       0-100,   // reliability, honesty, follow-through
  affection:   0-100,   // warmth, care, enjoyment of company
  familiarity: 0-100,   // how well they know each other
  tension:     0-100,   // unresolved conflict, jealousy, competition
  history:     []       // log of significant shared events
}
```

Interactions update the scores:
- Shared meal: +5 affection, +3 familiarity
- Conflict: +20 tension, -10 trust
- Helping in crisis: +25 trust, +15 affection
- Ghosting/ignoring: -2 affection/week until it fades
- Betrayal (poaching client, affair): -40 trust, +50 tension

### Romance Mechanics
1. **Attraction check**: compatible personalities + proximity + affection > 70
2. **Flirtation phase**: small positive interactions, mood boosts
3. **Dating**: share meals, visits, activities together
4. **Commitment**: move in together (household forms), finances merge
5. **Marriage event**: optional, triggers community gathering
6. **Children**: possible after commitment, new citizen spawned
7. **Divorce**: if tension > 80 and affection < 20 for 30+ sim-days → separation event
8. **Widowing**: partner dies of old age/accident → grief state, behavioral changes

### The Social Graph (visible in inspector)
A force-directed graph showing each citizen's web:
- Thick lines = strong connection
- Red lines = tension/feud
- Pink lines = romantic
- Green lines = family
- Click any node = open that citizen's inspector
- Watch lines form and dissolve in real time

---

## BUSINESS & ECONOMY SYSTEMS

### How a Business is Born
```
1. Citizen has: savings > $10K + relevant skill + purpose < 40 + observed neighborhood demand
2. Haiku evaluates: "Marcus has 8 years cooking experience, $14K saved, 
   notices the Arts District has no Korean food. He decides to open one."
3. Citizen enters PLANNING mode (2-5 sim-days)
4. Finds available commercial lot
5. Applies for permit → construction begins
6. Hires 1-3 staff from unemployed citizens (preference: people they know)
7. GRAND OPENING event → neighborhood buzzes, first customers come
8. Operating: supply/demand determines daily revenue
```

### Business Types
```
Food & Drink:   restaurant, cafe, bar, food truck, bakery, grocery
Retail:         clothing, electronics, bookstore, hardware, pharmacy
Service:        salon, gym, laundromat, mechanic, daycare, clinic
Entertainment:  cinema, music venue, art gallery, arcade, theater
Professional:   law firm, accounting, marketing agency, tech startup
Industrial:     factory, warehouse, construction company, print shop
```

### Business Health
```javascript
business = {
  name:        "Sofia's Bakery",
  owner:       citizenId,
  employees:   [citizenId, ...],
  revenue:     { daily: 840, trend: +0.12 },
  expenses:    { rent: 2400/mo, wages: 6200/mo, supplies: 1200/mo },
  profit:      { monthly: 1440, cumulative: 8640 },
  reputation:  72,    // 0-100, affects foot traffic
  stress:      34,    // owner's stress level from running it
  age:         127,   // days operating
  status:      "thriving" // thriving / stable / struggling / critical / closed
}
```

### Business Lifecycle Events
- **Grand Opening** → community event, press, buzz
- **Good Review** → reputation +10, increased foot traffic
- **Health Inspection Fail** → reputation -20, possible closure
- **Employee Quits** → stress on owner, service decline  
- **Competitor Opens** → revenue split, market pressure
- **Economic Downturn** → all businesses see -30% revenue
- **Expansion** → owner takes on debt, builds second location
- **Going Viral** → random event, massive spike, can overwhelm operation
- **Bankruptcy** → owner loses savings, employees laid off, building vacant
- **Acquisition** → bigger company buys it, owner gets payout, identity changes

### The Economy Simulation
```
Money flows:
Citizens earn wages → spend at local businesses → businesses pay wages → cycle

Taxes:
Citizens pay income tax % → city fund → city spends on: roads, parks, schools, police

Rent market:
High demand area → landlords raise rent → businesses/residents squeezed out
Low demand area → rent drops → new businesses move in (gentrification/decline cycles)

Employment rate affects:
Crime (↑ unemployment → ↑ crime)
Happiness (↓ unemployment → ↑ happiness)  
Consumer spending (↓ unemployment → ↑ spending → more businesses thrive)
```

---

## BUILDING SYSTEMS

### Building Lifecycle
```
VACANT LOT → PERMITTED → CONSTRUCTION → OCCUPIED → (AGING) → RENOVATED or ABANDONED → DEMOLISHED
```

**Construction Phase** (visible in sim):
- Scaffolding appears on building
- Construction workers arrive daily 7am–5pm
- Building goes up floor by floor over 5-15 sim-days depending on size
- Materials truck arrives regularly
- Crane visible above if tall building
- Once done: construction crew leaves, owner moves in/opens

**Aging System**:
Every building ages. Without maintenance investment, it deteriorates:
- Year 1-5: new + maintained (no decay)
- Year 5-10: minor wear visible (cracked paint, etc)
- Year 10-20: notable aging (broken windows possible, graffiti risk)
- Year 20+: serious disrepair unless renovated

**Neighborhood Effects**:
- One abandoned building → nearby property values -5%
- Cluster of abandonment → crime magnet → safety scores drop → exodus begins
- Renovation → nearby properties gain value → attracts new businesses
- New park built → entire block happiness +10, property values +15%

---

## EVENTS SYSTEM

### Event Categories

**Personal Life Events** (citizen-level):
```
birth, death, graduation, first_job, promotion, fired, 
married, divorced, had_child, lost_child, moved, 
started_business, closed_business, fell_ill, recovered,
made_enemy, fell_in_love, heartbreak, inheritance, bankruptcy
```

**Social Events** (group):
```
neighborhood_party, street_festival, protest, vigil,
bar_fight, community_meeting, wedding, funeral,
flash_mob, food_fight (at the restaurant, naturally)
```

**Business Events**:
```
grand_opening, bankruptcy, acquisition, viral_moment,
health_violation, award_won, expansion, fire_damage,
labor_dispute, competitor_arrived, going_out_of_business_sale
```

**City-Level Events** (affects everything):
```
economic_boom:    all wages +20%, new businesses open, population grows
recession:        businesses close, unemployment rises, crime up, exodus
natural_disaster: flood zone damage, recovery effort, community bonding
political_scandal: city trust collapses, protests, resignations
major_employer_opens: 200 new jobs, housing demand spikes
factory_closes:   mass layoffs, neighborhood decline begins
festival_season:  tourism up, revenue up, city energy high
```

**Crime Events** (emergent from conditions):
```
petty_theft:    low money citizen steals from shop (need > safety threshold)
vandalism:      bored/angry teens, low purpose, targeting high-tension buildings
assault:        conflict escalation between citizens with high tension
organized_crime: emerges if unemployment > 25% sustained, group of low-safety citizens
```
Note: Crime is never random. It emerges from desperation, conflict, and opportunity.

### The Event Ripple System
Every significant event creates a ripple of smaller events:

```
EVENT: Sofia's Bakery closes (couldn't make rent)
↓
RIPPLE 1: 3 employees lose jobs → unemployment rises
↓  
RIPPLE 2: Sofia's savings depleted → stress + 40, purpose crashes
↓
RIPPLE 3: Building goes vacant → nearby property values drop
↓
RIPPLE 4: Sofia's husband (who she met at the bakery 3 years ago) watches her suffer → 
           relationship tension rises if he can't support them both
↓
RIPPLE 5: Regular customers (5 citizens who came every morning) lose their ritual →
           social scores drop, they disperse to other spots, some lose connection
↓
RIPPLE 6: New entrepreneur notices vacant lot in same area...
```

Nobody scripted any of this. It just happened.

---

## THE CITIZEN INSPECTOR PANEL

Click any citizen in the world → inspector slides out from the right.

### What you see:

```
┌─────────────────────────────────────────┐
│  SOFIA REYES, 34          [FOLLOW] [X]  │
│  ● Currently: Walking to work           │
│  Baker · Arts District                  │
├─────────────────────────────────────────┤
│  NEEDS                                  │
│  Hunger   ████░░░░  42%                 │
│  Sleep    ██████░░  68%  ← getting tired│
│  Social   ████████  89%  ← very happy   │
│  Money    ████░░░░  40%  ← concerned    │
│  Purpose  ██████░░  72%                 │
├─────────────────────────────────────────┤
│  CURRENT THOUGHT (AI generated)         │
│  "The morning rush is coming. I hope    │
│   Marcus shows up on time today."       │
├─────────────────────────────────────────┤
│  RELATIONSHIPS                          │
│  ❤️ Marco Reyes (husband) — married 4yr │
│  👥 Lisa Chen (best friend) — close     │
│  😤 Tenant #4B (neighbor) — tension     │
│  👔 Marcus (employee) — boss/employee   │
│  [View full social graph →]             │
├─────────────────────────────────────────┤
│  RECENT EVENTS                          │
│  Today    → Argued with supplier        │
│  Yesterday → Great day, record revenue  │
│  3 days ago → Daughter's birthday       │
│  Last week → Lisa got married (attended)│
├─────────────────────────────────────────┤
│  FINANCES          │  HEALTH            │
│  Daily: +$240      │  Good              │
│  Savings: $8,400   │  Last sick: 3mo ago│
│  Rent: $1,200/mo   │  Age: 34           │
├─────────────────────────────────────────┤
│  LIFE TIMELINE                          │
│  2026 → Opened Sofia's Bakery           │
│  2024 → Married Marco                  │
│  2023 → Moved to Arts District         │
│  2020 → First baking job at Cafe Blue  │
│  2018 → Moved to city from hometown    │
└─────────────────────────────────────────┘
```

**Follow Mode**: camera locks on citizen, you watch their day unfold in real time.
**Thought bubble**: updates via Claude Haiku every 10 sim-minutes when following.

---

## CITY STATS PANEL

Live dashboard of the whole city:

```
Population:     1,247  (+3 this week, 2 births, 1 death)
Employment:     89.2%  (140 unemployed, 12 job openings)
GDP/citizen:    $34,200/yr average
Happiness:      73/100  (↑ trending up)
Crime rate:     12/100  (moderate)
Housing:        94% occupied
Businesses:     234 active, 8 in construction, 12 closed this month
Births:         14 this month
Deaths:         9 this month
Richest citizen:  James Okafor ($284,000) — owns 3 buildings
Poorest:          Maria Santos ($12) — 3 days from eviction
Most popular spot: Kenzo's Ramen (118 visits this week)
Longest marriage:  Ethel + Frank Wu (47 years)
```

### Heatmap Modes
Toggle overlay to see the city differently:
- **Wealth**: green = rich, red = poor (shows inequality starkly)
- **Happiness**: bright = happy, dark = suffering
- **Crime**: shows hot zones, safe zones
- **Foot traffic**: where everyone goes, dead zones
- **Relationship density**: where social connections are strongest

---

## WHAT MAKES EVERY CITY UNIQUE

At seed generation, randomize:
```
1. Geography: grid shape, river placement, park locations
2. Starting population: 50-200 citizens, ages spread, personalities rolled
3. Economic starting point: boom town / stable / recovering
4. Dominant industries: tech hub / blue collar / tourism / finance
5. Cultural identity: arts community / family-oriented / transient / tight-knit
6. Random event weights: disaster-prone / boom-bust / slow and steady
7. Starting relationships: some citizens already know each other
8. Built environment: some buildings old, some new, some vacant
```

Then over time, the city writes its own history.
Year 1 city in seed 4829 will be NOTHING like Year 5 city in seed 4829.
And year 5 in seed 4829 will be NOTHING like year 5 in seed 7731.

---

## BUILD PHASES (Updated)

### Phase 1 — The Living World (2 weeks)
Three.js scene, Rod Hunt art style, isometric grid
100 citizens walking with pathfinding, day/night cycle
Basic needs vector, no AI yet

### Phase 2 — The Economy (2 weeks)
Jobs, wages, businesses open/close
Buildings age, construction visible
Money flows through the system

### Phase 3 — Relationships (2 weeks)
Social graph builds from interactions
Romance, family formation, new citizens born
Business partnerships, rivalries

### Phase 4 — The Brain (1 week)
Claude Haiku integration for deep decisions
Citizen memory system
Emergent events with ripple system

### Phase 5 — The Inspector (1 week)
Click-to-inspect citizen panel
Social graph visualization
City stats + heatmaps

### Phase 6 — Polish + Seeds (1 week)
Seed system, shareable cities
Time controls (pause, 1x, 10x, 100x)
Follow mode, thought bubbles
Performance: 1000 citizens at 60fps

**Total: ~9 weeks. ~$50 build cost. ~$1.50/day to run.**

---

## THE NORTH STAR (Updated)

You open the app. The city is already 3 years old.

You click on a 67-year-old man named Frank Wu sitting alone on a park bench.
The inspector opens:
- Retired. Widower (wife died 8 months ago — 43-year marriage).
- Savings: $180,000 (lifelong factory worker).
- Purpose: 18/100.
- His three adult children: two moved to the suburbs (different neighborhood), 
  one still in the city but busy with her own family.
- He goes to the same bench every morning at 9am.
- Relationships: 2 friends (both from the factory, also retired).
- Recent thought: "I wonder if the cafe across the street is good. 
  Ethel would have wanted me to try new things."

Nobody wrote Frank's story. The system generated it.
Frank is real. His grief is real. His hesitation is real.
And if you watch long enough, you might see him finally walk into that cafe.
Meet someone. Start something new.

Or not. He might just sit on that bench every day until he dies.

That's the point.
