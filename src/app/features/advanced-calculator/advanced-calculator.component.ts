/**
 * Advanced Calculator Component
 * Gelişmiş mod - parantezli ifade çözümleyici
 * İleride eklencek modlar için genişletilebilir altyapı
 */
import { Component, inject, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { CalculatorButtonComponent } from '../../shared/components';
import { CalculatorDisplayComponent } from '../../shared/components';
import { HistoryPanelComponent } from '../../shared/components';
import { CalculatorStateService } from '../../core/services';
import { CalculationEngineService, CalculationResult } from '../../core/services/calculation-engine.service';

@Component({
    selector: 'app-advanced-calculator',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        MatInputModule,
        MatFormFieldModule,
        MatIconModule,
        CalculatorButtonComponent,
        CalculatorDisplayComponent,
        HistoryPanelComponent
    ],
    template: `
    <div class="advanced-calculator">
      <div class="calculator-main">
        <!-- İfade Girişi -->
        <div class="expression-input-container">
          <mat-form-field appearance="outline" class="expression-field">
            <mat-label>Matematiksel İfade</mat-label>
            <input 
              matInput 
              [(ngModel)]="expressionInput"
              (keydown.enter)="evaluateExpression()"
              placeholder="Örn: (5 + 3) × 2 − 4"
              autocomplete="off"
              class="expression-input">
            <mat-icon matSuffix class="help-icon" matTooltip="Desteklenen: +, −, ×, ÷, ^, (, ), π, e">
              help_outline
            </mat-icon>
          </mat-form-field>
        </div>

        <!-- Sonuç Ekranı -->
        <div class="result-display">
          <div class="result-label">Sonuç</div>
          <div class="result-value" [class.error]="hasError">
            {{ displayResult }}
          </div>
        </div>

        <!-- Hızlı Butonlar -->
        <div class="quick-buttons">
          <div class="button-row">
            <app-calculator-button 
              label="(" 
              variant="function"
              (pressed)="insertChar('(')">
            </app-calculator-button>
            <app-calculator-button 
              label=")" 
              variant="function"
              (pressed)="insertChar(')')">
            </app-calculator-button>
            <app-calculator-button 
              label="^" 
              variant="function"
              ariaLabel="Power"
              (pressed)="insertChar('^')">
            </app-calculator-button>
            <app-calculator-button 
              label="π" 
              variant="function"
              ariaLabel="Pi"
              (pressed)="insertChar('π')">
            </app-calculator-button>
            <app-calculator-button 
              label="e" 
              variant="function"
              ariaLabel="Euler's number"
              (pressed)="insertChar('e')">
            </app-calculator-button>
          </div>

          <div class="button-row">
            <app-calculator-button 
              label="7" 
              variant="number"
              (pressed)="insertChar('7')">
            </app-calculator-button>
            <app-calculator-button 
              label="8" 
              variant="number"
              (pressed)="insertChar('8')">
            </app-calculator-button>
            <app-calculator-button 
              label="9" 
              variant="number"
              (pressed)="insertChar('9')">
            </app-calculator-button>
            <app-calculator-button 
              label="÷" 
              variant="operator"
              (pressed)="insertChar('/')">
            </app-calculator-button>
            <app-calculator-button 
              label="C" 
              variant="special"
              (pressed)="clear()">
            </app-calculator-button>
          </div>

          <div class="button-row">
            <app-calculator-button 
              label="4" 
              variant="number"
              (pressed)="insertChar('4')">
            </app-calculator-button>
            <app-calculator-button 
              label="5" 
              variant="number"
              (pressed)="insertChar('5')">
            </app-calculator-button>
            <app-calculator-button 
              label="6" 
              variant="number"
              (pressed)="insertChar('6')">
            </app-calculator-button>
            <app-calculator-button 
              label="×" 
              variant="operator"
              (pressed)="insertChar('*')">
            </app-calculator-button>
            <app-calculator-button 
              label="⌫" 
              variant="special"
              (pressed)="backspace()">
            </app-calculator-button>
          </div>

          <div class="button-row">
            <app-calculator-button 
              label="1" 
              variant="number"
              (pressed)="insertChar('1')">
            </app-calculator-button>
            <app-calculator-button 
              label="2" 
              variant="number"
              (pressed)="insertChar('2')">
            </app-calculator-button>
            <app-calculator-button 
              label="3" 
              variant="number"
              (pressed)="insertChar('3')">
            </app-calculator-button>
            <app-calculator-button 
              label="−" 
              variant="operator"
              (pressed)="insertChar('-')">
            </app-calculator-button>
            <app-calculator-button 
              label="=" 
              variant="equal"
              (pressed)="evaluateExpression()">
            </app-calculator-button>
          </div>

          <div class="button-row">
            <app-calculator-button 
              label="0" 
              variant="number"
              [wide]="true"
              (pressed)="insertChar('0')">
            </app-calculator-button>
            <app-calculator-button 
              label="." 
              variant="number"
              (pressed)="insertChar('.')">
            </app-calculator-button>
            <app-calculator-button 
              label="+" 
              variant="operator"
              (pressed)="insertChar('+')">
            </app-calculator-button>
          </div>
        </div>
      </div>

      <!-- Geçmiş Paneli -->
      <div class="history-sidebar">
        <app-history-panel
          (resultSelected)="onHistorySelect($event)">
        </app-history-panel>
      </div>
    </div>
  `,
    styles: [`
    .advanced-calculator {
      display: grid;
      grid-template-columns: 1fr 280px;
      gap: 20px;
      max-width: 800px;
      margin: 0 auto;
      padding: 16px;
      min-height: 500px;

      @media (max-width: 768px) {
        grid-template-columns: 1fr;
        
        .history-sidebar {
          order: -1;
          max-height: 200px;
        }
      }
    }

    .calculator-main {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .expression-input-container {
      width: 100%;
    }

    .expression-field {
      width: 100%;

      .expression-input {
        font-family: 'SF Mono', 'Consolas', 'Monaco', monospace;
        font-size: 1.25rem;
        letter-spacing: 1px;
      }
    }

    .help-icon {
      cursor: help;
      opacity: 0.6;
    }

    .result-display {
      background: var(--calc-display-bg, linear-gradient(135deg, #1a1a2e 0%, #16213e 100%));
      border-radius: 12px;
      padding: 20px;
      text-align: right;
    }

    .result-label {
      font-size: 0.875rem;
      color: var(--calc-display-secondary, rgba(255, 255, 255, 0.6));
      margin-bottom: 8px;
    }

    .result-value {
      font-size: 2rem;
      font-weight: 600;
      color: var(--calc-display-primary, #ffffff);
      font-family: 'SF Mono', 'Consolas', 'Monaco', monospace;
      letter-spacing: 1px;
      word-break: break-all;

      &.error {
        color: var(--calc-display-error, #ef5350);
      }
    }

    .quick-buttons {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .button-row {
      display: grid;
      grid-template-columns: repeat(5, 1fr);
      gap: 8px;

      &:last-child {
        grid-template-columns: 2fr 1fr 1fr;
      }
    }

    .history-sidebar {
      min-height: 400px;
    }
  `]
})
export class AdvancedCalculatorComponent {
    readonly stateService = inject(CalculatorStateService);
    private readonly engine = inject(CalculationEngineService);

    expressionInput = '';
    result = '0';
    hasError = false;

    get displayResult(): string {
        return this.result;
    }

    @HostListener('window:keydown', ['$event'])
    handleKeyboard(event: KeyboardEvent): void {
        // Input alanındayken normal klavye davranışı
        if (event.target instanceof HTMLInputElement) {
            if (event.key === 'Enter') {
                event.preventDefault();
                this.evaluateExpression();
            }
            return;
        }
    }

    insertChar(char: string): void {
        this.expressionInput += char;
        this.hasError = false;
    }

    backspace(): void {
        if (this.expressionInput.length > 0) {
            this.expressionInput = this.expressionInput.slice(0, -1);
        }
    }

    clear(): void {
        this.expressionInput = '';
        this.result = '0';
        this.hasError = false;
    }

    evaluateExpression(): void {
        if (!this.expressionInput.trim()) {
            return;
        }

        try {
            // Operatörleri standart hale getir
            let normalized = this.expressionInput
                .replace(/×/g, '*')
                .replace(/÷/g, '/')
                .replace(/−/g, '-');

            const numericResult = this.engine.evaluateExpression(normalized);
            this.result = this.engine.formatResult(numericResult);
            this.hasError = false;

            // Geçmişe ekle
            const historyItem: CalculationResult = {
                expression: this.expressionInput,
                result: numericResult,
                timestamp: new Date(),
                mode: 'advanced'
            };
            this.stateService.addToHistory(historyItem);

        } catch (error) {
            this.result = 'Hata: Geçersiz ifade';
            this.hasError = true;
        }
    }

    onHistorySelect(item: CalculationResult): void {
        // Geçmişten seçilen sonucu ifadeye ekle
        this.expressionInput = item.result.toString();
        this.result = this.engine.formatResult(item.result);
        this.hasError = false;
    }
}
