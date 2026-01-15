/**
 * Graph Calculator Component
 * Matematiksel fonksiyon çizici
 * y = f(x) grafik plotter
 */
import { Component, signal, computed, ElementRef, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatSliderModule } from '@angular/material/slider';
import { MatTooltipModule } from '@angular/material/tooltip';

interface GraphFunction {
    id: string;
    expression: string;
    color: string;
    visible: boolean;
}

@Component({
    selector: 'app-graph-calculator',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatIconModule,
        MatChipsModule,
        MatSliderModule,
        MatTooltipModule
    ],
    template: `
    <div class="graph-calculator">
      <!-- Function Input -->
      <div class="function-input-section">
        <mat-form-field appearance="outline" class="function-input">
          <mat-label>y = f(x)</mat-label>
          <input 
            matInput 
            [(ngModel)]="currentExpression"
            (keydown.enter)="addFunction()"
            placeholder="Örn: sin(x), x^2, 2*x+1">
          <mat-icon matPrefix>functions</mat-icon>
        </mat-form-field>
        <button 
          mat-fab 
          color="primary" 
          (click)="addFunction()"
          matTooltip="Fonksiyon Ekle">
          <mat-icon>add</mat-icon>
        </button>
      </div>

      <!-- Active Functions -->
      <div class="functions-list">
        @for (fn of functions(); track fn.id) {
          <div class="function-chip" [style.borderColor]="fn.color">
            <span 
              class="color-dot" 
              [style.background]="fn.color"
              (click)="toggleVisibility(fn.id)">
            </span>
            <span class="expression" [class.hidden]="!fn.visible">y = {{ fn.expression }}</span>
            <button mat-icon-button (click)="removeFunction(fn.id)">
              <mat-icon>close</mat-icon>
            </button>
          </div>
        }
      </div>

      <!-- Canvas Graph -->
      <div class="graph-container" #graphContainer>
        <canvas 
          #graphCanvas 
          (mousedown)="startPan($event)"
          (mousemove)="onPan($event)"
          (mouseup)="endPan()"
          (mouseleave)="endPan()"
          (wheel)="onZoom($event)">
        </canvas>

        <!-- Coordinates Display -->
        <div class="coordinates" *ngIf="mouseCoords()">
          x: {{ mouseCoords()!.x.toFixed(2) }}, y: {{ mouseCoords()!.y.toFixed(2) }}
        </div>

        <!-- Zoom Controls -->
        <div class="zoom-controls">
          <button mat-icon-button (click)="zoomIn()" matTooltip="Yakınlaştır">
            <mat-icon>add</mat-icon>
          </button>
          <button mat-icon-button (click)="zoomOut()" matTooltip="Uzaklaştır">
            <mat-icon>remove</mat-icon>
          </button>
          <button mat-icon-button (click)="resetView()" matTooltip="Görünümü Sıfırla">
            <mat-icon>center_focus_strong</mat-icon>
          </button>
        </div>
      </div>

      <!-- Preset Functions -->
      <div class="presets">
        <span class="preset-label">Hazır Fonksiyonlar:</span>
        <div class="preset-buttons">
          @for (preset of presetFunctions; track preset) {
            <button 
              mat-stroked-button 
              (click)="addPreset(preset)"
              class="preset-btn">
              {{ preset }}
            </button>
          }
        </div>
      </div>
    </div>
  `,
    styles: [`
    .graph-calculator {
      max-width: 700px;
      margin: 0 auto;
      padding: 16px;
    }

    .function-input-section {
      display: flex;
      gap: 12px;
      align-items: flex-start;
      margin-bottom: 16px;
    }

    .function-input {
      flex: 1;
    }

    .functions-list {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-bottom: 16px;
    }

    .function-chip {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 4px 8px 4px 12px;
      background: var(--calc-number-bg, #f0f0f5);
      border-radius: 20px;
      border-left: 3px solid;
    }

    .color-dot {
      width: 12px;
      height: 12px;
      border-radius: 50%;
      cursor: pointer;
      transition: transform 0.2s;

      &:hover {
        transform: scale(1.2);
      }
    }

    .expression {
      font-family: 'SF Mono', monospace;
      font-size: 0.875rem;

      &.hidden {
        text-decoration: line-through;
        opacity: 0.5;
      }
    }

    .graph-container {
      position: relative;
      background: var(--calc-display-bg, #1a1a2e);
      border-radius: 16px;
      overflow: hidden;
      aspect-ratio: 4/3;
      margin-bottom: 16px;

      canvas {
        width: 100%;
        height: 100%;
        cursor: crosshair;
      }
    }

    .coordinates {
      position: absolute;
      bottom: 12px;
      left: 12px;
      background: rgba(0, 0, 0, 0.6);
      color: white;
      padding: 6px 12px;
      border-radius: 6px;
      font-family: 'SF Mono', monospace;
      font-size: 0.75rem;
    }

    .zoom-controls {
      position: absolute;
      right: 12px;
      top: 12px;
      display: flex;
      flex-direction: column;
      gap: 4px;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 8px;
      padding: 4px;

      button {
        color: white;
      }
    }

    .presets {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .preset-label {
      font-size: 0.875rem;
      color: var(--calc-text-secondary, #666);
    }

    .preset-buttons {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }

    .preset-btn {
      font-family: 'SF Mono', monospace;
      font-size: 0.75rem;
    }
  `]
})
export class GraphCalculatorComponent implements AfterViewInit, OnDestroy {
    @ViewChild('graphCanvas') canvasRef!: ElementRef<HTMLCanvasElement>;
    @ViewChild('graphContainer') containerRef!: ElementRef<HTMLDivElement>;

    private ctx!: CanvasRenderingContext2D;
    private animationId: number = 0;
    private isPanning = false;
    private panStart = { x: 0, y: 0 };

    currentExpression = '';
    functions = signal<GraphFunction[]>([]);
    mouseCoords = signal<{ x: number; y: number } | null>(null);

    // View state
    private viewState = {
        centerX: 0,
        centerY: 0,
        scale: 50 // pixels per unit
    };

    private colors = [
        '#667eea', '#f093fb', '#4facfe', '#43e97b',
        '#fa709a', '#fee140', '#30cfd0', '#a8edea'
    ];
    private colorIndex = 0;

    presetFunctions = [
        'sin(x)',
        'cos(x)',
        'tan(x)',
        'x^2',
        'x^3',
        'sqrt(x)',
        'log(x)',
        '1/x',
        'abs(x)',
        'exp(x)'
    ];

    ngAfterViewInit(): void {
        this.initCanvas();
        this.draw();

        // Handle resize
        window.addEventListener('resize', this.handleResize);
    }

    ngOnDestroy(): void {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        window.removeEventListener('resize', this.handleResize);
    }

    private handleResize = (): void => {
        this.initCanvas();
        this.draw();
    };

    private initCanvas(): void {
        const canvas = this.canvasRef.nativeElement;
        const container = this.containerRef.nativeElement;

        canvas.width = container.clientWidth * window.devicePixelRatio;
        canvas.height = container.clientHeight * window.devicePixelRatio;

        this.ctx = canvas.getContext('2d')!;
        this.ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    }

    private draw(): void {
        const canvas = this.canvasRef.nativeElement;
        const width = canvas.width / window.devicePixelRatio;
        const height = canvas.height / window.devicePixelRatio;

        // Clear
        this.ctx.fillStyle = '#1a1a2e';
        this.ctx.fillRect(0, 0, width, height);

        // Draw grid
        this.drawGrid(width, height);

        // Draw axes
        this.drawAxes(width, height);

        // Draw functions
        for (const fn of this.functions()) {
            if (fn.visible) {
                this.drawFunction(fn, width, height);
            }
        }
    }

    private drawGrid(width: number, height: number): void {
        const { centerX, centerY, scale } = this.viewState;
        const originX = width / 2 - centerX * scale;
        const originY = height / 2 + centerY * scale;

        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        this.ctx.lineWidth = 1;

        // Calculate grid step
        const gridStep = this.calculateGridStep(scale);

        // Vertical lines
        const startX = Math.floor((0 - originX) / (scale * gridStep)) * gridStep;
        const endX = Math.ceil((width - originX) / (scale * gridStep)) * gridStep;

        for (let x = startX; x <= endX; x += gridStep) {
            const px = originX + x * scale;
            this.ctx.beginPath();
            this.ctx.moveTo(px, 0);
            this.ctx.lineTo(px, height);
            this.ctx.stroke();
        }

        // Horizontal lines
        const startY = Math.floor((originY - height) / (scale * gridStep)) * gridStep;
        const endY = Math.ceil(originY / (scale * gridStep)) * gridStep;

        for (let y = startY; y <= endY; y += gridStep) {
            const py = originY - y * scale;
            this.ctx.beginPath();
            this.ctx.moveTo(0, py);
            this.ctx.lineTo(width, py);
            this.ctx.stroke();
        }
    }

    private drawAxes(width: number, height: number): void {
        const { centerX, centerY, scale } = this.viewState;
        const originX = width / 2 - centerX * scale;
        const originY = height / 2 + centerY * scale;

        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
        this.ctx.lineWidth = 2;

        // X axis
        this.ctx.beginPath();
        this.ctx.moveTo(0, originY);
        this.ctx.lineTo(width, originY);
        this.ctx.stroke();

        // Y axis
        this.ctx.beginPath();
        this.ctx.moveTo(originX, 0);
        this.ctx.lineTo(originX, height);
        this.ctx.stroke();

        // Axis labels
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
        this.ctx.font = '12px SF Mono, monospace';
        this.ctx.textAlign = 'center';

        const gridStep = this.calculateGridStep(scale);

        // X axis labels
        const startX = Math.floor((0 - originX) / (scale * gridStep)) * gridStep;
        const endX = Math.ceil((width - originX) / (scale * gridStep)) * gridStep;

        for (let x = startX; x <= endX; x += gridStep) {
            if (x !== 0) {
                const px = originX + x * scale;
                this.ctx.fillText(x.toString(), px, originY + 16);
            }
        }

        // Y axis labels
        this.ctx.textAlign = 'right';
        const startY = Math.floor((originY - height) / (scale * gridStep)) * gridStep;
        const endY = Math.ceil(originY / (scale * gridStep)) * gridStep;

        for (let y = startY; y <= endY; y += gridStep) {
            if (y !== 0) {
                const py = originY - y * scale;
                this.ctx.fillText(y.toString(), originX - 8, py + 4);
            }
        }
    }

    private drawFunction(fn: GraphFunction, width: number, height: number): void {
        const { centerX, centerY, scale } = this.viewState;
        const originX = width / 2 - centerX * scale;
        const originY = height / 2 + centerY * scale;

        this.ctx.strokeStyle = fn.color;
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();

        let isFirstPoint = true;

        for (let px = 0; px < width; px += 0.5) {
            const x = (px - originX) / scale;

            try {
                const y = this.evaluateExpression(fn.expression, x);

                if (isFinite(y) && Math.abs(y) < 1000) {
                    const py = originY - y * scale;

                    if (isFirstPoint) {
                        this.ctx.moveTo(px, py);
                        isFirstPoint = false;
                    } else {
                        this.ctx.lineTo(px, py);
                    }
                } else {
                    isFirstPoint = true;
                }
            } catch {
                isFirstPoint = true;
            }
        }

        this.ctx.stroke();
    }

    private calculateGridStep(scale: number): number {
        const minPixelStep = 50;
        const idealStep = minPixelStep / scale;

        const pow10 = Math.pow(10, Math.floor(Math.log10(idealStep)));
        const normalized = idealStep / pow10;

        if (normalized < 2) return pow10;
        if (normalized < 5) return 2 * pow10;
        return 5 * pow10;
    }

    private evaluateExpression(expr: string, x: number): number {
        // Safe math evaluation
        const sanitized = expr
            .replace(/\^/g, '**')
            .replace(/sin/g, 'Math.sin')
            .replace(/cos/g, 'Math.cos')
            .replace(/tan/g, 'Math.tan')
            .replace(/sqrt/g, 'Math.sqrt')
            .replace(/abs/g, 'Math.abs')
            .replace(/log/g, 'Math.log10')
            .replace(/ln/g, 'Math.log')
            .replace(/exp/g, 'Math.exp')
            .replace(/pi/gi, 'Math.PI')
            .replace(/e(?![x])/g, 'Math.E');

        return new Function('x', `return ${sanitized}`)(x);
    }

    addFunction(): void {
        if (!this.currentExpression.trim()) return;

        const newFn: GraphFunction = {
            id: crypto.randomUUID(),
            expression: this.currentExpression.trim(),
            color: this.colors[this.colorIndex % this.colors.length],
            visible: true
        };

        this.functions.set([...this.functions(), newFn]);
        this.colorIndex++;
        this.currentExpression = '';
        this.draw();
    }

    addPreset(preset: string): void {
        this.currentExpression = preset;
        this.addFunction();
    }

    removeFunction(id: string): void {
        this.functions.set(this.functions().filter(fn => fn.id !== id));
        this.draw();
    }

    toggleVisibility(id: string): void {
        this.functions.set(
            this.functions().map(fn =>
                fn.id === id ? { ...fn, visible: !fn.visible } : fn
            )
        );
        this.draw();
    }

    // Pan & Zoom
    startPan(event: MouseEvent): void {
        this.isPanning = true;
        this.panStart = { x: event.clientX, y: event.clientY };
    }

    onPan(event: MouseEvent): void {
        // Update mouse coordinates
        const rect = this.canvasRef.nativeElement.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        const width = rect.width;
        const height = rect.height;
        const { centerX, centerY, scale } = this.viewState;

        const originX = width / 2 - centerX * scale;
        const originY = height / 2 + centerY * scale;

        const graphX = (x - originX) / scale;
        const graphY = (originY - y) / scale;

        this.mouseCoords.set({ x: graphX, y: graphY });

        if (this.isPanning) {
            const dx = (event.clientX - this.panStart.x) / this.viewState.scale;
            const dy = (event.clientY - this.panStart.y) / this.viewState.scale;

            this.viewState.centerX -= dx;
            this.viewState.centerY += dy;

            this.panStart = { x: event.clientX, y: event.clientY };
            this.draw();
        }
    }

    endPan(): void {
        this.isPanning = false;
    }

    onZoom(event: WheelEvent): void {
        event.preventDefault();
        const factor = event.deltaY > 0 ? 0.9 : 1.1;
        this.viewState.scale *= factor;
        this.viewState.scale = Math.max(5, Math.min(500, this.viewState.scale));
        this.draw();
    }

    zoomIn(): void {
        this.viewState.scale *= 1.2;
        this.viewState.scale = Math.min(500, this.viewState.scale);
        this.draw();
    }

    zoomOut(): void {
        this.viewState.scale *= 0.8;
        this.viewState.scale = Math.max(5, this.viewState.scale);
        this.draw();
    }

    resetView(): void {
        this.viewState = { centerX: 0, centerY: 0, scale: 50 };
        this.draw();
    }
}
