'use client';

import { useTheme } from 'next-themes';
import { Sun, Moon } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function ThemeToggle() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return (
            <div className="w-9 h-9 rounded-lg bg-muted border border-border" />
        );
    }

    return (
        <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="w-9 h-9 rounded-lg flex items-center justify-center transition-colors bg-muted text-foreground hover:bg-border border border-border"
            aria-label="Toggle Theme"
        >
            {theme === 'dark' ? (
                <Sun className="w-4.5 h-4.5 text-accent-gold" strokeWidth={1.5} />
            ) : (
                <Moon className="w-4.5 h-4.5 text-foreground" strokeWidth={1.5} />
            )}
        </button>
    );
}
