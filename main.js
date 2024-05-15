import * as THREE from "three";
import gsap from "gsap";
import * as dat from "dat.gui";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { mapLinear } from "three/src/math/MathUtils.js";

const gui = new dat.GUI();
const world = {
  plane: {
    width: 400,
    height: 400,
    widthAssagmnet: 50,
    heightAssagment: 50,
  },
};
gui.add(world.plane, "width", 1, 50).onChange(generatePlane);
gui.add(world.plane, "height", 1, 50).onChange(generatePlane);
gui.add(world.plane, "widthAssagmnet", 1, 50).onChange(generatePlane);
gui.add(world.plane, "heightAssagment", 1, 50).onChange(generatePlane);


function generatePlane() {
  planeMesh.geometry.dispose();
  planeMesh.geometry = new THREE.PlaneGeometry(
    world.plane.width,
    world.plane.height,
    world.plane.widthAssagmnet,
    world.plane.heightAssagment
  );

  // vertices position randomazition
  const { array } = planeMesh.geometry.attributes.position;

  for (let i = 0; i < array.length; i++) {
    const x = array[i];
    const y = array[i + 1];
    const z = array[i + 2];

    array[i + 2] = z + Math.random(); // to make it fuzzy
  }
  
  // color attribute 
  const color = [];
  for (let i = 0; i < planeMesh.geometry.attributes.position.count; i++) {
    color.push(0, 0.19, 0.4);
  }
  planeMesh.geometry.setAttribute(
    "color",
    new THREE.BufferAttribute(new Float32Array(color), 3)
  );
}

// console.log(planeMesh.geometry.attributes.position);

const rayCaster = new THREE.Raycaster();
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

new OrbitControls(camera, renderer.domElement);
camera.position.z = 50;

const planeGeometry = new THREE.PlaneGeometry(
  world.plane.width,
  world.plane.height,
  world.plane.widthAssagmnet,
  world.plane.heightAssagment
);
const planeMaterial = new THREE.MeshPhongMaterial({
  side: THREE.DoubleSide,
  flatShading: true,
  vertexColors: true,
});
const planeMesh = new THREE.Mesh(planeGeometry, planeMaterial);
scene.add(planeMesh);

// object distructure
const { array } = planeMesh.geometry.attributes.position;
const randomValues = [];
for (let i = 0; i < array.length; i++) {

  if (i % 3 === 0) {

    const x = array[i];
    const y = array[i + 1];
    const z = array[i + 2];
    
    array[i] = x + (Math.random() - 0.05 * 3);
    array[i + 1] = y + (Math.random() - 0.05) * 6;
    array[i + 2] = z + (Math.random() - 0.5) * 9 ; // to make it fuzzy
  }
  randomValues.push(Math.random() - 0.5)
}

console.log(randomValues);
// add normal value for position
planeMesh.geometry.attributes.position.randomValues = randomValues;
// here i add the original position
planeMesh.geometry.attributes.position.originalPosition = planeMesh.geometry.attributes.position.array;
console.log(planeMesh.geometry.attributes.position)
// the new color for planMesh
const color = [];
for (let i = 0; i < planeMesh.geometry.attributes.position.count; i++) {
  color.push(0, 0.19, 0.4);
}
planeMesh.geometry.setAttribute(
  "color",
  new THREE.BufferAttribute(new Float32Array(color), 3)
);

const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(0, 1, 1);
scene.add(light);

const backLight = new THREE.DirectionalLight(0xffffff, 1);
backLight.position.set(0, 0, -1);
scene.add(backLight);

const mouse = {x: undefined, y: undefined,};

// to make the move
let frame = 0; 
function animate() {
  requestAnimationFrame(animate);
  // planeMesh.rotation.x += 0.01;
  renderer.render(scene, camera);
  frame += 0.01;
  const { array, originalPosition, randomValues} = planeMesh.geometry.attributes.position;
  for (let i = 0; i < array.length; i += 3) {
    // x
    array[i] = originalPosition[i] + Math.cos(frame + randomValues[i]) * 0.003;
    array[i + 1] = originalPosition[i + 1] + Math.cos(frame + randomValues[i + 1]) * 0.003;

    planeMesh.geometry.attributes.position.needsUpdate = true;
  }

  // laiser point
  rayCaster.setFromCamera(mouse, camera);
  const intersects = rayCaster.intersectObject(planeMesh);

  if (intersects.length > 0) {
    const { color } = intersects[0].object.geometry.attributes;
    // vertesis 1
    color.setX(intersects[0].face.a, 0.1);
    color.setY(intersects[0].face.a, 0.5);
    color.setZ(intersects[0].face.a, 1);

    // vertesis 2
    color.setX(intersects[0].face.b, 0.1);
    color.setY(intersects[0].face.b, 0.5);
    color.setZ(intersects[0].face.b, 1);

    // vertesis 3
    color.setX(intersects[0].face.c, 0.1);
    color.setY(intersects[0].face.c, 0.5);
    color.setZ(intersects[0].face.c, 1);

    intersects[0].object.geometry.attributes.color.needsUpdate = true;

    const initialColor = { r: 0, g: 0.19, b: 0.4 };

    const hoverColor = { r: 0.1, g: 0.5, b: 1 };

    gsap.to(hoverColor, {
      r: initialColor.r,
      g: initialColor.g,
      b: initialColor.b,
      duration: 1,
      onUpdate: () => {
        color.setX(intersects[0].face.a, hoverColor.r);
        color.setY(intersects[0].face.a, hoverColor.g);
        color.setZ(intersects[0].face.a, hoverColor.b);

        // vertesis 2
        color.setX(intersects[0].face.b, hoverColor.r);
        color.setY(intersects[0].face.b, hoverColor.g);
        color.setZ(intersects[0].face.b, hoverColor.b);

        // vertesis 3
        color.setX(intersects[0].face.c, hoverColor.r);
        color.setY(intersects[0].face.c, hoverColor.g);
        color.setZ(intersects[0].face.c, hoverColor.b);
      },
    });
  }
}

animate();

addEventListener("mousemove", (event) => {
  mouse.x = (event.clientX / innerWidth) * 2 - 1; // sudty this one
  mouse.y = -(event.clientY / innerHeight) * 2 + 1;
});


console.log("2:13")