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

    nightMode(mode = 'switch') {
        this.night = ((mode === 'switch') ? (!this.night) : (!!mode));
        scene.background = new THREE.Color(this.night ? '#000000' : '#ffffff');
        document.body.style.background = this.night ? '#000000' : '#ffffff';
    }

    pause() {
        controls.autoRotate = !controls.autoRotate;
        Object.keys(this.clusters).forEach(clusterName => {
            this.clusters[clusterName].forEach(c => c.needRotate = controls.autoRotate)
        });
    }
    planetsByField(field, fillEmpties = false) {
        let values = this.planets.map(pl => pl[field]);
        if (fillEmpties) {
            const m = Math.max(...values);
            values = values.concat([...Array(m).keys()].map(i => i + 1));
        }
        const uniqValues = [...new Set(values)];
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
        this.distances = this.planetsByField("distance", true);
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
                const c = new Cluster().arrange(this.sizes[i].planets, pos, scene);
                c.layoutIndex = this.sizes[i].val;
                return c;
            }),
            themes: this.orbit.circle(this.themes.length).map((pos, i) => {
                const c = new Cluster().arrange(this.themes[i].planets, pos, scene);
                c.layoutIndex = this.themes[i].val;
                return c;
            }),
            distances: this.distances.map(dist => {
                const rad = minOrbit + (this.orbit.radius - minOrbit) * dist.val / maxDist;
                const c = new OrbitCluster(rad, orbitSize).arrange(dist.planets, scene);
                c.layoutIndex = dist.val;
                return c;
            }),
        }
        this.changeLayout('sizes');
    }
    changeLayout(newLayout) {
        this.clusters[newLayout.toLowerCase()].forEach(c => c.move());
        if (newLayout !== 'distances') {
            this.clusters['distances'].forEach(c => c.moveOut());
        }
    }
    emphasizeLayout(layoutName, layoutIndex) {
        console.log(layoutName, layoutIndex);
        const oneOrbitLayout = (layoutName === 'sizes' || layoutName === 'themes');
        controls.autoRotate = !oneOrbitLayout;
        if (this.clusters) {
            ['sizes', 'themes'].forEach(clusterLayoutName => {
                this.clusters[clusterLayoutName].forEach(c => c.needRotate = controls.autoRotate)
            });
            this.clusters['distances'].forEach(c => {
                c.emphasize(c.layoutIndex === layoutIndex && 'distances' === layoutName);
            });
            this.planets.map(pl => {
                pl.mesh.material.emissive.set(0, 0, 0);
            });
            if (oneOrbitLayout) {
                this.clusters[layoutName].forEach(c => {
                    if (c.layoutIndex === layoutIndex) {
                        c.planets.forEach(pl => {
                            pl.mesh.material.emissive.set('green');
                        });
                    }
                    // c.emphasize(c.layoutIndex === layoutIndex && 'distances' === layoutName);
                });
            }
            // Object.keys(this.clusters).forEach(clusterLayoutName => {
            // });
        }
    }
    update(deltaTime) {
        if (this.planets) {
            this.planets.forEach(pl => pl.update(deltaTime));
        }
        if (this.clusters) {
            Object.keys(this.clusters).forEach(k => {
                this.clusters[k].forEach(c => {
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
