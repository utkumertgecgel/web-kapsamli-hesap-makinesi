/**
 * Programmer Calculator Component
 * Binary, Octal, Decimal, Hexadecimal hesaplama modu
 * Bitwise işlemler ve base dönüşümleri
 */
import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CalculatorButtonComponent } from '../../shared/components';
import { CalculatorStateService } from '../../core/services';

export type NumberBase = 'BIN' | 'OCT' | 'DEC' | 'HEX';
export type WordSize = 'BYTE' | 'WORD' | 'DWORD' | 'QWORD';

@Component({
    selector: 'app-programmer-calculator',
    standalone: true,
    imports: [
        CommonModule,
        MatButtonToggleModule,
        MatTooltipModule,
        CalculatorButtonComponent
    ],
    template: `
    <div class="programmer-calculator">
      <!-- Multi-base Display -->
      <div class="base-display">
        <div class="base-row" [class.active]="currentBase() === 'HEX'" (click)="setBase('HEX')">
          <span class="base-label">HEX</span>
          <span class="base-value">{{ hexValue() }}</span>
        </div>
        <div class="base-row" [class.active]="currentBase() === 'DEC'" (click)="setBase('DEC')">
          <span class="base-label">DEC</span>
          <span class="base-value">{{ decValue() }}</span>
        </div>
        <div class="base-row" [class.active]="currentBase() === 'OCT'" (click)="setBase('OCT')">
          <span class="base-label">OCT</span>
          <span class="base-value">{{ octValue() }}</span>
        </div>
        <div class="base-row" [class.active]="currentBase() === 'BIN'" (click)="setBase('BIN')">
          <span class="base-label">BIN</span>
          <span class="base-value binary">{{ binValue() }}</span>
        </div>
      </div>

      <!-- Word Size Toggle -->
      <div class="word-size-toggle">
        <mat-button-toggle-group 
          [value]="wordSize()"
          (change)="setWordSize($event.value)">
          <mat-button-toggle value="BYTE" matTooltip="8 bit">BYTE</mat-button-toggle>
          <mat-button-toggle value="WORD" matTooltip="16 bit">WORD</mat-button-toggle>
          <mat-button-toggle value="DWORD" matTooltip="32 bit">DWORD</mat-button-toggle>
          <mat-button-toggle value="QWORD" matTooltip="64 bit">QWORD</mat-button-toggle>
        </mat-button-toggle-group>
      </div>

      <!-- Bit Visualization -->
      <div class="bit-display">
        @for (group of bitGroups(); track $index) {
          <div class="bit-group">
            @for (bit of group; track $index) {
              <div 
                class="bit" 
                [class.active]="bit === '1'"
                (click)="toggleBit($index * 8 + group.indexOf(bit))">
                {{ bit }}
              </div>
            }
          </div>
        }
      </div>

      <!-- Button Grid -->
      <div class="button-grid">
        <!-- Bitwise operators row -->
        <app-calculator-button 
          label="AND" 
          variant="function"
          [disabled]="false"
          (pressed)="bitwiseOp('AND')">
        </app-calculator-button>
        <app-calculator-button 
          label="OR" 
          variant="function"
          (pressed)="bitwiseOp('OR')">
        </app-calculator-button>
        <app-calculator-button 
          label="XOR" 
          variant="function"
          (pressed)="bitwiseOp('XOR')">
        </app-calculator-button>
        <app-calculator-button 
          label="NOT" 
          variant="function"
          (pressed)="bitwiseNot()">
        </app-calculator-button>
        <app-calculator-button 
          label="C" 
          variant="special"
          (pressed)="clear()">
        </app-calculator-button>
        <app-calculator-button 
          label="⌫" 
          variant="special"
          (pressed)="backspace()">
        </app-calculator-button>

        <!-- Shift operators + Hex digits row -->
        <app-calculator-button 
          label="<<" 
          variant="function"
          ariaLabel="Left Shift"
          (pressed)="shift('left')">
        </app-calculator-button>
        <app-calculator-button 
          label=">>" 
          variant="function"
          ariaLabel="Right Shift"
          (pressed)="shift('right')">
        </app-calculator-button>
        <app-calculator-button 
          label="A" 
          variant="number"
          [disabled]="!isHexDigitEnabled('A')"
          (pressed)="inputDigit('A')">
        </app-calculator-button>
        <app-calculator-button 
          label="B" 
          variant="number"
          [disabled]="!isHexDigitEnabled('B')"
          (pressed)="inputDigit('B')">
        </app-calculator-button>
        <app-calculator-button 
          label="C" 
          variant="number"
          [disabled]="!isHexDigitEnabled('C')"
          (pressed)="inputDigit('C')">
        </app-calculator-button>
        <app-calculator-button 
          label="D" 
          variant="number"
          [disabled]="!isHexDigitEnabled('D')"
          (pressed)="inputDigit('D')">
        </app-calculator-button>

        <!-- Numbers row 1 -->
        <app-calculator-button 
          label="(" 
          variant="function"
          (pressed)="inputChar('(')">
        </app-calculator-button>
        <app-calculator-button 
          label=")" 
          variant="function"
          (pressed)="inputChar(')')">
        </app-calculator-button>
        <app-calculator-button 
          label="E" 
          variant="number"
          [disabled]="!isHexDigitEnabled('E')"
          (pressed)="inputDigit('E')">
        </app-calculator-button>
        <app-calculator-button 
          label="F" 
          variant="number"
          [disabled]="!isHexDigitEnabled('F')"
          (pressed)="inputDigit('F')">
        </app-calculator-button>
        <app-calculator-button 
          label="÷" 
          variant="operator"
          [active]="operator() === '÷'"
          (pressed)="setOperator('÷')">
        </app-calculator-button>
        <app-calculator-button 
          label="MOD" 
          variant="operator"
          [active]="operator() === 'MOD'"
          (pressed)="setOperator('MOD')">
        </app-calculator-button>

        <!-- Numbers row 2 -->
        <app-calculator-button 
          label="7" 
          variant="number"
          [disabled]="!isDigitEnabled('7')"
          (pressed)="inputDigit('7')">
        </app-calculator-button>
        <app-calculator-button 
          label="8" 
          variant="number"
          [disabled]="!isDigitEnabled('8')"
          (pressed)="inputDigit('8')">
        </app-calculator-button>
        <app-calculator-button 
          label="9" 
          variant="number"
          [disabled]="!isDigitEnabled('9')"
          (pressed)="inputDigit('9')">
        </app-calculator-button>
        <app-calculator-button 
          label="×" 
          variant="operator"
          [active]="operator() === '×'"
          (pressed)="setOperator('×')">
        </app-calculator-button>
        <app-calculator-button 
          label="RoL" 
          variant="function"
          matTooltip="Rotate Left"
          (pressed)="rotate('left')">
        </app-calculator-button>
        <app-calculator-button 
          label="RoR" 
          variant="function"
          matTooltip="Rotate Right"
          (pressed)="rotate('right')">
        </app-calculator-button>

        <!-- Numbers row 3 -->
        <app-calculator-button 
          label="4" 
          variant="number"
          [disabled]="!isDigitEnabled('4')"
          (pressed)="inputDigit('4')">
        </app-calculator-button>
        <app-calculator-button 
          label="5" 
          variant="number"
          [disabled]="!isDigitEnabled('5')"
          (pressed)="inputDigit('5')">
        </app-calculator-button>
        <app-calculator-button 
          label="6" 
          variant="number"
          [disabled]="!isDigitEnabled('6')"
          (pressed)="inputDigit('6')">
        </app-calculator-button>
        <app-calculator-button 
          label="−" 
          variant="operator"
          [active]="operator() === '−'"
          (pressed)="setOperator('−')">
        </app-calculator-button>
        <app-calculator-button 
          label="2's" 
          variant="function"
          matTooltip="Two's Complement"
          (pressed)="twosComplement()">
        </app-calculator-button>
        <app-calculator-button 
          label="1's" 
          variant="function"
          matTooltip="One's Complement"
          (pressed)="onesComplement()">
        </app-calculator-button>

        <!-- Numbers row 4 -->
        <app-calculator-button 
          label="1" 
          variant="number"
          (pressed)="inputDigit('1')">
        </app-calculator-button>
        <app-calculator-button 
          label="2" 
          variant="number"
          [disabled]="!isDigitEnabled('2')"
          (pressed)="inputDigit('2')">
        </app-calculator-button>
        <app-calculator-button 
          label="3" 
          variant="number"
          [disabled]="!isDigitEnabled('3')"
          (pressed)="inputDigit('3')">
        </app-calculator-button>
        <app-calculator-button 
          label="+" 
          variant="operator"
          [active]="operator() === '+'"
          (pressed)="setOperator('+')">
        </app-calculator-button>
        <app-calculator-button 
          label="=" 
          variant="equal"
          [wide]="true"
          (pressed)="calculate()">
        </app-calculator-button>

        <!-- Bottom row -->
        <app-calculator-button 
          label="±" 
          variant="function"
          (pressed)="negate()">
        </app-calculator-button>
        <app-calculator-button 
          label="0" 
          variant="number"
          [wide]="true"
          (pressed)="inputDigit('0')">
        </app-calculator-button>
      </div>
    </div>
  `,
    styles: [`
    .programmer-calculator {
      display: flex;
      flex-direction: column;
      gap: 12px;
      max-width: 520px;
      margin: 0 auto;
      padding: 16px;
    }

    .base-display {
      background: var(--calc-display-bg, linear-gradient(135deg, #1a1a2e 0%, #16213e 100%));
      border-radius: 12px;
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .base-row {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 8px 12px;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.2s ease;

      &:hover {
        background: rgba(255, 255, 255, 0.05);
      }

      &.active {
        background: rgba(102, 126, 234, 0.2);
        
        .base-label {
          color: #667eea;
        }
        
        .base-value {
          color: #ffffff;
          font-size: 1.5rem;
        }
      }
    }

    .base-label {
      font-size: 0.75rem;
      font-weight: 600;
      color: rgba(255, 255, 255, 0.5);
      width: 40px;
    }

    .base-value {
      font-family: 'SF Mono', 'Consolas', monospace;
      font-size: 1rem;
      color: rgba(255, 255, 255, 0.7);
      letter-spacing: 1px;
      transition: all 0.2s ease;

      &.binary {
        font-size: 0.875rem;
        letter-spacing: 2px;
      }
    }

    .word-size-toggle {
      display: flex;
      justify-content: center;

      mat-button-toggle-group {
        border-radius: 8px;
      }
    }

    .bit-display {
      display: flex;
      justify-content: center;
      gap: 4px;
      flex-wrap: wrap;
    }

    .bit-group {
      display: flex;
      gap: 2px;
      padding: 4px;
      background: var(--calc-number-bg, #f0f0f5);
      border-radius: 6px;
    }

    .bit {
      width: 20px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.75rem;
      font-family: monospace;
      cursor: pointer;
      border-radius: 3px;
      transition: all 0.15s ease;
      color: var(--calc-text-secondary, #666);

      &:hover {
        background: rgba(102, 126, 234, 0.2);
      }

      &.active {
        background: #667eea;
        color: white;
        font-weight: 600;
      }
    }

    .button-grid {
      display: grid;
      grid-template-columns: repeat(6, 1fr);
      gap: 6px;
    }

    @media (max-width: 480px) {
      .button-grid {
        grid-template-columns: repeat(4, 1fr);
      }

      .bit-display {
        display: none;
      }
    }
  `]
})
export class ProgrammerCalculatorComponent {
    readonly stateService = inject(CalculatorStateService);

    // Local state
    readonly currentBase = signal<NumberBase>('DEC');
    readonly wordSize = signal<WordSize>('DWORD');
    readonly currentValue = signal<bigint>(0n);
    readonly previousValue = signal<bigint>(0n);
    readonly operator = signal<string | null>(null);
    readonly waitingForOperand = signal<boolean>(false);

    // Word size bit limits
    private readonly bitLimits: Record<WordSize, bigint> = {
        'BYTE': 0xFFn,
        'WORD': 0xFFFFn,
        'DWORD': 0xFFFFFFFFn,
        'QWORD': 0xFFFFFFFFFFFFFFFFn
    };

    // Computed values for different bases
    readonly hexValue = computed(() => this.currentValue().toString(16).toUpperCase());
    readonly decValue = computed(() => this.currentValue().toString(10));
    readonly octValue = computed(() => this.currentValue().toString(8));
    readonly binValue = computed(() => {
        const bits = this.getWordBits();
        return this.currentValue().toString(2).padStart(bits, '0');
    });

    // Bit groups for visualization (groups of 8)
    readonly bitGroups = computed(() => {
        const binary = this.binValue();
        const groups: string[][] = [];
        for (let i = 0; i < binary.length; i += 8) {
            groups.push(binary.slice(i, i + 8).split(''));
        }
        return groups;
    });

    private getWordBits(): number {
        switch (this.wordSize()) {
            case 'BYTE': return 8;
            case 'WORD': return 16;
            case 'DWORD': return 32;
            case 'QWORD': return 64;
        }
    }

    setBase(base: NumberBase): void {
        this.currentBase.set(base);
    }

    setWordSize(size: WordSize): void {
        this.wordSize.set(size);
        // Mask value to new word size
        this.currentValue.set(this.currentValue() & this.bitLimits[size]);
    }

    isDigitEnabled(digit: string): boolean {
        const base = this.currentBase();
        const d = parseInt(digit, 10);
        switch (base) {
            case 'BIN': return d <= 1;
            case 'OCT': return d <= 7;
            case 'DEC': return d <= 9;
            case 'HEX': return true;
        }
    }

    isHexDigitEnabled(digit: string): boolean {
        return this.currentBase() === 'HEX';
    }

    inputDigit(digit: string): void {
        if (this.waitingForOperand()) {
            this.currentValue.set(0n);
            this.waitingForOperand.set(false);
        }

        const base = this.currentBase();
        let radix = 10;
        switch (base) {
            case 'BIN': radix = 2; break;
            case 'OCT': radix = 8; break;
            case 'HEX': radix = 16; break;
        }

        const currentStr = this.currentValue().toString(radix);
        const newStr = currentStr === '0' ? digit : currentStr + digit;
        let newValue = BigInt('0x0');

        try {
            if (radix === 16) {
                newValue = BigInt('0x' + newStr);
            } else if (radix === 2) {
                newValue = BigInt('0b' + newStr);
            } else if (radix === 8) {
                newValue = BigInt('0o' + newStr);
            } else {
                newValue = BigInt(newStr);
            }
        } catch {
            return;
        }

        // Apply word size limit
        newValue = newValue & this.bitLimits[this.wordSize()];
        this.currentValue.set(newValue);
    }

    inputChar(char: string): void {
        // For future expression support
    }

    setOperator(op: string): void {
        if (this.operator() && !this.waitingForOperand()) {
            this.calculate();
        }
        this.previousValue.set(this.currentValue());
        this.operator.set(op);
        this.waitingForOperand.set(true);
    }

    calculate(): void {
        const op = this.operator();
        if (!op) return;

        const prev = this.previousValue();
        const current = this.currentValue();
        let result = 0n;

        try {
            switch (op) {
                case '+': result = prev + current; break;
                case '−': result = prev - current; break;
                case '×': result = prev * current; break;
                case '÷':
                    if (current === 0n) throw new Error('Division by zero');
                    result = prev / current;
                    break;
                case 'MOD':
                    if (current === 0n) throw new Error('Division by zero');
                    result = prev % current;
                    break;
                case 'AND': result = prev & current; break;
                case 'OR': result = prev | current; break;
                case 'XOR': result = prev ^ current; break;
            }

            // Apply word size limit
            result = result & this.bitLimits[this.wordSize()];
            this.currentValue.set(result);
        } catch {
            // Handle error
        }

        this.operator.set(null);
        this.waitingForOperand.set(true);
    }

    bitwiseOp(op: 'AND' | 'OR' | 'XOR'): void {
        this.setOperator(op);
    }

    bitwiseNot(): void {
        const result = ~this.currentValue() & this.bitLimits[this.wordSize()];
        this.currentValue.set(result);
    }

    shift(direction: 'left' | 'right'): void {
        const value = this.currentValue();
        const result = direction === 'left'
            ? (value << 1n) & this.bitLimits[this.wordSize()]
            : value >> 1n;
        this.currentValue.set(result);
    }

    rotate(direction: 'left' | 'right'): void {
        const bits = BigInt(this.getWordBits());
        const value = this.currentValue();
        const mask = this.bitLimits[this.wordSize()];

        let result: bigint;
        if (direction === 'left') {
            const msb = (value >> (bits - 1n)) & 1n;
            result = ((value << 1n) | msb) & mask;
        } else {
            const lsb = value & 1n;
            result = (value >> 1n) | (lsb << (bits - 1n));
        }
        this.currentValue.set(result);
    }

    twosComplement(): void {
        const result = (~this.currentValue() + 1n) & this.bitLimits[this.wordSize()];
        this.currentValue.set(result);
    }

    onesComplement(): void {
        this.bitwiseNot();
    }

    negate(): void {
        this.twosComplement();
    }

    toggleBit(index: number): void {
        const mask = 1n << BigInt(this.getWordBits() - 1 - index);
        this.currentValue.set(this.currentValue() ^ mask);
    }

    clear(): void {
        this.currentValue.set(0n);
        this.previousValue.set(0n);
        this.operator.set(null);
        this.waitingForOperand.set(false);
    }

    backspace(): void {
        const base = this.currentBase();
        let radix = 10;
        switch (base) {
            case 'BIN': radix = 2; break;
            case 'OCT': radix = 8; break;
            case 'HEX': radix = 16; break;
        }

        const str = this.currentValue().toString(radix);
        if (str.length <= 1) {
            this.currentValue.set(0n);
        } else {
            const newStr = str.slice(0, -1);
            if (radix === 16) {
                this.currentValue.set(BigInt('0x' + newStr));
            } else if (radix === 2) {
                this.currentValue.set(BigInt('0b' + newStr));
            } else if (radix === 8) {
                this.currentValue.set(BigInt('0o' + newStr));
            } else {
                this.currentValue.set(BigInt(newStr));
            }
        }
    }
}
