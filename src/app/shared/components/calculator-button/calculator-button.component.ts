/**
 * Calculator Button Component
 * Yeniden kullanılabilir hesap makinesi butonu
 * Farklı stiller: number, operator, function, special
 */
import { Component, Input, Output, EventEmitter, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatRippleModule } from '@angular/material/core';

export type ButtonVariant = 'number' | 'operator' | 'function' | 'special' | 'equal';

@Component({
    selector: 'app-calculator-button',
    standalone: true,
    imports: [CommonModule, MatButtonModule, MatRippleModule],
    template: `
    <button
      mat-flat-button
      class="calc-button"
      [class.number]="variant === 'number'"
      [class.operator]="variant === 'operator'"
      [class.function]="variant === 'function'"
      [class.special]="variant === 'special'"
      [class.equal]="variant === 'equal'"
      [class.wide]="wide"
      [class.active]="active"
      [disabled]="disabled"
      [attr.aria-label]="ariaLabel || label"
      (click)="onClick()"
      matRipple
      [matRippleColor]="rippleColor">
      <span class="button-content">
        @if (icon) {
          <span class="icon">{{ icon }}</span>
        } @else {
          {{ label }}
        }
      </span>
    </button>
  `,
    styles: [`
    :host {
      display: block;
    }

    .calc-button {
      width: 100%;
      height: 100%;
      min-height: 56px;
      font-size: 1.25rem;
      font-weight: 500;
      border-radius: 12px;
      transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
      border: none;
      cursor: pointer;

      &:hover:not(:disabled) {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      }

      &:active:not(:disabled) {
        transform: translateY(0);
      }

      &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }

      &.wide {
        grid-column: span 2;
      }

      /* Sayı butonları */
      &.number {
        background: var(--calc-number-bg, #f5f5f5);
        color: var(--calc-number-text, #1a1a1a);

        &:hover:not(:disabled) {
          background: var(--calc-number-hover, #e8e8e8);
        }
      }

      /* Operatör butonları */
      &.operator {
        background: var(--calc-operator-bg, #ff9800);
        color: var(--calc-operator-text, #ffffff);

        &:hover:not(:disabled) {
          background: var(--calc-operator-hover, #f57c00);
        }

        &.active {
          background: var(--calc-operator-active, #e65100);
          box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.2);
        }
      }

      /* Fonksiyon butonları */
      &.function {
        background: var(--calc-function-bg, #e3f2fd);
        color: var(--calc-function-text, #1565c0);

        &:hover:not(:disabled) {
          background: var(--calc-function-hover, #bbdefb);
        }
      }

      /* Özel butonlar (C, CE) */
      &.special {
        background: var(--calc-special-bg, #ffebee);
        color: var(--calc-special-text, #c62828);

        &:hover:not(:disabled) {
          background: var(--calc-special-hover, #ffcdd2);
        }
      }

      /* Eşittir butonu */
      &.equal {
        background: var(--calc-equal-bg, linear-gradient(135deg, #667eea 0%, #764ba2 100%));
        color: var(--calc-equal-text, #ffffff);
        font-size: 1.5rem;

        &:hover:not(:disabled) {
          background: var(--calc-equal-hover, linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%));
        }
      }
    }

    .button-content {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 4px;
    }

    .icon {
      font-size: 1.5rem;
    }
  `]
})
export class CalculatorButtonComponent {
    @Input() label = '';
    @Input() variant: ButtonVariant = 'number';
    @Input() icon?: string;
    @Input() wide = false;
    @Input() active = false;
    @Input() disabled = false;
    @Input() ariaLabel?: string;
    @Input() keyboardShortcut?: string;

    @Output() pressed = new EventEmitter<void>();

    get rippleColor(): string {
        switch (this.variant) {
            case 'operator':
            case 'equal':
                return 'rgba(255, 255, 255, 0.3)';
            default:
                return 'rgba(0, 0, 0, 0.1)';
        }
    }

    onClick(): void {
        this.pressed.emit();
    }

    @HostListener('window:keydown', ['$event'])
    handleKeyboard(event: KeyboardEvent): void {
        if (this.keyboardShortcut && event.key === this.keyboardShortcut) {
            event.preventDefault();
            this.onClick();
        }
    }
}
