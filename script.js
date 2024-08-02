import * as THREE from "https://cdn.skypack.dev/three@0.129.0/build/three.module.js";
import { OrbitControls } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById("container3D").appendChild(renderer.domElement);

scene.add(new THREE.AmbientLight(0xffffff, 0.5));


const addDirectionalLight = (x, y, z, intensity) => {
    const light = new THREE.DirectionalLight(0xffffff, intensity);
    light.position.set(x, y, z);
    scene.add(light);
  }

  // Функция для добавления точечного света с экстремальной интенсивностью
  const addPointLight = (x, y, z, intensity) => {
    const light = new THREE.PointLight(0xffffff, intensity, 1200);
    light.position.set(x, y, z);
    scene.add(light);
  }

  // Добавляем направленные и точечные света с очень высокой интенсивностью
  addDirectionalLight(75, 75, 75, 10);
  addDirectionalLight(-75, 75, 75, 10);
  addPointLight(0, 75, 25, 8);
  addPointLight(0, -75, 25, 8);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableZoom = false;
controls.enableRotate = false;

camera.position.set(0, 0, 100);
controls.update();


let coin = null;
const loader = new GLTFLoader();
loader.load('scene.gltf', function (gltf) {
    coin = gltf.scene;
    coin.scale.set(15, 15, 15);
    coin.position.y = 13;
    scene.add(coin);
    document.body.classList.remove('hidden');
    animate();
}, undefined, function (error) {
    console.error("An error occurred while loading the model", error);
});

function animate() {
    requestAnimationFrame(animate);
    if (!flipping && coin) {
        coin.rotation.y += 0.03;  // Небольшое вращение монеты, когда не происходит flip
    }
    renderer.render(scene, camera);
}


let flipping = false;
let flipStartTime = 0;
const flipDuration = 2000; // Duration of the flip in milliseconds

document.getElementById("flipButton").addEventListener("click", function () {
    if (!flipping && coin) {
        flipping = true;
        flipStartTime = performance.now();
        flipCoin();
    }
});

function flipCoin() {
    requestAnimationFrame(function(timestamp) {
        if (flipping) {
            let elapsed = timestamp - flipStartTime;
            let progress = elapsed / flipDuration;
            if (progress < 1) {
                let yPosition = 13 + 37 * Math.sin(Math.PI * progress); // Подскок вверх и вниз
                let rotationProgress = Math.PI * 10 * progress; // Более быстрое вращение
                coin.position.y = yPosition;
                coin.rotation.y = rotationProgress;
                flipCoin(); // Продолжить анимацию flip
            } else {
                flipping = false;
                coin.position.y = 13;
                coin.rotation.y = Math.PI * 10; // Установить окончательное положение монеты после flip
                let result = (Math.random() < 0.5) ? "Head" : "Tail";
                document.getElementById("resultText").textContent = result;
                document.getElementById("resultText").style.display = 'block';
            }
        }
    });
}


window.addEventListener("resize", function () {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});