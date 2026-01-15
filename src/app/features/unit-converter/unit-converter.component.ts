/**
 * Unit Converter Component
 * Uzunluk, ağırlık, sıcaklık, hacim, veri ve daha fazlası
 */
import { Component, signal, computed } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTabsModule } from '@angular/material/tabs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

interface UnitCategory {
    name: string;
    icon: string;
    units: { id: string; name: string; factor: number }[];
}

@Component({
    selector: 'app-unit-converter',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        MatTabsModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatIconModule,
        MatButtonModule,
        DecimalPipe
    ],
    template: `
    <div class="unit-converter">
      <!-- Category Selector -->
      <div class="category-selector">
        @for (category of categories; track category.name) {
          <button 
            class="category-btn"
            [class.active]="selectedCategory() === category.name"
            (click)="selectCategory(category.name)">
            <mat-icon>{{ category.icon }}</mat-icon>
            <span>{{ category.name }}</span>
          </button>
        }
      </div>

      <!-- Converter Card -->
      <div class="converter-card">
        <!-- From Section -->
        <div class="converter-section from">
          <mat-form-field appearance="outline" class="unit-select">
            <mat-label>Birim</mat-label>
            <mat-select [(ngModel)]="fromUnit" (ngModelChange)="convert()">
              @for (unit of currentUnits(); track unit.id) {
                <mat-option [value]="unit.id">{{ unit.name }}</mat-option>
              }
            </mat-select>
          </mat-form-field>

          <mat-form-field appearance="outline" class="value-input">
            <mat-label>Değer</mat-label>
            <input 
              matInput 
              type="number" 
              [(ngModel)]="fromValue"
              (ngModelChange)="convert()"
              class="value-field">
          </mat-form-field>
        </div>

        <!-- Swap Button -->
        <button class="swap-btn" (click)="swapUnits()">
          <mat-icon>swap_vert</mat-icon>
        </button>

        <!-- To Section -->
        <div class="converter-section to">
          <mat-form-field appearance="outline" class="unit-select">
            <mat-label>Birim</mat-label>
            <mat-select [(ngModel)]="toUnit" (ngModelChange)="convert()">
              @for (unit of currentUnits(); track unit.id) {
                <mat-option [value]="unit.id">{{ unit.name }}</mat-option>
              }
            </mat-select>
          </mat-form-field>

          <div class="result-display">
            <span class="result-value">{{ toValue() | number:'1.0-10':'tr' }}</span>
            <span class="result-unit">{{ getUnitName(toUnit) }}</span>
          </div>
        </div>

        <!-- Formula Display -->
        <div class="formula-display">
          <span class="formula">
            1 {{ getUnitName(fromUnit) }} = {{ conversionRate() | number:'1.0-10':'tr' }} {{ getUnitName(toUnit) }}
          </span>
        </div>
      </div>

      <!-- Quick Conversions -->
      <div class="quick-conversions">
        <h4>Hızlı Dönüşümler</h4>
        <div class="quick-grid">
          @for (quick of quickConversions(); track quick.value) {
            <div class="quick-item">
              <span class="quick-from">{{ quick.from }}</span>
              <mat-icon>arrow_forward</mat-icon>
              <span class="quick-to">{{ quick.to }}</span>
            </div>
          }
        </div>
      </div>
    </div>
  `,
    styles: [`
    .unit-converter {
      max-width: 500px;
      margin: 0 auto;
      padding: 16px;
    }

    .category-selector {
      display: flex;
      gap: 8px;
      overflow-x: auto;
      padding-bottom: 12px;
      margin-bottom: 16px;

      &::-webkit-scrollbar {
        height: 4px;
      }
    }

    .category-btn {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 4px;
      padding: 12px 16px;
      border: none;
      border-radius: 12px;
      background: var(--calc-number-bg, #f0f0f5);
      color: var(--calc-text-secondary, #666);
      cursor: pointer;
      transition: all 0.2s ease;
      min-width: 80px;

      mat-icon {
        font-size: 24px;
        width: 24px;
        height: 24px;
      }

      span {
        font-size: 0.75rem;
        white-space: nowrap;
      }

      &:hover {
        background: var(--calc-function-bg, #e8f0fe);
      }

      &.active {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
      }
    }

    .converter-card {
      background: var(--calc-card-bg, #fff);
      border-radius: 20px;
      padding: 24px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
      position: relative;
    }

    .converter-section {
      display: flex;
      gap: 12px;
      align-items: flex-start;

      &.from {
        margin-bottom: 16px;
      }

      &.to {
        margin-top: 16px;
      }
    }

    .unit-select {
      flex: 1;
    }

    .value-input {
      flex: 1.5;

      .value-field {
        font-size: 1.5rem;
        font-weight: 600;
      }
    }

    .swap-btn {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      width: 48px;
      height: 48px;
      border-radius: 50%;
      border: none;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
      transition: transform 0.2s ease;
      z-index: 10;

      &:hover {
        transform: translate(-50%, -50%) scale(1.1);
      }

      &:active {
        transform: translate(-50%, -50%) scale(0.95);
      }
    }

    .result-display {
      flex: 1.5;
      background: var(--calc-display-bg, linear-gradient(135deg, #1a1a2e 0%, #16213e 100%));
      border-radius: 12px;
      padding: 16px;
      text-align: right;
    }

    .result-value {
      display: block;
      font-size: 1.75rem;
      font-weight: 700;
      color: white;
      font-family: 'SF Mono', monospace;
    }

    .result-unit {
      display: block;
      font-size: 0.875rem;
      color: rgba(255, 255, 255, 0.6);
      margin-top: 4px;
    }

    .formula-display {
      text-align: center;
      margin-top: 16px;
      padding-top: 16px;
      border-top: 1px solid var(--calc-border, rgba(0, 0, 0, 0.08));
    }

    .formula {
      font-size: 0.875rem;
      color: var(--calc-text-secondary, #666);
      font-family: 'SF Mono', monospace;
    }

    .quick-conversions {
      margin-top: 24px;

      h4 {
        margin: 0 0 12px;
        font-size: 0.875rem;
        color: var(--calc-text-secondary, #666);
      }
    }

    .quick-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 8px;
    }

    .quick-item {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      padding: 12px;
      background: var(--calc-number-bg, #f0f0f5);
      border-radius: 8px;
      font-size: 0.875rem;

      mat-icon {
        font-size: 16px;
        width: 16px;
        height: 16px;
        color: var(--calc-text-secondary, #666);
      }
    }

    .quick-from {
      color: var(--calc-text-primary, #1a1a1a);
      font-weight: 500;
    }

    .quick-to {
      color: #667eea;
      font-weight: 600;
    }

    @media (max-width: 480px) {
      .converter-section {
        flex-direction: column;
      }

      .quick-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class UnitConverterComponent {
    categories: UnitCategory[] = [
        {
            name: 'Uzunluk',
            icon: 'straighten',
            units: [
                { id: 'm', name: 'Metre', factor: 1 },
                { id: 'km', name: 'Kilometre', factor: 1000 },
                { id: 'cm', name: 'Santimetre', factor: 0.01 },
                { id: 'mm', name: 'Milimetre', factor: 0.001 },
                { id: 'mi', name: 'Mil', factor: 1609.344 },
                { id: 'ft', name: 'Feet', factor: 0.3048 },
                { id: 'in', name: 'İnç', factor: 0.0254 },
                { id: 'yd', name: 'Yarda', factor: 0.9144 }
            ]
        },
        {
            name: 'Ağırlık',
            icon: 'fitness_center',
            units: [
                { id: 'kg', name: 'Kilogram', factor: 1 },
                { id: 'g', name: 'Gram', factor: 0.001 },
                { id: 'mg', name: 'Miligram', factor: 0.000001 },
                { id: 'lb', name: 'Pound', factor: 0.453592 },
                { id: 'oz', name: 'Ons', factor: 0.0283495 },
                { id: 't', name: 'Ton', factor: 1000 }
            ]
        },
        {
            name: 'Sıcaklık',
            icon: 'thermostat',
            units: [
                { id: 'c', name: 'Celsius', factor: 1 },
                { id: 'f', name: 'Fahrenheit', factor: 1 },
                { id: 'k', name: 'Kelvin', factor: 1 }
            ]
        },
        {
            name: 'Hacim',
            icon: 'local_drink',
            units: [
                { id: 'l', name: 'Litre', factor: 1 },
                { id: 'ml', name: 'Mililitre', factor: 0.001 },
                { id: 'm3', name: 'Metreküp', factor: 1000 },
                { id: 'gal', name: 'Galon (US)', factor: 3.78541 },
                { id: 'qt', name: 'Quart', factor: 0.946353 },
                { id: 'pt', name: 'Pint', factor: 0.473176 },
                { id: 'cup', name: 'Bardak', factor: 0.236588 }
            ]
        },
        {
            name: 'Alan',
            icon: 'square_foot',
            units: [
                { id: 'm2', name: 'Metrekare', factor: 1 },
                { id: 'km2', name: 'Kilometrekare', factor: 1000000 },
                { id: 'ha', name: 'Hektar', factor: 10000 },
                { id: 'ac', name: 'Acre', factor: 4046.86 },
                { id: 'ft2', name: 'Feet kare', factor: 0.092903 }
            ]
        },
        {
            name: 'Veri',
            icon: 'storage',
            units: [
                { id: 'b', name: 'Byte', factor: 1 },
                { id: 'kb', name: 'Kilobyte', factor: 1024 },
                { id: 'mb', name: 'Megabyte', factor: 1048576 },
                { id: 'gb', name: 'Gigabyte', factor: 1073741824 },
                { id: 'tb', name: 'Terabyte', factor: 1099511627776 }
            ]
        },
        {
            name: 'Hız',
            icon: 'speed',
            units: [
                { id: 'kmh', name: 'km/saat', factor: 1 },
                { id: 'mph', name: 'mil/saat', factor: 1.60934 },
                { id: 'ms', name: 'm/saniye', factor: 3.6 },
                { id: 'kn', name: 'Knot', factor: 1.852 }
            ]
        },
        {
            name: 'Zaman',
            icon: 'schedule',
            units: [
                { id: 's', name: 'Saniye', factor: 1 },
                { id: 'min', name: 'Dakika', factor: 60 },
                { id: 'h', name: 'Saat', factor: 3600 },
                { id: 'd', name: 'Gün', factor: 86400 },
                { id: 'w', name: 'Hafta', factor: 604800 },
                { id: 'mo', name: 'Ay', factor: 2592000 },
                { id: 'y', name: 'Yıl', factor: 31536000 }
            ]
        }
    ];

    selectedCategory = signal<string>('Uzunluk');
    fromUnit = 'm';
    toUnit = 'km';
    fromValue = 1000;

    currentUnits = computed(() => {
        const category = this.categories.find(c => c.name === this.selectedCategory());
        return category?.units || [];
    });

    toValue = computed(() => {
        const category = this.categories.find(c => c.name === this.selectedCategory());
        if (!category) return 0;

        // Special handling for temperature
        if (this.selectedCategory() === 'Sıcaklık') {
            return this.convertTemperature(this.fromValue, this.fromUnit, this.toUnit);
        }

        const fromUnitData = category.units.find(u => u.id === this.fromUnit);
        const toUnitData = category.units.find(u => u.id === this.toUnit);

        if (!fromUnitData || !toUnitData) return 0;

        // Convert to base unit, then to target unit
        const baseValue = this.fromValue * fromUnitData.factor;
        return baseValue / toUnitData.factor;
    });

    conversionRate = computed(() => {
        const category = this.categories.find(c => c.name === this.selectedCategory());
        if (!category) return 0;

        if (this.selectedCategory() === 'Sıcaklık') {
            return this.convertTemperature(1, this.fromUnit, this.toUnit);
        }

        const fromUnitData = category.units.find(u => u.id === this.fromUnit);
        const toUnitData = category.units.find(u => u.id === this.toUnit);

        if (!fromUnitData || !toUnitData) return 0;

        return fromUnitData.factor / toUnitData.factor;
    });

    quickConversions = computed(() => {
        const value = this.fromValue;
        const from = this.getUnitName(this.fromUnit);
        const to = this.getUnitName(this.toUnit);
        const result = this.toValue();

        const quickValues = [1, 10, 100, 1000];
        return quickValues.map(v => {
            const ratio = result / value;
            return {
                value: v,
                from: `${v} ${from}`,
                to: `${(v * ratio).toFixed(4)} ${to}`
            };
        });
    });

    selectCategory(name: string): void {
        this.selectedCategory.set(name);
        const category = this.categories.find(c => c.name === name);
        if (category && category.units.length >= 2) {
            this.fromUnit = category.units[0].id;
            this.toUnit = category.units[1].id;
            this.fromValue = 1;
        }
    }

    swapUnits(): void {
        const temp = this.fromUnit;
        this.fromUnit = this.toUnit;
        this.toUnit = temp;
        this.fromValue = this.toValue();
    }

    convert(): void {
        // Trigger reactivity
    }

    getUnitName(id: string): string {
        const category = this.categories.find(c => c.name === this.selectedCategory());
        const unit = category?.units.find(u => u.id === id);
        return unit?.name || id;
    }

    private convertTemperature(value: number, from: string, to: string): number {
        // First convert to Celsius
        let celsius: number;
        switch (from) {
            case 'c': celsius = value; break;
            case 'f': celsius = (value - 32) * 5 / 9; break;
            case 'k': celsius = value - 273.15; break;
            default: celsius = value;
        }

        // Then convert to target
        switch (to) {
            case 'c': return celsius;
            case 'f': return celsius * 9 / 5 + 32;
            case 'k': return celsius + 273.15;
            default: return celsius;
        }
    }
}
