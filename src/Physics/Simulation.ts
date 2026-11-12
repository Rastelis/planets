import { Canvas } from "../canvas/Canvas";
import { PhysicsWorld } from "./PhyscsWorld";

export class Simulation {
  private world: PhysicsWorld;
  private canvas: Canvas;
  private previousTime: number | undefined;
  private animationId: number | null = null;
  // public config: [object]

  constructor() {
    this.world = new PhysicsWorld();
    this.canvas = new Canvas(this.world);
    this.canvas.draw();
  }

  private frame = (time: number): void => {
    const deltaTime =
      this.previousTime === undefined
        ? 0
        : Math.min((time - this.previousTime) / 1000, 0.05);

    this.previousTime = time;

    this.world.update(deltaTime);
    this.canvas.draw();

    this.animationId = requestAnimationFrame(this.frame);
  };

  start(): void {
    if (this.animationId !== null) return;

    this.previousTime = undefined;
    this.animationId = requestAnimationFrame(this.frame);
  }

  stop(): void {
    if (this.animationId === null) return;

    cancelAnimationFrame(this.animationId);
    this.animationId = null;
    this.previousTime = undefined;
  }

  reset(): void {
    if (this.animationId) cancelAnimationFrame(this.animationId);
    this.world.bodies.length = 0;
    this.canvas.clear();
    this.animationId = null;
    this.previousTime = undefined;
  }
}
