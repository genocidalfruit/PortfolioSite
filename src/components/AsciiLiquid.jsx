import { useEffect, useRef, useState } from 'react';

const ASCII_CHARS = ' .·˙`′,:;Il!i><~+_-?][}{1)(|\\/tfjrxnuvczXYUJCLQ0OZmwqpdbkhao*#MW&8%B@$';

const PALETTE = {
    bgDark:     [12,  12,  18],
    depthDark:  [5, 8, 15],
    waterDeep:  [8, 18, 35],
    waterMid:   [15, 30, 50],
    waterLight: [25, 50, 70],
    accentCyan: [40, 70, 90],
    foam:       [60, 80, 100],
};

function lerp(a, b, t) { return a + (b - a) * t; }

function lerpColor(c1, c2, t) {
    return [
        Math.round(lerp(c1[0], c2[0], t)),
        Math.round(lerp(c1[1], c2[1], t)),
        Math.round(lerp(c1[2], c2[2], t)),
    ];
}

function getChar(density, t, x, y) {
    const wave = Math.sin(t * 3 + x * 0.4 - y * 0.2) * 0.08;
    const idx = Math.floor(Math.min(1, Math.max(0, density + wave)) * (ASCII_CHARS.length - 1));
    return ASCII_CHARS[idx];
}

export default function AsciiLiquid({ className }) {
    const canvasRef   = useRef(null);
    const gridRef     = useRef(null);
    const mouseRef    = useRef({ x: 0, y: 0 });
    const animRef     = useRef(null);
    const lastTimeRef = useRef(0);
    const timeRef     = useRef(0);
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

        // Each cell:
        //   density [0,1]  — how full of liquid it is
        //   life    [0,1]  — independent fade counter
        //   vx             — horizontal velocity (for splash)
        const makeGrid = () => {
            const g = [];
            for (let y = 0; y < rows; y++) {
                g[y] = [];
                for (let x = 0; x < cols; x++) {
                    g[y][x] = { density: 0, life: 0, vx: 0 };
                }
            }
            return g;
        };

        gridRef.current = makeGrid();
        mouseRef.current = { x: cols / 2, y: rows * 0.3 };

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

        // ── helper: inject liquid into a cell ──────────────────────────────
        const inject = (x, y, amount, vx = 0) => {
            const gx = Math.round(x);
            const gy = Math.round(y);
            if (gx < 0 || gx >= cols || gy < 0 || gy >= rows) return;
            const cell = gridRef.current[gy][gx];
            cell.density = Math.min(1, cell.density + amount);
            cell.life    = 1.0;
            cell.vx += vx;
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

            // ── 1. EMIT from cursor (continuous, every frame) ────────────────
            const emitRadius = 4;
            for (let dy = -emitRadius; dy <= emitRadius; dy++) {
                for (let dx = -emitRadius; dx <= emitRadius; dx++) {
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist <= emitRadius) {
                        const strength = (1 - dist / emitRadius);
                        // slight outward velocity so it spreads from cursor
                        const angle = Math.atan2(dy, dx);
                        inject(mx + dx, my + dy, 0.28 * strength, Math.cos(angle) * strength * 0.04);
                    }
                }
            }

            // ── 2. EMIT from ambient ceiling drip sources ────────────────────
            // Disabled per user request (removes top-right random spawns)

            // ── 3. FLOW PHYSICS (bottom-up pass) ────────────────────────────
            for (let y = rows - 2; y >= 0; y--) {
                for (let x = 0; x < cols; x++) {
                    const cell = grid[y][x];
                    if (cell.density < 0.06) continue;

                    const below      = grid[y + 1]?.[x];
                    const belowLeft  = grid[y + 1]?.[x - 1];
                    const belowRight = grid[y + 1]?.[x + 1];

                    // ── fall straight down ───────────────────────────────
                    if (below && below.density < 0.92) {
                        const flow = Math.min(cell.density, 0.45);
                        below.density = Math.min(1, below.density + flow);
                        below.life    = Math.max(below.life, cell.life);
                        // carry horizontal velocity downward
                        below.vx = lerp(below.vx, cell.vx, 0.3);
                        cell.density -= flow * 0.7;
                    } else {
                        // ── blocked below → diagonal ─────────────────────
                        const goLeft = cell.vx < 0 || (cell.vx === 0 && Math.sin(t * 13 + x * 7 + y) > 0);
                        const a = goLeft ? belowLeft : belowRight;
                        const b = goLeft ? belowRight : belowLeft;

                        if (a && a.density < 0.78) {
                            const flow = Math.min(cell.density, 0.3);
                            a.density = Math.min(1, a.density + flow);
                            a.life    = Math.max(a.life, cell.life);
                            a.vx += goLeft ? -0.03 : 0.03;
                            cell.density -= flow * 0.6;
                        } else if (b && b.density < 0.78) {
                            const flow = Math.min(cell.density, 0.3);
                            b.density = Math.min(1, b.density + flow);
                            b.life    = Math.max(b.life, cell.life);
                            b.vx += goLeft ? 0.03 : -0.03;
                            cell.density -= flow * 0.6;
                        }
                    }

                    if (cell.density < 0.04) { cell.density = 0; cell.vx = 0; }
                }
            }

            // ── 4. SPLASH at bottom row ──────────────────────────────────────
            // When a new drop arrives at row (rows-2) and the cell below is full,
            // convert excess density into horizontal velocity — this is the splash.
            for (let x = 1; x < cols - 1; x++) {
                const cell  = grid[rows - 2][x];
                const floor = grid[rows - 1][x];

                if (cell.density > 0.3 && floor.density > 0.85) {
                    const splashVel = cell.density * 0.4;
                    // Spray left and right
                    const leftTarget  = grid[rows - 2][x - 1];
                    const rightTarget = grid[rows - 2][x + 1];
                    if (leftTarget)  { leftTarget.density  = Math.min(1, leftTarget.density  + splashVel * 0.4); leftTarget.vx  -= splashVel * 0.06; leftTarget.life  = 1; }
                    if (rightTarget) { rightTarget.density = Math.min(1, rightTarget.density + splashVel * 0.4); rightTarget.vx += splashVel * 0.06; rightTarget.life = 1; }
                    cell.density *= 0.55;
                }
            }

            // ── 5. HORIZONTAL PRESSURE FLOW (liquid seeks its level) ─────────
            for (let y = 0; y < rows; y++) {
                for (let x = 1; x < cols - 1; x++) {
                    const cell  = grid[y][x];
                    if (cell.density < 0.12) continue;

                    const left  = grid[y][x - 1];
                    const right = grid[y][x + 1];

                    // Apply vx to push flow sideways
                    const vxClamped = Math.max(-0.15, Math.min(0.15, cell.vx));
                    if (vxClamped > 0 && right && right.density < cell.density - 0.04) {
                        const transfer = Math.min(cell.density - 0.04, vxClamped * cell.density);
                        right.density = Math.min(1, right.density + transfer);
                        right.life    = Math.max(right.life, cell.life);
                        right.vx += vxClamped * 0.5;
                        cell.density -= transfer * 0.8;
                    } else if (vxClamped < 0 && left && left.density < cell.density - 0.04) {
                        const transfer = Math.min(cell.density - 0.04, (-vxClamped) * cell.density);
                        left.density = Math.min(1, left.density + transfer);
                        left.life    = Math.max(left.life, cell.life);
                        left.vx += vxClamped * 0.5;
                        cell.density -= transfer * 0.8;
                    }

                    // Passive pressure equalisation (no velocity)
                    if (left && left.density < cell.density - 0.1) {
                        const transfer = (cell.density - left.density) * 0.07;
                        left.density += transfer;
                        left.life     = Math.max(left.life, cell.life * 0.9);
                        cell.density -= transfer;
                    }
                    if (right && right.density < cell.density - 0.1) {
                        const transfer = (cell.density - right.density) * 0.07;
                        right.density += transfer;
                        right.life     = Math.max(right.life, cell.life * 0.9);
                        cell.density -= transfer;
                    }

                    // Dampen velocity
                    cell.vx *= 0.88;
                }
            }

            // ── 6. FADE over time ────────────────────────────────────────────
            for (let y = 0; y < rows; y++) {
                for (let x = 0; x < cols; x++) {
                    const cell = grid[y][x];
                    if (cell.life > 0) {
                        cell.life -= 0.008; // ~125 frames ≈ 4 seconds at 30fps
                        if (cell.life < 0) cell.life = 0;
                        if (cell.life < 0.18) {
                            cell.density *= 0.975; // density follows life near end
                        }
                    } else if (cell.density > 0) {
                        cell.density *= 0.94;
                    }
                }
            }

            // ── 7. RENDER ────────────────────────────────────────────────────
            const [bgR, bgG, bgB] = PALETTE.bgDark;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = `rgb(${bgR},${bgG},${bgB})`;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.font = `${fontSize}px monospace`;
            ctx.textBaseline = 'top';

            for (let y = 0; y < rows; y++) {
                for (let x = 0; x < cols; x++) {
                    const cell = grid[y][x];
                    if (cell.density < 0.05) continue;

                    const d    = Math.min(1, cell.density);
                    const fade = Math.min(1, cell.life);
                    const char = getChar(d, t, x, y);

                    let color;
                    if (d < 0.2)       color = lerpColor(PALETTE.depthDark,  PALETTE.waterDeep,  d / 0.2);
                    else if (d < 0.45) color = lerpColor(PALETTE.waterDeep,  PALETTE.waterMid,   (d - 0.2)  / 0.25);
                    else if (d < 0.7)  color = lerpColor(PALETTE.waterMid,   PALETTE.waterLight, (d - 0.45) / 0.25);
                    else if (d < 0.88) color = lerpColor(PALETTE.waterLight, PALETTE.accentCyan, (d - 0.7)  / 0.18);
                    else               color = lerpColor(PALETTE.accentCyan, PALETTE.foam,       (d - 0.88) / 0.12);

                    const alpha = (Math.min(1, (d * 0.65 + 0.35)) * Math.min(1, fade * 2)) * 0.3;
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