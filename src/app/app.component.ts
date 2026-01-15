/**
 * Ana Uygulama Bileşeni
 * Hesap makinesi modları arasında geçiş yapan ana kabuk
 * Material toolbar, tabs ve tema geçişi
 */
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

import { ThemeService } from './core/services';
import { StandardCalculatorComponent } from './features/standard-calculator/standard-calculator.component';
import { ScientificCalculatorComponent } from './features/scientific-calculator/scientific-calculator.component';
import { AdvancedCalculatorComponent } from './features/advanced-calculator/advanced-calculator.component';

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
    MatSlideToggleModule,
    StandardCalculatorComponent,
    ScientificCalculatorComponent,
    AdvancedCalculatorComponent
  ],
  template: `
    <div class="app-container" [class.dark-mode]="themeService.isDark()">
      <!-- Üst Toolbar -->
      <mat-toolbar class="app-toolbar" color="primary">
        <div class="toolbar-content">
          <div class="brand">
            <mat-icon class="logo-icon">calculate</mat-icon>
            <span class="app-title">Hesap Makinesi</span>
            <span class="app-subtitle">Pro</span>
          </div>
          
          <div class="toolbar-actions">
            <!-- Tema Toggle -->
            <button 
              mat-icon-button 
              (click)="toggleTheme()"
              [matTooltip]="themeService.isDark() ? 'Açık Tema' : 'Koyu Tema'"
              aria-label="Toggle theme">
              <mat-icon>{{ themeService.isDark() ? 'light_mode' : 'dark_mode' }}</mat-icon>
            </button>
          </div>
        </div>
      </mat-toolbar>

      <!-- Ana İçerik -->
      <main class="main-content">
        <mat-tab-group 
          class="calculator-tabs"
          animationDuration="300ms"
          [selectedIndex]="selectedTab"
          (selectedIndexChange)="onTabChange($event)"
          mat-stretch-tabs="false"
          mat-align-tabs="center">
          
          <!-- Standart Mod -->
          <mat-tab>
            <ng-template mat-tab-label>
              <mat-icon class="tab-icon">dialpad</mat-icon>
              <span class="tab-label">Standart</span>
            </ng-template>
            <div class="tab-content">
              <app-standard-calculator></app-standard-calculator>
            </div>
          </mat-tab>

          <!-- Bilimsel Mod -->
          <mat-tab>
            <ng-template mat-tab-label>
              <mat-icon class="tab-icon">science</mat-icon>
              <span class="tab-label">Bilimsel</span>
            </ng-template>
            <div class="tab-content">
              <app-scientific-calculator></app-scientific-calculator>
            </div>
          </mat-tab>

          <!-- Gelişmiş Mod -->
          <mat-tab>
            <ng-template mat-tab-label>
              <mat-icon class="tab-icon">functions</mat-icon>
              <span class="tab-label">Gelişmiş</span>
            </ng-template>
            <div class="tab-content">
              <app-advanced-calculator></app-advanced-calculator>
            </div>
          </mat-tab>
        </mat-tab-group>
      </main>

      <!-- Alt Bilgi -->
      <footer class="app-footer">
        <span>Angular 19 • Material Design • Signals</span>
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

    .toolbar-actions {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .main-content {
      flex: 1;
      padding: 24px 16px;
      max-width: 1200px;
      margin: 0 auto;
      width: 100%;
      box-sizing: border-box;
    }

    .calculator-tabs {
      background: var(--calc-card-bg, rgba(255, 255, 255, 0.95));
      border-radius: 20px;
      box-shadow: 
        0 10px 40px rgba(0, 0, 0, 0.1),
        0 4px 12px rgba(0, 0, 0, 0.05);
      overflow: hidden;
      backdrop-filter: blur(10px);
    }

    .tab-icon {
      margin-right: 8px;
    }

    .tab-label {
      font-weight: 500;
    }

    .tab-content {
      padding: 20px 0;
      animation: fadeIn 0.3s ease;
    }

    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: translateY(10px);
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
    @media (max-width: 600px) {
      .app-title {
        font-size: 1rem;
      }

      .app-subtitle {
        display: none;
      }

      .tab-label {
        display: none;
      }

      .tab-icon {
        margin-right: 0;
      }

      .main-content {
        padding: 16px 8px;
      }

      .calculator-tabs {
        border-radius: 16px;
      }
    }
  `]
})
export class AppComponent {
  readonly themeService = inject(ThemeService);
  selectedTab = 0;

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  onTabChange(index: number): void {
    this.selectedTab = index;
  }
}
