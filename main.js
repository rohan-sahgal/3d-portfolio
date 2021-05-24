import "./style.css";

import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { PlaneGeometry, BoxGeometry, MeshStandardMaterial } from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

// Will always need 1. Scene 2. Camera 3. Renderer

// Container that holds all objects, cameras, lights
const scene = new THREE.Scene();

// Perspective camera: mimics human eyes
// (FOV, aspect ratio, view frustrum start, view frustrum end)
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

// Currently, camera is in middle of screen
// camera.position.setZ(30);

// Renderer renders elements of the scene
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector("#bg"),
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

// renderer.render(scene, camera);

// OBJECT CREATION

const geometry = new THREE.TorusKnotGeometry(10, 2, 100, 16);
const material = new THREE.MeshStandardMaterial({
  color: 0x00aaff,
  wireframe: true,
});
const torus = new THREE.Mesh(geometry, material);

// scene.add(torus);

const pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(20, 20, 20);
scene.add(pointLight);

const ambientLight = new THREE.AmbientLight(0xffffff);
scene.add(ambientLight);

const lightHelper = new THREE.PointLightHelper(pointLight);
const gridHelper = new THREE.GridHelper(200, 50);
// scene.add(lightHelper, gridHelper);

const controls = new OrbitControls(camera, renderer.domElement);

function addStar() {
  const geometry = new THREE.SphereGeometry(0.12, 24, 24);
  const material = new THREE.MeshStandardMaterial({ color: 0xeeeeee });
  const star = new THREE.Mesh(geometry, material);

  const [x, y, z] = Array(3)
    .fill()
    .map(() => THREE.MathUtils.randFloatSpread(100, 50));

  star.position.set(x, y, z);
  scene.add(star);
}

Array(500).fill().forEach(addStar);

// Can pass in callback function here to be notified when image loads
const spaceTexture = new THREE.TextureLoader().load("space.jpg");
// scene.background = spaceTexture;

const rohanTexture = new THREE.TextureLoader().load("rohan.jpg");
const rohanPlane = new THREE.Mesh(
  new THREE.PlaneGeometry(0.75, 0.75, 1),
  new THREE.MeshBasicMaterial({ map: rohanTexture, side: THREE.DoubleSide })
);

scene.add(rohanPlane);

rohanPlane.position.x += 0.75;

rohanPlane.position.z -= 1;

// Ring

const ringTexture = new THREE.TextureLoader().load("halo-ring-texture.jpg");
const normalTexture = new THREE.TextureLoader().load("normal.jpg");

const ringGeometry = new THREE.CylinderGeometry(8, 8, 1, 50, 1, true);
const materialOuter = new THREE.MeshBasicMaterial({
  map: new THREE.TextureLoader().load("halo-ring-texture.jpg"),
  // normalMap: normalTexture,
  side: THREE.DoubleSide,
});

const materialInner = new THREE.MeshBasicMaterial({
  map: new THREE.TextureLoader().load("ring.png"),
  // color: 0x888888,
});

var ring = new THREE.Mesh(ringGeometry, materialOuter);
var meshInner = new THREE.Mesh(ringGeometry, materialInner);

ring.add(meshInner);
scene.add(ring);

// const ring = new THREE.Mesh(
//   ,
//   new THREE.MeshStandardMaterial({
//     color: 0x888888,
//     side: THREE.DoubleSide,
//     map: ringTexture,
//     // wireframe: true,
//   })
// );

scene.add(ring);
ring.position.z = -20;
ring.position.x = -10;
ring.position.y = -5;

//Moon

const moonTexture = new THREE.TextureLoader().load("moon.jpg");
// const normalTexture = new THREE.TextureLoader().load("normal.jpg");

const moon = new THREE.Mesh(
  new THREE.SphereGeometry(3, 32, 32),
  new THREE.MeshStandardMaterial({
    map: moonTexture,
    normalMap: normalTexture,
  })
);

scene.add(moon);
moon.position.z = 30;
moon.position.setX(-10);

function moveCamera() {
  const t = document.body.getBoundingClientRect().top;
  console.log(t);
  moon.rotation.x += 0.05;
  moon.rotation.y += 0.075;
  moon.rotation.z += 0.05;

  // rohanPlane.rotation.y += 0.01;
  rohanPlane.rotation.z += 3 / 4;
  console.log(rohanPlane.rotation.z);

  if (t <= 0) {
    camera.position.z = t * -0.01;
    camera.position.x = t * -0.0002;
    camera.rotation.y = t * -0.0002;
  } else {
    camera.position.z = t * 0.01;
    camera.position.x = t * 0.0002;
    camera.rotation.y = t * 0.0002;
  }
}

document.body.onscroll = moveCamera;

// Animation Loop
function animate() {
  requestAnimationFrame(animate);

  // torus.rotation.x += 0.005;
  // torus.rotation.y += 0.0025;
  // torus.rotation.z += 0.005;

  ring.rotation.y += 0.0025;
  // ring.rotation.x += 0.0025;

  controls.update();

  renderer.render(scene, camera);
}

animate();

moveCamera();
