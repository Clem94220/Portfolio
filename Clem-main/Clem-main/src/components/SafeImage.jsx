import { useEffect, useState } from 'react';

function getInitials(label) {
    const normalized = (label || 'Image')
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase() || '')
        .join('');

    return normalized || 'IMG';
}

export default function SafeImage({
    src,
    alt,
    className = '',
    fallbackClassName = '',
    fallbackLabel,
    onError,
    style,
    loading = 'lazy',
    decoding = 'async',
    ...props
}) {
    const [failed, setFailed] = useState(!src);
    const label = fallbackLabel || alt || 'Image';

    useEffect(() => {
        setFailed(!src);
    }, [src]);

    if (failed) {
        return (
            <div
                role="img"
                aria-label={label}
                className={fallbackClassName || className}
                style={style}
            >
                <span className="text-[10px] sm:text-xs font-display tracking-[0.14em] uppercase text-txt-muted">
                    {getInitials(label)}
                </span>
            </div>
        );
    }

    return (
        <img
            src={src}
            alt={alt}
            className={className}
            loading={loading}
            decoding={decoding}
            style={style}
            onError={(event) => {
                setFailed(true);
                onError?.(event);
            }}
            {...props}
        />
    );
}
