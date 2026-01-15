/**
 * Scientific Calculator Component
 * Bilimsel hesap makinesi - trigonometri, logaritma, üs alma
 */
import { Component, inject, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { CalculatorButtonComponent } from '../../shared/components';
import { CalculatorDisplayComponent } from '../../shared/components';
import { CalculatorStateService } from '../../core/services';
import { CalculationEngineService, CalculationResult, AngleUnit } from '../../core/services/calculation-engine.service';

@Component({
    selector: 'app-scientific-calculator',
    standalone: true,
    imports: [
        CommonModule,
        MatButtonToggleModule,
        CalculatorButtonComponent,
        CalculatorDisplayComponent
    ],
    template: `
    <div class="scientific-calculator">
      <!-- Ekran -->
      <app-calculator-display
        [value]="stateService.currentValue()"
        [expression]="stateService.expressionDisplay()"
        [hasMemory]="stateService.hasMemory()">
      </app-calculator-display>

      <!-- Derece/Radyan Toggle -->
      <div class="angle-toggle">
        <mat-button-toggle-group 
          [value]="stateService.angleUnit()"
          (change)="setAngleUnit($event.value)"
          aria-label="Angle unit">
          <mat-button-toggle value="deg">DEG</mat-button-toggle>
          <mat-button-toggle value="rad">RAD</mat-button-toggle>
        </mat-button-toggle-group>
      </div>

      <!-- Buton Grid -->
      <div class="button-grid">
        <!-- İlk sıra: Trigonometrik fonksiyonlar -->
        <app-calculator-button 
          label="sin" 
          variant="function"
          ariaLabel="Sine"
          (pressed)="trigFunction('sin')">
        </app-calculator-button>
        <app-calculator-button 
          label="cos" 
          variant="function"
          ariaLabel="Cosine"
          (pressed)="trigFunction('cos')">
        </app-calculator-button>
        <app-calculator-button 
          label="tan" 
          variant="function"
          ariaLabel="Tangent"
          (pressed)="trigFunction('tan')">
        </app-calculator-button>
        <app-calculator-button 
          label="π" 
          variant="function"
          ariaLabel="Pi"
          (pressed)="insertConstant('pi')">
        </app-calculator-button>
        <app-calculator-button 
          label="e" 
          variant="function"
          ariaLabel="Euler's number"
          (pressed)="insertConstant('e')">
        </app-calculator-button>

        <!-- İkinci sıra: Ters trig, log, ln -->
        <app-calculator-button 
          label="sin⁻¹" 
          variant="function"
          ariaLabel="Arcsine"
          (pressed)="inverseTrigFunction('asin')">
        </app-calculator-button>
        <app-calculator-button 
          label="cos⁻¹" 
          variant="function"
          ariaLabel="Arccosine"
          (pressed)="inverseTrigFunction('acos')">
        </app-calculator-button>
        <app-calculator-button 
          label="tan⁻¹" 
          variant="function"
          ariaLabel="Arctangent"
          (pressed)="inverseTrigFunction('atan')">
        </app-calculator-button>
        <app-calculator-button 
          label="log" 
          variant="function"
          ariaLabel="Logarithm base 10"
          (pressed)="logFunction('log')">
        </app-calculator-button>
        <app-calculator-button 
          label="ln" 
          variant="function"
          ariaLabel="Natural logarithm"
          (pressed)="logFunction('ln')">
        </app-calculator-button>

        <!-- Üçüncü sıra: Üs, kök, faktöriyel -->
        <app-calculator-button 
          label="x²" 
          variant="function"
          ariaLabel="Square"
          (pressed)="square()">
        </app-calculator-button>
        <app-calculator-button 
          label="x³" 
          variant="function"
          ariaLabel="Cube"
          (pressed)="cube()">
        </app-calculator-button>
        <app-calculator-button 
          label="xʸ" 
          variant="function"
          ariaLabel="Power"
          (pressed)="setOperator('^')">
        </app-calculator-button>
        <app-calculator-button 
          label="√" 
          variant="function"
          ariaLabel="Square root"
          (pressed)="sqrt()">
        </app-calculator-button>
        <app-calculator-button 
          label="n!" 
          variant="function"
          ariaLabel="Factorial"
          (pressed)="factorial()">
        </app-calculator-button>

        <!-- Dördüncü sıra: Memory ve Clear -->
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
          label="C" 
          variant="special"
          ariaLabel="Clear All"
          (pressed)="clearAll()">
        </app-calculator-button>
        <app-calculator-button 
          label="⌫" 
          variant="special"
          ariaLabel="Backspace"
          (pressed)="backspace()">
        </app-calculator-button>

        <!-- Beşinci sıra: 7, 8, 9, ÷, 1/x -->
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
          label="÷" 
          variant="operator"
          [active]="stateService.operator() === '÷'"
          ariaLabel="Divide"
          (pressed)="setOperator('÷')">
        </app-calculator-button>
        <app-calculator-button 
          label="1/x" 
          variant="function"
          ariaLabel="Reciprocal"
          (pressed)="reciprocal()">
        </app-calculator-button>

        <!-- Altıncı sıra: 4, 5, 6, ×, % -->
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
          label="×" 
          variant="operator"
          [active]="stateService.operator() === '×'"
          ariaLabel="Multiply"
          (pressed)="setOperator('×')">
        </app-calculator-button>
        <app-calculator-button 
          label="%" 
          variant="function"
          ariaLabel="Percentage"
          (pressed)="percentage()">
        </app-calculator-button>

        <!-- Yedinci sıra: 1, 2, 3, −, eˣ -->
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
          label="−" 
          variant="operator"
          [active]="stateService.operator() === '−'"
          ariaLabel="Subtract"
          (pressed)="setOperator('−')">
        </app-calculator-button>
        <app-calculator-button 
          label="eˣ" 
          variant="function"
          ariaLabel="Exponential"
          (pressed)="exp()">
        </app-calculator-button>

        <!-- Sekizinci sıra: ±, 0, ., +, = -->
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
          label="+" 
          variant="operator"
          [active]="stateService.operator() === '+'"
          ariaLabel="Add"
          (pressed)="setOperator('+')">
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
    .scientific-calculator {
      display: flex;
      flex-direction: column;
      gap: 12px;
      max-width: 480px;
      margin: 0 auto;
      padding: 16px;
    }

    .angle-toggle {
      display: flex;
      justify-content: center;
      
      mat-button-toggle-group {
        border-radius: 8px;
        overflow: hidden;
      }
    }

    .button-grid {
      display: grid;
      grid-template-columns: repeat(5, 1fr);
      gap: 8px;
    }

    @media (max-width: 480px) {
      .button-grid {
        gap: 6px;
      }
      
      .scientific-calculator {
        padding: 12px;
      }
    }
  `]
})
export class ScientificCalculatorComponent {
    readonly stateService = inject(CalculatorStateService);
    private readonly engine = inject(CalculationEngineService);

    /**
     * Klavye girişi desteği
     */
    @HostListener('window:keydown', ['$event'])
    handleKeyboard(event: KeyboardEvent): void {
        if (event.target instanceof HTMLInputElement) {
            return;
        }

        const key = event.key;

        if (/^[0-9]$/.test(key)) {
            event.preventDefault();
            this.inputDigit(key);
            return;
        }

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
            case '^':
                event.preventDefault();
                this.setOperator('^');
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
                this.backspace();
                break;
            case 'Escape':
                event.preventDefault();
                this.clearAll();
                break;
        }
    }

    setAngleUnit(unit: AngleUnit): void {
        this.stateService.setAngleUnit(unit);
    }

    inputDigit(digit: string): void {
        this.stateService.inputDigit(digit);
    }

    inputDecimal(): void {
        this.stateService.inputDecimal();
    }

    setOperator(operator: string): void {
        if (this.stateService.operator() && !this.stateService.waitingForOperand()) {
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
                case '^':
                    result = this.engine.power(prev, current);
                    break;
                default:
                    return;
            }

            const expression = `${prev} ${operator} ${current}`;

            const historyItem: CalculationResult = {
                expression,
                result,
                timestamp: new Date(),
                mode: 'scientific'
            };
            this.stateService.addToHistory(historyItem);

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

    // Trigonometrik fonksiyonlar
    trigFunction(func: 'sin' | 'cos' | 'tan'): void {
        const current = parseFloat(this.stateService.currentValue());
        const unit = this.stateService.angleUnit();

        try {
            let result: number;
            switch (func) {
                case 'sin':
                    result = this.engine.sin(current, unit);
                    break;
                case 'cos':
                    result = this.engine.cos(current, unit);
                    break;
                case 'tan':
                    result = this.engine.tan(current, unit);
                    break;
            }

            const historyItem: CalculationResult = {
                expression: `${func}(${current}${unit === 'deg' ? '°' : ''})`,
                result,
                timestamp: new Date(),
                mode: 'scientific'
            };
            this.stateService.addToHistory(historyItem);

            this.stateService.setCurrentValue(this.engine.formatResult(result));
            this.stateService.setWaitingForOperand(true);
        } catch {
            this.stateService.setCurrentValue('Hata');
        }
    }

    // Ters trigonometrik fonksiyonlar
    inverseTrigFunction(func: 'asin' | 'acos' | 'atan'): void {
        const current = parseFloat(this.stateService.currentValue());
        const unit = this.stateService.angleUnit();

        try {
            let result: number;
            switch (func) {
                case 'asin':
                    result = this.engine.asin(current, unit);
                    break;
                case 'acos':
                    result = this.engine.acos(current, unit);
                    break;
                case 'atan':
                    result = this.engine.atan(current, unit);
                    break;
            }

            const historyItem: CalculationResult = {
                expression: `${func}(${current})`,
                result,
                timestamp: new Date(),
                mode: 'scientific'
            };
            this.stateService.addToHistory(historyItem);

            this.stateService.setCurrentValue(this.engine.formatResult(result));
            this.stateService.setWaitingForOperand(true);
        } catch {
            this.stateService.setCurrentValue('Hata');
        }
    }

    // Logaritmik fonksiyonlar
    logFunction(func: 'log' | 'ln'): void {
        const current = parseFloat(this.stateService.currentValue());

        try {
            const result = func === 'log' ? this.engine.log(current) : this.engine.ln(current);

            const historyItem: CalculationResult = {
                expression: `${func}(${current})`,
                result,
                timestamp: new Date(),
                mode: 'scientific'
            };
            this.stateService.addToHistory(historyItem);

            this.stateService.setCurrentValue(this.engine.formatResult(result));
            this.stateService.setWaitingForOperand(true);
        } catch {
            this.stateService.setCurrentValue('Hata');
        }
    }

    // Matematiksel sabitler
    insertConstant(constant: 'pi' | 'e'): void {
        const value = constant === 'pi' ? this.engine.PI : this.engine.E;
        this.stateService.setCurrentValue(this.engine.formatResult(value));
        this.stateService.setWaitingForOperand(true);
    }

    // Üs alma
    square(): void {
        const current = parseFloat(this.stateService.currentValue());
        const result = this.engine.square(current);

        const historyItem: CalculationResult = {
            expression: `${current}²`,
            result,
            timestamp: new Date(),
            mode: 'scientific'
        };
        this.stateService.addToHistory(historyItem);

        this.stateService.setCurrentValue(this.engine.formatResult(result));
        this.stateService.setWaitingForOperand(true);
    }

    cube(): void {
        const current = parseFloat(this.stateService.currentValue());
        const result = this.engine.cube(current);

        const historyItem: CalculationResult = {
            expression: `${current}³`,
            result,
            timestamp: new Date(),
            mode: 'scientific'
        };
        this.stateService.addToHistory(historyItem);

        this.stateService.setCurrentValue(this.engine.formatResult(result));
        this.stateService.setWaitingForOperand(true);
    }

    sqrt(): void {
        const current = parseFloat(this.stateService.currentValue());

        try {
            const result = this.engine.sqrt(current);

            const historyItem: CalculationResult = {
                expression: `√${current}`,
                result,
                timestamp: new Date(),
                mode: 'scientific'
            };
            this.stateService.addToHistory(historyItem);

            this.stateService.setCurrentValue(this.engine.formatResult(result));
            this.stateService.setWaitingForOperand(true);
        } catch {
            this.stateService.setCurrentValue('Hata');
        }
    }

    factorial(): void {
        const current = parseFloat(this.stateService.currentValue());

        try {
            const result = this.engine.factorial(current);

            const historyItem: CalculationResult = {
                expression: `${current}!`,
                result,
                timestamp: new Date(),
                mode: 'scientific'
            };
            this.stateService.addToHistory(historyItem);

            this.stateService.setCurrentValue(this.engine.formatResult(result));
            this.stateService.setWaitingForOperand(true);
        } catch {
            this.stateService.setCurrentValue('Hata');
        }
    }

    reciprocal(): void {
        const current = parseFloat(this.stateService.currentValue());

        try {
            const result = this.engine.reciprocal(current);

            const historyItem: CalculationResult = {
                expression: `1/${current}`,
                result,
                timestamp: new Date(),
                mode: 'scientific'
            };
            this.stateService.addToHistory(historyItem);

            this.stateService.setCurrentValue(this.engine.formatResult(result));
            this.stateService.setWaitingForOperand(true);
        } catch {
            this.stateService.setCurrentValue('Hata');
        }
    }

    exp(): void {
        const current = parseFloat(this.stateService.currentValue());
        const result = this.engine.exp(current);

        const historyItem: CalculationResult = {
            expression: `e^${current}`,
            result,
            timestamp: new Date(),
            mode: 'scientific'
        };
        this.stateService.addToHistory(historyItem);

        this.stateService.setCurrentValue(this.engine.formatResult(result));
        this.stateService.setWaitingForOperand(true);
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

    backspace(): void {
        this.stateService.backspace();
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
}
