/**
 * Financial Calculator Component
 * Kredi, faiz, yatırım hesaplamaları
 * EMI, bileşik faiz, SIP hesaplayıcı
 */
import { Component, signal, computed } from '@angular/core';
import { CommonModule, CurrencyPipe, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTabsModule } from '@angular/material/tabs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatSliderModule } from '@angular/material/slider';

type FinancialMode = 'loan' | 'compound' | 'sip' | 'fd';

interface LoanResult {
    emi: number;
    totalPayment: number;
    totalInterest: number;
    schedule: { month: number; principal: number; interest: number; balance: number }[];
}

interface CompoundResult {
    finalAmount: number;
    totalInterest: number;
    yearlyBreakdown: { year: number; amount: number; interest: number }[];
}

interface SIPResult {
    investedAmount: number;
    estimatedReturns: number;
    totalValue: number;
    yearlyBreakdown: { year: number; invested: number; value: number }[];
}

@Component({
    selector: 'app-financial-calculator',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        MatTabsModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatButtonModule,
        MatIconModule,
        MatCardModule,
        MatSliderModule,
        CurrencyPipe,
        DecimalPipe
    ],
    template: `
    <div class="financial-calculator">
      <mat-tab-group 
        class="financial-tabs"
        [(selectedIndex)]="selectedTabIndex"
        animationDuration="200ms">
        
        <!-- Loan Calculator -->
        <mat-tab>
          <ng-template mat-tab-label>
            <mat-icon>account_balance</mat-icon>
            <span>Kredi</span>
          </ng-template>
          
          <div class="tab-content">
            <div class="input-section">
              <mat-form-field appearance="outline">
                <mat-label>Kredi Tutarı (₺)</mat-label>
                <input matInput type="number" [(ngModel)]="loanAmount" (ngModelChange)="calculateLoan()">
                <mat-icon matPrefix>payments</mat-icon>
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Yıllık Faiz Oranı (%)</mat-label>
                <input matInput type="number" [(ngModel)]="loanRate" (ngModelChange)="calculateLoan()">
                <mat-icon matPrefix>percent</mat-icon>
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Vade (Ay)</mat-label>
                <input matInput type="number" [(ngModel)]="loanTerm" (ngModelChange)="calculateLoan()">
                <mat-icon matPrefix>calendar_month</mat-icon>
              </mat-form-field>
            </div>

            @if (loanResult()) {
              <div class="result-cards">
                <mat-card class="result-card highlight">
                  <mat-card-content>
                    <span class="result-label">Aylık Taksit</span>
                    <span class="result-value">{{ loanResult()!.emi | currency:'TRY':'symbol':'1.2-2':'tr' }}</span>
                  </mat-card-content>
                </mat-card>

                <mat-card class="result-card">
                  <mat-card-content>
                    <span class="result-label">Toplam Ödeme</span>
                    <span class="result-value">{{ loanResult()!.totalPayment | currency:'TRY':'symbol':'1.2-2':'tr' }}</span>
                  </mat-card-content>
                </mat-card>

                <mat-card class="result-card interest">
                  <mat-card-content>
                    <span class="result-label">Toplam Faiz</span>
                    <span class="result-value">{{ loanResult()!.totalInterest | currency:'TRY':'symbol':'1.2-2':'tr' }}</span>
                  </mat-card-content>
                </mat-card>
              </div>

              <!-- Payment Schedule Preview -->
              <div class="schedule-preview">
                <h4>Ödeme Planı (İlk 12 Ay)</h4>
                <div class="schedule-table">
                  <div class="schedule-header">
                    <span>Ay</span>
                    <span>Anapara</span>
                    <span>Faiz</span>
                    <span>Kalan</span>
                  </div>
                  @for (row of loanResult()!.schedule.slice(0, 12); track row.month) {
                    <div class="schedule-row">
                      <span>{{ row.month }}</span>
                      <span>{{ row.principal | number:'1.0-0':'tr' }}</span>
                      <span>{{ row.interest | number:'1.0-0':'tr' }}</span>
                      <span>{{ row.balance | number:'1.0-0':'tr' }}</span>
                    </div>
                  }
                </div>
              </div>
            }
          </div>
        </mat-tab>

        <!-- Compound Interest -->
        <mat-tab>
          <ng-template mat-tab-label>
            <mat-icon>trending_up</mat-icon>
            <span>Bileşik Faiz</span>
          </ng-template>

          <div class="tab-content">
            <div class="input-section">
              <mat-form-field appearance="outline">
                <mat-label>Başlangıç Tutarı (₺)</mat-label>
                <input matInput type="number" [(ngModel)]="compoundPrincipal" (ngModelChange)="calculateCompound()">
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Yıllık Faiz Oranı (%)</mat-label>
                <input matInput type="number" [(ngModel)]="compoundRate" (ngModelChange)="calculateCompound()">
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Süre (Yıl)</mat-label>
                <input matInput type="number" [(ngModel)]="compoundYears" (ngModelChange)="calculateCompound()">
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Faiz Periyodu</mat-label>
                <mat-select [(ngModel)]="compoundFrequency" (ngModelChange)="calculateCompound()">
                  <mat-option value="1">Yıllık</mat-option>
                  <mat-option value="4">3 Aylık</mat-option>
                  <mat-option value="12">Aylık</mat-option>
                  <mat-option value="365">Günlük</mat-option>
                </mat-select>
              </mat-form-field>
            </div>

            @if (compoundResult()) {
              <div class="result-cards">
                <mat-card class="result-card highlight">
                  <mat-card-content>
                    <span class="result-label">Son Tutar</span>
                    <span class="result-value">{{ compoundResult()!.finalAmount | currency:'TRY':'symbol':'1.2-2':'tr' }}</span>
                  </mat-card-content>
                </mat-card>

                <mat-card class="result-card">
                  <mat-card-content>
                    <span class="result-label">Kazanılan Faiz</span>
                    <span class="result-value profit">{{ compoundResult()!.totalInterest | currency:'TRY':'symbol':'1.2-2':'tr' }}</span>
                  </mat-card-content>
                </mat-card>
              </div>

              <div class="growth-chart">
                <h4>Yıllık Büyüme</h4>
                <div class="chart-bars">
                  @for (year of compoundResult()!.yearlyBreakdown; track year.year) {
                    <div class="bar-container">
                      <div 
                        class="bar" 
                        [style.height.%]="(year.amount / compoundResult()!.finalAmount) * 100">
                        <span class="bar-value">{{ year.amount | number:'1.0-0':'tr' }}</span>
                      </div>
                      <span class="bar-label">{{ year.year }}</span>
                    </div>
                  }
                </div>
              </div>
            }
          </div>
        </mat-tab>

        <!-- SIP Calculator -->
        <mat-tab>
          <ng-template mat-tab-label>
            <mat-icon>savings</mat-icon>
            <span>SIP</span>
          </ng-template>

          <div class="tab-content">
            <div class="input-section">
              <mat-form-field appearance="outline">
                <mat-label>Aylık Yatırım (₺)</mat-label>
                <input matInput type="number" [(ngModel)]="sipAmount" (ngModelChange)="calculateSIP()">
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Beklenen Yıllık Getiri (%)</mat-label>
                <input matInput type="number" [(ngModel)]="sipRate" (ngModelChange)="calculateSIP()">
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Yatırım Süresi (Yıl)</mat-label>
                <input matInput type="number" [(ngModel)]="sipYears" (ngModelChange)="calculateSIP()">
              </mat-form-field>
            </div>

            @if (sipResult()) {
              <div class="result-cards">
                <mat-card class="result-card">
                  <mat-card-content>
                    <span class="result-label">Yatırılan Tutar</span>
                    <span class="result-value">{{ sipResult()!.investedAmount | currency:'TRY':'symbol':'1.2-2':'tr' }}</span>
                  </mat-card-content>
                </mat-card>

                <mat-card class="result-card profit-card">
                  <mat-card-content>
                    <span class="result-label">Tahmini Getiri</span>
                    <span class="result-value profit">+{{ sipResult()!.estimatedReturns | currency:'TRY':'symbol':'1.2-2':'tr' }}</span>
                  </mat-card-content>
                </mat-card>

                <mat-card class="result-card highlight">
                  <mat-card-content>
                    <span class="result-label">Toplam Değer</span>
                    <span class="result-value">{{ sipResult()!.totalValue | currency:'TRY':'symbol':'1.2-2':'tr' }}</span>
                  </mat-card-content>
                </mat-card>
              </div>

              <!-- Visual breakdown -->
              <div class="sip-breakdown">
                <div class="breakdown-bar">
                  <div 
                    class="invested-portion" 
                    [style.width.%]="(sipResult()!.investedAmount / sipResult()!.totalValue) * 100">
                    Yatırım
                  </div>
                  <div 
                    class="returns-portion"
                    [style.width.%]="(sipResult()!.estimatedReturns / sipResult()!.totalValue) * 100">
                    Getiri
                  </div>
                </div>
              </div>
            }
          </div>
        </mat-tab>

        <!-- FD Calculator -->
        <mat-tab>
          <ng-template mat-tab-label>
            <mat-icon>lock</mat-icon>
            <span>Vadeli Mevduat</span>
          </ng-template>

          <div class="tab-content">
            <div class="input-section">
              <mat-form-field appearance="outline">
                <mat-label>Yatırım Tutarı (₺)</mat-label>
                <input matInput type="number" [(ngModel)]="fdPrincipal" (ngModelChange)="calculateFD()">
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Yıllık Faiz Oranı (%)</mat-label>
                <input matInput type="number" [(ngModel)]="fdRate" (ngModelChange)="calculateFD()">
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Vade (Ay)</mat-label>
                <input matInput type="number" [(ngModel)]="fdMonths" (ngModelChange)="calculateFD()">
              </mat-form-field>
            </div>

            @if (fdResult()) {
              <div class="result-cards">
                <mat-card class="result-card highlight">
                  <mat-card-content>
                    <span class="result-label">Vade Sonu Tutarı</span>
                    <span class="result-value">{{ fdResult()!.maturityAmount | currency:'TRY':'symbol':'1.2-2':'tr' }}</span>
                  </mat-card-content>
                </mat-card>

                <mat-card class="result-card profit-card">
                  <mat-card-content>
                    <span class="result-label">Faiz Geliri</span>
                    <span class="result-value profit">+{{ fdResult()!.interestEarned | currency:'TRY':'symbol':'1.2-2':'tr' }}</span>
                  </mat-card-content>
                </mat-card>
              </div>
            }
          </div>
        </mat-tab>
      </mat-tab-group>
    </div>
  `,
    styles: [`
    .financial-calculator {
      max-width: 600px;
      margin: 0 auto;
      padding: 16px;
    }

    .financial-tabs {
      background: var(--calc-card-bg, #fff);
      border-radius: 16px;
      overflow: hidden;
    }

    .tab-content {
      padding: 20px;
    }

    .input-section {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 16px;
      margin-bottom: 24px;
    }

    .result-cards {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 12px;
      margin-bottom: 24px;
    }

    .result-card {
      text-align: center;
      background: var(--calc-function-bg, #e8f0fe);
      border-radius: 12px;

      &.highlight {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;

        .result-label {
          color: rgba(255, 255, 255, 0.8);
        }

        .result-value {
          color: white;
        }
      }

      &.interest {
        background: linear-gradient(135deg, #ff6b6b 0%, #ee5a5a 100%);
        color: white;

        .result-label {
          color: rgba(255, 255, 255, 0.8);
        }

        .result-value {
          color: white;
        }
      }

      &.profit-card {
        background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
        color: white;

        .result-label {
          color: rgba(255, 255, 255, 0.8);
        }
      }
    }

    .result-label {
      display: block;
      font-size: 0.75rem;
      color: var(--calc-text-secondary, #666);
      margin-bottom: 4px;
    }

    .result-value {
      display: block;
      font-size: 1.25rem;
      font-weight: 700;
      color: var(--calc-text-primary, #1a1a1a);

      &.profit {
        color: #38ef7d;
      }
    }

    .schedule-preview {
      background: var(--calc-number-bg, #f5f5f5);
      border-radius: 12px;
      padding: 16px;

      h4 {
        margin: 0 0 12px;
        font-size: 0.875rem;
        color: var(--calc-text-primary, #1a1a1a);
      }
    }

    .schedule-table {
      font-size: 0.75rem;
    }

    .schedule-header, .schedule-row {
      display: grid;
      grid-template-columns: 40px 1fr 1fr 1fr;
      gap: 8px;
      padding: 8px 0;
    }

    .schedule-header {
      font-weight: 600;
      color: var(--calc-text-secondary, #666);
      border-bottom: 1px solid var(--calc-border, rgba(0,0,0,0.1));
    }

    .schedule-row {
      color: var(--calc-text-primary, #1a1a1a);
      
      &:nth-child(even) {
        background: rgba(0, 0, 0, 0.02);
      }
    }

    .growth-chart {
      margin-top: 24px;

      h4 {
        margin: 0 0 12px;
        font-size: 0.875rem;
      }
    }

    .chart-bars {
      display: flex;
      gap: 8px;
      height: 150px;
      align-items: flex-end;
    }

    .bar-container {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      height: 100%;
    }

    .bar {
      width: 100%;
      background: linear-gradient(180deg, #667eea 0%, #764ba2 100%);
      border-radius: 4px 4px 0 0;
      display: flex;
      align-items: flex-start;
      justify-content: center;
      min-height: 20px;
      transition: height 0.3s ease;
    }

    .bar-value {
      font-size: 0.6rem;
      color: white;
      padding: 2px;
      writing-mode: vertical-rl;
      text-orientation: mixed;
    }

    .bar-label {
      font-size: 0.7rem;
      margin-top: 4px;
      color: var(--calc-text-secondary, #666);
    }

    .sip-breakdown {
      margin-top: 24px;
    }

    .breakdown-bar {
      display: flex;
      height: 40px;
      border-radius: 8px;
      overflow: hidden;
    }

    .invested-portion {
      background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 0.75rem;
      font-weight: 500;
    }

    .returns-portion {
      background: linear-gradient(90deg, #11998e 0%, #38ef7d 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 0.75rem;
      font-weight: 500;
    }

    mat-tab-group {
      ::ng-deep .mat-mdc-tab-labels {
        justify-content: center;
      }
    }

    @media (max-width: 480px) {
      .input-section {
        grid-template-columns: 1fr;
      }

      .chart-bars {
        height: 100px;
      }
    }
  `]
})
export class FinancialCalculatorComponent {
    selectedTabIndex = 0;

    // Loan Calculator
    loanAmount = 100000;
    loanRate = 24;
    loanTerm = 12;
    loanResult = signal<LoanResult | null>(null);

    // Compound Interest
    compoundPrincipal = 10000;
    compoundRate = 15;
    compoundYears = 5;
    compoundFrequency = '12';
    compoundResult = signal<CompoundResult | null>(null);

    // SIP Calculator
    sipAmount = 1000;
    sipRate = 12;
    sipYears = 10;
    sipResult = signal<SIPResult | null>(null);

    // FD Calculator
    fdPrincipal = 50000;
    fdRate = 8;
    fdMonths = 12;
    fdResult = signal<{ maturityAmount: number; interestEarned: number } | null>(null);

    constructor() {
        this.calculateLoan();
        this.calculateCompound();
        this.calculateSIP();
        this.calculateFD();
    }

    calculateLoan(): void {
        const P = this.loanAmount;
        const r = this.loanRate / 100 / 12; // Monthly interest rate
        const n = this.loanTerm;

        if (P <= 0 || r <= 0 || n <= 0) {
            this.loanResult.set(null);
            return;
        }

        // EMI Formula: EMI = P × r × (1+r)^n / ((1+r)^n - 1)
        const emi = P * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1);
        const totalPayment = emi * n;
        const totalInterest = totalPayment - P;

        // Generate payment schedule
        const schedule: LoanResult['schedule'] = [];
        let balance = P;

        for (let month = 1; month <= n; month++) {
            const interest = balance * r;
            const principal = emi - interest;
            balance -= principal;

            schedule.push({
                month,
                principal: Math.max(0, principal),
                interest,
                balance: Math.max(0, balance)
            });
        }

        this.loanResult.set({
            emi,
            totalPayment,
            totalInterest,
            schedule
        });
    }

    calculateCompound(): void {
        const P = this.compoundPrincipal;
        const r = this.compoundRate / 100;
        const t = this.compoundYears;
        const n = parseInt(this.compoundFrequency, 10);

        if (P <= 0 || r <= 0 || t <= 0) {
            this.compoundResult.set(null);
            return;
        }

        // A = P(1 + r/n)^(nt)
        const finalAmount = P * Math.pow(1 + r / n, n * t);
        const totalInterest = finalAmount - P;

        // Yearly breakdown
        const yearlyBreakdown: CompoundResult['yearlyBreakdown'] = [];
        for (let year = 1; year <= t; year++) {
            const amount = P * Math.pow(1 + r / n, n * year);
            yearlyBreakdown.push({
                year,
                amount,
                interest: amount - P
            });
        }

        this.compoundResult.set({
            finalAmount,
            totalInterest,
            yearlyBreakdown
        });
    }

    calculateSIP(): void {
        const P = this.sipAmount; // Monthly investment
        const r = this.sipRate / 100 / 12; // Monthly rate
        const n = this.sipYears * 12; // Total months

        if (P <= 0 || r <= 0 || n <= 0) {
            this.sipResult.set(null);
            return;
        }

        // SIP Future Value = P × ((1+r)^n - 1) / r × (1+r)
        const totalValue = P * ((Math.pow(1 + r, n) - 1) / r) * (1 + r);
        const investedAmount = P * n;
        const estimatedReturns = totalValue - investedAmount;

        // Yearly breakdown
        const yearlyBreakdown: SIPResult['yearlyBreakdown'] = [];
        for (let year = 1; year <= this.sipYears; year++) {
            const months = year * 12;
            const value = P * ((Math.pow(1 + r, months) - 1) / r) * (1 + r);
            yearlyBreakdown.push({
                year,
                invested: P * months,
                value
            });
        }

        this.sipResult.set({
            investedAmount,
            estimatedReturns,
            totalValue,
            yearlyBreakdown
        });
    }

    calculateFD(): void {
        const P = this.fdPrincipal;
        const r = this.fdRate / 100;
        const t = this.fdMonths / 12;
        const n = 4; // Quarterly compounding

        if (P <= 0 || r <= 0 || t <= 0) {
            this.fdResult.set(null);
            return;
        }

        const maturityAmount = P * Math.pow(1 + r / n, n * t);
        const interestEarned = maturityAmount - P;

        this.fdResult.set({
            maturityAmount,
            interestEarned
        });
    }
}
