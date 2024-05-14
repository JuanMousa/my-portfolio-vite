import * as THREE from "three";
import * as dat from "dat.gui";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { mapLinear } from "three/src/math/MathUtils.js";
console.log(OrbitControls);

const gui = new dat.GUI();
const world = {
  plane: {
    width: 10,
    height: 10,
    widthAssagmnet: 10,
    heightAssagment: 10,
  },
};
gui.add(world.plane, "width", 1, 20).onChange(generatePlane);
gui.add(world.plane, "height", 1, 20).onChange(generatePlane);
gui.add(world.plane, "widthAssagmnet", 1, 20).onChange(generatePlane);
gui.add(world.plane, "heightAssagment", 1, 20).onChange(generatePlane);

function generatePlane() {
  planeMesh.geometry.dispose();
  planeMesh.geometry = new THREE.PlaneGeometry(
    world.plane.width,
    world.plane.height,
    world.plane.widthAssagmnet,
    world.plane.heightAssagment
  );
  
  const { array } = planeMesh.geometry.attributes.position;
  
  for (let i = 0; i < array.length; i++) {
    const x = array[i];
    const y = array[i + 1];
    const z = array[i + 2];
    
    array[i + 2] = z + Math.random(); // to make it fuzzy
  }
}

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(devicePixelRatio);
document.body.appendChild(renderer.domElement);

new OrbitControls(camera,renderer.domElement)

camera.position.z = 5;

const planeGeometry = new THREE.PlaneGeometry(5, 5, 10, 10);
const planeMaterial = new THREE.MeshPhongMaterial({
  color: 0x68d2e8,
  side: THREE.DoubleSide,
  flatShading: true,
});
const planeMesh = new THREE.Mesh(planeGeometry, planeMaterial);
scene.add(planeMesh);

const { array } = planeMesh.geometry.attributes.position;

for (let i = 0; i < array.length; i++) {
  const x = array[i];
  const y = array[i + 1];
  const z = array[i + 2];
  
  array[i + 2] = z + Math.random(); // to make it fuzzy
  
  // console.log(array[i]);
}

const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(0, 0, 1);
scene.add(light);

const backLight = new THREE.DirectionalLight(0xffffff, 1);
backLight.position.set(0, 0, -1);
scene.add(backLight);

function animate() {
  requestAnimationFrame(animate);
  // planeMesh.rotation.x += 0.01;
  renderer.render(scene, camera);
}

animate();


const mouse = {
  x: undefined,
  y: undefined
}
addEventListener("mousemove", (event) => {
    mouse.x = (event.clientX / innerWidth) * 2 - 1 // sudty this one
    mouse.y = -(event.clientY / innerHeight) * 2 + 1
  console.log(mouse);
})
console.log("1:18 minute")