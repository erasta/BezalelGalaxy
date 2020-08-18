'use strict'

class Cluster {
    constructor(maxRadius = 50, minRadius = 0, minDistance = 15) {
        this.maxRadius = maxRadius;
        this.minRadius = minRadius;
        this.minDistance = minDistance;
    }
    gen() {
        const v = new THREE.Vector3(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5);
        const r = Math.random() * (this.maxRadius - this.minRadius) + this.minRadius;
        return v.normalize().multiplyScalar(r);
    }
    generate(num = 10) {
        const ret = [];
        while (ret.length < num) {
            const v = this.gen();
            if (ret.find(q => q.distanceTo(v) < this.minDistance)) {
                continue;
            }
            ret.push(v);
        }
        return ret;
    }
    update(deltaTime) {
        if (this.planets && this.planets.length && !this.planets[0].endPos) {
            this.axis = this.axis || new THREE.Vector3();
            this.axis.copy(this.focus.position).normalize().cross(this.focus.up)
            this.focus.rotateOnWorldAxis(this.axis, 0.15 * deltaTime);
        }
    }
    arrange(planets, anchor, scene) {
        this.focus = new THREE.Object3D();
        this.focus.position.copy(anchor);
        scene.add(this.focus);
        this.positions = this.generate(planets.length);
        this.planets = planets;
        return this;
    }
    move() {
        this.planets.forEach((pl, i) => {
            this.focus.attach(pl.mesh);
            pl.move(this.positions[i]);
        });
    }
}