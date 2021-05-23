import "./style.css";

import * as THREE from "three";

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
