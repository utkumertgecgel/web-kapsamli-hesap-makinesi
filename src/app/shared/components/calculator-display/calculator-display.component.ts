/**
 * Calculator Display Component
 * Hesap makinesi ekranı - mevcut değer ve ifade gösterimi
 */
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';

@Component({
    selector: 'app-calculator-display',
    standalone: true,
    imports: [CommonModule, MatCardModule],
    template: `
    <mat-card class="display-card" appearance="outlined">
      <div class="display-container">
        <!-- Üst kısım: İfade veya önceki değer -->
        <div class="expression-line" [attr.aria-label]="'Expression: ' + expression">
          {{ expression || '&nbsp;' }}
        </div>
        
        <!-- Ana ekran: Mevcut değer -->
        <div 
          class="value-line" 
          [class.error]="isError"
          [attr.aria-label]="'Current value: ' + value"
          role="textbox"
          aria-readonly="true">
          {{ displayValue }}
        </div>

        <!-- Hafıza göstergesi -->
        @if (hasMemory) {
          <div class="memory-indicator" aria-label="Memory stored">
            M
          </div>
        }
      </div>
    </mat-card>
  `,
    styles: [`
    :host {
      display: block;
      width: 100%;
    }

    .display-card {
      background: var(--calc-display-bg, linear-gradient(135deg, #1a1a2e 0%, #16213e 100%));
      border: none;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 
        inset 0 2px 4px rgba(0, 0, 0, 0.3),
        0 4px 12px rgba(0, 0, 0, 0.15);
    }

    .display-container {
      position: relative;
      padding: 20px 24px;
      min-height: 100px;
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      align-items: flex-end;
    }

    .expression-line {
      font-size: 1rem;
      color: var(--calc-display-secondary, rgba(255, 255, 255, 0.6));
      font-family: 'SF Mono', 'Consolas', 'Monaco', monospace;
      min-height: 24px;
      text-align: right;
      width: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .value-line {
      font-size: 2.5rem;
      font-weight: 600;
      color: var(--calc-display-primary, #ffffff);
      font-family: 'SF Mono', 'Consolas', 'Monaco', monospace;
      text-align: right;
      width: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      letter-spacing: 1px;
      transition: color 0.2s ease;

      &.error {
        color: var(--calc-display-error, #ef5350);
      }

      @media (max-width: 400px) {
        font-size: 2rem;
      }
    }

    .memory-indicator {
      position: absolute;
      top: 12px;
      left: 16px;
      font-size: 0.75rem;
      font-weight: 600;
      color: var(--calc-memory-indicator, #64b5f6);
      background: rgba(100, 181, 246, 0.15);
      padding: 2px 8px;
      border-radius: 4px;
    }
  `]
})
export class CalculatorDisplayComponent {
    @Input() value = '0';
    @Input() expression = '';
    @Input() hasMemory = false;
    @Input() isError = false;

    get displayValue(): string {
        // Büyük sayıları formatla
        if (this.value === 'Error' || this.value === 'Hata') {
            return this.value;
        }

        const num = parseFloat(this.value);
        if (isNaN(num)) {
            return this.value;
        }

        // Binlik ayracı ekle (sadece tam sayı kısmına)
        const parts = this.value.split('.');
        const integerPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');

        if (parts[1] !== undefined) {
            return `${integerPart}.${parts[1]}`;
        }

        return integerPart;
    }
}
