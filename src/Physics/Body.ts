import { Vector2 } from "../math/Vector2";

type BodyConfig = {
  color: string;
  trailLength: number;
  mass: number;
};

export class Body {
  public position: Vector2;
  public velocity: Vector2;
  public trail: Vector2[] = [];
  public config: BodyConfig;
  constructor(
    position: Vector2 = new Vector2(),
    velocity: Vector2 = new Vector2(),
    config: Partial<BodyConfig> = {},
  ) {
    this.config = normalizeBodyConfig(config);
    this.position = position;
    this.velocity = velocity;
    this.trail.push(new Vector2(this.position.x, this.position.y));
  }
  update(deltaTime: number): void {
    this.position.x += this.velocity.x * deltaTime;
    this.position.y += this.velocity.y * deltaTime;
    this.trail.unshift(new Vector2(this.position.x, this.position.y));

    if (this.trail.length > this.config.trailLength) {
      this.trail.pop();
    }
  }
}

function normalizeBodyConfig(config?: Partial<BodyConfig>): BodyConfig {
  return {
    color: config?.color ?? "#fff",
    mass: config?.mass ?? 100,
    trailLength: config?.trailLength ?? 200,
  };
}
