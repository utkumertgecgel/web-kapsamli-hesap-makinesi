/**
 * Theme Service
 * Dark/Light tema yönetimi
 * Angular Material tema sistemi ile entegre
 */
import { Injectable, signal, effect } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { inject } from '@angular/core';

export type Theme = 'light' | 'dark';

const THEME_KEY = 'angular-calculator-theme';

@Injectable({
    providedIn: 'root'
})
export class ThemeService {
    private readonly document = inject(DOCUMENT);

    // Tema state'i
    private readonly _theme = signal<Theme>(this.getInitialTheme());
    readonly theme = this._theme.asReadonly();
    readonly isDark = () => this._theme() === 'dark';

    constructor() {
        // Tema değişikliklerini DOM'a uygula
        effect(() => {
            this.applyTheme(this._theme());
        });
    }

    /**
     * Temayı değiştir
     */
    toggleTheme(): void {
        const newTheme = this._theme() === 'light' ? 'dark' : 'light';
        this._theme.set(newTheme);
        this.saveTheme(newTheme);
    }

    /**
     * Belirli bir tema ayarla
     */
    setTheme(theme: Theme): void {
        this._theme.set(theme);
        this.saveTheme(theme);
    }

    /**
     * Başlangıç temasını belirle
     * 1. SessionStorage'dan oku
     * 2. Sistem tercihini kontrol et
     * 3. Varsayılan olarak light kullan
     */
    private getInitialTheme(): Theme {
        // SessionStorage'dan oku
        try {
            const saved = sessionStorage.getItem(THEME_KEY) as Theme;
            if (saved === 'light' || saved === 'dark') {
                return saved;
            }
        } catch {
            // SessionStorage erişim hatası
        }

        // Sistem dark mode tercihini kontrol et
        if (typeof window !== 'undefined' && window.matchMedia) {
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            return prefersDark ? 'dark' : 'light';
        }

        return 'light';
    }

    /**
     * Temayı sessionStorage'a kaydet
     */
    private saveTheme(theme: Theme): void {
        try {
            sessionStorage.setItem(THEME_KEY, theme);
        } catch {
            // SessionStorage yazma hatası
        }
    }

    /**
     * Temayı DOM'a uygula
     */
    private applyTheme(theme: Theme): void {
        const body = this.document.body;

        if (theme === 'dark') {
            body.classList.add('dark-theme');
            body.classList.remove('light-theme');
        } else {
            body.classList.add('light-theme');
            body.classList.remove('dark-theme');
        }
    }
}
