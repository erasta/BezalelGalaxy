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
    arrange(planets, anchor) {
        const positions = this.generate(planets.length);
        planets.forEach((pl, i) => {
            pl.move(positions[i].add(anchor));
        });
    }
}