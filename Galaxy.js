'use strict'

class Galaxy {
    read(json_url) {
        fetch(json_url)
            .then(response => {
                if (response.ok) return response.json();
            })
            .then(json => {
                this.create(json);
            });
        return this;
    }

    planetsByField(field) {
        const uniqValues = [...new Set(this.planets.map(pl => pl[field]))];
        const uniqSorted = uniqValues.sort((a, b) => parseInt(a) - parseInt(b));
        return uniqSorted.map(val => {
            return { val: val, planets: this.planets.filter(pl => pl[field] === val) };
        });
    }
    create(json) {
        console.log(json);
        this.planets = json.map(j => new Planet(j)); //.filter(pl => pl.distance === 3);
    }

    show(scene) {
        this.distances = this.planetsByField("distance");
        this.sizes = this.planetsByField("size");
        this.themes = this.planetsByField("theme");
        const maxDist = Math.max(...galaxy.distances.map(d => d.val));

        this.planets.forEach(pl => {
            pl.show(scene);
        });
        this.planetsMeshes = this.planets.map(pl => pl.mesh);
        const maxRadius = Math.max(...this.planets.map(pl => pl.radius));

        const minOrbit = 30;
        const orbitSize = (maxRadius * 2 + 2) * maxDist + minOrbit;
        console.log('orbit', minOrbit, orbitSize);
        this.orbit = new Orbit(orbitSize);
        this.orbit.show(scene);

        this.clusters = {
            sizes: this.orbit.circle(this.sizes.length).map((pos, i) => {
                return new Cluster().arrange(this.sizes[i].planets, pos, scene);
            }),
            themes: this.orbit.circle(this.themes.length).map((pos, i) => {
                return new Cluster().arrange(this.themes[i].planets, pos, scene);
            }),
            distances: this.orbit.circle(this.distances.length).map((pos, i) => {
                const rad = minOrbit + (this.orbit.radius - minOrbit) * this.distances[i].planets[0].distance / maxDist;
                return new OrbitCluster(rad).arrange(this.distances[i].planets, scene);
            }),
        }
        this.changeLayout('sizes');
    }
    changeLayout(newLayout) {
        this.clusters[newLayout.toLowerCase()].forEach(c => c.move());
        if(newLayout === 'distances') {
            // this.clusters[newLayout.toLowerCase()].forEach(c => c.foc());
        }
    }
    update(deltaTime) {
        if (this.planets) {
            this.planets.forEach(pl => pl.update(deltaTime));
        }
        if (this.clusters) {
            Object.keys(galaxy.clusters).forEach(k => {
                galaxy.clusters[k].forEach(c => {
                    c.update(deltaTime);
                });
            });
        }
    }

    waitForShow(scene) {
        if (this.planets) {
            this.show(scene);
        } else {
            setTimeout(() => this.waitForShow(scene), 100);
        }
    }
}
