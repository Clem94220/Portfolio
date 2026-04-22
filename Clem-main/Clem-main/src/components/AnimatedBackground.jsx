import { useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { AUDIO_REACTIVE_EVENT } from '../lib/audioReactive';

function cubicBezierPoint(p0, p1, p2, p3, t) {
    const mt = 1 - t;
    const mt2 = mt * mt;
    const t2 = t * t;

    return {
        x: mt2 * mt * p0.x + 3 * mt2 * t * p1.x + 3 * mt * t2 * p2.x + t2 * t * p3.x,
        y: mt2 * mt * p0.y + 3 * mt2 * t * p1.y + 3 * mt * t2 * p2.y + t2 * t * p3.y,
    };
}

export default function AnimatedBackground() {
    const canvasRef = useRef(null);
    const mouseRef = useRef({ x: 0.5, y: 0.42, targetX: 0.5, targetY: 0.42 });
    const audioReactiveRef = useRef({ playing: false, intensity: 0, smoothed: 0 });

    const reducedMotion =
        typeof window !== 'undefined' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;
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
    const orbY1 = useTransform(scrollY, [0, 2600], [0, -160]);
    const orbY2 = useTransform(scrollY, [0, 2600], [0, -110]);
    const orbOpacity = useTransform(scrollY, [0, 520], [0.16, 0.38]);

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
        let ribbons = [];

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

        function createRibbons() {
            const layouts = [
                {
                    start: [-0.12, 0.03],
                    c1: [0.05, 0.16],
                    c2: [0.06, 0.78],
                    end: [0.24, 1.06],
                    widthFactor: optimizeVisuals ? 0.17 : 0.23,
                    ampX: 0.048,
                    ampY: 0.05,
                    speed: 0.65,
                    wobble: 0.95,
                    parallax: 0.028,
                    alpha: 0.92,
                    markerOffset: 0.72,
                },
                {
                    start: [1.08, 0.04],
                    c1: [0.93, 0.18],
                    c2: [0.87, 0.58],
                    end: [0.7, 1.05],
                    widthFactor: optimizeVisuals ? 0.14 : 0.2,
                    ampX: 0.055,
                    ampY: 0.045,
                    speed: 0.88,
                    wobble: 1.15,
                    parallax: 0.02,
                    alpha: 0.96,
                    markerOffset: 0.62,
                },
                {
                    start: [0.58, 1.04],
                    c1: [0.72, 0.8],
                    c2: [0.9, 0.96],
                    end: [1.12, 0.88],
                    widthFactor: optimizeVisuals ? 0.11 : 0.16,
                    ampX: 0.045,
                    ampY: 0.03,
                    speed: 0.58,
                    wobble: 0.82,
                    parallax: 0.018,
                    alpha: 0.8,
                    markerOffset: 0.34,
                },
            ];

            ribbons = layouts
                .slice(0, optimizeVisuals ? 2 : layouts.length)
                .map((layout, index) => ({
                    ...layout,
                    phase: index * 1.7 + Math.random() * 0.9,
                }));
        }

        function toPoint(pair) {
            return {
                x: pair[0] * viewportWidth,
                y: pair[1] * viewportHeight,
            };
        }

        function getRibbonState(ribbon, time, audioEnergy, pointerX, pointerY) {
            const playingBoost = audioReactiveRef.current.playing ? 1 : 0;
            const baseTime = time * 0.00018 * (0.6 + ribbon.speed * 0.85 + playingBoost * 1.5);
            const shiftX = pointerX * viewportWidth * ribbon.parallax;
            const shiftY = pointerY * viewportHeight * ribbon.parallax * 0.75;

            const start = toPoint(ribbon.start);
            const c1 = toPoint(ribbon.c1);
            const c2 = toPoint(ribbon.c2);
            const end = toPoint(ribbon.end);

            const ax = viewportWidth * ribbon.ampX;
            const ay = viewportHeight * ribbon.ampY;

            start.x += Math.sin(baseTime * 1.2 + ribbon.phase) * ax * 0.25 + shiftX * 0.4;
            start.y += Math.cos(baseTime * 0.9 + ribbon.phase) * ay * 0.2 + shiftY * 0.25;

            c1.x += Math.sin(baseTime * 1.05 + ribbon.phase) * ax + shiftX;
            c1.y += Math.cos(baseTime * 0.92 + ribbon.phase * 0.7) * ay + shiftY * 0.7;

            c2.x += Math.cos(baseTime * 1.28 + ribbon.phase * 1.1) * ax * 1.2 + shiftX * 1.08;
            c2.y += Math.sin(baseTime * 1.04 + ribbon.phase) * ay * 1.18 + shiftY;

            end.x += Math.sin(baseTime * 0.85 + ribbon.phase * 0.8) * ax * 0.7 + shiftX * 1.18;
            end.y += Math.cos(baseTime * 1.16 + ribbon.phase) * ay * 0.35 + shiftY * 0.9;

            const minSide = Math.min(viewportWidth, viewportHeight);
            const thicknessBase = minSide * ribbon.widthFactor;
            const thickness = Math.max(
                42,
                thicknessBase * (audioReactiveRef.current.playing ? 1.0 : 0.84)
            );

            const markerT = (time * 0.00003 * (0.8 + ribbon.speed) + ribbon.markerOffset) % 1;
            const marker = cubicBezierPoint(start, c1, c2, end, markerT);

            return { start, c1, c2, end, thickness, marker };
        }

        function drawRibbon(path, thickness, alpha, audioEnergy) {
            ctx.save();
            ctx.globalCompositeOperation = 'screen';

            ctx.filter = `blur(${Math.max(24, thickness * 0.2)}px)`;
            ctx.strokeStyle = `rgba(16, 42, 255, ${0.16 * alpha + audioEnergy * 0.12})`;
            ctx.lineWidth = thickness * 1.52;
            ctx.stroke(path);

            ctx.filter = `blur(${Math.max(12, thickness * 0.1)}px)`;
            ctx.strokeStyle = `rgba(28, 74, 255, ${0.24 * alpha + audioEnergy * 0.18})`;
            ctx.lineWidth = thickness;
            ctx.stroke(path);

            ctx.filter = `blur(${Math.max(3, thickness * 0.028)}px)`;
            ctx.strokeStyle = `rgba(54, 115, 255, ${0.48 * alpha + audioEnergy * 0.18})`;
            ctx.lineWidth = thickness * 0.48;
            ctx.stroke(path);

            ctx.filter = `blur(${Math.max(1, thickness * 0.012)}px)`;
            ctx.strokeStyle = `rgba(118, 208, 255, ${0.12 + audioEnergy * 0.1})`;
            ctx.lineWidth = thickness * 0.11;
            ctx.stroke(path);

            ctx.restore();
        }

        function fillGlow(x, y, radius, innerColor, outerColor) {
            const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
            gradient.addColorStop(0, innerColor);
            gradient.addColorStop(0.38, outerColor);
            gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
            ctx.fillStyle = gradient;
            ctx.fillRect(x - radius, y - radius, radius * 2, radius * 2);
        }

        function drawAmbient(time, audioEnergy, pointerX, pointerY) {
            ctx.save();
            ctx.globalCompositeOperation = 'screen';

            const drift = time * 0.00012;
            const leftX = viewportWidth * (0.16 + Math.sin(drift * 1.1) * 0.02) + pointerX * viewportWidth * 0.045;
            const leftY = viewportHeight * (0.22 + Math.cos(drift * 0.9) * 0.03) + pointerY * viewportHeight * 0.03;
            const rightX = viewportWidth * (0.82 + Math.cos(drift * 1.3 + 1.2) * 0.025) + pointerX * viewportWidth * 0.03;
            const rightY = viewportHeight * (0.78 + Math.sin(drift * 0.8 + 0.4) * 0.03) + pointerY * viewportHeight * 0.025;
            const centerX = viewportWidth * (0.48 + pointerX * 0.018);
            const centerY = viewportHeight * 0.42;
            const energyGlow = 0.16 + audioEnergy * 0.32;

            fillGlow(
                leftX,
                leftY,
                viewportWidth * 0.34,
                `rgba(38, 82, 255, ${0.16 + energyGlow * 0.28})`,
                `rgba(16, 36, 255, ${0.05 + energyGlow * 0.12})`
            );
            fillGlow(
                rightX,
                rightY,
                viewportWidth * 0.28,
                `rgba(30, 74, 255, ${0.12 + energyGlow * 0.24})`,
                `rgba(15, 24, 180, ${0.04 + energyGlow * 0.09})`
            );
            fillGlow(
                centerX,
                centerY,
                viewportWidth * 0.2,
                `rgba(60, 120, 255, ${0.05 + energyGlow * 0.08})`,
                'rgba(10, 18, 90, 0.02)'
            );

            ctx.restore();
        }

        function drawMarkers(time, ribbonState, index, audioEnergy) {
            if (index > 1) return;

            ctx.save();
            ctx.globalCompositeOperation = 'screen';
            ctx.filter = `blur(12px)`;
            ctx.beginPath();
            ctx.arc(
                ribbonState.marker.x,
                ribbonState.marker.y,
                3.5 + index * 0.5 + (audioReactiveRef.current.playing ? 1.5 : 0),
                0,
                Math.PI * 2
            );
            ctx.fillStyle = `rgba(88, 150, 255, ${audioReactiveRef.current.playing ? 0.6 : 0.45})`;
            ctx.fill();

            ctx.filter = 'blur(1px)';
            ctx.beginPath();
            ctx.arc(ribbonState.marker.x, ribbonState.marker.y, 1.6 + (audioReactiveRef.current.playing ? 0.5 : 0), 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(180, 225, 255, 0.9)';
            ctx.fill();
            ctx.restore();
        }

        function drawFrame(time) {
            ctx.clearRect(0, 0, viewportWidth, viewportHeight);
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';

            const audioState = audioReactiveRef.current;
            const targetEnergy = audioState.playing ? audioState.intensity : 0;
            audioState.smoothed += (targetEnergy - audioState.smoothed) * 0.11;
            const audioEnergy = audioState.smoothed;

            mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.04;
            mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.04;

            const pointerX = mouseRef.current.x - 0.5;
            const pointerY = mouseRef.current.y - 0.5;

            drawAmbient(time, audioEnergy, pointerX, pointerY);

            ribbons.forEach((ribbon, index) => {
                const state = getRibbonState(ribbon, time, audioEnergy, pointerX, pointerY);
                const path = new Path2D();
                path.moveTo(state.start.x, state.start.y);
                path.bezierCurveTo(state.c1.x, state.c1.y, state.c2.x, state.c2.y, state.end.x, state.end.y);
                drawRibbon(path, state.thickness, ribbon.alpha, audioEnergy);
                drawMarkers(time, state, index, audioEnergy);
            });
        }

        function loop(time) {
            if (!running) return;
            drawFrame(time);
            frame = requestAnimationFrame(loop);
        }

        const onResize = () => {
            resize();
            createRibbons();
        };

        const onMouseMove = (event) => {
            mouseRef.current.targetX = event.clientX / viewportWidth;
            mouseRef.current.targetY = event.clientY / viewportHeight;
        };

        const onMouseLeave = () => {
            mouseRef.current.targetX = 0.5;
            mouseRef.current.targetY = 0.42;
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
                loop(performance.now());
            }
        };

        const onAudioReactive = (event) => {
            audioReactiveRef.current.playing = Boolean(event.detail?.playing);
            audioReactiveRef.current.intensity = Math.max(0, Math.min(1, Number(event.detail?.intensity) || 0));
        };

        resize();
        createRibbons();
        loop(performance.now());

        window.addEventListener('resize', onResize);
        window.addEventListener('mousemove', onMouseMove, { passive: true });
        window.addEventListener(AUDIO_REACTIVE_EVENT, onAudioReactive);
        document.addEventListener('mouseleave', onMouseLeave);
        document.addEventListener('visibilitychange', onVisibilityChange);

        return () => {
            running = false;
            if (frame) cancelAnimationFrame(frame);
            window.removeEventListener('resize', onResize);
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener(AUDIO_REACTIVE_EVENT, onAudioReactive);
            document.removeEventListener('mouseleave', onMouseLeave);
            document.removeEventListener('visibilitychange', onVisibilityChange);
        };
    }, [optimizeVisuals, reducedMotion]);

    return (
        <>
            <div
                className="fixed inset-0 z-[-5] bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: 'url("/assets/new-bg.jpeg")' }}
            />

            <div
                className="fixed inset-0 z-[-4]"
                style={{
                    background:
                        'linear-gradient(180deg, rgba(2,3,8,0.82) 0%, rgba(2,3,8,0.94) 50%, rgba(2,3,8,0.98) 100%)',
                }}
            />

            <div
                className="fixed inset-0 z-[-4] pointer-events-none"
                style={{
                    background:
                        'radial-gradient(circle at 18% 16%, rgba(28,64,255,0.16) 0%, rgba(10,16,60,0.06) 26%, transparent 52%), radial-gradient(circle at 82% 78%, rgba(24,60,255,0.12) 0%, rgba(10,16,60,0.05) 22%, transparent 45%)',
                }}
            />

            {!optimizeVisuals && <div className="noise" />}

            {!reducedMotion && !optimizeVisuals && (
                <>
                    <motion.div style={{ y: orbY1, opacity: orbOpacity }} className="fixed pointer-events-none z-[-3]" aria-hidden>
                        <div
                            className="w-[520px] h-[520px] rounded-full"
                            style={{
                                position: 'fixed',
                                top: '-4%',
                                left: '-10%',
                                background: 'radial-gradient(circle, rgba(36,74,255,0.2) 0%, rgba(18,32,120,0.08) 32%, transparent 64%)',
                                filter: 'blur(90px)',
                            }}
                        />
                    </motion.div>

                    <motion.div style={{ y: orbY2, opacity: orbOpacity }} className="fixed pointer-events-none z-[-3]" aria-hidden>
                        <div
                            className="w-[420px] h-[420px] rounded-full"
                            style={{
                                position: 'fixed',
                                bottom: '-10%',
                                right: '-7%',
                                background: 'radial-gradient(circle, rgba(28,74,255,0.18) 0%, rgba(14,24,100,0.07) 34%, transparent 62%)',
                                filter: 'blur(76px)',
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
