'use strict'

class OrbitCluster {
    constructor(orbitRadius, maxOrbit) {
        this.orbitRadius = orbitRadius;
        this.maxOrbit = maxOrbit;
        this.rotationSpeed = -this.maxOrbit / this.orbitRadius / 1500;// Math.random() / 100;
    }
    update(deltaTime) {
        if (this.orbit && this.endScale) {
            this.t += 0.8 * deltaTime;
            if (this.t > 0.9999) {
                this.orbit.line.scale.setScalar(this.endScale);
                this.startScale = this.endScale = this.t = undefined;
            } else {
                this.orbit.line.scale.setScalar(lerp(this.startScale, this.endScale, easeInOutCubic(this.t)));
            }
        }
        if (this.focus) {
            this.focus.rotateY(this.rotationSpeed);
        }
    }
    arrange(planets, scene) {
        this.orbit = new Orbit(this.orbitRadius);
        this.orbit.show(scene);
        this.orbit.line.scale.setScalar(this.maxOrbit / this.orbitRadius);
        this.focus = new THREE.Object3D();
        scene.add(this.focus);
        this.planets = planets;
        this.positions = [];

        while (this.positions.length < this.planets.length) {
            const pl = this.planets[this.positions.length];
            const v = this.orbit.at(Math.random() * Math.PI * 2);
            if (this.positions.find((q, i) => q.distanceTo(v) < pl.radius + this.planets[i].radius + 2)) {
                continue;
            }
            this.positions.push(v);
        }

        return this;
    }
    moveOrbitScale(newScale) {
        if (Math.abs(newScale - this.orbit.line.scale.x) > 0.0001) {
            this.startScale = this.orbit.line.scale.x;
            this.endScale = newScale;
            this.t = 0;
        } else {
            this.startScale = this.endScale = this.t = undefined;
        }
    }
    moveOut() {
        this.moveOrbitScale(this.maxOrbit / this.orbitRadius);
    }
    move() {
        this.moveOrbitScale(1);
        this.planets.forEach((pl, i) => {
            this.focus.attach(pl.mesh);
            pl.move(this.positions[i]);
        });
    }
    emphasize(on) {

    }
}