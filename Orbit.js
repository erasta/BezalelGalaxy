'use strict'

class Orbit {
    constructor(radius) {
        this.radius = radius;
    }
    at(t) {
        return new THREE.Vector3(this.radius * Math.cos(t), 0, this.radius * Math.sin(t));
    }
    circle(num = 128, isClosed = false) {
        const arr = Array(num).fill().map((x, i) => this.at(Math.PI * 2 * i / num - 1));
        if (isClosed) arr.push(this.at(0));
        return arr;
    }
    show(scene) {
        const material = new THREE.LineBasicMaterial({ color: new THREE.Color('#ababab') });
        this.line = new THREE.LineLoop(new THREE.Geometry(), material);
        this.line.geometry.vertices = this.circle();
        scene.add(this.line);
        return this.line;
    }
}