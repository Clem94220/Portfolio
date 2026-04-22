/** @type {import('tailwindcss').Config} */
export default {
    content: ['./index.html', './src/**/*.{js,jsx}'],
    theme: {
        extend: {
            colors: {
                void: 'var(--bg-void)',
                dark: {
                    900: 'var(--bg-void)',
                    800: 'var(--bg-dark)',
                    700: 'var(--bg-card)',
                    600: 'var(--bg-panel)',
                },
                crystal: {
                    card: 'var(--bg-card)',
                    panel: 'var(--bg-panel)',
                    border: 'var(--border-crystal)',
                    'border-hi': 'var(--border-highlight)',
                    'border-glow': 'var(--border-glow)',
                },
                accent: {
                    DEFAULT: 'var(--accent)',
                    glow: 'var(--accent-glow)',
                    subtle: 'var(--accent-subtle)',
                },
                txt: {
                    primary: 'var(--text-primary)',
                    secondary: 'var(--text-secondary)',
                    muted: 'var(--text-muted)',
                },
                status: {
                    green: 'var(--green)',
                    yellow: 'var(--yellow)',
                    red: 'var(--red)',
                },
            },
            fontFamily: {
                display: ['Orbitron', 'sans-serif'],
                sans: ['Rajdhani', 'system-ui', 'sans-serif'],
                mono: ['JetBrains Mono', 'monospace'],
            },
            animation: {
                'scan-line': 'scan-line 8s linear infinite',
                shimmer: 'shimmer 3s ease-in-out infinite',
                float: 'float 6s ease-in-out infinite',
                'pulse-gold': 'pulse-gold 2s ease-in-out infinite',
            },
            keyframes: {
                'scan-line': {
                    '0%': { transform: 'translateY(-100%)' },
                    '100%': { transform: 'translateY(100vh)' },
                },
                shimmer: {
                    '0%': { left: '-100%' },
                    '50%': { left: '200%' },
                    '100%': { left: '200%' },
                },
                float: {
                    '0%, 100%': { transform: 'translateY(0px)' },
                    '50%': { transform: 'translateY(-20px)' },
                },
                'pulse-gold': {
                    '0%, 100%': { opacity: '1' },
                    '50%': { opacity: '0.5' },
                },
            },
        },
    },
    plugins: [],
};
