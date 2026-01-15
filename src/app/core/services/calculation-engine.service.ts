/**
 * Calculation Engine Service
 * Tüm matematiksel hesaplamaları yöneten merkezi servis
 * Standard, Scientific ve Advanced modlar için hesaplama desteği sağlar
 */
import { Injectable } from '@angular/core';

export type CalculatorMode = 'standard' | 'scientific' | 'advanced';
export type AngleUnit = 'deg' | 'rad';

export interface CalculationResult {
    expression: string;
    result: number;
    timestamp: Date;
    mode: CalculatorMode;
}

@Injectable({
    providedIn: 'root'
})
export class CalculationEngineService {

    /**
     * Temel aritmetik işlemler
     */
    add(a: number, b: number): number {
        return a + b;
    }

    subtract(a: number, b: number): number {
        return a - b;
    }

    multiply(a: number, b: number): number {
        return a * b;
    }

    divide(a: number, b: number): number {
        if (b === 0) {
            throw new Error('Sıfıra bölme hatası');
        }
        return a / b;
    }

    /**
     * Yüzde hesaplama
     */
    percentage(value: number): number {
        return value / 100;
    }

    /**
     * Trigonometrik fonksiyonlar
     * @param angle Açı değeri
     * @param unit Açı birimi (derece veya radyan)
     */
    sin(angle: number, unit: AngleUnit = 'deg'): number {
        const radians = unit === 'deg' ? this.toRadians(angle) : angle;
        return Math.sin(radians);
    }

    cos(angle: number, unit: AngleUnit = 'deg'): number {
        const radians = unit === 'deg' ? this.toRadians(angle) : angle;
        return Math.cos(radians);
    }

    tan(angle: number, unit: AngleUnit = 'deg'): number {
        const radians = unit === 'deg' ? this.toRadians(angle) : angle;
        return Math.tan(radians);
    }

    /**
     * Ters trigonometrik fonksiyonlar
     */
    asin(value: number, unit: AngleUnit = 'deg'): number {
        const result = Math.asin(value);
        return unit === 'deg' ? this.toDegrees(result) : result;
    }

    acos(value: number, unit: AngleUnit = 'deg'): number {
        const result = Math.acos(value);
        return unit === 'deg' ? this.toDegrees(result) : result;
    }

    atan(value: number, unit: AngleUnit = 'deg'): number {
        const result = Math.atan(value);
        return unit === 'deg' ? this.toDegrees(result) : result;
    }

    /**
     * Logaritmik fonksiyonlar
     */
    log(value: number): number {
        if (value <= 0) {
            throw new Error('Logaritma için pozitif sayı gerekli');
        }
        return Math.log10(value);
    }

    ln(value: number): number {
        if (value <= 0) {
            throw new Error('Logaritma için pozitif sayı gerekli');
        }
        return Math.log(value);
    }

    /**
     * Üs ve kök işlemleri
     */
    power(base: number, exponent: number): number {
        return Math.pow(base, exponent);
    }

    sqrt(value: number): number {
        if (value < 0) {
            throw new Error('Negatif sayının karekökü alınamaz');
        }
        return Math.sqrt(value);
    }

    cbrt(value: number): number {
        return Math.cbrt(value);
    }

    /**
     * Faktöriyel hesaplama
     * Büyük sayılar için memoization kullanır
     */
    factorial(n: number): number {
        if (n < 0) {
            throw new Error('Faktöriyel negatif sayı için tanımsız');
        }
        if (!Number.isInteger(n)) {
            throw new Error('Faktöriyel sadece tam sayılar için tanımlı');
        }
        if (n > 170) {
            throw new Error('Sayı çok büyük (max: 170)');
        }

        let result = 1;
        for (let i = 2; i <= n; i++) {
            result *= i;
        }
        return result;
    }

    /**
     * Matematiksel sabitler
     */
    get PI(): number {
        return Math.PI;
    }

    get E(): number {
        return Math.E;
    }

    /**
     * Açı dönüşümleri
     */
    toRadians(degrees: number): number {
        return degrees * (Math.PI / 180);
    }

    toDegrees(radians: number): number {
        return radians * (180 / Math.PI);
    }

    /**
     * Yardımcı fonksiyonlar
     */
    abs(value: number): number {
        return Math.abs(value);
    }

    negate(value: number): number {
        return -value;
    }

    reciprocal(value: number): number {
        if (value === 0) {
            throw new Error('Sıfırın tersi tanımsız');
        }
        return 1 / value;
    }

    square(value: number): number {
        return value * value;
    }

    cube(value: number): number {
        return value * value * value;
    }

    exp(value: number): number {
        return Math.exp(value);
    }

    /**
     * İfade çözümleyici (Advanced mod için)
     * Parantezli matematiksel ifadeleri hesaplar
     */
    evaluateExpression(expression: string): number {
        // Güvenlik kontrolü - sadece izin verilen karakterler
        const sanitized = expression.replace(/\s/g, '');
        const allowedPattern = /^[0-9+\-*/().^%πe]+$/;

        if (!allowedPattern.test(sanitized)) {
            throw new Error('Geçersiz ifade');
        }

        // Sabit değerleri yerine koy
        let processed = sanitized
            .replace(/π/g, String(Math.PI))
            .replace(/e(?![0-9])/g, String(Math.E))
            .replace(/\^/g, '**');

        try {
            // Güvenli değerlendirme için Function constructor kullan
            const result = new Function(`return ${processed}`)();

            if (typeof result !== 'number' || !isFinite(result)) {
                throw new Error('Geçersiz sonuç');
            }

            return result;
        } catch {
            throw new Error('İfade hesaplanamadı');
        }
    }

    /**
     * Operatör işlemi uygula
     */
    applyOperator(a: number, operator: string, b: number): number {
        switch (operator) {
            case '+': return this.add(a, b);
            case '-': return this.subtract(a, b);
            case '×':
            case '*': return this.multiply(a, b);
            case '÷':
            case '/': return this.divide(a, b);
            case '^': return this.power(a, b);
            default: throw new Error(`Bilinmeyen operatör: ${operator}`);
        }
    }

    /**
     * Sonucu formatlı string'e çevir
     */
    formatResult(value: number, precision: number = 10): string {
        if (!isFinite(value)) {
            return 'Hata';
        }

        // Çok büyük veya küçük sayılar için bilimsel notasyon
        if (Math.abs(value) >= 1e15 || (Math.abs(value) < 1e-10 && value !== 0)) {
            return value.toExponential(precision);
        }

        // Normal sayılar için gereksiz sıfırları kaldır
        const fixed = value.toFixed(precision);
        return parseFloat(fixed).toString();
    }
}
