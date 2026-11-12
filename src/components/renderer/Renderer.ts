import { drawBackground } from './background';
import { getCanvasCenter } from '../../utils/Math';
import type { Vector2 } from '../../types';

export class Renderer {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  public bgColor: string;
  readonly centerVector: Vector2;

  constructor(width: number, height: number, bgColor: string = 'black') {
    const dpr = window.devicePixelRatio || 1;
    this.canvas = document.createElement('canvas');
    this.canvas.width = width * dpr;
    this.canvas.height = height * dpr;
    this.canvas.style.width = `${width}px`;
    this.canvas.style.height = `${height}px`;
    this.centerVector = getCanvasCenter(this.canvas);

    document.body.appendChild(this.canvas);
    const ctx = this.canvas.getContext('2d') as CanvasRenderingContext2D;

    this.ctx = ctx;
    this.bgColor = bgColor;
    this.ctx.scale(dpr, dpr);
  }
  clear() {
    drawBackground(this.ctx, this.canvas, this.bgColor);
  }
}