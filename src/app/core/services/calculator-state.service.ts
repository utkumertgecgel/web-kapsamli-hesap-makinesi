/**
 * Calculator State Service
 * Angular Signals kullanarak reaktif state yönetimi
 * Tüm hesap makinesi durumunu merkezi olarak yönetir
 */
import { Injectable, signal, computed, effect } from '@angular/core';
import { CalculatorMode, AngleUnit, CalculationResult } from './calculation-engine.service';
import { StorageService } from './storage.service';

export interface CalculatorState {
    currentValue: string;
    previousValue: string;
    operator: string | null;
    waitingForOperand: boolean;
    memory: number;
    history: CalculationResult[];
    mode: CalculatorMode;
    angleUnit: AngleUnit;
    expression: string;
}

const INITIAL_STATE: CalculatorState = {
    currentValue: '0',
    previousValue: '',
    operator: null,
    waitingForOperand: false,
    memory: 0,
    history: [],
    mode: 'standard',
    angleUnit: 'deg',
    expression: ''
};

@Injectable({
    providedIn: 'root'
})
export class CalculatorStateService {
    // Signals - reaktif state değişkenleri
    private readonly _currentValue = signal<string>('0');
    private readonly _previousValue = signal<string>('');
    private readonly _operator = signal<string | null>(null);
    private readonly _waitingForOperand = signal<boolean>(false);
    private readonly _memory = signal<number>(0);
    private readonly _history = signal<CalculationResult[]>([]);
    private readonly _mode = signal<CalculatorMode>('standard');
    private readonly _angleUnit = signal<AngleUnit>('deg');
    private readonly _expression = signal<string>('');

    // Public readonly signals
    readonly currentValue = this._currentValue.asReadonly();
    readonly previousValue = this._previousValue.asReadonly();
    readonly operator = this._operator.asReadonly();
    readonly waitingForOperand = this._waitingForOperand.asReadonly();
    readonly memory = this._memory.asReadonly();
    readonly history = this._history.asReadonly();
    readonly mode = this._mode.asReadonly();
    readonly angleUnit = this._angleUnit.asReadonly();
    readonly expression = this._expression.asReadonly();

    // Computed signals
    readonly hasMemory = computed(() => this._memory() !== 0);
    readonly displayValue = computed(() => {
        const value = this._currentValue();
        return this.formatDisplay(value);
    });

    readonly expressionDisplay = computed(() => {
        const prev = this._previousValue();
        const op = this._operator();
        if (prev && op) {
            return `${prev} ${op}`;
        }
        return '';
    });

    constructor(private storageService: StorageService) {
        // State'i sessionStorage'dan yükle
        this.loadState();

        // State değişikliklerini otomatik kaydet
        effect(() => {
            const state: CalculatorState = {
                currentValue: this._currentValue(),
                previousValue: this._previousValue(),
                operator: this._operator(),
                waitingForOperand: this._waitingForOperand(),
                memory: this._memory(),
                history: this._history(),
                mode: this._mode(),
                angleUnit: this._angleUnit(),
                expression: this._expression()
            };
            this.storageService.saveState(state);
        });
    }

    /**
     * State güncelleme metodları
     */
    setCurrentValue(value: string): void {
        this._currentValue.set(value);
    }

    setPreviousValue(value: string): void {
        this._previousValue.set(value);
    }

    setOperator(operator: string | null): void {
        this._operator.set(operator);
    }

    setWaitingForOperand(waiting: boolean): void {
        this._waitingForOperand.set(waiting);
    }

    setMode(mode: CalculatorMode): void {
        this._mode.set(mode);
    }

    setAngleUnit(unit: AngleUnit): void {
        this._angleUnit.set(unit);
    }

    setExpression(expression: string): void {
        this._expression.set(expression);
    }

    /**
     * Rakam girişi
     */
    inputDigit(digit: string): void {
        const current = this._currentValue();

        if (this._waitingForOperand()) {
            this._currentValue.set(digit);
            this._waitingForOperand.set(false);
        } else {
            // Başındaki 0'ı kaldır, ama ondalık için koru
            if (current === '0' && digit !== '.') {
                this._currentValue.set(digit);
            } else {
                this._currentValue.set(current + digit);
            }
        }
    }

    /**
     * Ondalık nokta girişi
     */
    inputDecimal(): void {
        if (this._waitingForOperand()) {
            this._currentValue.set('0.');
            this._waitingForOperand.set(false);
            return;
        }

        if (!this._currentValue().includes('.')) {
            this._currentValue.set(this._currentValue() + '.');
        }
    }

    /**
     * Son karakteri sil (backspace)
     */
    backspace(): void {
        const current = this._currentValue();
        if (current.length > 1) {
            this._currentValue.set(current.slice(0, -1));
        } else {
            this._currentValue.set('0');
        }
    }

    /**
     * Mevcut girişi temizle (CE)
     */
    clearEntry(): void {
        this._currentValue.set('0');
    }

    /**
     * Tümünü temizle (C)
     */
    clearAll(): void {
        this._currentValue.set('0');
        this._previousValue.set('');
        this._operator.set(null);
        this._waitingForOperand.set(false);
        this._expression.set('');
    }

    /**
     * Hafıza işlemleri
     */
    memoryClear(): void {
        this._memory.set(0);
    }

    memoryRecall(): void {
        this._currentValue.set(this._memory().toString());
        this._waitingForOperand.set(true);
    }

    memoryAdd(): void {
        const current = parseFloat(this._currentValue());
        this._memory.set(this._memory() + current);
    }

    memorySubtract(): void {
        const current = parseFloat(this._currentValue());
        this._memory.set(this._memory() - current);
    }

    /**
     * Geçmişe ekle
     */
    addToHistory(result: CalculationResult): void {
        const current = this._history();
        // Son 50 kayıt tut
        const updated = [result, ...current].slice(0, 50);
        this._history.set(updated);
    }

    /**
     * Geçmişi temizle
     */
    clearHistory(): void {
        this._history.set([]);
    }

    /**
     * State'i sessionStorage'dan yükle
     */
    private loadState(): void {
        const savedState = this.storageService.loadState();
        if (savedState) {
            this._currentValue.set(savedState.currentValue);
            this._previousValue.set(savedState.previousValue);
            this._operator.set(savedState.operator);
            this._waitingForOperand.set(savedState.waitingForOperand);
            this._memory.set(savedState.memory);
            this._history.set(savedState.history || []);
            this._mode.set(savedState.mode);
            this._angleUnit.set(savedState.angleUnit);
            this._expression.set(savedState.expression || '');
        }
    }

    /**
     * Ekran değerini formatla
     */
    private formatDisplay(value: string): string {
        // Sayı çok uzunsa kısalt
        if (value.length > 16) {
            const num = parseFloat(value);
            if (!isNaN(num)) {
                return num.toExponential(10);
            }
        }
        return value;
    }

    /**
     * State'i sıfırla
     */
    reset(): void {
        this._currentValue.set(INITIAL_STATE.currentValue);
        this._previousValue.set(INITIAL_STATE.previousValue);
        this._operator.set(INITIAL_STATE.operator);
        this._waitingForOperand.set(INITIAL_STATE.waitingForOperand);
        this._memory.set(INITIAL_STATE.memory);
        this._history.set(INITIAL_STATE.history);
        this._expression.set(INITIAL_STATE.expression);
    }
}
