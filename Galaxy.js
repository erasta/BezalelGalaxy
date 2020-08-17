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
}
