'use strict'

class Planet {
    constructor(json) {
        const fields = json.fields;
        this.distance = parseInt(fields.distance);
        this.image = fields.image;
        this.project_name = fields.project_name;
        this.size = parseInt(fields.size);
        this.theme = parseInt(fields.theme);
    }
}
