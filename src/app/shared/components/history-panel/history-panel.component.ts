/**
 * History Panel Component
 * Hesaplama geçmişi paneli
 * Önceki hesaplamaları listeler ve tekrar kullanılabilir yapar
 */
import { Component, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CalculatorStateService } from '../../../core/services';
import { CalculationResult } from '../../../core/services/calculation-engine.service';

@Component({
    selector: 'app-history-panel',
    standalone: true,
    imports: [
        CommonModule,
        MatIconModule,
        MatButtonModule,
        MatListModule,
        MatTooltipModule,
        DatePipe
    ],
    template: `
    <div class="history-panel">
      <div class="history-header">
        <h3>Geçmiş</h3>
        @if (stateService.history().length > 0) {
          <button 
            mat-icon-button 
            (click)="clearHistory()"
            matTooltip="Geçmişi Temizle"
            aria-label="Clear history">
            <mat-icon>delete_sweep</mat-icon>
          </button>
        }
      </div>

      <div class="history-content">
        @if (stateService.history().length === 0) {
          <div class="empty-state">
            <mat-icon>history</mat-icon>
            <p>Henüz hesaplama yok</p>
          </div>
        } @else {
          <mat-list class="history-list">
            @for (item of stateService.history(); track item.timestamp) {
              <mat-list-item 
                class="history-item"
                (click)="selectResult(item)"
                (keydown.enter)="selectResult(item)"
                tabindex="0"
                role="button"
                [attr.aria-label]="item.expression + ' equals ' + item.result">
                <div class="item-content">
                  <div class="expression">{{ item.expression }}</div>
                  <div class="result">= {{ formatNumber(item.result) }}</div>
                </div>
                <div class="timestamp">{{ item.timestamp | date:'HH:mm' }}</div>
              </mat-list-item>
            }
          </mat-list>
        }
      </div>
    </div>
  `,
    styles: [`
    :host {
      display: block;
      height: 100%;
    }

    .history-panel {
      display: flex;
      flex-direction: column;
      height: 100%;
      background: var(--calc-history-bg, #fafafa);
      border-radius: 12px;
      overflow: hidden;
    }

    .history-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 16px 20px;
      border-bottom: 1px solid var(--calc-border, rgba(0, 0, 0, 0.1));

      h3 {
        margin: 0;
        font-size: 1rem;
        font-weight: 600;
        color: var(--calc-text-primary, #1a1a1a);
      }
    }

    .history-content {
      flex: 1;
      overflow-y: auto;
      padding: 8px;
    }

    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 40px 20px;
      color: var(--calc-text-secondary, #666);

      mat-icon {
        font-size: 48px;
        width: 48px;
        height: 48px;
        opacity: 0.5;
        margin-bottom: 12px;
      }

      p {
        margin: 0;
        font-size: 0.875rem;
      }
    }

    .history-list {
      padding: 0;
    }

    .history-item {
      cursor: pointer;
      border-radius: 8px;
      margin-bottom: 4px;
      transition: background 0.2s ease;

      &:hover {
        background: var(--calc-history-hover, rgba(0, 0, 0, 0.05));
      }

      &:focus {
        outline: 2px solid var(--calc-focus, #667eea);
        outline-offset: -2px;
      }
    }

    .item-content {
      flex: 1;
    }

    .expression {
      font-size: 0.875rem;
      color: var(--calc-text-secondary, #666);
      margin-bottom: 2px;
    }

    .result {
      font-size: 1.125rem;
      font-weight: 600;
      color: var(--calc-text-primary, #1a1a1a);
      font-family: 'SF Mono', 'Consolas', 'Monaco', monospace;
    }

    .timestamp {
      font-size: 0.75rem;
      color: var(--calc-text-tertiary, #999);
    }
  `]
})
export class HistoryPanelComponent {
    readonly stateService = inject(CalculatorStateService);

    @Output() resultSelected = new EventEmitter<CalculationResult>();

    selectResult(item: CalculationResult): void {
        this.resultSelected.emit(item);
    }

    clearHistory(): void {
        this.stateService.clearHistory();
    }

    formatNumber(value: number): string {
        if (!isFinite(value)) {
            return 'Hata';
        }

        // Büyük sayılar için bilimsel notasyon
        if (Math.abs(value) >= 1e10 || (Math.abs(value) < 1e-6 && value !== 0)) {
            return value.toExponential(6);
        }

        // Normal sayılar için binlik ayracı
        return value.toLocaleString('tr-TR', {
            maximumFractionDigits: 10
        });
    }
}
