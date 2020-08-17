'use strict'

class Planet {
    constructor(json) {
        const fields = json.fields;
        this.distance = parseInt(fields.distance);
        this.image = fields.image;
        this.project_name = fields.project_name;
        this.size = parseInt(fields.size);
        this.theme = parseInt(fields.theme);
        Planet.materials = Planet.materials || this.themeColors();
    }

    show(scene, pos) {
        // var material = new THREE.MeshStandardMaterial({});
        // var material = new THREE.MeshNormalMaterial();
        this.mesh = new THREE.Mesh(new THREE.SphereGeometry(this.size, 32, 32), Planet.materials[this.theme]);
        this.mesh.castShadow = true;
        this.mesh.receiveShadow = true;
        if (pos) {
            this.mesh.position = pos;
        } else {
            this.mesh.position.set((this.distance - 4) * 30, (this.theme - 4) * 30, 0);
        }
        scene.add(this.mesh);
        return this.mesh;
    }

    // move(target) {
    //     this.startPos = this.mesh.position;
    //     this.endPos = this.mesh.position;
    // }
    update(deltaTime) {
        if (this.target && this.mesh) {
            // console.log(this.target.toArray().map(x => Math.round(x * 1000) / 1000), this.mesh.position.toArray().map(x => Math.round(x * 1000) / 1000));
            const way = new THREE.Vector3().subVectors(this.target, this.mesh.position);
            const len = way.length();
            if (len < 0.0001 || (100 * deltaTime / len) > 0.9999) {
                this.mesh.position.copy(this.target);
                this.target = undefined;
            } else {
                this.mesh.position.addScaledVector(way, (100 * deltaTime / len));
            }
        }
    }

    themeColors() {
        return [
            this.material(), // zero theme
            this.material(new THREE.Color("#ffaf8f"), new THREE.Color("#00aaa5")),
            this.material(new THREE.Color("#fc7342"), new THREE.Color("#5a5aff")),
            this.material(new THREE.Color("#9ff7ea"), new THREE.Color("#fc4312")),
            this.material(new THREE.Color("#bdbdff"), new THREE.Color("#fc276e")),
            this.material(new THREE.Color("#f9a2f9"), new THREE.Color("#0642ff")),
            this.material(new THREE.Color("#8ef4ca"), new THREE.Color("#e807be")),
            this.material(new THREE.Color("#ffb070"), new THREE.Color("#9721f4"))];
    }
    material(color1 = new THREE.Color("red"), color2 = new THREE.Color("purple")) {
        return new THREE.ShaderMaterial({
            uniforms: {
                color1: {
                    value: color1
                },
                color2: {
                    value: color2
                }
            },
            vertexShader: `
              varying vec2 vUv;

              void main() {
                vUv = uv;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
              }
            `,
            fragmentShader: `
              uniform vec3 color1;
              uniform vec3 color2;

              varying vec2 vUv;

              void main() {

                gl_FragColor = vec4(mix(color1, color2, vUv.y), 1.0);
              }
            `
        });
    }
}
