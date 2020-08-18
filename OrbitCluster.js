'use strict'

class OrbitCluster {
    constructor(orbitRadius) {
        this.orbitRadius = orbitRadius;
    }
    update(deltaTime) {
    }
    arrange(planets, scene) {
        this.focus = new THREE.Object3D();
        scene.add(this.focus);
        this.planets = planets;
        this.positions = [];

        while (this.positions.length < this.planets.length) {
            const pl = this.planets[this.positions.length];
            const v = new THREE.Vector3(Math.random() - 0.5, 0, Math.random() - 0.5);
            v.normalize().multiplyScalar(this.orbitRadius);
            if (this.positions.find((q, i) => q.distanceTo(v) < pl.radius + this.planets[i].radius + 2)) {
                continue;
            }
            this.positions.push(v);
        }

        return this;
    }
    move() {
        this.planets.forEach((pl, i) => {
            this.focus.attach(pl.mesh);
            pl.move(this.positions[i]);
        });
    }
}