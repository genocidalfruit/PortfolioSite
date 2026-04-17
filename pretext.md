# Pretext Library Documentation

## Overview

**Pretext** is a fast, accurate, and comprehensive text measurement and layout library for JavaScript/TypeScript. It was created by Cheng Lou (chenglou) and is available as `@chenglou/pretext` on npm.

### Key Features

- **~600x faster** than DOM-based measurement (getBoundingClientRect)
- **Zero dependencies**, ~15KB gzipped
- **Unicode-aware** - handles CJK, Arabic, Hebrew, Thai, Korean, and mixed-script text
- **Framework-agnostic** - works with React, Vue, Svelte, Angular, Solid, or vanilla JS
- **DOM-free** - uses Canvas `measureText()` to tap into the browser's font engine

### The Core Insight

Pretext splits text measurement into two distinct phases:

1. **Prepare** (one-time, expensive) - Segment text, measure glyph widths, cache results
2. **Layout** (fast, reusable) - Pure arithmetic over cached widths to compute line breaks

This architecture allows reusing the prepared handle for multiple container widths without re-measuring.

---

## Installation

```bash
npm install @chenglou/pretext
```

---

## API Reference

### Core Functions

#### `prepare(text, font, options?)`

One-time text analysis and measurement pass. Returns an opaque handle to pass to `layout()`.

```typescript
import { prepare, layout } from '@chenglou/pretext';

const prepared = prepare('Hello, world!', '16px Inter');
```

**Parameters:**
- `text: string` - The text string to measure
- `font: string` - CSS font shorthand (e.g., `'16px Inter'`, `'bold 14px monospace'`)
- `options?: PrepareOptions` - Optional configuration

**Returns:** `PreparedText` - An opaque handle for layout calculations

---

#### `layout(prepared, maxWidth, lineHeight)`

Calculates text height given a max width and line height. Pure arithmetic - no DOM access.

```typescript
const { height, lineCount } = layout(prepared, 400, 24);
console.log(height, lineCount); // e.g., { height: 72, lineCount: 3 }
```

**Parameters:**
- `prepared: PreparedText` - Handle from `prepare()`
- `maxWidth: number` - Container width in pixels
- `lineHeight: number` - Line height in pixels (synced with CSS)

**Returns:** `{ height: number, lineCount: number }`

---

### Advanced Functions

#### `prepareWithSegments(text, font, options?)`

Rich variant of `prepare()` that exposes segment data for manual line rendering. Use when you need to render lines yourself on canvas, SVG, or WebGL.

```typescript
import { prepareWithSegments, layoutWithLines } from '@chenglou/pretext';

const prepared = prepareWithSegments('Hello, world!', '16px monospace');
const { lines } = layoutWithLines(prepared, 400, 24);
```

**Returns:** `PreparedTextWithSegments` - Extends `PreparedText` with a `segments` array

---

#### `layoutWithLines(prepared, maxWidth, lineHeight)`

Like `layout()`, but returns per-line text and width information.

```typescript
const { height, lineCount, lines } = layoutWithLines(prepared, 400, 24);
lines.forEach(line => {
  console.log(line.text, line.width);
});
```

**Returns:** `{ height: number, lineCount: number, lines: LayoutLine[] }`

---

#### `walkLineRanges(prepared, width, onLine)`

Low-level API for manual layout needs. Iterates line boundaries without building strings. Useful for binary-search layouts.

```typescript
walkLineRanges(prepared, 320, (line) => {
  console.log(line.start, line.end, line.width);
});
```

---

#### `layoutNextLine(prepared, cursor, maxWidth)`

Lay out one line at a time with variable width per line. Use for text flowing around floated images.

```typescript
let cursor = { segmentIndex: 0, graphemeIndex: 0 };
while (true) {
  const line = layoutNextLine(prepared, cursor, 300);
  if (!line) break;
  console.log(line.text, line.width);
  cursor = line.end;
}
```

---

### Options

```typescript
type PrepareOptions = {
  whiteSpace?: 'normal' | 'pre-wrap',
  wordBreak?: 'normal' | 'keep-all'
}
```

- `whiteSpace: 'normal'` (default) - Collapses whitespace, ignores `\n`
- `whiteSpace: 'pre-wrap'` - Preserves whitespace and newlines

---

## Usage in This Project

### Implementation: AsciiSmoke Component

The AsciiSmoke component uses Pretext for accurate text measurement in an ASCII smoke fluid simulation. Here's how it's integrated:

```tsx
import { prepare, layout } from '@chenglou/pretext';

// Initialize Pretext with monospace font
const fontSize = 14;
const prepared = prepare('W', `${fontSize}px monospace`);

// Measure each ASCII character width for consistent rendering
for (let i = 0; i < ASCII_CHARS.length; i++) {
    const char = ASCII_CHARS[i];
    const { width } = layout(prepared, cellSize * 2, fontSize);
    preparedChars[char] = width;
}
```

### Key Implementation Details

1. **Font Preparation**: The component prepares a single character ('W') to initialize the text measurement system. This establishes the font metrics.

2. **Character Width Caching**: Each ASCII character in the character set is measured once and cached in `preparedChars`. This enables consistent character spacing.

3. **Fallback Handling**: The component wraps Pretext usage in a try-catch block. If Pretext fails to load, it falls back to using Canvas `measureText()` directly:

```tsx
try {
    const prepared = prepare('W', `${fontSize}px monospace`);
    // ... measure characters
} catch {
    console.warn('Pretext not available, using canvas fallback');
}
```

### Why Pretext?

In this ASCII smoke simulation:
- **Performance**: With hundreds of cells updating each frame, DOM measurement would cause severe performance issues
- **Accuracy**: Pretext uses the browser's font engine as ground truth, ensuring ASCII characters align properly
- **No DOM**: The simulation runs entirely on Canvas, so there's no DOM element to measure
- **Pre-computation**: Character widths are measured once at initialization, then reused throughout the animation

---

## Performance Comparison

| Method | Time per call |
|--------|---------------|
| DOM (getBoundingClientRect) | ~1-2ms |
| Pretext (layout) | ~0.0002ms |

This is approximately **600x faster** than DOM-based measurement, making it ideal for:
- Virtual scrolling lists
- Chat interfaces with variable-height messages
- Real-time text animations
- Canvas/WebGL rendering

---

## Resources

- [Official GitHub](https://github.com/chenglou/pretext)
- [Interactive Playground](https://chenglou.me/pretext/)
- [Documentation Wiki](https://pretext.wiki/)
- [Chenglou's Blog](https://pretextjs.dev/blog/chenglou-pretext)

---

## Credits

Pretext was created by Cheng Lou (chenglou), known for react-motion, ReasonML, and ReScript. The architecture was inspired by Sebastian Markbage's text-layout work from a decade ago.