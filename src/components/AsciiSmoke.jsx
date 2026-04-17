import { useEffect, useRef, useState } from 'react';
import { prepare, layout } from '@chenglou/pretext';

const ASCII_CHARS = ' .·˙`′,:;Il!i><~+_-?][}{1)(|\\/tfjrxnuvczXYUJCLQ0OZmwqpdbkhao*#MW&8%B@$';

const KANAWAGA = {
    bgDark: [12, 12, 18],
    textMuted: [100, 100, 95],
    textSecondary: [180, 170, 140],
    textPrimary: [210, 205, 180],
    accentBlue: [126, 156, 216],
    accentCyan: [127, 180, 202],
};

function getChar(density) {
    const index = Math.floor((1 - density) * (ASCII_CHARS.length - 1));
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
    const mouseRef = useRef({ x: 0, y: 0 });
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

        const cellSize = 16;
        const cols = Math.ceil(dimensions.width / cellSize);
        const rows = Math.ceil(dimensions.height / cellSize);
        
        mouseRef.current = { x: cols / 2, y: rows * 0.85 };

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

        ctx.fillStyle = `rgb(${KANAWAGA.bgDark[0]}, ${KANAWAGA.bgDark[1]}, ${KANAWAGA.bgDark[2]})`;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        let prepared = null;
        let preparedChars = {};
        
        try {
            const fontSize = 14;
            prepared = prepare('W', `${fontSize}px monospace`);
            
            for (let i = 0; i < ASCII_CHARS.length; i++) {
                const char = ASCII_CHARS[i];
                const { width } = layout(prepared, cellSize * 2, fontSize);
                preparedChars[char] = width;
            }
        } catch {
            console.warn('Pretext not available, using canvas fallback');
        }

        const handleMouseMove = (e) => {
            const scaleX = cols / dimensions.width;
            const scaleY = rows / dimensions.height;
            mouseRef.current = {
                x: e.clientX * scaleX,
                y: e.clientY * scaleY
            };
        };
        window.addEventListener('mousemove', handleMouseMove);
        
        const handleTouchMove = (e) => {
            if (e.touches.length > 0) {
                const touch = e.touches[0];
                const scaleX = cols / dimensions.width;
                const scaleY = rows / dimensions.height;
                mouseRef.current = {
                    x: touch.clientX * scaleX,
                    y: touch.clientY * scaleY
                };
            }
        };
        window.addEventListener('touchmove', handleTouchMove, { passive: true });
        window.addEventListener('touchstart', handleTouchMove, { passive: true });

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

            const sourceX = mouse.x;
            const sourceY = mouse.y;
            const spread = Math.max(6, cols * 0.15);

            for (let y = 0; y < rows; y++) {
                for (let x = 0; x < cols; x++) {
                    const cell = grid[y][x];
                    
                    const dx = x - sourceX;
                    const dy = y - sourceY;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    
                    if (dist < spread) {
                        const intensity = (1 - dist / spread) * 0.5;
                        cell.density = Math.min(1, cell.density + intensity * 0.15);
                        
                        const pushAngle = Math.atan2(dy, dx) + Math.sin(timeRef.current * 0.8 + x * 0.15) * 0.4;
                        cell.vx += Math.cos(pushAngle) * intensity * 0.03;
                        cell.vy -= Math.sin(pushAngle) * intensity * 0.025;
                    }
                }
            }

            for (let y = rows - 2; y >= 0; y--) {
                for (let x = 0; x < cols; x++) {
                    const cell = grid[y][x];
                    
                    cell.vy -= 0.0006;
                    cell.vx *= 0.97;
                    cell.vy *= 0.97;
                    
                    const noise = Math.sin(timeRef.current * 2.5 + x * 0.4 + y * 0.3) * 0.003;
                    cell.vx += noise;

                    if (x > 0 && x < cols - 1) {
                        const left = grid[y][x - 1];
                        const right = grid[y][x + 1];
                        cell.vx += (right.density - left.density) * 0.015;
                    }

                    let newX = x + cell.vx;
                    let newY = y + cell.vy;
                    
                    newX = Math.max(0, Math.min(cols - 1, newX));
                    newY = Math.max(0, Math.min(rows - 1, newY));
                    
                    const targetCell = grid[Math.floor(newY)][Math.floor(newX)];
                    
                    if (y < rows - 1) {
                        const flow = cell.density * 0.2;
                        targetCell.density += flow;
                        cell.density -= flow * 0.5;
                    }

                    cell.density *= 0.99;
                }
            }

            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = `rgb(${bgR}, ${bgG}, ${bgB})`;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.font = '14px monospace';
            ctx.textBaseline = 'top';

            for (let y = 0; y < rows; y++) {
                for (let x = 0; x < cols; x++) {
                    const cell = grid[y][x];
                    if (cell.density > 0.02) {
                        const char = getChar(cell.density);
                        const d = cell.density;
                        
                        let color;
                        if (d < 0.2) {
                            color = lerpColor(KANAWAGA.textMuted, KANAWAGA.textSecondary, d / 0.2);
                        } else if (d < 0.5) {
                            color = lerpColor(KANAWAGA.textSecondary, KANAWAGA.textPrimary, (d - 0.2) / 0.3);
                        } else if (d < 0.75) {
                            color = lerpColor(KANAWAGA.textPrimary, KANAWAGA.accentCyan, (d - 0.5) / 0.25);
                        } else {
                            color = lerpColor(KANAWAGA.accentCyan, KANAWAGA.accentBlue, Math.min(1, (d - 0.75) / 0.25));
                        }
                        
                        ctx.fillStyle = `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${Math.min(1, d * 0.7 + 0.4) * 0.15})`;
                        
                        const px = x * cellSize;
                        const py = y * cellSize;
                        
                        ctx.fillText(char, px, py);
                    }
                }
            }

            animationRef.current = requestAnimationFrame(update);
        };

        animationRef.current = requestAnimationFrame(update);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('touchmove', handleTouchMove);
            window.removeEventListener('touchstart', handleTouchMove);
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
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