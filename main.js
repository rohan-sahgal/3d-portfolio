import "./style.css";
import rohanURL from "./src/rohan.jpg";
import moonURL from "./src/moon.jpg";
import haloInteriorURL from "./src/halo-ring-texture.jpg";
import haloExteriorURL from "./src/ring.png";
import normalURL from "./src/normal.jpg";
import spaceURL from "./src/space.jpg";
import faviconURL from "./src/favicon-32x32.png";

import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { PlaneGeometry, BoxGeometry, MeshStandardMaterial } from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

// FAVICON LOGIC

var link = document.querySelector("link[rel~='icon']");
if (!link) {
  link = document.createElement("link");
  link.rel = "icon";
  document.getElementsByTagName("head")[0].appendChild(link);
}
link.href = faviconURL;

// SCENE, CAMERA, RENDERER

/*    In Three.js, we will always need:
          1. Scene 
          2. Camera 
          3. Renderer                     */

//  Scene: container that holds all objects, cameras, lights
const scene = new THREE.Scene();

// Perspective camera: mimics human eyes
// Arguments: (FOV, aspect ratio, view frustrum start, view frustrum end)
// Currently, camera position is in middle of screen (0, 0, 0)
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

// Renderer renders elements of the scene
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector("#bg"),
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

// OBJECT CREATION

// Torus

const torusGeometry = new THREE.TorusKnotGeometry(10, 2, 100, 16);
const torusMaterial = new THREE.MeshStandardMaterial({
  color: 0x00aaff,
  wireframe: true,
});
const torus = new THREE.Mesh(torusGeometry, torusMaterial);

// scene.add(torus);

// Lighting

const pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(20, 20, 20);
scene.add(pointLight);

const ambientLight = new THREE.AmbientLight(0xffffff);
scene.add(ambientLight);

// Helpers

const lightHelper = new THREE.PointLightHelper(pointLight);
const gridHelper = new THREE.GridHelper(200, 50);
// scene.add(lightHelper, gridHelper);

const controls = new OrbitControls(camera, renderer.domElement);

// Logic for adding stars
function addStar() {
  const geometry = new THREE.SphereGeometry(0.12, 24, 24);
  const material = new THREE.MeshStandardMaterial({ color: 0xeeeeee });
  const star = new THREE.Mesh(geometry, material);

  const [x, y, z] = Array(3)
    .fill()
    .map(() => THREE.MathUtils.randFloatSpread(125, 50));

  star.position.set(x, y, z);
  scene.add(star);
}

Array(700).fill().forEach(addStar);

// Can pass in callback function here to be notified when image loads
const spaceTexture = new THREE.TextureLoader().load(spaceURL);
// scene.background = spaceTexture;

// Image plane

const rohanTexture = new THREE.TextureLoader().load(rohanURL);
const rohanPlane = new THREE.Mesh(
  new THREE.PlaneGeometry(0.55, 0.55, 1),
  new THREE.MeshBasicMaterial({ map: rohanTexture, side: THREE.DoubleSide })
);

scene.add(rohanPlane);

rohanPlane.position.x += 0.4;
rohanPlane.position.z -= 1;
rohanPlane.position.y += 0.1;

// Ring

const innerRingTexture = new THREE.TextureLoader().load(haloInteriorURL);
const outerRingTexture = new THREE.TextureLoader().load(haloExteriorURL);

const ringGeometry = new THREE.CylinderGeometry(8, 8, 1, 50, 1, true);
const materialOuter = new THREE.MeshBasicMaterial({
  map: innerRingTexture,
  side: THREE.DoubleSide,
});

const materialInner = new THREE.MeshBasicMaterial({
  map: outerRingTexture,
});

var ring = new THREE.Mesh(ringGeometry, materialOuter);
var meshInner = new THREE.Mesh(ringGeometry, materialInner);

ring.add(meshInner);
scene.add(ring);

scene.add(ring);
ring.position.z = -20;
ring.position.x = -10;
ring.position.y = -5;

//Moon

const moonTexture = new THREE.TextureLoader().load(moonURL);
const normalTexture = new THREE.TextureLoader().load(normalURL);

const moon = new THREE.Mesh(
  new THREE.SphereGeometry(3, 32, 32),
  new THREE.MeshStandardMaterial({
    map: moonTexture,
    normalMap: normalTexture,
  })
);

scene.add(moon);
moon.position.z = 40;
moon.position.setX(-8);

function moveCamera() {
  const t = document.body.getBoundingClientRect().top;

  moon.rotation.y += 0.075;

  rohanPlane.rotation.z += Math.PI / 8;
  rohanPlane.rotation.y += Math.PI / 32;
  rohanPlane.rotation.x += Math.PI / 32;

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

  const canvas = renderer.domElement;
  camera.aspect = canvas.clientWidth / canvas.clientHeight;
  camera.updateProjectionMatrix();

  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);

  // Rotation logic for rohanplane
  // Between 0.001 and pi I want it to rotate counter clockwise
  // Between pi and 2pi i want it to rotate clockwise
  if (
    rohanPlane.rotation.z % (2 * Math.PI) > 0.01 &&
    rohanPlane.rotation.z % (2 * Math.PI) <= Math.PI
  ) {
    rohanPlane.rotation.z -= 0.007;
  } else if (
    rohanPlane.rotation.z % (2 * Math.PI) > Math.PI &&
    rohanPlane.rotation.z % (2 * Math.PI) < 2 * Math.PI
  ) {
    rohanPlane.rotation.z += 0.007;
  }

  if (
    rohanPlane.rotation.x % (2 * Math.PI) > 0.01 &&
    rohanPlane.rotation.x % (2 * Math.PI) <= Math.PI
  ) {
    rohanPlane.rotation.x -= 0.007;
  } else if (
    rohanPlane.rotation.x % (2 * Math.PI) > Math.PI &&
    rohanPlane.rotation.x % (2 * Math.PI) < 2 * Math.PI
  ) {
    rohanPlane.rotation.x += 0.007;
  }

  if (
    rohanPlane.rotation.y % (2 * Math.PI) > 0.01 &&
    rohanPlane.rotation.y % (2 * Math.PI) <= Math.PI
  ) {
    rohanPlane.rotation.y -= 0.007;
  } else if (
    rohanPlane.rotation.y % (2 * Math.PI) > Math.PI &&
    rohanPlane.rotation.y % (2 * Math.PI) < 2 * Math.PI
  ) {
    rohanPlane.rotation.y += 0.007;
  }

  ring.rotation.y += 0.0035;
  ring.rotation.z += 0.0005;
  // ring.rotation.x += 0.0025;

  moon.rotation.y += 0.0025;

  controls.update();

  renderer.render(scene, camera);
}

animate();

function onDocumentMouseMove(event) {
  console.log("MOVE");
}
