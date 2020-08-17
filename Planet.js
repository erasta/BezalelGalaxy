export class Planet {
    constructor(json) {
        const fields = json.fields;
        this.distance = parseInt(fields.distance);
        this.image = fields.image;
        this.project_name = fields.project_name;
        this.size = parseInt(fields.size);
        this.theme = parseInt(fields.theme);
    }

    show(scene, pos) {
        var material = new THREE.MeshStandardMaterial({});
        // var material = new THREE.MeshNormalMaterial();
        var mesh = new THREE.Mesh(new THREE.SphereGeometry(this.size, 32, 32), material);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        if (pos) {
            mesh.position = pos;
        } else {
            mesh.position.set((this.distance - 4) * 30, (this.theme - 4) * 30, 0);
        }
        scene.add(mesh);
        return mesh;
    }
}
