export function initBike(scene, world, camera, spawn){
  const geom = new THREE.BoxGeometry(0.6,0.4,1.4);
  const mat  = new THREE.MeshStandardMaterial({ color:0x1e90ff });
  const mesh = new THREE.Mesh(geom, mat);
  mesh.castShadow = true;
  scene.add(mesh);

  const shape = new CANNON.Box(new CANNON.Vec3(0.3,0.2,0.7));
  const body  = new CANNON.Body({ mass:150, shape, angularDamping:0.9 });
  body.position.copy(spawn).y = 1;
  world.addBody(body);

  const keys = {};
  addEventListener('keydown',e=>keys[e.code]=true);
  addEventListener('keyup',  e=>keys[e.code]=false);

  return { mesh, body, keys, camera, lap:0, lapTime:0 };
}

export function updateBike(bike, dt){
  const { body, mesh, keys, camera } = bike;
  const fwd = new CANNON.Vec3(0,0,-1); body.quaternion.vmult(fwd,fwd);

  if(keys.ArrowUp)    body.applyLocalForce(new CANNON.Vec3(0,0,-450), new CANNON.Vec3(0,0,1));
  if(keys.ArrowDown)  body.velocity.scale(0.98, body.velocity);
  if(keys.ArrowLeft)  body.angularVelocity.y =  1.5;
  if(keys.ArrowRight) body.angularVelocity.y = -1.5;

  mesh.position.copy(body.position);
  mesh.quaternion.copy(body.quaternion);

  const camTarget = new THREE.Vector3().copy(mesh.position)
                      .addScaledVector(fwd,-6).setY(mesh.position.y+3);
  camera.position.lerp(camTarget, 0.08);
  camera.lookAt(mesh.position);

  bike.lapTime += dt;
  if(body.position.length()<5 && bike.lapTime>3){ bike.lap++; bike.lapTime=0; }
}
