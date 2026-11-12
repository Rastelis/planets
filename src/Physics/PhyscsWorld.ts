import { Body } from "./Body";

export class PhysicsWorld {
  readonly bodies: Body[] = [];

  addBody(body: Body): void {
    this.bodies.push(body);
  }

  update(deltaTime: number): void {
    for (const body of this.bodies) {
      body.update(deltaTime);
    }
  }
}
