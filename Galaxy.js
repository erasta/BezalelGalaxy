'use strict'

class Galaxy {
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
        if (this.planets) {
            this.planets.forEach(pl => {
                pl.show(scene);
            });
        } else {
            setTimeout(() => this.show(scene), 100);
        }
    }
}
