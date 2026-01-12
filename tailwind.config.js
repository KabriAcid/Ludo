/** @type {import('tailwindcss').Config} */
export default {
    content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
    theme: {
        extend: {
            colors: {
                board: {
                    bg: '#f5e6c8',
                    border: '#8b4513',
                },
                player: {
                    red: '#dc2626',
                    green: '#16a34a',
                    yellow: '#eab308',
                    blue: '#2563eb',
                },
                safe: '#94a3b8',
            },
            animation: {
                'bounce-slow': 'bounce 1.5s infinite',
                'pulse-glow': 'pulse-glow 1.5s ease-in-out infinite',
                'token-move': 'token-move 0.3s ease-out',
            },
            keyframes: {
                'pulse-glow': {
                    '0%, 100%': {
                        boxShadow: '0 0 5px 2px rgba(255, 255, 255, 0.5)',
                    },
                    '50%': {
                        boxShadow: '0 0 20px 5px rgba(255, 255, 255, 0.8)',
                    },
                },
                'token-move': {
                    '0%': { transform: 'scale(1.2)' },
                    '100%': { transform: 'scale(1)' },
                },
            },
        },
    },
    plugins: [],
};
