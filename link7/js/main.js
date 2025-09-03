import { initWorld, updatePhysics } from './world.js';
import { initTrack }             from './track.js';
import { initBike, updateBike }  from './bike.js';
import { updateUI }              from './ui.js';

let scene, camera, renderer, clock, world, bike;

(function start(){
  ({ scene, camera, renderer, clock, world } = initWorld());
  const track = initTrack(scene, world);
  bike = initBike(scene, world, camera, track.spawn);
  loop();
})();

function loop(){
  requestAnimationFrame(loop);
  const dt = Math.min(0.033, clock.getDelta());    // cap 30 ms
  updatePhysics(world, dt);
  updateBike(bike, dt);
  updateUI(bike);
  renderer.render(scene, camera);
}


