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
};

const addPointLight = (x, y, z, intensity) => {
    const light = new THREE.PointLight(0xffffff, intensity, 1200);
    light.position.set(x, y, z);
    scene.add(light);
};

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
        coin.rotation.y += 0.03; // Slight rotation when not flipping
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

const text = {
    'ru': {
        'orel': 'ОРЕЛ',
        'reshka': 'РЕШКА',
        'btn': 'ВРАЩАТЬ'
    },
    'en': {
        'orel': 'HEAD',
        'reshka': 'TAIL',
        'btn': 'FLIP'
    },
};

function flipCoin() {
    requestAnimationFrame(function (timestamp) {
        if (flipping) {
            let elapsed = timestamp - flipStartTime;
            let progress = elapsed / flipDuration;
            if (progress < 1) {
                let yPosition = 13 + 37 * Math.sin(Math.PI * progress); // Up and down bounce
                let rotationProgress = Math.PI * 10 * progress; // Faster rotation
                coin.position.y = yPosition;
                coin.rotation.y = rotationProgress;
                flipCoin(); // Continue flip animation
            } else {
                flipping = false;
                coin.position.y = 13;
                coin.rotation.y = Math.PI * 10; // Set final position after flip
                const languageCode = window.Telegram.WebApp.initDataUnsafe.user.language_code || 'en';
                const result = (Math.random() < 0.5) ? text[languageCode].orel || text['en'].orel : text[languageCode].reshka || text['en'].reshka;
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

function displayBotUsername() {
    const resultTextElement = document.getElementById('flipButton');
    const languageCode = window.Telegram.WebApp.initDataUnsafe.user.language_code || 'en';
    resultTextElement.textContent = text[languageCode].btn;
}

// Call the function when the page loads
document.addEventListener('DOMContentLoaded', (event) => {
    const resultTextElement = document.getElementById('flipButton');
    const languageCode = window.Telegram.WebApp.initDataUnsafe.user.language_code || 'en';
    resultTextElement.textContent = text[languageCode].btn;

    const resultTextElement2 = document.getElementById('botName');
    const botName = window.Telegram.WebApp.initDataUnsafe.start_param || 'Unknown';

    resultTextElement2.textContent = botName;

});
