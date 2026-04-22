import { motion } from 'framer-motion';
import { useToast } from '../contexts/ToastContext';
import { FaExternalLinkAlt } from 'react-icons/fa';

export default function PaymentCard({ icon: Icon, name, value, copyValue, link, color = '#d4a543' }) {
    const { addToast } = useToast();

    const handleCopy = async () => {
        const text = copyValue || value;
        if (!text) return;

        try {
            await navigator.clipboard.writeText(text);
        } catch {
            const textarea = document.createElement('textarea');
            textarea.value = text;
            textarea.style.position = 'fixed';
            textarea.style.opacity = '0';
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
        }

        addToast('Copie dans le presse-papiers');
    };

    return (
        <motion.div whileHover={{ y: -3 }} className="crystal-card p-5 group magnetic-hover relative overflow-hidden">
            <div
                className="absolute inset-0 opacity-15 pointer-events-none"
                style={{
                    backgroundImage:
                        'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")',
                    mixBlendMode: 'overlay',
                }}
            />

            <div className="relative z-10">
                <div className="flex items-center gap-3 mb-3">
                    {Icon && <Icon className="text-2xl" style={{ color }} />}
                    <h4 className="text-txt-primary font-semibold tracking-wide uppercase text-sm">{name}</h4>
                </div>

                {value && <p className="text-txt-muted text-xs font-mono break-all mb-3 leading-relaxed">{value}</p>}

                {link ? (
                    <a
                        href={link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-2 px-4 rounded-xl border border-[var(--border-crystal)] hover:border-white/20 text-sm text-txt-secondary hover:text-white transition-all flex items-center justify-center gap-2"
                        style={{ background: 'var(--bg-panel)' }}
                    >
                        <FaExternalLinkAlt className="text-xs" />
                        Ouvrir
                    </a>
                ) : (
                    <button
                        onClick={handleCopy}
                        className="w-full py-2 px-4 rounded-xl border border-[var(--border-crystal)] hover:border-white/20 text-sm text-txt-secondary hover:text-txt-primary transition-all flex items-center justify-center gap-2"
                        style={{ background: 'var(--bg-panel)' }}
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.5}
                                d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                            />
                        </svg>
                        Copier
                    </button>
                )}
            </div>
        </motion.div>
    );
}
