import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
    plugins: [
        react(),
        VitePWA({
            registerType: 'autoUpdate',
            includeAssets: [
                'dice-1.svg',
                'dice-2.svg',
                'dice-3.svg',
                'dice-4.svg',
                'dice-5.svg',
                'dice-6.svg',
                'sounds/*.mp3',
            ],
            manifest: {
                name: 'Modern Classic Ludo',
                short_name: 'Ludo',
                description: 'A modern classic Ludo game with custom modes',
                theme_color: '#1e3a5f',
                background_color: '#0f172a',
                display: 'standalone',
                orientation: 'portrait',
                scope: '/',
                start_url: '/',
                icons: [
                    {
                        src: 'icons/icon-192.svg',
                        sizes: '192x192',
                        type: 'image/svg+xml',
                    },
                    {
                        src: 'icons/icon-512.svg',
                        sizes: '512x512',
                        type: 'image/svg+xml',
                    },
                    {
                        src: 'icons/icon-512.svg',
                        sizes: '512x512',
                        type: 'image/svg+xml',
                        purpose: 'maskable',
                    },
                ],
            },
            workbox: {
                globPatterns: ['**/*.{js,css,html,ico,png,svg,mp3}'],
            },
        }),
    ],
    base: './',
});
