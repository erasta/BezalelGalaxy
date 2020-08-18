'use strict'

class OrbitCluster {
    constructor(orbitRadius) {
        this.orbitRadius = orbitRadius;
    }
    update(deltaTime) {
    }
    arrange(planets, scene) {
        this.orbit = new Orbit(this.orbitRadius);
        this.focus = this.orbit.show(scene);
        this.focus.visible = false;
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
    move() {
        this.focus.visible = true;
        this.planets.forEach((pl, i) => {
            this.focus.attach(pl.mesh);
            pl.move(this.positions[i]);
        });
    }
}