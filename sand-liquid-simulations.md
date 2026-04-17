# ASCII Particle Simulations: Sand & Liquid

## Overview

This document describes the implementation of two ASCII particle simulations - **AsciiSand** and **AsciiLiquid** - that run on an HTML5 Canvas using the Pretext library for accurate text measurement. Both simulations are interactive and respond to mouse/touch input.

---

## AsciiSand Simulation

### Concept
A gravity-based falling sand simulation where particles fall downward and pile up at the bottom, creating natural sand pile formations with realistic cascading behavior.

### Physics Model

The sand simulation uses a simplified **cellular automaton** approach:

```
┌─────────────────────────────────────────────────────┐
│                 SAND PHYSICS RULES                  │
├─────────────────────────────────────────────────────┤
│  1. Gravity: particles fall straight down          │
│  2. If blocked below: try diagonal (left/right)    │
│  3. If blocked diagonally: flow sideways           │
│  4. Velocity increases fall speed                  │
│  5. Settled particles become static               │
└─────────────────────────────────────────────────────┘
```

### Implementation Details

**Grid Structure:**
```javascript
grid[y][x] = {
    amount: 0-1,      // Density of sand (0 = empty, 1 = full)
    velocity: 0-2    // Fall velocity for momentum
}
```

**Update Loop (per frame):**
1. **Input Handling**: Mouse/touch adds sand in a radius around cursor
2. **Velocity Update**: Each cell's velocity increases by gravity (0.15) and decays (0.7)
3. **Movement Logic**:
   - If cell below is empty (< 0.8), flow directly down
   - If below blocked, try below-left or below-right (cascading)
   - If all blocked, flow sideways to emptier neighbors
4. **Rendering**: Map density to ASCII chars with Kanagawa sand colors

**Color Palette (Kanagawa):**
| Density Range | Character | Color |
|---------------|-----------|-------|
| 0-30% | ` .·:` | Dark sand (#8C7850) |
| 30-60% | `;oO` | Mid sand (#B4A064) |
| 60-100% | `@` | Light gold (#FFC864) |

### Pretext Integration

```javascript
// Prepare text measurement for consistent character widths
const prepared = prepare('W', '14px monospace');

// Measure each character's width for proper spacing
const result = layout(prepared, cellSize * 2, 14);
charWidths[char] = result.width;
```

This ensures all ASCII characters render with consistent, accurate widths across different viewports.

---

## AsciiLiquid Simulation

### Concept
A fluid simulation using simplified Navier-Stokes principles adapted for ASCII rendering. Particles have both vertical and horizontal velocity, creating wave-like flow patterns and pressure-based spreading.

### Physics Model

The liquid simulation uses a **simplified fluid dynamics** approach:

```
┌─────────────────────────────────────────────────────┐
│              LIQUID PHYSICS RULES                   │
├─────────────────────────────────────────────────────┤
│  1. Gravity: weak downward pull                    │
│  2. Velocity: X and Y components with damping     │
│  3. Pressure: flows to lower density areas         │
│  4. Horizontal spread: liquids level out          │
│  5. Wave propagation via velocity transfer         │
└─────────────────────────────────────────────────────┘
```

### Implementation Details

**Grid Structure:**
```javascript
grid[y][x] = {
    amount: 0-1,        // Liquid density
    velocityX: -1 to 1, // Horizontal velocity
    velocityY: -1 to 1  // Vertical velocity
}
```

**Update Loop (per frame):**
1. **Input Handling**: Mouse/touch adds liquid with initial downward velocity
2. **Velocity Update**: 
   - Gravity adds to Y velocity (0.04/frame)
   - Damping reduces velocity (0.96-0.94)
   - Noise adds turbulence for organic movement
3. **Flow Logic**:
   - First try flowing straight down
   - If blocked, try diagonals
   - If blocked, spread horizontally to empty cells
   - Pressure equalization: dense cells push to sparse neighbors
4. **Horizontal Leveling**: Heavy cells push excess to neighbors for water-leveling effect
5. **Rendering**: Map density to water-themed ASCII chars with blue-cyan gradient

**Color Palette (Kanagawa Water):**
| Density Range | Character | Color |
|---------------|-----------|-------|
| 0-25% | ` .·:` | Deep blue (#1E325A) |
| 25-50% | `;~-+` | Mid blue (#3C64A0) |
| 50-75% | `*oO` | Light blue (#6496C8) |
| 75-100% | `@` | Cyan/foam (#50A0C8) |

### Pretext Integration

Same as Sand - uses `prepare()` and `layout()` to get accurate character widths for consistent ASCII rendering.

---

## Shared Architecture

### Canvas Setup
Both simulations share identical canvas configuration:
```javascript
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
position: fixed;
z-index: -100;  // Behind all content
pointerEvents: auto;  // Capture mouse/touch
```

### Event Handling
- `mousedown` / `touchstart`: Activate input
- `mousemove` / `touchmove`: Update cursor position
- `mouseup` / `touchend`: Deactivate input

### Frame Throttling
- 33ms throttle (~30fps) for smooth but readable updates
- Pretext initialization with fallback on failure

### Color Interpolation
Both use linear interpolation (lerp) between Kanagawa palette colors:
```javascript
function lerpColor(color1, color2, t) {
    return [
        Math.round(lerp(color1[0], color2[0], t)),
        Math.round(lerp(color1[1], color2[1], t)),
        Math.round(lerp(color1[2], color2[2], t)),
    ];
}
```

---

## Performance Considerations

| Aspect | Sand | Liquid |
|--------|------|--------|
| Cell Size | 12px | 12px |
| Update Rate | ~25fps (40ms) | ~30fps (33ms) |
| Grid Size (1920x1080) | 160x90 | 160x90 |
| Physics Complexity | Low | Medium |

### Optimization Techniques:
1. **Boundary Checks**: Skip edge cells (x=0, x=col-1, y=rows-1)
2. **Density Thresholds**: Skip cells with amount < 0.05-0.08
3. **Optional Chaining**: Use `grid[y]?.[x]` for safe array access
4. **Local Variables**: Cache grid references in loops

---

## File Structure

```
src/components/
├── AsciiSmoke.jsx    - Smoke/fog fluid simulation
├── AsciiSand.jsx     - Gravity-based falling sand
├── AsciiLiquid.jsx   - Fluid dynamics simulation
├── SimulationSelector.jsx - Tab bar to switch simulations
└── SimulationSelector.css - Selector styling
```

---

## Usage

Switch between simulations using the top bar:
- ☁ **Smoke**: Rising, flowing particles
- ▓ **Sand**: Falling, piling particles  
- 💧 **Liquid**: Fluid, spreading particles

Click and drag anywhere on screen to interact with the active simulation.

---

## Credits

- **Pretext**: @chenglou/pretext for text measurement
- **Color Scheme**: Kanagawa VSCode theme
- **Physics**: Simplified cellular automata / fluid dynamics