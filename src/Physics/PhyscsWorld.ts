import { Body } from "./Body";

export class PhysicsWorld {
  readonly bodies: Body[] = [];
  private gravityStrength = 100;
  private softening = 1;

  addBody(body: Body): void {
    this.bodies.push(body);
  }

  update(deltaTime: number): void {
    this.applyGravity(deltaTime);

    for (const body of this.bodies) {
      body.update(deltaTime);
    }
  }
  private applyGravity(deltaTime: number): void {
    for (let i = 0; i < this.bodies.length; i++) {
      for (let j = i + 1; j < this.bodies.length; j++) {
        const a = this.bodies[i]!;
        const b = this.bodies[j]!;

        const dx = b.position.x - a.position.x;
        const dy = b.position.y - a.position.y;

        const distanceSquared =
          dx * dx + dy * dy + this.softening * this.softening;

        const factor = this.gravityStrength / Math.pow(distanceSquared, 1.5);

        a.velocity.x += dx * factor * b.config.mass * deltaTime;
        a.velocity.y += dy * factor * b.config.mass * deltaTime;

        b.velocity.x -= dx * factor * a.config.mass * deltaTime;
        b.velocity.y -= dy * factor * a.config.mass * deltaTime;
      }
    }
  }
}
