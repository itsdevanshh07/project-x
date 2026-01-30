/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
        "./lib/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                // Primary System
                'primary': {
                    DEFAULT: 'var(--color-primary)',
                    light: 'var(--color-primary-light)',
                    dark: 'var(--color-primary-dark)',
                },
                'brand-primary': 'var(--color-primary)', // Legacy support

                // Accent System
                'accent': {
                    DEFAULT: 'var(--color-accent)',
                    light: 'var(--color-accent-light)',
                    dark: 'var(--color-accent-dark)',
                },
                'brand-reward': 'var(--color-accent)', // Legacy support

                // Secondary System
                'secondary': {
                    DEFAULT: 'var(--color-secondary)',
                    light: 'var(--color-secondary-light)',
                    dark: 'var(--color-secondary-dark)',
                },
                'brand-secondary': 'var(--color-secondary)', // Legacy support

                // Neutrals
                'bg': 'var(--color-bg)',
                'bg-main': 'var(--color-bg)', // Legacy support

                'surface': {
                    DEFAULT: 'var(--color-surface)',
                    soft: 'var(--color-surface-soft)',
                },
                'bg-card': 'var(--color-surface)', // Legacy support
                'bg-section': 'var(--color-surface-soft)', // Legacy support

                'text': {
                    DEFAULT: 'var(--color-text)',
                    muted: 'var(--color-text-muted)',
                    soft: 'var(--color-text-soft)',
                    'on-primary': 'var(--color-on-primary)',
                },
                'text-primary': 'var(--color-text)', // Legacy support
                'text-secondary': 'var(--color-text-muted)', // Legacy support
                'text-muted': 'var(--color-text-soft)', // Legacy support

                // Borders
                'border': {
                    subtle: 'var(--color-border-subtle)',
                    strong: 'var(--color-border-strong)',
                },
                'border-main': 'var(--color-border-subtle)', // Legacy support

                // States
                'success': 'var(--color-success)',
                'warning': 'var(--color-warning)',
                'danger': 'var(--color-danger)',
                'info': 'var(--color-info)',
            },
        },
    },
    plugins: [],
};
