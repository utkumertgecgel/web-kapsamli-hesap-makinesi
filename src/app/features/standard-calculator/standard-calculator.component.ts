/**
 * Standard Calculator Component
 * Temel aritmetik işlemler için hesap makinesi
 * Toplama, çıkarma, çarpma, bölme, yüzde hesabı
 */
import { Component, inject, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalculatorButtonComponent } from '../../shared/components';
import { CalculatorDisplayComponent } from '../../shared/components';
import { CalculatorStateService } from '../../core/services';
import { CalculationEngineService, CalculationResult } from '../../core/services/calculation-engine.service';

@Component({
    selector: 'app-standard-calculator',
    standalone: true,
    imports: [CommonModule, CalculatorButtonComponent, CalculatorDisplayComponent],
    template: `
    <div class="standard-calculator">
      <!-- Ekran -->
      <app-calculator-display
        [value]="stateService.currentValue()"
        [expression]="stateService.expressionDisplay()"
        [hasMemory]="stateService.hasMemory()">
      </app-calculator-display>

      <!-- Buton Grid -->
      <div class="button-grid">
        <!-- Üst sıra: Memory ve Clear -->
        <app-calculator-button 
          label="MC" 
          variant="function"
          ariaLabel="Memory Clear"
          (pressed)="memoryClear()">
        </app-calculator-button>
        <app-calculator-button 
          label="MR" 
          variant="function"
          ariaLabel="Memory Recall"
          (pressed)="memoryRecall()">
        </app-calculator-button>
        <app-calculator-button 
          label="M+" 
          variant="function"
          ariaLabel="Memory Add"
          (pressed)="memoryAdd()">
        </app-calculator-button>
        <app-calculator-button 
          label="M−" 
          variant="function"
          ariaLabel="Memory Subtract"
          (pressed)="memorySubtract()">
        </app-calculator-button>

        <!-- İkinci sıra: C, CE, %, ÷ -->
        <app-calculator-button 
          label="C" 
          variant="special"
          ariaLabel="Clear All"
          (pressed)="clearAll()">
        </app-calculator-button>
        <app-calculator-button 
          label="CE" 
          variant="special"
          ariaLabel="Clear Entry"
          (pressed)="clearEntry()">
        </app-calculator-button>
        <app-calculator-button 
          label="%" 
          variant="function"
          ariaLabel="Percentage"
          (pressed)="percentage()">
        </app-calculator-button>
        <app-calculator-button 
          label="÷" 
          variant="operator"
          [active]="stateService.operator() === '÷'"
          ariaLabel="Divide"
          (pressed)="setOperator('÷')">
        </app-calculator-button>

        <!-- Üçüncü sıra: 7, 8, 9, × -->
        <app-calculator-button 
          label="7" 
          variant="number"
          (pressed)="inputDigit('7')">
        </app-calculator-button>
        <app-calculator-button 
          label="8" 
          variant="number"
          (pressed)="inputDigit('8')">
        </app-calculator-button>
        <app-calculator-button 
          label="9" 
          variant="number"
          (pressed)="inputDigit('9')">
        </app-calculator-button>
        <app-calculator-button 
          label="×" 
          variant="operator"
          [active]="stateService.operator() === '×'"
          ariaLabel="Multiply"
          (pressed)="setOperator('×')">
        </app-calculator-button>

        <!-- Dördüncü sıra: 4, 5, 6, − -->
        <app-calculator-button 
          label="4" 
          variant="number"
          (pressed)="inputDigit('4')">
        </app-calculator-button>
        <app-calculator-button 
          label="5" 
          variant="number"
          (pressed)="inputDigit('5')">
        </app-calculator-button>
        <app-calculator-button 
          label="6" 
          variant="number"
          (pressed)="inputDigit('6')">
        </app-calculator-button>
        <app-calculator-button 
          label="−" 
          variant="operator"
          [active]="stateService.operator() === '−'"
          ariaLabel="Subtract"
          (pressed)="setOperator('−')">
        </app-calculator-button>

        <!-- Beşinci sıra: 1, 2, 3, + -->
        <app-calculator-button 
          label="1" 
          variant="number"
          (pressed)="inputDigit('1')">
        </app-calculator-button>
        <app-calculator-button 
          label="2" 
          variant="number"
          (pressed)="inputDigit('2')">
        </app-calculator-button>
        <app-calculator-button 
          label="3" 
          variant="number"
          (pressed)="inputDigit('3')">
        </app-calculator-button>
        <app-calculator-button 
          label="+" 
          variant="operator"
          [active]="stateService.operator() === '+'"
          ariaLabel="Add"
          (pressed)="setOperator('+')">
        </app-calculator-button>

        <!-- Altıncı sıra: ±, 0, ., = -->
        <app-calculator-button 
          label="±" 
          variant="function"
          ariaLabel="Negate"
          (pressed)="negate()">
        </app-calculator-button>
        <app-calculator-button 
          label="0" 
          variant="number"
          (pressed)="inputDigit('0')">
        </app-calculator-button>
        <app-calculator-button 
          label="." 
          variant="number"
          ariaLabel="Decimal Point"
          (pressed)="inputDecimal()">
        </app-calculator-button>
        <app-calculator-button 
          label="=" 
          variant="equal"
          ariaLabel="Equals"
          (pressed)="calculate()">
        </app-calculator-button>
      </div>
    </div>
  `,
    styles: [`
    .standard-calculator {
      display: flex;
      flex-direction: column;
      gap: 16px;
      max-width: 400px;
      margin: 0 auto;
      padding: 20px;
    }

    .button-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 10px;
    }
  `]
})
export class StandardCalculatorComponent {
    readonly stateService = inject(CalculatorStateService);
    private readonly engine = inject(CalculationEngineService);

    /**
     * Klavye girişi desteği
     */
    @HostListener('window:keydown', ['$event'])
    handleKeyboard(event: KeyboardEvent): void {
        // Diğer input alanlarında devre dışı bırak
        if (event.target instanceof HTMLInputElement) {
            return;
        }

        const key = event.key;

        // Rakamlar
        if (/^[0-9]$/.test(key)) {
            event.preventDefault();
            this.inputDigit(key);
            return;
        }

        // Operatörler
        switch (key) {
            case '+':
                event.preventDefault();
                this.setOperator('+');
                break;
            case '-':
                event.preventDefault();
                this.setOperator('−');
                break;
            case '*':
                event.preventDefault();
                this.setOperator('×');
                break;
            case '/':
                event.preventDefault();
                this.setOperator('÷');
                break;
            case '%':
                event.preventDefault();
                this.percentage();
                break;
            case '.':
            case ',':
                event.preventDefault();
                this.inputDecimal();
                break;
            case 'Enter':
            case '=':
                event.preventDefault();
                this.calculate();
                break;
            case 'Backspace':
                event.preventDefault();
                this.stateService.backspace();
                break;
            case 'Escape':
                event.preventDefault();
                this.clearAll();
                break;
            case 'Delete':
                event.preventDefault();
                this.clearEntry();
                break;
        }
    }

    inputDigit(digit: string): void {
        this.stateService.inputDigit(digit);
    }

    inputDecimal(): void {
        this.stateService.inputDecimal();
    }

    setOperator(operator: string): void {
        const current = parseFloat(this.stateService.currentValue());

        if (this.stateService.operator() && !this.stateService.waitingForOperand()) {
            // Önceki işlemi hesapla
            this.calculate();
        }

        this.stateService.setPreviousValue(this.stateService.currentValue());
        this.stateService.setOperator(operator);
        this.stateService.setWaitingForOperand(true);
    }

    calculate(): void {
        const operator = this.stateService.operator();
        if (!operator) return;

        const prev = parseFloat(this.stateService.previousValue());
        const current = parseFloat(this.stateService.currentValue());

        try {
            let result: number;

            switch (operator) {
                case '+':
                    result = this.engine.add(prev, current);
                    break;
                case '−':
                    result = this.engine.subtract(prev, current);
                    break;
                case '×':
                    result = this.engine.multiply(prev, current);
                    break;
                case '÷':
                    result = this.engine.divide(prev, current);
                    break;
                default:
                    return;
            }

            const expression = `${prev} ${operator} ${current}`;

            // Geçmişe ekle
            const historyItem: CalculationResult = {
                expression,
                result,
                timestamp: new Date(),
                mode: 'standard'
            };
            this.stateService.addToHistory(historyItem);

            // Sonucu göster
            this.stateService.setCurrentValue(this.engine.formatResult(result));
            this.stateService.setPreviousValue('');
            this.stateService.setOperator(null);
            this.stateService.setWaitingForOperand(true);
        } catch (error) {
            this.stateService.setCurrentValue('Hata');
            this.stateService.setPreviousValue('');
            this.stateService.setOperator(null);
            this.stateService.setWaitingForOperand(true);
        }
    }

    percentage(): void {
        const current = parseFloat(this.stateService.currentValue());
        const result = this.engine.percentage(current);
        this.stateService.setCurrentValue(this.engine.formatResult(result));
    }

    negate(): void {
        const current = parseFloat(this.stateService.currentValue());
        const result = this.engine.negate(current);
        this.stateService.setCurrentValue(this.engine.formatResult(result));
    }

    clearEntry(): void {
        this.stateService.clearEntry();
    }

    clearAll(): void {
        this.stateService.clearAll();
    }

    memoryClear(): void {
        this.stateService.memoryClear();
    }

    memoryRecall(): void {
        this.stateService.memoryRecall();
    }

    memoryAdd(): void {
        this.stateService.memoryAdd();
    }

    memorySubtract(): void {
        this.stateService.memorySubtract();
    }
}
