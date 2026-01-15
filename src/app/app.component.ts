/**
 * Ana Uygulama Bileşeni - v2.0
 * 7 farklı hesap makinesi modu
 * Material toolbar, tabs ve tema geçişi
 */
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';

import { ThemeService } from './core/services';
import { StandardCalculatorComponent } from './features/standard-calculator/standard-calculator.component';
import { ScientificCalculatorComponent } from './features/scientific-calculator/scientific-calculator.component';
import { AdvancedCalculatorComponent } from './features/advanced-calculator/advanced-calculator.component';
import { ProgrammerCalculatorComponent } from './features/programmer-calculator/programmer-calculator.component';
import { FinancialCalculatorComponent } from './features/financial-calculator/financial-calculator.component';
import { UnitConverterComponent } from './features/unit-converter/unit-converter.component';
import { GraphCalculatorComponent } from './features/graph-calculator/graph-calculator.component';

interface Tab {
  label: string;
  icon: string;
  component: string;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatTabsModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatMenuModule,
    StandardCalculatorComponent,
    ScientificCalculatorComponent,
    AdvancedCalculatorComponent,
    ProgrammerCalculatorComponent,
    FinancialCalculatorComponent,
    UnitConverterComponent,
    GraphCalculatorComponent
  ],
  template: `
    <div class="app-container" [class.dark-mode]="themeService.isDark()">
      <!-- Üst Toolbar -->
      <mat-toolbar class="app-toolbar">
        <div class="toolbar-content">
          <div class="brand">
            <mat-icon class="logo-icon">calculate</mat-icon>
            <span class="app-title">Hesap Makinesi</span>
            <span class="app-subtitle">PRO</span>
            <span class="version-badge">v2.0</span>
          </div>
          
          <div class="toolbar-actions">
            <!-- PWA Install Button - will be shown when available -->
            <button 
              mat-icon-button 
              *ngIf="showInstallButton"
              (click)="installPWA()"
              matTooltip="Uygulamayı Yükle">
              <mat-icon>install_mobile</mat-icon>
            </button>

            <!-- Theme Toggle -->
            <button 
              mat-icon-button 
              (click)="toggleTheme()"
              [matTooltip]="themeService.isDark() ? 'Açık Tema' : 'Koyu Tema'"
              aria-label="Toggle theme">
              <mat-icon>{{ themeService.isDark() ? 'light_mode' : 'dark_mode' }}</mat-icon>
            </button>

            <!-- More Options -->
            <button mat-icon-button [matMenuTriggerFor]="moreMenu">
              <mat-icon>more_vert</mat-icon>
            </button>
            <mat-menu #moreMenu="matMenu">
              <button mat-menu-item disabled>
                <mat-icon>info</mat-icon>
                <span>Versiyon 2.0.0</span>
              </button>
            </mat-menu>
          </div>
        </div>
      </mat-toolbar>

      <!-- Ana İçerik -->
      <main class="main-content">
        <mat-tab-group 
          class="calculator-tabs"
          animationDuration="250ms"
          [selectedIndex]="selectedTab"
          (selectedIndexChange)="onTabChange($event)"
          mat-stretch-tabs="false"
          mat-align-tabs="center">
          
          @for (tab of tabs; track tab.component) {
            <mat-tab>
              <ng-template mat-tab-label>
                <mat-icon class="tab-icon">{{ tab.icon }}</mat-icon>
                <span class="tab-label">{{ tab.label }}</span>
              </ng-template>
            </mat-tab>
          }
        </mat-tab-group>

        <!-- Tab Content -->
        <div class="tab-content" [ngSwitch]="selectedTab">
          <app-standard-calculator *ngSwitchCase="0"></app-standard-calculator>
          <app-scientific-calculator *ngSwitchCase="1"></app-scientific-calculator>
          <app-advanced-calculator *ngSwitchCase="2"></app-advanced-calculator>
          <app-programmer-calculator *ngSwitchCase="3"></app-programmer-calculator>
          <app-financial-calculator *ngSwitchCase="4"></app-financial-calculator>
          <app-unit-converter *ngSwitchCase="5"></app-unit-converter>
          <app-graph-calculator *ngSwitchCase="6"></app-graph-calculator>
        </div>
      </main>

      <!-- Alt Bilgi -->
      <footer class="app-footer">
        <span>Angular 19 • Material Design 3 • PWA Ready</span>
      </footer>
    </div>
  `,
  styles: [`
    .app-container {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
      background: var(--calc-bg, linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%));
      transition: background 0.3s ease;
    }

    .app-toolbar {
      background: var(--toolbar-bg, linear-gradient(135deg, #667eea 0%, #764ba2 100%)) !important;
      color: white !important;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
      position: sticky;
      top: 0;
      z-index: 100;
    }

    .toolbar-content {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 16px;
    }

    .brand {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .logo-icon {
      font-size: 28px;
      width: 28px;
      height: 28px;
    }

    .app-title {
      font-size: 1.25rem;
      font-weight: 600;
      letter-spacing: 0.5px;
    }

    .app-subtitle {
      font-size: 0.75rem;
      font-weight: 500;
      background: rgba(255, 255, 255, 0.2);
      padding: 2px 8px;
      border-radius: 12px;
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    .version-badge {
      font-size: 0.625rem;
      background: #38ef7d;
      color: #1a1a1a;
      padding: 2px 6px;
      border-radius: 8px;
      font-weight: 600;
    }

    .toolbar-actions {
      display: flex;
      align-items: center;
      gap: 4px;
    }

    .main-content {
      flex: 1;
      max-width: 1200px;
      margin: 0 auto;
      width: 100%;
      box-sizing: border-box;
    }

    .calculator-tabs {
      background: var(--calc-card-bg, rgba(255, 255, 255, 0.95));
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
      backdrop-filter: blur(10px);
      margin: 16px;
      border-radius: 20px 20px 0 0;
      overflow: hidden;

      ::ng-deep .mat-mdc-tab-header {
        overflow-x: auto;
        scrollbar-width: thin;

        &::-webkit-scrollbar {
          height: 3px;
        }
      }
    }

    .tab-icon {
      margin-right: 6px;
      font-size: 20px;
      width: 20px;
      height: 20px;
    }

    .tab-label {
      font-weight: 500;
      font-size: 0.875rem;
    }

    .tab-content {
      background: var(--calc-card-bg, rgba(255, 255, 255, 0.95));
      margin: 0 16px 16px;
      border-radius: 0 0 20px 20px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
      padding-bottom: 16px;
      animation: fadeIn 0.25s ease;
    }

    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: translateY(8px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .app-footer {
      text-align: center;
      padding: 16px;
      font-size: 0.75rem;
      color: var(--footer-text, #666);
      opacity: 0.8;
    }

    /* Dark Mode Overrides */
    :host-context(.dark-theme),
    .dark-mode {
      --calc-bg: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
      --calc-card-bg: rgba(30, 30, 50, 0.95);
      --toolbar-bg: linear-gradient(135deg, #434d90 0%, #5a3d8a 100%);
      --footer-text: #aaa;
    }

    /* Responsive */
    @media (max-width: 768px) {
      .app-title {
        font-size: 1rem;
      }

      .app-subtitle, .version-badge {
        display: none;
      }

      .tab-label {
        display: none;
      }

      .tab-icon {
        margin-right: 0;
      }

      .calculator-tabs, .tab-content {
        margin: 8px;
      }
    }

    @media (max-width: 480px) {
      .calculator-tabs {
        border-radius: 16px 16px 0 0;
      }

      .tab-content {
        border-radius: 0 0 16px 16px;
      }
    }
  `]
})
export class AppComponent {
  readonly themeService = inject(ThemeService);
  selectedTab = 0;
  showInstallButton = false;
  private deferredPrompt: any;

  tabs: Tab[] = [
    { label: 'Standart', icon: 'dialpad', component: 'standard' },
    { label: 'Bilimsel', icon: 'science', component: 'scientific' },
    { label: 'Gelişmiş', icon: 'functions', component: 'advanced' },
    { label: 'Programcı', icon: 'code', component: 'programmer' },
    { label: 'Finans', icon: 'account_balance', component: 'financial' },
    { label: 'Birim', icon: 'straighten', component: 'unit' },
    { label: 'Grafik', icon: 'show_chart', component: 'graph' }
  ];

  constructor() {
    // Listen for PWA install prompt
    if (typeof window !== 'undefined') {
      window.addEventListener('beforeinstallprompt', (e: any) => {
        e.preventDefault();
        this.deferredPrompt = e;
        this.showInstallButton = true;
      });
    }
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  onTabChange(index: number): void {
    this.selectedTab = index;
  }

  async installPWA(): Promise<void> {
    if (!this.deferredPrompt) return;

    this.deferredPrompt.prompt();
    const { outcome } = await this.deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      this.showInstallButton = false;
    }
    this.deferredPrompt = null;
  }
}
