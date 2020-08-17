'use strict'

const galaxy = new Galaxy().read('./planets.json');

const scene = new THREE.Scene();
scene.background = new THREE.Color(0.8, 0.8, 0.8);
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.up.set(0, -1, 0);

const container = document.getElementById('three');
const renderer = new THREE.WebGLRenderer({ antialias: true, canvas: container });
renderer.setSize(renderer.domElement.clientWidth, renderer.domElement.clientHeight);
THREEx.WindowResize(renderer, camera);

const controls = new THREE.OrbitControls(camera, renderer.domElement);

scene.castShadow = true;
scene.receiveShadow = true;
renderer.shadowMap.enabled = true;
const setLight = (obj, x, y, z) => {
    obj.position.set(x, y, z);
    obj.castShadow = true;
    scene.add(obj);
    // scene.add(new THREE.SpotLightHelper(obj));
    return obj;
};

scene.add(new THREE.HemisphereLight(0xffffbb, 0x080820, 1));
setLight(new THREE.SpotLight(0xffffff, 1.5), 300, -300, 300);
setLight(new THREE.SpotLight(0xbdebfa, 0.7), -200, -300, 100);
setLight(new THREE.SpotLight(0xfbeabe, 0.7), 100, -300, -200);
scene.add(new THREE.AmbientLight(0xfbeabe, 0.5));

camera.position.set(0, -70, -300);

galaxy.waitForShow(scene);
document.getElementById('distances').addEventListener("click", (() => {
    galaxy.changeLayout('distances');
}).bind(this));
document.getElementById('themes').addEventListener("click", (() => {
    galaxy.changeLayout('themes');
}).bind(this));
document.getElementById('sizes').addEventListener("click", (() => {
    galaxy.changeLayout('sizes');
}).bind(this));

// let lastCameraPos;
var clock = new THREE.Clock();
const animate = (scene, camera, renderer, controls) => {

    galaxy.update(clock.getDelta());

    controls.update();

    // if (!lastCameraPos || camera.position.manhattanDistanceTo(lastCameraPos) > 0.001) {
    //     console.log(camera.position.toArray().map(x => Math.round(x * 1000) / 1000));//, camera.rotation);
    //     lastCameraPos = camera.position.clone();
    // }

    renderer.render(scene, camera);
    requestAnimationFrame(() => { animate(scene, camera, renderer, controls) });
}
animate(scene, camera, renderer, controls);
