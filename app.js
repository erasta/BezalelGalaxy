'use strict'

const galaxy = new Galaxy().read('./planets.json');

const scene = new THREE.Scene();
scene.background = new THREE.Color(0.8, 0.8, 0.8);
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 10000);
camera.up.set(0, -1, 0);

const container = document.getElementById('three');
const renderer = new THREE.WebGLRenderer({ antialias: true, canvas: container });
renderer.setSize(renderer.domElement.clientWidth, renderer.domElement.clientHeight);
// THREEx.WindowResize(renderer, camera);

const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.autoRotate = true;
controls.autoRotateSpeed = 0.5;

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

camera.position.set(0, -150, -450);

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

let raycaster = new THREE.Raycaster();
let mouse = new THREE.Vector2();
let screenPos = new THREE.Vector2();

container.addEventListener('mousemove', (event) => {
    screenPos.set(event.clientX, event.clientY);
    const x = (event.clientX - container.offsetLeft) / container.width * 2 - 1;
    const y = -(event.clientY - container.offsetTop) / container.height * 2 + 1;
    mouse.set(x, y);
}, false);

// const marker = new THREE.Mesh(new THREE.SphereGeometry());
// scene.add(marker);

const projectName = document.getElementById('project-name');
const projectImage = document.getElementById('project-image');
const projectDetails = document.getElementById('project-details');

// let lastCameraPos;
var clock = new THREE.Clock();
const animate = (scene, camera, renderer, controls) => {

    galaxy.update(clock.getDelta());

    controls.update();

    raycaster.setFromCamera(mouse, camera);
    const inter = raycaster.intersectObjects(galaxy.planetsMeshes || []);
    if (inter.length > 0) {
        // marker.position.copy(inter[0].point);
        projectName.textContent = inter[0].object.planet.project_name;
        projectDetails.style.display = "";
        projectDetails.style.left = screenPos.x + "px";
        projectDetails.style.top = screenPos.y + "px";
        projectImage.src = inter[0].object.planet.image || "";
    } else {
        projectDetails.style.display = "none";
    }

    // if (!lastCameraPos || camera.position.manhattanDistanceTo(lastCameraPos) > 0.001) {
    //     console.log(camera.position.toArray().map(x => Math.round(x * 1000) / 1000));//, camera.rotation);
    //     lastCameraPos = camera.position.clone();
    // }

    renderer.render(scene, camera);
    requestAnimationFrame(() => { animate(scene, camera, renderer, controls) });
}
animate(scene, camera, renderer, controls);
