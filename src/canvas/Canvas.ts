import { drawBackground } from "./background";
import { calculateVelocity, getCanvasCenter, getSize } from "../math/Math";
import { Vector2 } from "../math/Vector2";
import { Body } from "../Physics/Body";
import { PhysicsWorld } from "../Physics/PhyscsWorld";

export class Canvas {
  private world: PhysicsWorld;
  private element: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  public bgColor: string;
  readonly centerVector: Vector2;
  private currentBodyId: number | null = null;

  constructor(
    world: PhysicsWorld,
    width: number = 800,
    height: number = 600,
    bgColor: string = "black",
  ) {
    this.world = world;
    const dpr = window.devicePixelRatio || 1;
    this.element = document.createElement("canvas");
    this.element.width = width * dpr;
    this.element.height = height * dpr;
    this.element.style.width = `${width}px`;
    this.element.style.height = `${height}px`;
    this.centerVector = getCanvasCenter(width, height);

    document.body.appendChild(this.element);

    const ctx = this.element.getContext("2d");

    if (!ctx) {
      throw new Error("Could not create a 2D canvas context");
    }

    this.ctx = ctx;
    this.bgColor = bgColor;
    this.ctx.scale(dpr, dpr);

    this.element.addEventListener("pointerdown", (event) => {
      this.element.setPointerCapture(event.pointerId);
      const rect = this.element.getBoundingClientRect();
      const position = new Vector2(
        (event.clientX - rect.left) * (width / rect.width),
        (event.clientY - rect.top) * (height / rect.height),
      );
      this.world.addBody(
        new Body(position, new Vector2(), { color: randomColor() }),
      );
      this.draw();
      this.currentBodyId = this.world.bodies.length - 1;
    });

    this.element.addEventListener("pointerup", (event) => {
      if (this.currentBodyId === null) return;
      const rect = this.element.getBoundingClientRect();
      const position = new Vector2(
        (event.clientX - rect.left) * (width / rect.width),
        (event.clientY - rect.top) * (height / rect.height),
      );
      const velocity = calculateVelocity(
        this.world.bodies[this.currentBodyId].position,
        position,
      );
      this.world.bodies[this.currentBodyId].velocity = velocity;
      this.currentBodyId = null;
    });
  }

  clear() {
    drawBackground(this.ctx, this.element, this.bgColor);
  }

  draw(): void {
    this.clear();

    for (const body of this.world.bodies) {
      this.ctx.fillStyle = body.config.color;
      this.drawBody(body);
    }
  }
  private drawBody(body: Body): void {
    this.ctx.beginPath();
    this.ctx.arc(
      body.position.x,
      body.position.y,
      getSize(body.config.mass),
      0,
      Math.PI * 2,
    );
    this.ctx.fill();
    if (body.config.trailLength > 0) this.drawTrail(body);
  }
  private drawTrail(body: Body): void {
    const trail = body.trail;
    const maxSegments = body.config.trailLength - 1;

    if (trail.length < 2 || maxSegments <= 0) return;

    const fadeStart = maxSegments * (2 / 3);

    this.ctx.save();
    this.ctx.strokeStyle = body.config.color;
    this.ctx.lineWidth = 1;

    for (let i = 1; i < trail.length; i++) {
      const from = trail[i - 1]!;
      const to = trail[i]!;

      const opacity =
        i <= fadeStart ? 1 : 1 - (i - fadeStart) / (maxSegments - fadeStart);

      this.ctx.globalAlpha = Math.max(0, Math.min(1, opacity));

      this.ctx.beginPath();
      this.ctx.moveTo(from.x, from.y);
      this.ctx.lineTo(to.x, to.y);
      this.ctx.stroke();
    }

    this.ctx.restore();
  }
}

function randomColor(): string {
  return `hsl(${Math.random() * 360}, 100%, 65%)`;
}
