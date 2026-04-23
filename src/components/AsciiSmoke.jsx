import { useEffect, useRef, useState } from 'react';

const ASCII_CHARS = ' .,:;Il!i><~+_-?][}{1)(|\\/tfjrxnuvczXYUJCLQ0OZmwqpdbkhao*#MW&8%B@$';

const KANAWAGA = {
    bgDark: [12, 12, 18],
    textMuted: [100, 100, 95],
    textSecondary: [180, 170, 140],
    textPrimary: [210, 205, 180],
    accentBlue: [126, 156, 216],
    accentCyan: [127, 180, 202],
};

function getChar(density) {
    const index = Math.floor(density * (ASCII_CHARS.length - 1));
    return ASCII_CHARS[Math.max(0, Math.min(index, ASCII_CHARS.length - 1))];
}

function lerp(a, b, t) {
    return a + (b - a) * t;
}

function lerpColor(color1, color2, t) {
    return [
        Math.round(lerp(color1[0], color2[0], t)),
        Math.round(lerp(color1[1], color2[1], t)),
        Math.round(lerp(color1[2], color2[2], t)),
    ];
}

export default function AsciiSmoke({ className }) {
    const canvasRef = useRef(null);
    const gridRef = useRef(null);
    const mouseRef = useRef({ x: -999, y: -999 });
    const animationRef = useRef(null);
    const lastTimeRef = useRef(0);
    const timeRef = useRef(0);
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

    useEffect(() => {
        const updateDimensions = () => {
            setDimensions({ width: window.innerWidth, height: window.innerHeight });
        };
        updateDimensions();
        window.addEventListener('resize', updateDimensions);
        return () => window.removeEventListener('resize', updateDimensions);
    }, []);

    useEffect(() => {
        if (dimensions.width === 0 || dimensions.height === 0) return;

        const isMobile = dimensions.width < 768;
        const isSmallMobile = dimensions.width < 480;
        const cellSize = isSmallMobile ? 10 : isMobile ? 12 : 16;
        const fontSize = isSmallMobile ? 8 : isMobile ? 10 : 14;
        const cols = Math.ceil(dimensions.width / cellSize);
        const rows = Math.ceil(dimensions.height / cellSize);

        const grid = [];
        for (let y = 0; y < rows; y++) {
            grid[y] = [];
            for (let x = 0; x < cols; x++) {
                grid[y][x] = { density: 0, vx: 0, vy: 0 };
            }
        }
        gridRef.current = grid;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        canvas.width = dimensions.width;
        canvas.height = dimensions.height;

        const handleMouseMove = (e) => {
            mouseRef.current = {
                x: e.clientX / cellSize,
                y: e.clientY / cellSize,
            };
        };

        const handleTouchMove = (e) => {
            if (e.touches.length > 0) {
                mouseRef.current = {
                    x: e.touches[0].clientX / cellSize,
                    y: e.touches[0].clientY / cellSize,
                };
            }
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('touchmove', handleTouchMove, { passive: true });

        const update = () => {
            const now = Date.now();
            if (lastTimeRef.current && now - lastTimeRef.current < 33) {
                animationRef.current = requestAnimationFrame(update);
                return;
            }
            lastTimeRef.current = now;
            timeRef.current += 0.01;

            const grid = gridRef.current;
            const mouse = mouseRef.current;
            const [bgR, bgG, bgB] = KANAWAGA.bgDark;

            // --- CIRCULAR CONTINUOUS SPAWN ---
            if (mouse.x !== -999 && mouse.y !== -999) {
                const cx = mouse.x;
                const cy = mouse.y;
                const spawnRadius = 7.0; // Large circular radius

                // Iterate in a square bounds, but filter by distance
                for (let dy = -Math.ceil(spawnRadius); dy <= Math.ceil(spawnRadius); dy++) {
                    for (let dx = -Math.ceil(spawnRadius); dx <= Math.ceil(spawnRadius); dx++) {
                        const nx = Math.floor(cx + dx);
                        const ny = Math.floor(cy + dy);

                        if (nx < 0 || nx >= cols || ny < 0 || ny >= rows) continue;

                        // Pythagorean check for circular shape
                        const distance = Math.sqrt(dx * dx + dy * dy);
                        if (distance > spawnRadius) continue;

                        const cell = grid[ny][nx];

                        // Radial falloff: Higher intensity at center (1.0), zero at edge (0.0)
                        const falloff = 1 - (distance / spawnRadius);
                        const intensity = falloff * 0.45;

                        cell.density = Math.min(2.0, cell.density + intensity * 2);

                        // Upward and outward pressure
                        cell.vy -= intensity * 0.2;
                        cell.vx += (dx / spawnRadius) * 0.05 + (Math.random() - 0.5) * 0.1;
                    }
                }
            }

            // --- PHYSICS ---
            for (let y = 0; y < rows; y++) {
                for (let x = 0; x < cols; x++) {
                    const cell = grid[y][x];
                    if (cell.density < 0.01) {
                        cell.density = 0;
                        continue;
                    }

                    // Buoyancy and momentum
                    cell.vy -= 0.004;
                    cell.vx *= 0.94;
                    cell.vy *= 0.94;

                    // Wave-like turbulence
                    cell.vx += Math.sin(timeRef.current * 2 + y * 0.1) * 0.006;

                    // Advection: Move density to next cell based on velocity
                    const nextX = Math.floor(x + cell.vx);
                    const nextY = Math.floor(y + cell.vy);

                    if (nextX >= 0 && nextX < cols && nextY >= 0 && nextY < rows) {
                        const target = grid[nextY][nextX];
                        const moveAmount = cell.density * 0.25;
                        target.density += moveAmount;
                        cell.density -= moveAmount;
                    }

                    // Decay to prevent screen clogging
                    cell.density *= 0.92;
                }
            }

            // --- RENDER ---
            ctx.fillStyle = `rgb(${bgR}, ${bgG}, ${bgB})`;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.font = `${fontSize}px monospace`;
            ctx.textBaseline = 'top';

            for (let y = 0; y < rows; y++) {
                for (let x = 0; x < cols; x++) {
                    const cell = grid[y][x];
                    if (cell.density > 0.05) {
                        const d = Math.min(1, cell.density);
                        const char = getChar(d);

                        const color = KANAWAGA.textSecondary;

                        ctx.fillStyle = `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${Math.min(1, d * 0.6 + 0.4) * 0.5})`;
                        ctx.fillText(char, x * cellSize, y * cellSize);
                    }
                }
            }

            animationRef.current = requestAnimationFrame(update);
        };

        animationRef.current = requestAnimationFrame(update);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('touchmove', handleTouchMove);
            if (animationRef.current) cancelAnimationFrame(animationRef.current);
        };
    }, [dimensions]);

    return (
        <canvas
            ref={canvasRef}
            className={className}
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                pointerEvents: 'none',
                zIndex: -100,
            }}
        />
    );
}