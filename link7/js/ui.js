export function updateUI(bike){
  const now = performance.now();
  updateUI.prev ||= now;
  const fps = Math.round(1000/(now-updateUI.prev)); updateUI.prev = now;
  document.getElementById('fps').textContent = `FPS: ${fps}`;
  document.getElementById('lap').textContent =
    `Lap: ${bike.lap} | Time: ${bike.lapTime.toFixed(2)} s`;
}
