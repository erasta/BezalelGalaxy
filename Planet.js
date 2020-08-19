'use strict'

class Planet {
    constructor(json) {
        const fields = json.fields;
        this.image = fields.image;
        this.project_name = fields.project_name;
        this.link = json.link;
        this.distance = parseInt(fields.distance);
        this.size = parseInt(fields.size);
        this.theme = parseInt(fields.theme);
        this.radius = this.sphereSize(this.size) * 10;
        Planet.colors = Planet.colors || this.themeColors();
        [this.color1, this.color2] = Planet.colors[this.theme];
        // Planet.materials = Planet.materials || this.themeMaterials();
    }

    show(scene, pos) {
        // var material = new THREE.MeshStandardMaterial({});
        // var material = new THREE.MeshNormalMaterial();
        const geometry = new THREE.SphereGeometry(this.radius, 32, 32);
        this.mesh = new THREE.Mesh(geometry, new THREE.MeshLambertMaterial({ vertexColors: true }));
        geometry.faces.forEach(face => {
            face.vertexColors = [face.a, face.b, face.b].map(a => {
                const alpha = (geometry.vertices[a].y / this.radius + 1) / 2;
                return this.color1.clone().lerp(this.color2, alpha);
            });
        });
        // this.mesh = new THREE.Mesh(new THREE.SphereGeometry(this.radius, 32, 32), Planet.materials[this.theme]);
        this.mesh.planet = this;
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

    sphereSize(sz) {
        if (!Planet.sizes) {
            Planet.sizes = [0, 15, 25, 32.5, 40, 47.5, 55, 62.5, 70, 77.5, 85];
            Planet.sizes = Planet.sizes.map(s => s / Math.max(...Planet.sizes));
        }
        return Planet.sizes[sz];
    }

    move(target) {
        this.startPos = this.mesh.position.clone();
        this.endPos = target.clone();
        this.t = this.afterFirstTime ? 0 : 1;
        this.afterFirstTime = true;
    }
    update(deltaTime) {
        if (this.mesh && this.endPos) {
            this.t += 0.8 * deltaTime;
            if (this.t > 0.9999) {
                this.mesh.position.copy(this.endPos);
                this.startPos = this.endPos = this.t = undefined;
            } else {
                this.mesh.position.lerpVectors(this.startPos, this.endPos, easeInOutCubic(this.t));
            }
        }
    }

    themeColors() {
        return [
            [new THREE.Color(), new THREE.Color()],// zero theme
            [new THREE.Color("#ffaf8f"), new THREE.Color("#00aaa5")],
            [new THREE.Color("#fc7342"), new THREE.Color("#5a5aff")],
            [new THREE.Color("#9ff7ea"), new THREE.Color("#fc4312")],
            [new THREE.Color("#bdbdff"), new THREE.Color("#fc276e")],
            [new THREE.Color("#f9a2f9"), new THREE.Color("#0642ff")],
            [new THREE.Color("#8ef4ca"), new THREE.Color("#e807be")],
            [new THREE.Color("#ffb070"), new THREE.Color("#9721f4")]];
    }
    themeMaterials() {
        return this.themeColors().map(c => this.material(c[0], c[1]));
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
