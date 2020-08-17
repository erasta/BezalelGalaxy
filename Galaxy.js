import { Planet } from './Planet.js';
import { Orbit } from './Orbit.js';
import { Cluster } from './Cluster.js';

export class Galaxy {
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
        return uniqValues.map(val => {
            return { val: val, planets: this.planets.filter(pl => pl[field] === val) };
        });
    }
    create(json) {
        console.log(json);
        this.planets = json.map(j => new Planet(j))
        this.distances = this.planetsByField("distance");
        this.sizes = this.planetsByField("size");
        this.themes = this.planetsByField("theme");
    }

    show(scene) {
        this.planets.forEach(pl => {
            pl.show(scene);
        });
        this.orbit = new Orbit();
        this.orbit.show(scene);
    }
    changeLayout(newLayout) {
        const lay = newLayout.toLowerCase()
        if (lay === 'distances') {
            this.orbit.circle(this.distances.length).map((pos, i) => {
                new Cluster().arrange(this.distances[i].planets, pos);
            })
        }
        if (lay === 'sizes') {
            this.orbit.circle(this.sizes.length).map((pos, i) => {
                new Cluster().arrange(this.sizes[i].planets, pos);
            })
        }
        if (lay === 'themes') {
            this.orbit.circle(this.themes.length).map((pos, i) => {
                new Cluster().arrange(this.themes[i].planets, pos);
            })
        }
    }

    waitForShow(scene) {
        if (this.planets) {
            this.show(scene);
        } else {
            setTimeout(() => this.show(scene), 100);
        }
    }
}
