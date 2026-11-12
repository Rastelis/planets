import type { Vector2 } from "./Vector2";

export function getCanvasCenter(width: number, height: number) {
  return {
    x: width / 2,
    y: height / 2,
  };
}

export function calculateVelocity(start: Vector2, end: Vector2) {
  return { x: start.x - end.x, y: start.y - end.y };
}
