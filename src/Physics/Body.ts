import { Vector2 } from "../math/Vector2";

export class Body {
  public position: Vector2;
  public velocity: Vector2;
  public mass: number;
  constructor(
    position: Vector2 = new Vector2(),
    velocity: Vector2 = new Vector2(),
    mass: number = 1,
  ) {
    this.position = position;
    this.velocity = velocity;
    this.mass = mass;
  }
  update(deltaTime: number): void {
    this.position.x += this.velocity.x * deltaTime;
    this.position.y += this.velocity.y * deltaTime;
  }
}
