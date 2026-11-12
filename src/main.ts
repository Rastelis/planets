import { Renderer } from './components/renderer/Renderer';

const renderer = new Renderer(1000, 800);

(
  window as typeof window & {
    renderer: Renderer;
  }
).renderer = renderer;


draw();

function draw() {
  renderer.clear();
  let simSteps = 5000;
  while (simSteps > 0) {
    simSteps--;
  }
  requestAnimationFrame(draw);
}