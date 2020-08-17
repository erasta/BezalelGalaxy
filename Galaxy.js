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
        this.planets = json.map(j => new Planet(j))
        this.distances = this.planetsByField("distance");
        this.sizes = this.planetsByField("size");
        this.themes = this.planetsByField("theme");
        this.ok = true;
    }

    show(scene) {
        this.planets.forEach(pl => {
            pl.show(scene);
        });
        this.orbit = new Orbit();
        this.orbit.show(scene);
        this.clusters = {
            distances: this.orbit.circle(this.distances.length).map((pos, i) => {
                return new Cluster().arrange(this.distances[i].planets, pos, scene);
            }),
            sizes: this.orbit.circle(this.sizes.length).map((pos, i) => {
                return new Cluster().arrange(this.sizes[i].planets, pos, scene);
            }),
            themes: this.orbit.circle(this.themes.length).map((pos, i) => {
                return new Cluster().arrange(this.themes[i].planets, pos, scene);
            })
        }
        this.changeLayout('sizes');
    }
    changeLayout(newLayout) {
        this.clusters[newLayout.toLowerCase()].forEach(c => c.move());
    }
    update(deltaTime) {
        if (this.planets) {
            this.planets.forEach(pl => pl.update(deltaTime));
        }
    }

    waitForShow(scene) {
        if (this.ok) {
            this.show(scene);
        } else {
            setTimeout(() => this.waitForShow(scene), 100);
        }
    }
}
