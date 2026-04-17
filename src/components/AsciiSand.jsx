import { useEffect, useRef, useState } from 'react';

const ASCII_CHARS = ' .·˙`′,:;Il!i><~+_-?][}{1)(|\\/tfjrxnuvczXYUJCLQ0OZmwqpdbkhao*#MW&8%B@$';

const PALETTE = {
    bgDark:    [12,  12,  18],
    dustFaint: [60,  55,  45],
    sandDark:  [100, 85,  55],
    sandMid:   [140, 115, 70],
    sandLight: [180, 150, 95],
    accentGold:[210, 175, 100],
};

function lerp(a, b, t) { return a + (b - a) * t; }

function lerpColor(c1, c2, t) {
    return [
        Math.round(lerp(c1[0], c2[0], t)),
        Math.round(lerp(c1[1], c2[1], t)),
        Math.round(lerp(c1[2], c2[2], t)),
    ];
}

function getChar(density) {
    const idx = Math.floor(density * (ASCII_CHARS.length - 1));
    return ASCII_CHARS[Math.max(0, Math.min(idx, ASCII_CHARS.length - 1))];
}

export default function AsciiSand({ className }) {
    const canvasRef    = useRef(null);
    const gridRef      = useRef(null);
    const mouseRef     = useRef({ x: 0, y: 0 });
    const animRef      = useRef(null);
    const lastTimeRef  = useRef(0);
    const timeRef      = useRef(0);
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

    useEffect(() => {
        const onResize = () => setDimensions({ width: window.innerWidth, height: window.innerHeight });
        onResize();
        window.addEventListener('resize', onResize);
        return () => window.removeEventListener('resize', onResize);
    }, []);

    useEffect(() => {
        if (!dimensions.width || !dimensions.height) return;

        const isMobile = dimensions.width < 768;
        const isSmallMobile = dimensions.width < 480;
        const CELL = isSmallMobile ? 10 : isMobile ? 12 : 16;
        const fontSize = isSmallMobile ? 8 : isMobile ? 10 : 14;
        const cols = Math.ceil(dimensions.width  / CELL);
        const rows = Math.ceil(dimensions.height / CELL);

        // Each cell: density [0,1], life [0,1] (separate fade track), settled flag
        const makeGrid = () => {
            const g = [];
            for (let y = 0; y < rows; y++) {
                g[y] = [];
                for (let x = 0; x < cols; x++) {
                    g[y][x] = { density: 0, life: 0, settled: false };
                }
            }
            return g;
        };

        gridRef.current = makeGrid();
        mouseRef.current = { x: cols / 2, y: rows * 0.2 };

        const canvas = canvasRef.current;
        const ctx    = canvas.getContext('2d');
        canvas.width  = dimensions.width;
        canvas.height = dimensions.height;

        // Mouse tracking
        const onMouseMove = (e) => {
            mouseRef.current = {
                x: (e.clientX / dimensions.width)  * cols,
                y: (e.clientY / dimensions.height) * rows,
            };
        };
        const onTouch = (e) => {
            if (!e.touches.length) return;
            mouseRef.current = {
                x: (e.touches[0].clientX / dimensions.width)  * cols,
                y: (e.touches[0].clientY / dimensions.height) * rows,
            };
        };
        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('touchmove',  onTouch, { passive: true });
        window.addEventListener('touchstart', onTouch, { passive: true });

        // ── helper: spawn a grain at (gx, gy) ──────────────────────────────
        const spawnGrain = (gx, gy, strength = 1) => {
            const x = Math.round(gx);
            const y = Math.round(gy);
            if (x < 0 || x >= cols || y < 0 || y >= rows) return;
            const cell = gridRef.current[y][x];
            if (cell.density < 0.95) {
                cell.density = Math.min(1, cell.density + 0.35 * strength);
                cell.life    = 1.0; // full life on spawn
                cell.settled = false;
            }
        };

        const update = () => {
            const now = Date.now();
            if (lastTimeRef.current && now - lastTimeRef.current < 33) {
                animRef.current = requestAnimationFrame(update);
                return;
            }
            lastTimeRef.current = now;
            timeRef.current += 0.016;
            const t    = timeRef.current;
            const grid = gridRef.current;
            const mx   = mouseRef.current.x;
            const my   = mouseRef.current.y;

            // ── 1. EMIT from cursor (continuous) ────────────────────────────
            const emitRadius = 5;
            for (let dy = -emitRadius; dy <= emitRadius; dy++) {
                for (let dx = -emitRadius; dx <= emitRadius; dx++) {
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist <= emitRadius) {
                        const strength = (1 - dist / emitRadius) * 0.9;
                        spawnGrain(mx + dx, my + dy, strength);
                    }
                }
            }

            // ── 2. EMIT from ambient top-edge sources ───────────────────────
            // Disabled to restrict spawn only to the mouse cursor

            // ── 3. CELLULAR AUTOMATON PHYSICS (bottom-up pass) ──────────────
            // Use shuffled x order to avoid directional bias
            const order = Array.from({ length: cols }, (_, i) => i);
            // Fisher-Yates shuffle (deterministic per frame with time seed)
            for (let i = cols - 1; i > 0; i--) {
                const j = Math.floor(Math.abs(Math.sin(t * 31.7 + i * 17.3)) * (i + 1));
                [order[i], order[j]] = [order[j], order[i]];
            }

            for (let y = rows - 2; y >= 0; y--) {
                for (let xi = 0; xi < cols; xi++) {
                    const x = order[xi];
                    const cell = grid[y][x];
                    if (cell.density < 0.1) continue;
                    if (cell.settled) continue;

                    const below      = grid[y + 1]?.[x];
                    const belowLeft  = grid[y + 1]?.[x - 1];
                    const belowRight = grid[y + 1]?.[x + 1];

                    if (below && below.density < 0.85) {
                        // Fall straight down
                        const transfer = Math.min(cell.density, 0.5);
                        below.density = Math.min(1, below.density + transfer);
                        below.life    = Math.max(below.life, cell.life);
                        below.settled = false;
                        cell.density -= transfer;
                    } else {
                        // Try diagonal — randomise left/right to avoid bias
                        const tryLeft  = Math.sin(t * 17 + x + y) > 0;
                        const a = tryLeft ? belowLeft  : belowRight;
                        const b = tryLeft ? belowRight : belowLeft;

                        if (a && a.density < 0.72) {
                            const transfer = Math.min(cell.density, 0.35);
                            a.density = Math.min(1, a.density + transfer);
                            a.life    = Math.max(a.life, cell.life);
                            a.settled = false;
                            cell.density -= transfer;
                        } else if (b && b.density < 0.72) {
                            const transfer = Math.min(cell.density, 0.35);
                            b.density = Math.min(1, b.density + transfer);
                            b.life    = Math.max(b.life, cell.life);
                            b.settled = false;
                            cell.density -= transfer;
                        } else {
                            // Nowhere to go → mark as settled
                            cell.settled = true;
                        }
                    }

                    if (cell.density < 0.05) {
                        cell.density = 0;
                        cell.life    = 0;
                    }
                }
            }

            // Bottom row: settled grains pile here indefinitely, life still fades
            for (let x = 0; x < cols; x++) {
                const cell = grid[rows - 1][x];
                if (cell.density > 0) cell.settled = true;
            }

            // ── 4. FADE over time ─────────────────────────────────────────
            // life ticks down; density only follows when life is very low
            for (let y = 0; y < rows; y++) {
                for (let x = 0; x < cols; x++) {
                    const cell = grid[y][x];
                    if (cell.life > 0) {
                        cell.life -= 0.015; // ~66 frames to fully fade
                        if (cell.life < 0) cell.life = 0;
                        // Only bleed density once life is nearly gone
                        if (cell.life < 0.15) {
                            cell.density *= 0.97;
                        }
                    } else {
                        cell.density *= 0.95; // accelerate disappearance
                    }
                }
            }

            // ── 5. RENDER ────────────────────────────────────────────────────
            const [bgR, bgG, bgB] = PALETTE.bgDark;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = `rgb(${bgR},${bgG},${bgB})`;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.font = `${fontSize}px monospace`;
            ctx.textBaseline = 'top';

            for (let y = 0; y < rows; y++) {
                for (let x = 0; x < cols; x++) {
                    const cell = grid[y][x];
                    if (cell.density < 0.06) continue;

                    const d    = Math.min(1, cell.density);
                    const fade = Math.min(1, cell.life);
                    const char = getChar(d);

                    let color;
                    if (d < 0.3) color = lerpColor(PALETTE.dustFaint,  PALETTE.sandDark,  d / 0.3);
                    else if (d < 0.6) color = lerpColor(PALETTE.sandDark,  PALETTE.sandMid,   (d - 0.3) / 0.3);
                    else if (d < 0.85) color = lerpColor(PALETTE.sandMid,   PALETTE.sandLight, (d - 0.6) / 0.25);
                    else color = lerpColor(PALETTE.sandLight, PALETTE.accentGold, (d - 0.85) / 0.15);

                    // alpha: density-driven base * life fade * 0.15 (set to 15%)
                    const alpha = (Math.min(1, (d * 0.6 + 0.4)) * Math.min(1, fade * 2)) * 0.3;
                    ctx.fillStyle = `rgba(${color[0]},${color[1]},${color[2]},${alpha.toFixed(3)})`;
                    ctx.fillText(char, x * CELL, y * CELL);
                }
            }

            animRef.current = requestAnimationFrame(update);
        };

        animRef.current = requestAnimationFrame(update);

        return () => {
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('touchmove',  onTouch);
            window.removeEventListener('touchstart', onTouch);
            if (animRef.current) cancelAnimationFrame(animRef.current);
        };
    }, [dimensions]);

    return (
        <canvas
            ref={canvasRef}
            className={className}
            style={{
                position: 'fixed',
                top: 0, left: 0,
                width: '100vw', height: '100vh',
                pointerEvents: 'none',
                zIndex: -100,
            }}
        />
    );
}