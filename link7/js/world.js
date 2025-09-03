export function initWorld(){
  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(70, innerWidth/innerHeight, 0.1, 5000);
  camera.position.set(0, 3, -6);

  const renderer = new THREE.WebGLRenderer({ antialias:true });
  renderer.setSize(innerWidth, innerHeight);
  renderer.shadowMap.enabled = true;
  document.body.appendChild(renderer.domElement);

  // optional skybox / reflections
  if (THREE.RGBELoader){
    new THREE.RGBELoader().load('./assets/sky.hdr', tex=>{
      tex.mapping = THREE.EquirectangularReflectionMapping;
      scene.environment = tex;
      scene.background  = tex;
    });
  }

  const sun = new THREE.DirectionalLight(0xfff7e5, 1.2);
  sun.position.set(50,100,-30);
  sun.castShadow = true;
  scene.add(sun);

  const world = new CANNON.World({
    gravity: new CANNON.Vec3(0, -9.82, 0),
    broadphase: new CANNON.SAPBroadphase(),
    allowSleep: true
  });

  const clock = new THREE.Clock();

  window.addEventListener('resize', ()=>{
    camera.aspect = innerWidth/innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(innerWidth, innerHeight);
  });

  return { scene, camera, renderer, clock, world };
}

export function updatePhysics(world, dt){
  world.fixedStep(dt);
}
