export function initTrack(scene, world){
  // figure-8 curve
  const path = new THREE.CurvePath();
  const R = 400, W = 12, SEG = 400;
  for(let i=0;i<SEG;i++){
    const t1 = i   /SEG * Math.PI*2;
    const t2 = (i+1)/SEG * Math.PI*2;
    path.add(new THREE.LineCurve3(
      new THREE.Vector3(Math.sin(t1)*R,0,Math.sin(t1)*Math.cos(t1)*R),
      new THREE.Vector3(Math.sin(t2)*R,0,Math.sin(t2)*Math.cos(t2)*R)
    ));
  }
  const geom = new THREE.TubeGeometry(path, SEG, W/2, 8, true);
  const mat  = new THREE.MeshStandardMaterial({ color:0x444444 });
  const track = new THREE.Mesh(geom, mat);
  track.receiveShadow = true;
  scene.add(track);

  // flat physics ground
  const groundShape = new CANNON.Plane();
  const groundBody  = new CANNON.Body({ mass:0, shape:groundShape });
  groundBody.quaternion.setFromEuler(-Math.PI/2,0,0);
  world.addBody(groundBody);

  return { spawn: path.getPoint(0) };
}

