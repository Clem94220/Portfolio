import { useEffect, useRef } from 'react';

const COLORS = {
    bgTop: '#030508',
    bgBottom: '#010204',
    particleCyan: 'rgba(0, 240, 255, 0.45)',
    particleBlue: 'rgba(99, 140, 255, 0.4)',
    particleWhite: 'rgba(255, 255, 255, 0.5)',
    particleGlow: 'rgba(56, 189, 248, 0.35)',
};

function getParticleCount(width) {
    if (width < 768) return 22;
    if (width < 1280) return 36;
    return 50;
}

export default function AnimatedBackground() {
    const canvasRef = useRef(null);
    const mouseRef = useRef({ x: -1, y: -1 });

    const isTouch =
        typeof window !== 'undefined' &&
        window.matchMedia('(hover: none) and (pointer: coarse)').matches;

    const reducedMotion =
        typeof window !== 'undefined' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // ── Canvas Star / Stardust Animation
    useEffect(() => {
        if (reducedMotion) return;

        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let viewportWidth = window.innerWidth;
        let viewportHeight = window.innerHeight;
        let frame = null;
        let running = true;
        let particles = [];

        function resize() {
            viewportWidth = window.innerWidth;
            viewportHeight = window.innerHeight;
            const dpr = Math.min(window.devicePixelRatio || 1, 2);
            const w = Math.floor(viewportWidth * dpr);
            const h = Math.floor(viewportHeight * dpr);

            if (canvas.width !== w || canvas.height !== h) {
                canvas.width = w;
                canvas.height = h;
                canvas.style.width = `${viewportWidth}px`;
                canvas.style.height = `${viewportHeight}px`;
                ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            }
        }

        function createParticle() {
            const rand = Math.random();
            let color = COLORS.particleWhite;
            if (rand > 0.65) color = COLORS.particleCyan;
            else if (rand > 0.35) color = COLORS.particleBlue;

            return {
                x: Math.random() * viewportWidth,
                y: Math.random() * viewportHeight,
                size: Math.random() * 1.4 + 0.6,
                baseAlpha: Math.random() * 0.4 + 0.2,
                twinkleSpeed: Math.random() * 0.02 + 0.005,
                twinkleOffset: Math.random() * Math.PI * 2,
                vx: (Math.random() - 0.5) * 0.25,
                vy: (Math.random() - 0.5) * 0.25,
                color,
            };
        }

        function initParticles() {
            const count = getParticleCount(viewportWidth);
            particles = Array.from({ length: count }, createParticle);
        }

        let time = 0;

        function drawFrame() {
            ctx.clearRect(0, 0, viewportWidth, viewportHeight);
            time += 0.015;

            const mx = mouseRef.current.x;
            const my = mouseRef.current.y;
            const hasPointer = mx >= 0 && my >= 0 && !isTouch;

            // Subtle mouse proximity glow
            if (hasPointer) {
                const gradient = ctx.createRadialGradient(mx, my, 0, mx, my, 280);
                gradient.addColorStop(0, 'rgba(0, 240, 255, 0.04)');
                gradient.addColorStop(0.5, 'rgba(59, 130, 246, 0.015)');
                gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
                ctx.fillStyle = gradient;
                ctx.fillRect(0, 0, viewportWidth, viewportHeight);
            }

            const len = particles.length;

            for (let i = 0; i < len; i++) {
                const p = particles[i];

                // Drift
                p.x += p.vx;
                p.y += p.vy;

                // Screen Wrap
                if (p.x < 0) p.x = viewportWidth;
                else if (p.x > viewportWidth) p.x = 0;
                if (p.y < 0) p.y = viewportHeight;
                else if (p.y > viewportHeight) p.y = 0;

                // Gentle mouse repulsion
                if (hasPointer) {
                    const dx = mx - p.x;
                    const dy = my - p.y;
                    const distSq = dx * dx + dy * dy;
                    const radiusSq = 140 * 140;

                    if (distSq < radiusSq) {
                        const dist = Math.sqrt(distSq);
                        const force = (140 - dist) / 140;
                        p.x -= (dx / dist) * force * 0.6;
                        p.y -= (dy / dist) * force * 0.6;
                    }
                }

                // Smooth Twinkle
                const alpha = p.baseAlpha + Math.sin(time + p.twinkleOffset) * 0.2;
                const clampedAlpha = Math.max(0.08, Math.min(0.7, alpha));

                ctx.save();
                ctx.globalAlpha = clampedAlpha;
                ctx.fillStyle = p.color;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
            }
        }

        function loop() {
            if (!running) return;
            drawFrame();
            frame = requestAnimationFrame(loop);
        }

        let resizeTimer = null;
        const onResize = () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                resize();
                initParticles();
            }, 150);
        };

        const onMouseMove = (event) => {
            mouseRef.current.x = event.clientX;
            mouseRef.current.y = event.clientY;
        };

        const onMouseLeave = () => {
            mouseRef.current.x = -1;
            mouseRef.current.y = -1;
        };

        const onVisibilityChange = () => {
            if (document.hidden) {
                running = false;
                if (frame) {
                    cancelAnimationFrame(frame);
                    frame = null;
                }
                return;
            }
            if (!running) {
                running = true;
                loop();
            }
        };

        resize();
        initParticles();
        loop();

        window.addEventListener('resize', onResize, { passive: true });
        if (!isTouch) {
            window.addEventListener('mousemove', onMouseMove, { passive: true });
            document.addEventListener('mouseleave', onMouseLeave);
        }
        document.addEventListener('visibilitychange', onVisibilityChange);

        return () => {
            running = false;
            if (frame) cancelAnimationFrame(frame);
            clearTimeout(resizeTimer);
            window.removeEventListener('resize', onResize);
            window.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseleave', onMouseLeave);
            document.removeEventListener('visibilitychange', onVisibilityChange);
        };
    }, [isTouch, reducedMotion]);

    return (
        <>
            {/* Deep Obsidian Gradient Foundation */}
            <div
                className="fixed inset-0 z-[-5]"
                style={{
                    background: `linear-gradient(180deg, ${COLORS.bgTop} 0%, ${COLORS.bgBottom} 100%)`,
                }}
            />

            {/* Ambient Aurora Glows (Subtle, luxury, non-distracting) */}
            <div
                className="fixed top-[-10%] left-[-5%] w-[650px] h-[650px] rounded-full pointer-events-none z-[-4] opacity-25 blur-[120px]"
                style={{
                    background: 'radial-gradient(circle, rgba(30, 58, 138, 0.5) 0%, rgba(2, 132, 199, 0.2) 50%, transparent 70%)',
                }}
                aria-hidden
            />
            <div
                className="fixed top-[45%] right-[-10%] w-[550px] h-[550px] rounded-full pointer-events-none z-[-4] opacity-20 blur-[130px]"
                style={{
                    background: 'radial-gradient(circle, rgba(88, 28, 135, 0.45) 0%, rgba(59, 130, 246, 0.2) 50%, transparent 70%)',
                }}
                aria-hidden
            />
            <div
                className="fixed bottom-[-10%] left-[20%] w-[500px] h-[500px] rounded-full pointer-events-none z-[-4] opacity-15 blur-[120px]"
                style={{
                    background: 'radial-gradient(circle, rgba(14, 116, 144, 0.4) 0%, transparent 70%)',
                }}
                aria-hidden
            />

            {/* Soft, Elegantly-Masked Grid Lines */}
            <div className="grid-lines" aria-hidden />

            {/* Subtle Frosted Film Noise */}
            <div className="noise" aria-hidden />

            {/* Gentle Canvas Particle Stardust */}
            {!reducedMotion && (
                <canvas
                    ref={canvasRef}
                    className="fixed inset-0 pointer-events-none"
                    style={{ zIndex: -2 }}
                    aria-hidden
                />
            )}
        </>
    );
}
