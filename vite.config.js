import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [react()],
    server: {
        open: true,
        headers: {
            'X-Content-Type-Options': 'nosniff',
            'X-Frame-Options': 'DENY',
            'X-DNS-Prefetch-Control': 'off',
            'Referrer-Policy': 'no-referrer',
            'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
        },
    },
    build: {
        sourcemap: false,
        minify: 'terser',
        terserOptions: {
            compress: {
                drop_console: false,
                drop_debugger: true,
            },
            format: {
                comments: false,
            },
        },
        rollupOptions: {
            output: {
                manualChunks(id) {
                    // framer-motion n'a pas de chunk forcé : son cœur reste léger dans le bundle
                    // principal et ses fonctionnalités (lib/motionFeatures) partent en chunk différé.
                    if (/framer-motion|motion-dom|motion-utils/.test(id)) return undefined;
                    if (id.includes('react-icons')) return 'icons';
                    if (id.includes('node_modules')) return 'vendor';
                },
            },
        },
    },
});
