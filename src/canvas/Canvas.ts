import { drawBackground } from "./background";
import { calculateVelocity, getCanvasCenter } from "../math/Math";
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
      this.world.addBody(new Body(position));
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

    this.ctx.fillStyle = "white";

    for (const body of this.world.bodies) {
      this.ctx.beginPath();
      this.ctx.arc(body.position.x, body.position.y, 5, 0, Math.PI * 2);
      this.ctx.fill();
    }
  }
}
