'use strict'

class Cluster {
    constructor(maxRadius = 50) {
        this.maxRadius = maxRadius;
        this.needRotate = true;
    }
    gen() {
        const v = new THREE.Vector3(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5);
        const r = Math.random() * this.maxRadius;
        return v.normalize().multiplyScalar(r);
    }

    update(deltaTime) {
        if (this.needRotate && this.planets && this.planets.length && !this.planets[0].endPos) {
            this.axis = this.axis || new THREE.Vector3();
            this.axis.copy(this.focus.position).normalize().cross(this.focus.up)
            this.focus.rotateOnWorldAxis(this.axis, 0.15 * deltaTime);
        }
    }
    arrange(planets, anchor, scene) {
        this.focus = new THREE.Object3D();
        this.focus.position.copy(anchor);
        scene.add(this.focus);
        this.planets = planets;
        this.positions = [];

        while (this.positions.length < this.planets.length) {
            const v = this.gen();
            const pl = this.planets[this.positions.length];
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
    emphasize(on) {
        // this.planets.forEach((pl, i) => {
        //     pl.mesh.material.emissive = on ? new THREE.Color('#367c29') : new THREE.Color('black');
        //     // pl.mesh.material.emissiveIntesity = on ? 0.5 : 0.0;
        //     // pl.mesh.material.emissive = on ? new THREE.Color('black') : new THREE.Color('white');
        // });
    }
}