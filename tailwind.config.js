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
                    strong: 'var(--accent-strong)',
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
                display: ['"Archivo Variable"', 'system-ui', 'sans-serif'],
                sans: ['"Archivo Variable"', 'system-ui', 'sans-serif'],
                mono: ['"JetBrains Mono Variable"', 'ui-monospace', 'monospace'],
            },
            maxWidth: {
                measure: '66ch',
                page: '76rem',
            },
        },
    },
    plugins: [],
};
