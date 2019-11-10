const init = () => {
  let scene = new THREE.Scene();
  let gui = new dat.GUI();

  let enableFog = false;
  if (enableFog) {
    scene.fog = new THREE.FogExp2(0xffffff, 0.2)
  }

  //Light
  let pointLight = getPointLight(1);
  pointLight.position.y = 2;
  pointLight.intensity = 2;
  gui.add(pointLight, 'intensity', 0, 10);
  gui.add(pointLight.position, 'y', 0, 5 );

  //Sphere
  let sphere = getSphere(0.05);

  //Box grid
  let boxGrid = getBoxGrid(10, 1.5); 

  //Plane
  let plane = getPlane(30);
  plane.name = 'plane-1';
  plane.rotation.x = Math.PI/2; //Radian s are used
  // plane.position.y = 1;

  scene.add(plane);
  pointLight.add(sphere)
  scene.add(pointLight);
  scene.add(boxGrid);
  
  //Camera
  let camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth/window.innerHeight,
    1, //Near clipping plan
    1000 //Far clipping plan
  );
  camera.position.x = 1;
  camera.position.y = 2;
  camera.position.z = 5;

  camera.lookAt(new THREE.Vector3(0,0,0))
  
  let renderer = new THREE.WebGLRenderer();
  renderer.shadowMap.enabled = true;
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor('rgb(120,120,120)');
  document.getElementById('webgl').appendChild(renderer.domElement);

    let controls = new THREE.OrbitControls(camera, renderer.domElement)

  update(renderer, scene, camera, controls);
  return scene;
}

//Cube
let getBox = (w,h,d) => {
  let geometry = new THREE.BoxGeometry(w,h,d)
  let material = new THREE.MeshPhongMaterial({
    color: 'rgb(120,120,120)'
  })
  let mesh = new THREE.Mesh(
    geometry,
    material
  );
  mesh.castShadow = true;

  return mesh;
}

//Box grid
let getBoxGrid = (amount, separationMultiplier) => {
  let group = new THREE.Group();

  for (let i=0; i<amount; i++) {
    let obj = getBox(1,1,1);
    obj.position.x = i * separationMultiplier;
    obj.position.y = obj.geometry.parameters.height/2;
    group.add(obj);
    for (let j=1; j<amount; j++) {
      let obj = getBox(1,1,1);
      obj.position.x = i * separationMultiplier;
      obj.position.y = obj.geometry.parameters.height/2;
      obj.position.z = j * separationMultiplier;
      group.add(obj);
    }
  }
  group.position.x = -(separationMultiplier * (amount-1))/2;
  group.position.z = -(separationMultiplier * (amount-1))/2;

  return group;
}

//Plane
let getPlane = (size) => {
  let geometry = new THREE.PlaneGeometry(size,size)
  let material = new THREE.MeshPhongMaterial({
    color: 'rgb(120,120,120)',
    side: THREE.DoubleSide,
  })
  let mesh = new THREE.Mesh(
    geometry,
    material
  );
  mesh.receiveShadow = true;
  
  return mesh;
}

//Sphere
let getSphere = (size) => {
  let geometry = new THREE.SphereGeometry(size,24,24)
  let material = new THREE.MeshBasicMaterial({
    color: 'rgb(255,255,255)'
  })
  let mesh = new THREE.Mesh(
    geometry,
    material
  );

  return mesh;
}

//Light
let getPointLight = (intensity) => {
  let light = new THREE.PointLight(0xffffff, intensity);
  light.castShadow = true;
 
  return light;
}

let update = (renderer, scene, camera, controls) => {
  renderer.render(
    scene,
    camera
  );

  // let plane = scene.getObjectByName('plane-1');
  // plane.rotation.y += 0.001;
  // plane.rotation.z += 0.001;

  // scene.traverse((child) => {
  //   child.scale.x += 0.001;
  // });

    controls.update();

  requestAnimationFrame(() => {
    update(renderer, scene, camera, controls);
  })
}

let scene = init();