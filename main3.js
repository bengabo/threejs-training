const init = () => {
  let scene = new THREE.Scene();
  let gui = new dat.GUI();

  let enableFog = false;
  if (enableFog) {
    scene.fog = new THREE.FogExp2(0xffffff, 0.2)
  }

  //Light
  let directionalLight = getDirectionalLight(1);
  directionalLight.position.x = 13;
  directionalLight.position.y = 10;
  directionalLight.position.z = 10;
  directionalLight.intensity = 2;
  // directionalLight.penumbra = 0.5;
  let ambientLight = getAmbientLight(4);

  gui.add(directionalLight, 'intensity', 0, 10);
  gui.add(directionalLight.position, 'x', 0, 20);
  gui.add(directionalLight.position, 'y', 0, 10);
  gui.add(directionalLight.position, 'z', 0, 20);
  // gui.add(directionalLight, 'penumbra', 0, 1 );

  //Sphere
  let sphere = getSphere(0.05);

  //Box grid
  let boxGrid = getBoxGrid(10, 1.5); 
  let helper = new THREE.CameraHelper(directionalLight.shadow.camera);

  //Plane
  let plane = getPlane(30);
  plane.name = 'plane-1';
  plane.rotation.x = Math.PI/2; //Radian s are used
  // plane.position.y = 1;

  scene.add(plane);
  directionalLight.add(sphere)
  scene.add(directionalLight);
  scene.add(ambientLight);
  scene.add(boxGrid);
  scene.add(helper);

  //Camera
  let camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth/window.innerHeight,
    1, //Near clipping plan
    1000 //Far clipping plan
  );
  camera.position.x = 5;
  camera.position.y = 10;
  camera.position.z = 15;

  camera.lookAt(new THREE.Vector3(0,0,0))
  
  let renderer = new THREE.WebGLRenderer({antialias: true});
  renderer.shadowMap.enabled = true;
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor('rgb(120,120,120)');
  document.getElementById('webgl').appendChild(renderer.domElement);

  let controls = new THREE.OrbitControls(camera, renderer.domElement);

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

//Point light
let getPointLight = (intensity) => {
  let light = new THREE.PointLight(0xffffff, intensity);
  light.castShadow = true;
  
  light.shadow.bias = 0.001;
  light.shadowMapWidth = 2048;
  light.shadowMapHeight = 2048;

  return light;
}

//Spot light
let getSpotLight = (intensity) => {
  let light = new THREE.SpotLight(0xffffff, intensity);
  light.castShadow = true;

  light.shadow.bias = 0.001;
  light.shadow.mapSize.width = 2048;
  light.shadow.mapSize.height = 2048;

  return light;
}
  
//Directional light
let getDirectionalLight = (intensity) => {
  let light = new THREE.DirectionalLight(0xffffff, intensity);
  light.castShadow = true;

  light.shadow.bias = 0.001;
  light.shadow.mapSize.width = 2048;
  light.shadow.mapSize.height = 2048;

  light.shadow.camera.left = 20;
  light.shadow.camera.bottom = -20;
  light.shadow.camera.right = -20;
  light.shadow.camera.top = 20;

  return light;
}

//Point light
let getAmbientLight = (intensity) => {
  let light = new THREE.AmbientLight('rgb(10, 30, 50)', intensity);

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