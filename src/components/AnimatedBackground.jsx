import { useEffect, useRef } from 'react';

// Constellation en fond :
// - les particules dérivent en continu, chacune à sa profondeur (parallaxe au défilement) ;
// - la souris (ou le doigt) les écarte, et un geste rapide les entraîne dans son sillage ;
// - les particules proches se relient par des fils, et la souris se relie à celles qui l'entourent ;
// - une partie prend la couleur du statut Discord (--ambient-tint, posé par AmbientBackdrop).

const WHITE = '226, 232, 240';
const BLUE = '125, 211, 252';
const DEFAULT_TINT = '56, 189, 248';

const LINK_DIST = 130;
const POINTER_RADIUS = 190;
const POINTER_LINK = 200;

function getParticleCount(width) {
    if (width < 768) return 34;
    if (width < 1280) return 60;
    return 80;
}

function readTint() {
    const value = getComputedStyle(document.documentElement).getPropertyValue('--ambient-tint').trim();
    return value || DEFAULT_TINT;
}

export default function AnimatedBackground() {
    const canvasRef = useRef(null);

    const reducedMotion =
        typeof window !== 'undefined' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    useEffect(() => {
        if (reducedMotion) return;

        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (!ctx) return;

        let width = window.innerWidth;
        let height = window.innerHeight;
        let particles = [];
        let frame = null;
        let running = true;
        let tick = 0;
        let tint = readTint();

        const pointer = { x: -9999, y: -9999, vx: 0, vy: 0, active: false };
        let lastScrollY = window.scrollY;

        function resize() {
            width = window.innerWidth;
            height = window.innerHeight;
            const dpr = Math.min(window.devicePixelRatio || 1, 2);
            canvas.width = Math.floor(width * dpr);
            canvas.height = Math.floor(height * dpr);
            canvas.style.width = `${width}px`;
            canvas.style.height = `${height}px`;
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        }

        function createParticle() {
            const depth = Math.random() * 0.8 + 0.2; // 0.2 = loin, 1 = proche
            const angle = Math.random() * Math.PI * 2;
            const speed = (Math.random() * 0.35 + 0.15) * depth;
            const roll = Math.random();
            return {
                x: Math.random() * width,
                y: Math.random() * height,
                depth,
                size: 0.6 + depth * 1.5,
                baseVx: Math.cos(angle) * speed,
                baseVy: Math.sin(angle) * speed,
                vx: 0,
                vy: 0,
                alpha: 0.25 + depth * 0.45,
                twinkle: Math.random() * Math.PI * 2,
                kind: roll < 0.35 ? 'tint' : roll < 0.65 ? 'blue' : 'white',
            };
        }

        function init() {
            particles = Array.from({ length: getParticleCount(width) }, createParticle);
            particles.forEach((p) => {
                p.vx = p.baseVx;
                p.vy = p.baseVy;
            });
        }

        function colorOf(p) {
            if (p.kind === 'tint') return tint;
            return p.kind === 'blue' ? BLUE : WHITE;
        }

        // Économie d'énergie : sans souris ni défilement depuis IDLE_MS, on ne dessine
        // qu'une image sur deux. Les déplacements sont doublés à chaque image dessinée,
        // donc la vitesse apparente reste identique.
        const IDLE_MS = 6000;
        let lastActivity = performance.now();
        let frameCount = 0;

        function draw(step) {
            tick += step;
            if (tick % 30 < step) tint = readTint();

            ctx.clearRect(0, 0, width, height);

            // Parallaxe : les particules proches défilent plus vite que les lointaines.
            const scrollY = window.scrollY;
            const scrollDelta = scrollY - lastScrollY;
            lastScrollY = scrollY;
            if (scrollDelta !== 0) lastActivity = performance.now();

            // Halo doux sous le pointeur, à la couleur du statut.
            if (pointer.active) {
                const glow = ctx.createRadialGradient(pointer.x, pointer.y, 0, pointer.x, pointer.y, 260);
                glow.addColorStop(0, `rgba(${tint}, 0.07)`);
                glow.addColorStop(1, `rgba(${tint}, 0)`);
                ctx.fillStyle = glow;
                ctx.fillRect(pointer.x - 260, pointer.y - 260, 520, 520);
            }

            // Le sillage du geste s'atténue rapidement.
            pointer.vx *= 0.85;
            pointer.vy *= 0.85;

            for (let i = 0; i < particles.length; i++) {
                const p = particles[i];

                if (pointer.active) {
                    const dx = p.x - pointer.x;
                    const dy = p.y - pointer.y;
                    const dist = Math.hypot(dx, dy);
                    if (dist < POINTER_RADIUS && dist > 0.1) {
                        const falloff = 1 - dist / POINTER_RADIUS;
                        const push = falloff * falloff * 1.4 * p.depth;
                        p.vx += (dx / dist) * push + pointer.vx * 0.03 * falloff;
                        p.vy += (dy / dist) * push + pointer.vy * 0.03 * falloff;
                    }
                }

                // Retour progressif à la dérive naturelle.
                p.vx += (p.baseVx - p.vx) * 0.03 * step;
                p.vy += (p.baseVy - p.vy) * 0.03 * step;

                p.x += p.vx * step;
                p.y += p.vy * step - scrollDelta * p.depth * 0.25;

                if (p.x < -20) p.x = width + 20;
                else if (p.x > width + 20) p.x = -20;
                if (p.y < -20) p.y = height + 20;
                else if (p.y > height + 20) p.y = -20;
            }

            // Fils entre particules proches.
            ctx.lineWidth = 0.6;
            for (let i = 0; i < particles.length; i++) {
                const a = particles[i];
                for (let j = i + 1; j < particles.length; j++) {
                    const b = particles[j];
                    const dx = a.x - b.x;
                    if (dx > LINK_DIST || dx < -LINK_DIST) continue;
                    const dy = a.y - b.y;
                    if (dy > LINK_DIST || dy < -LINK_DIST) continue;
                    const dist = Math.hypot(dx, dy);
                    if (dist < LINK_DIST) {
                        const strength = (1 - dist / LINK_DIST) * Math.min(a.depth, b.depth);
                        ctx.strokeStyle = `rgba(${WHITE}, ${strength * 0.16})`;
                        ctx.beginPath();
                        ctx.moveTo(a.x, a.y);
                        ctx.lineTo(b.x, b.y);
                        ctx.stroke();
                    }
                }
            }

            // Fils entre le pointeur et les particules autour.
            if (pointer.active) {
                ctx.lineWidth = 1;
                for (let i = 0; i < particles.length; i++) {
                    const p = particles[i];
                    const dist = Math.hypot(p.x - pointer.x, p.y - pointer.y);
                    if (dist < POINTER_LINK) {
                        ctx.strokeStyle = `rgba(${tint}, ${(1 - dist / POINTER_LINK) * 0.6})`;
                        ctx.beginPath();
                        ctx.moveTo(pointer.x, pointer.y);
                        ctx.lineTo(p.x, p.y);
                        ctx.stroke();
                    }
                }
            }

            // Particules.
            for (let i = 0; i < particles.length; i++) {
                const p = particles[i];
                const twinkle = 0.75 + Math.sin(tick * 0.02 + p.twinkle) * 0.25;
                ctx.fillStyle = `rgba(${colorOf(p)}, ${p.alpha * twinkle})`;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        function loop(now) {
            if (!running) return;
            frameCount += 1;
            const idle = (now ?? performance.now()) - lastActivity > IDLE_MS;
            if (!idle) draw(1);
            else if (frameCount % 2 === 0) draw(2);
            frame = requestAnimationFrame(loop);
        }

        let resizeTimer = null;
        const onResize = () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                resize();
                init();
            }, 150);
        };

        const onPointerMove = (event) => {
            if (pointer.active) {
                pointer.vx = event.clientX - pointer.x;
                pointer.vy = event.clientY - pointer.y;
            }
            pointer.x = event.clientX;
            pointer.y = event.clientY;
            pointer.active = true;
            lastActivity = performance.now();
        };

        // Au doigt : le navigateur annule le pointeur dès qu'on défile, on suit donc aussi touchmove.
        const onTouchMove = (event) => {
            const touch = event.touches[0];
            if (touch) onPointerMove(touch);
        };

        const onPointerEnd = (event) => {
            if (event.pointerType !== 'mouse') pointer.active = false;
        };

        const onLeave = () => {
            pointer.active = false;
        };

        const onVisibilityChange = () => {
            if (document.hidden) {
                running = false;
                if (frame) cancelAnimationFrame(frame);
                frame = null;
            } else if (!running) {
                running = true;
                lastScrollY = window.scrollY;
                loop();
            }
        };

        resize();
        init();
        loop();

        window.addEventListener('resize', onResize, { passive: true });
        window.addEventListener('pointermove', onPointerMove, { passive: true });
        window.addEventListener('pointerdown', onPointerMove, { passive: true });
        window.addEventListener('pointerup', onPointerEnd, { passive: true });
        window.addEventListener('touchmove', onTouchMove, { passive: true });
        window.addEventListener('touchend', onLeave, { passive: true });
        document.documentElement.addEventListener('pointerleave', onLeave);
        document.addEventListener('visibilitychange', onVisibilityChange);

        return () => {
            running = false;
            if (frame) cancelAnimationFrame(frame);
            clearTimeout(resizeTimer);
            window.removeEventListener('resize', onResize);
            window.removeEventListener('pointermove', onPointerMove);
            window.removeEventListener('pointerdown', onPointerMove);
            window.removeEventListener('pointerup', onPointerEnd);
            window.removeEventListener('touchmove', onTouchMove);
            window.removeEventListener('touchend', onLeave);
            document.documentElement.removeEventListener('pointerleave', onLeave);
            document.removeEventListener('visibilitychange', onVisibilityChange);
        };
    }, [reducedMotion]);

    if (reducedMotion) return null;

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 pointer-events-none"
            style={{ zIndex: -2 }}
            aria-hidden
        />
    );
}
