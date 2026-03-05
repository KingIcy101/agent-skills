# City Sim — Art Direction
## Visual Reference: Rod Hunt
rodhunt.com | @rodhunt

---

## What Rod Hunt Is

Rod Hunt is a London-based illustrator famous for incredibly dense, vibrant, 
isometric city illustrations. Think "Where's Waldo" crossed with a living city painting.
His work is commissioned by major brands for advertising — rich, layered, full of life.

**Key characteristics:**
- True isometric projection (not perspective — perfect 30° angle, no vanishing point)
- Incredibly dense detail — hundreds of tiny characters all doing different things
- Flat color fills with hard shadows (no gradients, no soft shading)
- Vibrant, saturated color palette — every building a different bold color
- Buildings have depth: rooftops visible, sides shadowed, interiors visible through windows
- Characters are tiny but expressive — readable at 12px
- Hidden humor: tiny scenes happening everywhere (someone arguing, a cat on a roof, delivery gone wrong)
- No empty space — every pixel has something happening
- Clear neighborhood identity — residential blocks look different from commercial, industrial
- Day scene = bright, punchy. Night scene = neon glow + lit windows + dark streets

---

## Our Color Palette (Rod Hunt inspired)

### Building Colors
```
Residential (short):   #FF6B6B (coral red), #4ECDC4 (teal), #45B7D1 (sky blue)
Residential (tall):    #96CEB4 (sage), #FFEAA7 (pale yellow), #DDA0DD (plum)
Commercial:            #FF8C42 (orange), #6C5CE7 (purple), #00B894 (green)
Industrial:            #636E72 (steel), #B2BEC3 (silver), #DFE6E9 (light gray)
Landmark:              #FD79A8 (hot pink), #FDCB6E (gold), #E17055 (burnt orange)
Parks/Nature:          #00B894 (emerald), #55EFC4 (mint), #81ECEC (aqua)
Roads:                 #2D3436 (near black), #636E72 (sidewalk gray)
```

### Shadow System (flat, hard)
```
Shadow side of building:  darken base color by 25% — no gradient, hard edge
Shadow on ground:         rgba(0,0,0,.15) flat polygon cast at 30° angle
Roof top:                 lighten base color by 15%
Window lit (day):         #FFEAA7 (warm white)
Window lit (night):       #FDCB6E (amber glow) with radial halo rgba(253,203,110,.2)
```

### Lighting by Time of Day
```
Dawn (5am–7am):    Warm pink/orange sky, long soft shadows, buildings warm-tinted
Morning (7am–12):  Bright white light, crisp shadows, full saturation
Afternoon (12–5pm): Slightly golden, shadows shortening
Evening (5pm–8pm): Golden hour — everything amber, long shadows
Night (8pm–5am):   Dark #1a1a2e sky, buildings dark, windows glowing amber/blue, neon signs
```

---

## Building Design System

### Isometric Rules
- All buildings on perfect 30° isometric grid
- Three visible faces: top (lightest), left (medium), right (darkest)
- Windows: grid pattern, 8x8px minimum, lit = yellow, dark = charcoal
- Roof details: water towers, AC units, gardens, helipads, murals

### Building Types with Rod Hunt Flavor

**Rowhouse / Townhouse**
- 2-3 stories, different colors side by side
- Tiny front steps, window boxes with flowers
- Clotheslines between buildings
- Character in window reading/watching

**Corner Store / Shop**
- Ground floor has shop front (display window, signage)
- Striped awning in bright color
- Delivery boxes on sidewalk
- 1-2 characters inside visible through window

**Office Tower**
- Glass curtain wall (grid of blue/silver windows)
- Rooftop: antenna, water tower, maybe a rooftop garden
- People visible in conference rooms

**Restaurant**
- Open front if summer, tables on sidewalk
- Steam rising from kitchen vents
- Queue outside if popular
- Neon sign at night

**Park Block**
- Green grass base tile
- Trees: round lollipop shapes (Rod Hunt signature)
- Benches with characters sitting
- Playground equipment
- Dog walkers
- Fountain as center piece

**Construction Site**
- Crane visible above
- Scaffolding on building face
- Dirt/materials ground texture
- Worker characters in hard hats
- Temporary fence around site

---

## Character Design

### Scale
Characters are ~6px tall in full zoom. Like little colored pins.
At 2x zoom: recognizable as human, simple clothing color, tiny accessory.

### Types (visual coding)
- **Workers (blue collar):** orange/yellow hard hat, work clothes
- **Office workers:** dark suit or bright business color  
- **Students:** backpack, casual
- **Elderly:** slower movement, cane sometimes, light colors
- **Children:** small scale, bright colors, often running
- **Dogs:** tiny, follow their owner within radius

### Mood Indicator (subtle)
Small colored aura/dot above character when emotional state is notable:
- 🔴 Red dot = angry, in conflict
- 💛 Yellow = happy, content
- 💙 Blue = sad, lonely
- 💜 Purple = in love / romantic encounter
- Normal state = no dot (don't clutter the scene)

---

## Roads & Traffic

### Road Design
- Main roads: 2 lanes each direction, center line dashes
- Side streets: 1 lane, no center line
- Sidewalks: lighter gray, 8px wide
- Crosswalks: white stripe pattern at intersections
- Traffic lights: tiny post with colored light
- Road markings: stop lines, arrows, parking zones

### Vehicles
- Cars: boxy isometric, bold single colors, tiny windshield
- Taxis: yellow with checkered stripe
- Buses: long, 2-color (body + roof), route number
- Delivery trucks: white with company logo color
- Emergency vehicles: red (fire), blue (police), white (ambulance)
- Bikes: tiny, rider visible, no roof

---

## Neighborhood Identity System

Different districts should be INSTANTLY readable from the art:

| District | Color vibe | Building types | Street life |
|----------|-----------|----------------|-------------|
| Uptown/Wealthy | Cream, gold, dark green | Tall towers, manicured parks | Few people, luxury cars |
| Downtown/Business | Silver, blue glass | Office towers, coffee shops | Dense foot traffic |
| Arts District | Murals on buildings, mismatched colors | Galleries, cafes, studios | Lots of characters, bikes |
| Residential/Family | Warm coral, sage | Rowhouses, schools, parks | Kids, dogs, families |
| Industrial | Gray, steel, orange | Warehouses, factories | Fewer people, lots of trucks |
| Market/Commercial | Orange, yellow, busy awnings | Shops, restaurants, stalls | Most dense foot traffic |
| Rough/Declining | Desaturated, grays, browns | Rundown buildings, vacant lots | Few people, tension visible |

---

## Signature Rod Hunt Details (must include)

These are the "wow" moments people discover:
- **Cat on every other rooftop** — tradition in Rod Hunt work
- **Someone's window plants** on at least one residential building per block
- **Arguments happening** — 2 tiny characters facing each other, red dots
- **Construction cranes** always in the skyline (city is always growing)
- **Hot air balloon or blimp** over the skyline with a banner
- **Food truck** with a queue
- **Someone on their phone** walking into someone else
- **Dog off-leash** running away from its owner
- **Kiss happening** in at least one location
- **Window cleaner** on the side of a tall building
- **Kid flying a kite** in the park
- **Delivery gone wrong** — boxes scattered somewhere

These hidden story moments are EXACTLY the kind of emergent behavior our simulation generates naturally. The art direction matches the simulation ethos perfectly.

---

## Technical Rendering Approach

### Why NOT realistic 3D
Rod Hunt's style is FLAT with hard shadows. That's easier to render AND looks better for this.
Three.js can render isometric flat-shaded geometry at 60fps with 1000+ objects easily.

### Three.js implementation
```javascript
// Isometric camera setup (Rod Hunt angle)
camera = new THREE.OrthographicCamera(...)
camera.position.set(10, 10, 10)  // 30° isometric
camera.lookAt(0, 0, 0)

// Flat shading = Rod Hunt look
material = new THREE.MeshLambertMaterial({ 
  color: 0xFF6B6B,
  flatShading: true  // THIS gives the crisp flat-color look
})

// Hard directional light = crisp shadows
const sun = new THREE.DirectionalLight(0xffffff, 1.2)
sun.position.set(5, 10, 5)  // angle matches isometric shadow direction
```

### Performance target
- 1000 buildings: MeshInstancedBuffer — all rendered in ONE draw call
- 1000 characters: same — instanced, each a colored capsule mesh
- 200 vehicles: same approach
- Total: ~5 draw calls for entire city = 60fps easily

---

## Reference Images to Study
- rodhunt.com/expansive-cityscape-advertising-campaign-illustration
- rodhunt.com (portfolio section — isometric)
- Search "Rod Hunt wimmelbilder" on Reddit for community discussion
- His Flickr: flickr.com/photos/rodhunt

## Closest Technical References
- **eBoy** — pixel art isometric cities (similar aesthetic, Rod Hunt is influenced by)
- **Monument Valley** — flat isometric geometry, clean rendering in Three.js
- **Mini Metro** — minimal but beautiful movement of entities
- **Townscaper** — procedural isometric building generation

---

## File System for This Build

```
/Users/mattbender/Projects/city-sim/
├── CLAUDE.md              ← context for Claude Code
├── SPEC.md                ← full simulation spec (copy of CITY_SIM_SPEC.md)
├── ART_DIRECTION.md       ← this file
├── src/
│   ├── index.html         ← entry point
│   ├── main.js            ← Three.js scene setup
│   ├── city/
│   │   ├── generator.js   ← procedural city grid generation
│   │   ├── buildings.js   ← building mesh factory
│   │   ├── roads.js       ← road mesh + pathfinding grid
│   │   └── zones.js       ← neighborhood zone definitions
│   ├── simulation/
│   │   ├── engine.js      ← main tick loop
│   │   ├── citizen.js     ← citizen entity + needs vector
│   │   ├── pathfinding.js ← A* on road graph
│   │   ├── economy.js     ← jobs, wages, businesses
│   │   ├── relationships.js ← social graph
│   │   └── events.js      ← emergent event system
│   ├── ai/
│   │   ├── brain.js       ← Claude Haiku decision engine
│   │   ├── memory.js      ← citizen memory store
│   │   └── prompts.js     ← Haiku prompt templates
│   ├── ui/
│   │   ├── inspector.js   ← click-to-inspect citizens/buildings
│   │   ├── heatmap.js     ← overlay visualizations
│   │   └── stats.js       ← city stats panel
│   └── utils/
│       ├── colors.js      ← Rod Hunt color palette + utils
│       ├── noise.js       ← procedural noise for terrain
│       └── math.js        ← isometric projection helpers
├── server.js              ← Express API (saves city state, serves app)
├── package.json
└── .env                   ← ANTHROPIC_API_KEY
```
