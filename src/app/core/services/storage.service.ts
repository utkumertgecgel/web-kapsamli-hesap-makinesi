/**
 * Storage Service
 * sessionStorage wrapper - sayfa yenilense bile veri korunur
 * Tarayıcı kapatılınca otomatik silinir
 */
import { Injectable } from '@angular/core';
import { CalculatorState } from './calculator-state.service';

const STORAGE_KEY = 'angular-calculator-state';

@Injectable({
    providedIn: 'root'
})
export class StorageService {

    /**
     * State'i sessionStorage'a kaydet
     */
    saveState(state: CalculatorState): void {
        try {
            const serialized = JSON.stringify(state);
            sessionStorage.setItem(STORAGE_KEY, serialized);
        } catch (error) {
            console.warn('State kaydedilemedi:', error);
        }
    }

    /**
     * State'i sessionStorage'dan yükle
     */
    loadState(): CalculatorState | null {
        try {
            const serialized = sessionStorage.getItem(STORAGE_KEY);
            if (serialized) {
                const state = JSON.parse(serialized);
                // Tarih string'lerini Date nesnesine çevir
                if (state.history) {
                    state.history = state.history.map((item: any) => ({
                        ...item,
                        timestamp: new Date(item.timestamp)
                    }));
                }
                return state;
            }
        } catch (error) {
            console.warn('State yüklenemedi:', error);
        }
        return null;
    }

    /**
     * Belirli bir anahtarı kaydet
     */
    setItem<T>(key: string, value: T): void {
        try {
            const serialized = JSON.stringify(value);
            sessionStorage.setItem(key, serialized);
        } catch (error) {
            console.warn(`'${key}' kaydedilemedi:`, error);
        }
    }

    /**
     * Belirli bir anahtarı oku
     */
    getItem<T>(key: string): T | null {
        try {
            const serialized = sessionStorage.getItem(key);
            if (serialized) {
                return JSON.parse(serialized);
            }
        } catch (error) {
            console.warn(`'${key}' okunamadı:`, error);
        }
        return null;
    }

    /**
     * Belirli bir anahtarı sil
     */
    removeItem(key: string): void {
        sessionStorage.removeItem(key);
    }

    /**
     * Tüm verileri temizle
     */
    clear(): void {
        sessionStorage.removeItem(STORAGE_KEY);
    }
}
