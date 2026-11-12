import { useState } from 'react';
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
        <div className="surface p-5 flex flex-col justify-between h-full transition-colors hover:border-[var(--border-highlight)]">

            <div className="relative z-10 space-y-3">
                {/* Header with Icon & Name */}
                <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                        <div
                            className="w-10 h-10 rounded-xl flex items-center justify-center border border-white/10 shrink-0"
                        >
                            {Icon && <Icon aria-hidden="true" className="text-xl" style={{ color }} />}
                        </div>
                        <div>
                            <h4 className="text-txt-primary font-semibold">
                                {name}
                            </h4>
                            <span className="type-label text-xs">
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
                        className="btn btn-ghost w-full justify-center"
                    >
                        <FaExternalLinkAlt aria-hidden="true" className="text-xs" />
                        Payer via PayPal
                    </a>
                ) : (
                    <button
                        onClick={handleCopy}
                        type="button"
                        className="btn btn-ghost w-full justify-center"
                    >
                        {copied ? (
                            <>
                                <FaCheck aria-hidden="true" className="text-xs text-[var(--green)]" />
                                <span className="text-[var(--green)]">Copié !</span>
                            </>
                        ) : (
                            <>
                                <FaCopy aria-hidden="true" className="text-xs" />
                                <span>Copier l&apos;adresse</span>
                            </>
                        )}
                    </button>
                )}
            </div>
        </div>
    );
}
