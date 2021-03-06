'use strict'

const galaxy = new Galaxy().read(jsonSource);

const scene = new THREE.Scene();
galaxy.nightMode(true);
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 10000);
camera.up.set(0, -1, 0);

const container = document.getElementById('three');
const renderer = new THREE.WebGLRenderer({ antialias: true, canvas: container });
console.log(renderer.domElement.clientWidth, renderer.domElement.clientHeight);
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

// scene.add(new THREE.HemisphereLight(0xffffbb, 0x080820, 1));
// setLight(new THREE.SpotLight(0xffffff, 1.5), 300, -300, 300);
// setLight(new THREE.SpotLight(0xbdebfa, 0.7), -200, -300, 100);
setLight(new THREE.SpotLight(0xfbeabe, 0.7), 100, -300, -200);
scene.add(new THREE.AmbientLight(0xffffff, 0.8));
// scene.add(new THREE.AmbientLight(0xfbeabe, 0.8));

camera.position.set(0, -200, 600);

galaxy.waitForShow(scene);

// ['distances', 'themes', 'sizes'].forEach(layoutName => {
//     document.getElementById(layoutName).addEventListener("click", (() => {
//         galaxy.changeLayout(layoutName);
//     }).bind(this));
//     for (let i = 1; i <= 10; ++i) {
//         document.getElementById(layoutName+i).addEventListener("mouseover", (() => {
//             galaxy.emphasizeLayout(layoutName, i);
//         }).bind(this));
//     }
// });

let raycaster = new THREE.Raycaster();
let mouse = new THREE.Vector2(-1000, -1000);
let screenPos = new THREE.Vector2();

const move = (ex, ey) => {
    screenPos.set(ex, ey);
    const x = (ex - container.offsetLeft) / container.width * 2 - 1;
    const y = -(ey - container.offsetTop) / container.height * 2 + 1;
    mouse.set(x, y);
};

container.addEventListener('touchmove', (event) => {
    move(event.targetTouches[0].clientX, event.targetTouches[0].clientY)
}, false);

container.addEventListener('mousemove', (event) => {
    move(event.clientX, event.clientY)
}, false);

document.addEventListener('touchstart', () => {
    if (projectLink.href !== '#') projectLink.click();
}, false);

document.addEventListener('mousedown', () => {
    if (projectLink.href !== '#') projectLink.click();
}, false);

const projectName = document.getElementById('project-name');
const projectImage = document.getElementById('project-image');
const projectBack = document.getElementById('project-back');
const projectLink = document.getElementById('project-link');
const projectDetails = document.getElementById('project-details');

let lastCameraPos;
var clock = new THREE.Clock();
const animate = (scene, camera, renderer, controls) => {

    galaxy.update(clock.getDelta());

    controls.update();

    raycaster.setFromCamera(mouse, camera);
    const inter = raycaster.intersectObjects(galaxy.planetsMeshes || []);
    if (inter.length > 0) {
        const planet = inter[0].object.planet;
        // marker.position.copy(inter[0].point);
        projectName.textContent = planet.project_name;
        projectBack.style.backgroundColor = planet.color1.getStyle();
        projectImage.src = planet.image || "";
        projectDetails.style.display = "";
        projectDetails.style.left = screenPos.x + "px";
        projectDetails.style.top = screenPos.y + "px";
        projectLink.href = planet.link;
    } else {
        projectDetails.style.display = "none";
        projectLink.href = "#";
    }

    // if (!lastCameraPos || camera.position.manhattanDistanceTo(lastCameraPos) > 0.001) {
    //     console.log(camera.position.toArray().map(x => Math.round(x * 1000) / 1000));//, camera.rotation);
    //     lastCameraPos = camera.position.clone();
    // }

    renderer.render(scene, camera);
    requestAnimationFrame(() => { animate(scene, camera, renderer, controls) });
}
animate(scene, camera, renderer, controls);
