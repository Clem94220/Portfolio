import { useCallback, useEffect, useRef, useState } from 'react';
import { AUDIO_REACTIVE_EVENT } from '../lib/audioReactive';

const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));

const ORB_LAYOUTS = [
    {
        top: '-16%',
        left: '-12%',
        width: 'clamp(30rem, 48vw, 70rem)',
        height: 'clamp(30rem, 48vw, 70rem)',
        background:
            'radial-gradient(circle at 38% 36%, rgba(0, 170, 255, 1) 0%, rgba(0, 102, 255, 0.92) 26%, rgba(0, 68, 255, 0.74) 48%, rgba(5, 5, 21, 0.28) 66%, transparent 84%)',
        baseOpacity: 0.74,
        baseScale: 1.02,
        blur: 192,
        driftX: 520,
        driftY: 320,
        speed: 0.82,
        phase: 0.2,
    },
    {
        top: '8%',
        left: '26%',
        width: 'clamp(24rem, 36vw, 54rem)',
        height: 'clamp(24rem, 36vw, 54rem)',
        background:
            'radial-gradient(circle at 48% 42%, rgba(0, 102, 255, 0.96) 0%, rgba(0, 170, 255, 0.72) 22%, rgba(0, 68, 255, 0.52) 46%, rgba(5, 5, 21, 0.24) 62%, transparent 80%)',
        baseOpacity: 0.52,
        baseScale: 0.96,
        blur: 176,
        driftX: 420,
        driftY: 280,
        speed: 0.62,
        phase: 1.7,
    },
    {
        top: '2%',
        right: '-12%',
        width: 'clamp(28rem, 42vw, 62rem)',
        height: 'clamp(28rem, 42vw, 62rem)',
        background:
            'radial-gradient(circle at 52% 48%, rgba(0, 68, 255, 0.98) 0%, rgba(0, 170, 255, 0.68) 18%, rgba(0, 102, 255, 0.58) 40%, rgba(5, 5, 21, 0.22) 58%, transparent 76%)',
        baseOpacity: 0.62,
        baseScale: 1,
        blur: 198,
        driftX: 500,
        driftY: 340,
        speed: 0.96,
        phase: 3.1,
    },
    {
        bottom: '-18%',
        right: '2%',
        width: 'clamp(26rem, 38vw, 56rem)',
        height: 'clamp(26rem, 38vw, 56rem)',
        background:
            'radial-gradient(circle at 48% 48%, rgba(0, 170, 255, 0.94) 0%, rgba(0, 68, 255, 0.74) 22%, rgba(0, 102, 255, 0.48) 44%, rgba(5, 5, 21, 0.2) 58%, transparent 80%)',
        baseOpacity: 0.54,
        baseScale: 1.01,
        blur: 186,
        driftX: 460,
        driftY: 300,
        speed: 0.74,
        phase: 4.5,
    },
    {
        top: '34%',
        left: '62%',
        width: 'clamp(18rem, 26vw, 38rem)',
        height: 'clamp(18rem, 26vw, 38rem)',
        background:
            'radial-gradient(circle at 46% 46%, rgba(0, 170, 255, 1) 0%, rgba(0, 102, 255, 0.82) 24%, rgba(0, 68, 255, 0.54) 44%, rgba(5, 5, 21, 0.16) 58%, transparent 78%)',
        baseOpacity: 0.52,
        baseScale: 0.98,
        blur: 158,
        driftX: 520,
        driftY: 340,
        speed: 1.08,
        phase: 5.8,
    },
];

const MESH_LAYOUTS = [
    {
        top: '-24%',
        left: '-18%',
        width: 'clamp(42rem, 70vw, 96rem)',
        height: 'clamp(18rem, 28vw, 36rem)',
        background:
            'radial-gradient(ellipse at 34% 50%, rgba(0, 170, 255, 0.42) 0%, rgba(0, 102, 255, 0.32) 22%, rgba(0, 68, 255, 0.22) 42%, rgba(5, 5, 21, 0.08) 56%, transparent 76%)',
        opacity: 0.44,
        blur: 172,
        driftX: 720,
        driftY: 380,
        rotate: 14,
        speed: 0.52,
        scale: 1.06,
        phase: 0.7,
    },
    {
        top: '16%',
        right: '-22%',
        width: 'clamp(38rem, 62vw, 86rem)',
        height: 'clamp(16rem, 24vw, 30rem)',
        background:
            'radial-gradient(ellipse at 60% 52%, rgba(0, 68, 255, 0.4) 0%, rgba(0, 170, 255, 0.26) 22%, rgba(0, 102, 255, 0.18) 40%, rgba(5, 5, 21, 0.08) 54%, transparent 74%)',
        opacity: 0.4,
        blur: 178,
        driftX: 680,
        driftY: 360,
        rotate: -18,
        speed: 0.62,
        scale: 0.98,
        phase: 2.2,
    },
    {
        bottom: '-30%',
        left: '18%',
        width: 'clamp(34rem, 54vw, 72rem)',
        height: 'clamp(14rem, 20vw, 24rem)',
        background:
            'radial-gradient(ellipse at 48% 48%, rgba(0, 170, 255, 0.36) 0%, rgba(0, 102, 255, 0.24) 22%, rgba(0, 68, 255, 0.16) 38%, rgba(5, 5, 21, 0.06) 50%, transparent 74%)',
        opacity: 0.34,
        blur: 170,
        driftX: 620,
        driftY: 300,
        rotate: 20,
        speed: 0.46,
        scale: 0.96,
        phase: 4.1,
    },
];

export default function AudioBackground({
    showDemoPlayer = false,
    audioSrc = '/assets/musique.mp3',
    demoButtonLabel = 'Play',
}) {
    const orbRefs = useRef([]);
    const meshRefs = useRef([]);
    const reactiveRef = useRef({
        playing: false,
        intensity: 0,
        volume: 0,
        smoothedEnergy: 0,
        smoothedMotion: 0.24,
        pulse: 0,
        previousSignal: 0,
    });

    const demoAudioRef = useRef(null);
    const demoAudioContextRef = useRef(null);
    const demoAnalyserRef = useRef(null);
    const demoSourceNodeRef = useRef(null);
    const demoFrequencyDataRef = useRef(null);
    const demoAnalysisFrameRef = useRef(null);
    const demoPlayingRef = useRef(false);

    const [demoPlaying, setDemoPlaying] = useState(false);

    const applyReactiveState = useCallback((nextState = {}) => {
        const nextIntensity = clamp(Number(nextState.intensity) || 0);
        const nextVolume = clamp(Number(nextState.volume) || nextIntensity);

        reactiveRef.current.playing = Boolean(nextState.playing);
        reactiveRef.current.intensity = nextIntensity;
        reactiveRef.current.volume = nextVolume;
    }, []);

    const stopDemoAnalysis = useCallback(() => {
        if (demoAnalysisFrameRef.current !== null) {
            cancelAnimationFrame(demoAnalysisFrameRef.current);
            demoAnalysisFrameRef.current = null;
        }
    }, []);

    const startDemoAnalysis = useCallback(() => {
        if (demoAnalysisFrameRef.current !== null) return;
        if (!demoAnalyserRef.current || !demoFrequencyDataRef.current) return;

        const sample = () => {
            const analyser = demoAnalyserRef.current;
            const data = demoFrequencyDataRef.current;

            if (!analyser || !data) {
                demoAnalysisFrameRef.current = null;
                return;
            }

            analyser.getByteFrequencyData(data);

            const bucketCount = Math.max(14, Math.floor(data.length * 0.56));
            let weightedSum = 0;
            let weightTotal = 0;

            for (let i = 0; i < bucketCount; i++) {
                const weight = 1.2 - (i / bucketCount) * 0.55;
                weightedSum += data[i] * weight;
                weightTotal += weight;
            }

            const normalized = weightTotal > 0 ? weightedSum / (255 * weightTotal) : 0;
            const intensity = Math.min(1, normalized * 1.7);

            applyReactiveState({
                playing: true,
                intensity,
                volume: normalized,
            });

            demoAnalysisFrameRef.current = requestAnimationFrame(sample);
        };

        demoAnalysisFrameRef.current = requestAnimationFrame(sample);
    }, [applyReactiveState]);

    const setupDemoAnalysis = useCallback(async () => {
        const audio = demoAudioRef.current;
        if (!audio) return false;

        const AudioContextCtor = window.AudioContext || window.webkitAudioContext;
        if (!AudioContextCtor) return false;

        if (!demoAudioContextRef.current) {
            const context = new AudioContextCtor();
            const analyser = context.createAnalyser();
            analyser.fftSize = 256;
            analyser.smoothingTimeConstant = 0.8;

            const source = context.createMediaElementSource(audio);
            source.connect(analyser);
            analyser.connect(context.destination);

            demoAudioContextRef.current = context;
            demoAnalyserRef.current = analyser;
            demoSourceNodeRef.current = source;
            demoFrequencyDataRef.current = new Uint8Array(analyser.frequencyBinCount);
        }

        if (demoAudioContextRef.current.state === 'suspended') {
            try {
                await demoAudioContextRef.current.resume();
            } catch {
                return false;
            }
        }

        startDemoAnalysis();
        return true;
    }, [startDemoAnalysis]);

    const toggleDemoPlayback = useCallback(() => {
        const audio = demoAudioRef.current;
        if (!audio) return;

        if (audio.paused) {
            audio.play().then(() => {
                demoPlayingRef.current = true;
                setDemoPlaying(true);
                setupDemoAnalysis().catch(() => { });
            }).catch(() => { });
            return;
        }

        audio.pause();
        demoPlayingRef.current = false;
        setDemoPlaying(false);
        stopDemoAnalysis();
        applyReactiveState({ playing: false, intensity: 0, volume: 0 });
    }, [applyReactiveState, setupDemoAnalysis, stopDemoAnalysis]);

    useEffect(() => {
        const handleReactiveEvent = (event) => {
            if (showDemoPlayer && demoPlayingRef.current) return;
            applyReactiveState(event.detail);
        };

        window.addEventListener(AUDIO_REACTIVE_EVENT, handleReactiveEvent);
        return () => window.removeEventListener(AUDIO_REACTIVE_EVENT, handleReactiveEvent);
    }, [applyReactiveState, showDemoPlayer]);

    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        if (mediaQuery.matches) {
            MESH_LAYOUTS.forEach((mesh, index) => {
                const element = meshRefs.current[index];
                if (!element) return;

                element.style.transform = `translate3d(0px, 0px, 0) rotate(${mesh.rotate}deg) scale(${mesh.scale})`;
                element.style.opacity = mesh.opacity.toString();
                element.style.filter = `blur(${mesh.blur}px)`;
            });

            ORB_LAYOUTS.forEach((orb, index) => {
                const element = orbRefs.current[index];
                if (!element) return;

                element.style.transform = `translate3d(0px, 0px, 0) scale(${orb.baseScale})`;
                element.style.opacity = orb.baseOpacity.toString();
                element.style.filter = `blur(${orb.blur}px)`;
            });

            return;
        }

        let frame;
        let running = true;

        const animate = (time) => {
            if (!running) return;

            const reactive = reactiveRef.current;
            const targetEnergy = reactive.playing ? Math.max(reactive.intensity, reactive.volume) : 0;
            reactive.smoothedEnergy += (targetEnergy - reactive.smoothedEnergy) * 0.18;
            const signalRise = Math.max(0, reactive.smoothedEnergy - reactive.previousSignal);
            reactive.pulse = Math.max(reactive.pulse * 0.86, signalRise * 8.5);
            reactive.previousSignal = reactive.smoothedEnergy;

            const reaction = reactive.playing ? reactive.smoothedEnergy + reactive.pulse : 0;
            const targetMotion = reactive.playing
                ? 5 + reaction * 14
                : 0.28;
            reactive.smoothedMotion += (targetMotion - reactive.smoothedMotion) * 0.18;

            const energy = reactive.smoothedEnergy;
            const motion = reactive.smoothedMotion;
            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;
            const globalDriftX = Math.sin(time * 0.0011 * motion) * (reactive.playing ? 620 + reaction * 980 : 48);
            const globalDriftY = Math.cos(time * 0.00092 * motion) * (reactive.playing ? 420 + reaction * 720 : 28);
            const vibrationStrength = reactive.playing ? 10 + reaction * 120 : 0.5;

            MESH_LAYOUTS.forEach((mesh, index) => {
                const element = meshRefs.current[index];
                if (!element) return;

                const timeFactor = time * 0.0028 * motion * (1 + mesh.speed);
                const amplitude = reactive.playing ? 3 + reaction * 6.2 : 0.7;
                const roamX =
                    Math.sin(time * 0.00016 * motion + index * 0.9 + mesh.phase) *
                    viewportWidth *
                    (reactive.playing ? 0.18 + reaction * 0.3 : 0.028);
                const roamY =
                    Math.cos(time * 0.00013 * motion + index * 0.75 + mesh.phase) *
                    viewportHeight *
                    (reactive.playing ? 0.12 + reaction * 0.22 : 0.02);
                const vibrationX = Math.sin(time * 0.018 * (1 + index * 0.13) + mesh.phase * 8) * vibrationStrength * (0.8 + index * 0.15);
                const vibrationY = Math.cos(time * 0.015 * (1 + index * 0.11) + mesh.phase * 6) * vibrationStrength * (0.7 + index * 0.12);
                const translateX =
                    (Math.sin(timeFactor + mesh.phase) * mesh.driftX +
                        Math.cos(timeFactor * 0.58 + mesh.phase * 1.2) * mesh.driftX * 0.4) *
                    amplitude + globalDriftX * (0.46 + index * 0.08) + roamX + vibrationX;
                const translateY =
                    (Math.cos(timeFactor * 0.9 + mesh.phase * 0.76) * mesh.driftY +
                        Math.sin(timeFactor * 0.44 + mesh.phase * 1.08) * mesh.driftY * 0.34) *
                    amplitude + globalDriftY * (0.42 + index * 0.07) + roamY + vibrationY;
                const rotate =
                    mesh.rotate +
                    Math.sin(timeFactor * 0.72 + mesh.phase) * (reactive.playing ? 12 + reaction * 28 : 2.2);
                const scale = mesh.scale + (reactive.playing ? 0.08 + reaction * 0.34 : 0.02);
                const opacity = clamp(mesh.opacity + (reactive.playing ? 0.08 + reaction * 0.18 : 0.02), 0.22, 0.96);

                element.style.transform =
                    `translate3d(${translateX}px, ${translateY}px, 0) rotate(${rotate}deg) scale(${scale})`;
                element.style.opacity = opacity.toFixed(3);
            });

            ORB_LAYOUTS.forEach((orb, index) => {
                const element = orbRefs.current[index];
                if (!element) return;

                const timeFactor = time * 0.0034 * motion * (1 + orb.speed);
                const amplitude = reactive.playing ? 3.8 + reaction * 7.8 : 0.82;
                const roamX =
                    Math.sin(time * 0.00018 * motion + index * 0.82 + orb.phase) *
                    viewportWidth *
                    (reactive.playing ? 0.24 + reaction * 0.38 : 0.04);
                const roamY =
                    Math.cos(time * 0.00014 * motion + index * 0.64 + orb.phase) *
                    viewportHeight *
                    (reactive.playing ? 0.16 + reaction * 0.28 : 0.028);
                const vibrationX = Math.sin(time * 0.02 * (1 + index * 0.15) + orb.phase * 9) * vibrationStrength * (0.6 + index * 0.12);
                const vibrationY = Math.cos(time * 0.017 * (1 + index * 0.12) + orb.phase * 7) * vibrationStrength * (0.5 + index * 0.1);
                const translateX =
                    (Math.sin(timeFactor + orb.phase) * orb.driftX +
                        Math.cos(timeFactor * 0.63 + orb.phase * 1.25) * orb.driftX * 0.42) *
                    amplitude + globalDriftX * (0.28 + index * 0.1) + roamX + vibrationX;
                const translateY =
                    (Math.cos(timeFactor * 0.92 + orb.phase * 0.8) * orb.driftY +
                        Math.sin(timeFactor * 0.54 + orb.phase * 1.16) * orb.driftY * 0.36) *
                    amplitude + globalDriftY * (0.24 + index * 0.08) + roamY + vibrationY;
                const scale = orb.baseScale + (reactive.playing ? 0.1 + reaction * 0.42 : 0.025);
                const opacity = clamp(orb.baseOpacity + (reactive.playing ? 0.08 + reaction * 0.22 : 0.02), 0.28, 1);

                element.style.transform = `translate3d(${translateX}px, ${translateY}px, 0) scale(${scale})`;
                element.style.opacity = opacity.toFixed(3);
            });

            frame = requestAnimationFrame(animate);
        };

        frame = requestAnimationFrame(animate);

        return () => {
            running = false;
            if (frame) cancelAnimationFrame(frame);
        };
    }, []);

    useEffect(() => {
        if (!showDemoPlayer) return undefined;

        const audio = demoAudioRef.current;
        if (!audio) return undefined;

        audio.loop = true;

        const handlePause = () => {
            demoPlayingRef.current = false;
            setDemoPlaying(false);
            stopDemoAnalysis();
            applyReactiveState({ playing: false, intensity: 0, volume: 0 });
        };

        audio.addEventListener('pause', handlePause);

        return () => {
            audio.removeEventListener('pause', handlePause);
        };
    }, [applyReactiveState, showDemoPlayer, stopDemoAnalysis]);

    useEffect(() => {
        return () => {
            stopDemoAnalysis();

            if (demoSourceNodeRef.current) {
                demoSourceNodeRef.current.disconnect();
                demoSourceNodeRef.current = null;
            }

            if (demoAnalyserRef.current) {
                demoAnalyserRef.current.disconnect();
                demoAnalyserRef.current = null;
            }

            if (demoAudioContextRef.current) {
                demoAudioContextRef.current.close().catch(() => { });
                demoAudioContextRef.current = null;
            }
        };
    }, [stopDemoAnalysis]);

    return (
        <>
            <div
                className="fixed inset-0 overflow-hidden pointer-events-none"
                style={{ zIndex: -1, background: '#000000' }}
                aria-hidden
            >
                <div
                    className="absolute inset-0"
                    style={{
                        background:
                            'radial-gradient(circle at 18% 16%, rgba(0, 170, 255, 0.03) 0%, transparent 28%), radial-gradient(circle at 80% 72%, rgba(0, 68, 255, 0.03) 0%, transparent 30%), radial-gradient(circle at 48% 44%, rgba(0, 68, 255, 0.02) 0%, transparent 34%)',
                    }}
                />

                {MESH_LAYOUTS.map((mesh, index) => (
                    <div
                        key={`${mesh.phase}-${index}`}
                        ref={(element) => {
                            meshRefs.current[index] = element;
                        }}
                        className="absolute will-change-transform"
                        style={{
                            top: mesh.top,
                            left: mesh.left,
                            right: mesh.right,
                            bottom: mesh.bottom,
                            width: mesh.width,
                            height: mesh.height,
                            background: mesh.background,
                            opacity: mesh.opacity,
                            filter: `blur(${mesh.blur}px)`,
                            transform: `rotate(${mesh.rotate}deg) scale(${mesh.scale})`,
                            mixBlendMode: 'screen',
                            borderRadius: '999px',
                        }}
                    />
                ))}

                {ORB_LAYOUTS.map((orb, index) => (
                    <div
                        key={`${orb.phase}-${index}`}
                        ref={(element) => {
                            orbRefs.current[index] = element;
                        }}
                        className="absolute rounded-full will-change-transform"
                        style={{
                            top: orb.top,
                            left: orb.left,
                            right: orb.right,
                            bottom: orb.bottom,
                            width: orb.width,
                            height: orb.height,
                            background: orb.background,
                            opacity: orb.baseOpacity,
                            filter: `blur(${orb.blur}px)`,
                            transform: `scale(${orb.baseScale})`,
                            mixBlendMode: 'screen',
                        }}
                    />
                ))}

                <div
                    className="absolute inset-0"
                    style={{
                        background:
                            'linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.14) 35%, rgba(0, 0, 0, 0.34) 72%, rgba(0, 0, 0, 0.48) 100%)',
                    }}
                />
            </div>

            {showDemoPlayer && (
                <>
                    <audio ref={demoAudioRef} src={audioSrc} preload="metadata" />

                    <div className="fixed bottom-4 right-4 z-20 pointer-events-auto">
                        <button
                            type="button"
                            onClick={toggleDemoPlayback}
                            className="px-4 py-2 rounded-full text-sm font-medium transition-transform duration-200 hover:scale-[1.03] active:scale-[0.98]"
                            style={{
                                color: '#f5f7ff',
                                background: 'rgba(5, 5, 21, 0.72)',
                                border: '1px solid rgba(255, 255, 255, 0.12)',
                                boxShadow: '0 0 32px rgba(0, 68, 255, 0.2)',
                                backdropFilter: 'blur(16px)',
                            }}
                        >
                            {demoPlaying ? 'Pause' : demoButtonLabel}
                        </button>
                    </div>
                </>
            )}
        </>
    );
}
