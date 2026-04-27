import { useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const COLORS = {
    bgMain: '#030406',
    bgGradient: '#000000',
    glow: '#1F4C8F',
    highlight: '#2E6BD6'
};

export default function AnimatedBackground() {
    const canvasRef = useRef(null);
    const mouseRef = useRef({ x: -1, y: -1, vx: 0, vy: 0 });
    const lastMouseRef = useRef({ x: -1, y: -1 });

    // Forcer à false pour ignorer le réglage OS (ex: Windows optimisé) et toujours afficher les particules
    const reducedMotion = false;
    const isTouch =
        typeof window !== 'undefined' &&
        window.matchMedia('(hover: none) and (pointer: coarse)').matches;
    const lowPerformance =
        typeof navigator !== 'undefined' &&
        Boolean(
            (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4) ||
            (navigator.deviceMemory && navigator.deviceMemory <= 4)
        );
    const optimizeVisuals = isTouch || lowPerformance;

    const { scrollY } = useScroll();
    const orbY1 = useTransform(scrollY, [0, 2600], [0, -180]);
    const orbY2 = useTransform(scrollY, [0, 2600], [0, -120]);
    const orbOpacity = useTransform(scrollY, [0, 500], [0.4, 0.7]);

    useEffect(() => {
        if (reducedMotion) return;

        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let viewportWidth = window.innerWidth;
        let viewportHeight = window.innerHeight;
        let frame;
        let running = true;
        let particles = [];
        const COUNT = optimizeVisuals ? 30 : 70;

        function resize() {
            viewportWidth = window.innerWidth;
            viewportHeight = window.innerHeight;
            const dpr = Math.min(window.devicePixelRatio || 1, optimizeVisuals ? 1 : 1.5);
            canvas.width = Math.floor(viewportWidth * dpr);
            canvas.height = Math.floor(viewportHeight * dpr);
            canvas.style.width = `${viewportWidth}px`;
            canvas.style.height = `${viewportHeight}px`;
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        }

        function createParticle() {
            const isHighlight = Math.random() > 0.6;
            return {
                x: Math.random() * viewportWidth,
                y: Math.random() * viewportHeight,
                size: Math.random() * 1.5 + 0.8,
                vx: (Math.random() - 0.5) * 0.4,
                vy: (Math.random() - 0.5) * 0.4,
                color: isHighlight ? COLORS.highlight : COLORS.glow,
            };
        }

        function initParticles() {
            particles = Array.from({ length: COUNT }, createParticle);
        }

        function drawFrame() {
            ctx.clearRect(0, 0, viewportWidth, viewportHeight);

            const mx = mouseRef.current.x;
            const my = mouseRef.current.y;
            const hasPointer = mx >= 0 && my >= 0;

            if (hasPointer && !isTouch && !optimizeVisuals) {
                const gradient = ctx.createRadialGradient(mx, my, 0, mx, my, 400);
                gradient.addColorStop(0, 'rgba(46, 107, 214, 0.08)'); // highlight
                gradient.addColorStop(0.4, 'rgba(31, 76, 143, 0.03)'); // glow
                gradient.addColorStop(1, 'rgba(0, 0, 0, 0)'); // transparent
                
                ctx.fillStyle = gradient;
                ctx.fillRect(0, 0, viewportWidth, viewportHeight);
            }

            for (let i = 0; i < particles.length; i++) {
                const p = particles[i];

                p.x += p.vx;
                p.y += p.vy;

                if (p.x < 0) { p.x = 0; p.vx *= -1; }
                if (p.x > viewportWidth) { p.x = viewportWidth; p.vx *= -1; }
                if (p.y < 0) { p.y = 0; p.vy *= -1; }
                if (p.y > viewportHeight) { p.y = viewportHeight; p.vy *= -1; }

                if (hasPointer && !isTouch) {
                    const dx = mx - p.x;
                    const dy = my - p.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    const influence = 180;
                    
                    if (dist < influence) {
                        ctx.beginPath();
                        ctx.strokeStyle = `rgba(46, 107, 214, ${0.25 * (1 - dist / influence)})`;
                        ctx.lineWidth = 1;
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(mx, my);
                        ctx.stroke();

                        const force = (influence - dist) / influence;
                        p.x -= (dx / dist) * force * 0.8;
                        p.y -= (dy / dist) * force * 0.8;
                    }
                }

                if (!optimizeVisuals) {
                    for (let j = i + 1; j < particles.length; j++) {
                        const p2 = particles[j];
                        const dx = p.x - p2.x;
                        const dy = p.y - p2.y;
                        const dist = Math.sqrt(dx * dx + dy * dy);
                        const connectionDistance = 100;
                        
                        if (dist < connectionDistance) {
                            ctx.beginPath();
                            // Lignes fines et élégantes, bleu subtil
                            ctx.strokeStyle = `rgba(46, 107, 214, ${0.35 * (1 - dist / connectionDistance)})`;
                            ctx.lineWidth = 1.0;
                            ctx.moveTo(p.x, p.y);
                            ctx.lineTo(p2.x, p2.y);
                            ctx.stroke();
                        }
                    }
                }

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fillStyle = p.color;
                if (!optimizeVisuals) {
                    ctx.shadowBlur = 12;
                    ctx.shadowColor = p.color;
                }
                ctx.fill();
                if (!optimizeVisuals) {
                    ctx.shadowBlur = 0;
                }
            }
        }

        function loop() {
            if (!running) return;
            drawFrame();
            frame = requestAnimationFrame(loop);
        }

        const onResize = () => {
            resize();
            initParticles();
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
                if (frame) cancelAnimationFrame(frame);
                frame = null;
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

        window.addEventListener('resize', onResize);
        window.addEventListener('mousemove', onMouseMove, { passive: true });
        document.addEventListener('mouseleave', onMouseLeave);
        document.addEventListener('visibilitychange', onVisibilityChange);

        return () => {
            running = false;
            if (frame) cancelAnimationFrame(frame);
            window.removeEventListener('resize', onResize);
            window.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseleave', onMouseLeave);
            document.removeEventListener('visibilitychange', onVisibilityChange);
        };
    }, [isTouch, optimizeVisuals, reducedMotion]);

    return (
        <>
            <div
                className="fixed inset-0 z-[-4]"
                style={{ 
                    background: `linear-gradient(145deg, ${COLORS.bgMain} 0%, ${COLORS.bgGradient} 100%)` 
                }}
            />

            {!optimizeVisuals && <div className="grid-lines" />}
            {!optimizeVisuals && <div className="noise" />}

            {!reducedMotion && !optimizeVisuals && (
                <>
                    <motion.div style={{ y: orbY1, opacity: orbOpacity }} className="fixed pointer-events-none z-[-3]" aria-hidden>
                        <div
                            className="w-[500px] h-[500px] rounded-full"
                            style={{
                                position: 'fixed',
                                top: '5%',
                                left: '-5%',
                                background: `radial-gradient(circle, rgba(31, 76, 143, 0.12) 0%, transparent 65%)`,
                                filter: 'blur(90px)',
                            }}
                        />
                    </motion.div>

                    <motion.div style={{ y: orbY2, opacity: orbOpacity }} className="fixed pointer-events-none z-[-3]" aria-hidden>
                        <div
                            className="w-[400px] h-[400px] rounded-full"
                            style={{
                                position: 'fixed',
                                top: '60%',
                                right: '-10%',
                                background: `radial-gradient(circle, rgba(46, 107, 214, 0.08) 0%, transparent 65%)`,
                                filter: 'blur(90px)',
                            }}
                        />
                    </motion.div>
                </>
            )}

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
