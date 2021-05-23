import "./style.css";

import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

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

// Renderer renders elements of the scene
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector("#bg"),
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

// Currently, camera is in middle of screen
camera.position.setZ(30);

renderer.render(scene, camera);

// OBJECT CREATION

const geometry = new THREE.TorusKnotGeometry(10, 3, 100, 16);
const material = new THREE.MeshStandardMaterial({
  color: 0x00aaff,
  wireframe: true,
});
const torus = new THREE.Mesh(geometry, material);

scene.add(torus);

const pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(20, 20, 20);
scene.add(pointLight);

const ambientLight = new THREE.AmbientLight(0xffffff);
scene.add(ambientLight);

const lightHelper = new THREE.PointLightHelper(pointLight);
const gridHelper = new THREE.GridHelper();
// scene.add(lightHelper);

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);

  torus.rotation.x += 0.005;
  torus.rotation.y += 0.0025;
  torus.rotation.z += 0.005;
}

animate();
