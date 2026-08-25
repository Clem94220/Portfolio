import { useState } from 'react';
import { motion } from 'framer-motion';
import { useToast } from '../contexts/ToastContext';
import { FaExternalLinkAlt, FaCheck, FaCopy } from 'react-icons/fa';

export default function PaymentCard({ icon: Icon, name, value, copyValue, link, color = '#d4a543' }) {
    const { addToast } = useToast();
    const [copied, setCopied] = useState(false);

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

        setCopied(true);
        addToast('Adresse copiée dans le presse-papiers !');
        setTimeout(() => setCopied(false), 2500);
    };

    return (
        <motion.div
            whileHover={{ y: -4, scale: 1.01 }}
            className="crystal-card p-5 group relative overflow-hidden transition-all duration-300 border border-white/10 hover:border-white/25 flex flex-col justify-between"
            style={{
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.4)',
            }}
        >
            {/* Ambient neon color aura on hover */}
            <div
                className="absolute -inset-px opacity-0 group-hover:opacity-15 transition-opacity duration-500 pointer-events-none rounded-2xl blur-xl"
                style={{ background: color }}
            />

            <div className="relative z-10 space-y-3">
                {/* Header with Icon & Name */}
                <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                        <div
                            className="w-10 h-10 rounded-xl flex items-center justify-center border border-white/10 group-hover:scale-105 transition-transform"
                            style={{
                                background: 'rgba(255, 255, 255, 0.03)',
                                boxShadow: `0 0 16px ${color}22`,
                            }}
                        >
                            {Icon && <Icon className="text-xl" style={{ color }} />}
                        </div>
                        <div>
                            <h4 className="text-txt-primary font-bold tracking-wide text-sm font-display">
                                {name}
                            </h4>
                            <span className="text-[10px] font-mono uppercase tracking-widest text-txt-muted">
                                {link ? 'Direct Link' : 'Instant Transfer'}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Address or identifier preview */}
                {value && (
                    <div className="p-2.5 rounded-lg bg-black/40 border border-white/5 font-mono text-[11px] text-txt-secondary break-all select-all leading-relaxed">
                        {value}
                    </div>
                )}
            </div>

            {/* Action button */}
            <div className="relative z-10 pt-3">
                {link ? (
                    <a
                        href={link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-2.5 px-4 rounded-xl border border-white/15 hover:border-white/35 text-xs font-semibold text-white transition-all flex items-center justify-center gap-2 hover:bg-white/[0.08]"
                        style={{
                            background: 'rgba(255, 255, 255, 0.03)',
                        }}
                    >
                        <FaExternalLinkAlt className="text-xs" />
                        Payer via PayPal
                    </a>
                ) : (
                    <button
                        onClick={handleCopy}
                        type="button"
                        className="w-full py-2.5 px-4 rounded-xl border border-white/15 hover:border-white/35 text-xs font-semibold text-txt-secondary hover:text-white transition-all flex items-center justify-center gap-2 hover:bg-white/[0.08] cursor-pointer"
                        style={{
                            background: 'rgba(255, 255, 255, 0.03)',
                        }}
                    >
                        {copied ? (
                            <>
                                <FaCheck className="text-xs text-[var(--green)]" />
                                <span className="text-[var(--green)]">Copié !</span>
                            </>
                        ) : (
                            <>
                                <FaCopy className="text-xs" />
                                <span>Copier l&apos;adresse</span>
                            </>
                        )}
                    </button>
                )}
            </div>
        </motion.div>
    );
}
