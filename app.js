import { Galaxy } from './galaxy.js';

const galaxy = new Galaxy().create('/planets.json');

const scene = new THREE.Scene();
scene.background = new THREE.Color(0.4, 0.4, 0.4);
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.up.set(0, -1, 0);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
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

setLight(new THREE.SpotLight(0xffffff, 1.5), 300, -300, 300);
setLight(new THREE.SpotLight(0xbdebfa, 0.7), -200, -300, 100);
setLight(new THREE.SpotLight(0xfbeabe, 0.7), 100, -300, -200);
scene.add(new THREE.AmbientLight(0xfbeabe, 0.5));

camera.position.set(0, 0, -300);

galaxy.show(scene);

let lastCameraPos;
const animate = (scene, camera, renderer, controls) => {
    requestAnimationFrame(() => { animate(scene, camera, renderer, controls) });
    controls.update();

    if (!lastCameraPos || camera.position.manhattanDistanceTo(lastCameraPos) > 0.001) {
        console.log(camera.position.toArray().map(x => Math.round(x * 1000) / 1000));//, camera.rotation);
        lastCameraPos = camera.position.clone();
    }

    renderer.render(scene, camera);
}
animate(scene, camera, renderer, controls);
