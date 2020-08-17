import { Planet } from './Planet.js';
import { Orbit } from './Orbit.js';

export class Galaxy {
    create(json_url) {
        fetch(json_url)
            .then(response => {
                if (response.ok) return response.json();
            })
            .then(json => {
                console.log(json);
                this.planets = json.map(j => new Planet(j))
            });
        return this;
    }

    show(scene) {
        this.planets.forEach(pl => {
            pl.show(scene);
        });
        this.orbit = new Orbit();
        this.orbit.show(scene);
    }

    waitForShow(scene) {
        if (this.planets) {
            this.show(scene);
        } else {
            setTimeout(() => this.show(scene), 100);
        }
    }
}
