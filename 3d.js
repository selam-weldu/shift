let container = document.body;
let scene, camera, renderer, controls;

let canvas = document.createElement('CANVAS');
canvas.width = 16;
canvas.height = 16;
let ctx = canvas.getContext("2d");

let img = new Image();
img.onload = function () {
    ctx.drawImage(img, 0, 0, 16, 16);
    init();
}

img.src = "car1.png"

function init() {
    scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0xcccccc, 0.008);

    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.01, 1000);
    camera.position.set(0, 3, 3);
    camera.lookAt(scene.position);

    controls = new THREE.OrbitControls(camera, container);
    //console.log('constrols');

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setClearColor(scene.fog.color);
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);

    let light = new THREE.PointLight(0xdddddd, 1, 100);
    light.position.set(3, 3, 3);
    scene.add(light);

    let swordGeometry = new THREE.CanvasGeometry(canvas, 1 / 16, false);
    let swordMaterial = new THREE.MeshBasicMaterial({ vertexColors: THREE.FaceColors });
    let swordMesh = new THREE.Mesh(swordGeometry, swordMaterial);
    swordMesh.position.x = -0.5;
    swordMesh.position.y = 1;
    scene.add(swordMesh);

    resizeArea();
    window.addEventListener('resize', function () { resizeArea(); }, false);
    render();
}

function resizeArea() {
    let newWidth = window.innerWidth;
    let newHeight = window.innerHeight;
    renderer.setSize(newWidth, newHeight);
    camera.aspect = newWidth / newHeight;
    camera.updateProjectionMatrix()
}

function render() {
    requestAnimationFrame(render);
    renderer.render(scene, camera);
}

/* I did this so I could avoid typing 3 lines */
THREE.Face3.prototype.set = function (a, b, c) {
    this.a = a;
    this.b = b;
    this.c = c;
};

/* Obviously this will not be good for larger images.
   If you want larger Images, https://wizgrav.github.io/three.js/runner/
   parameters:
   		canvas - <CANVAS DOM Element>
		  depth - <float> how far to extend the Image
		  hasOpacity - <boolean> If the canvas has opacity
   		material - <THREE.Material> The material to use on the geometry with THREE.MeshFaceMaterial();
   To use opacity:
   		set hasOpacity to true,
		set a material to use with transparency
		set the Mesh material to THREE.MeshFaceMaterial(yourCanvasGeometry.materials());
	*/
THREE.CanvasGeometry = function (canvas, depth, hasOpacity, material) {
    THREE.Geometry.call(this);
    let ctx = canvas.getContext('2d'),
        w = canvas.width,
        h = canvas.height;
    this.materials = [];
    this.opacitys = [];
    for (let x = 0; x < w; x++) {
        for (let y = 0; y < h; y++) {
            let data = ctx.getImageData(x, y, x + 1, y + 1).data;
            if (data[3] !== 0) {
                let vectors = [];
                let v = new THREE.Vector3();
                let f = new THREE.Face3();
                f.color.setStyle("rgb(" + data[0] + "," + data[1] + "," + data[2] + ")");
                if (hasOpacity) {
                    if (this.opacitys.indexOf(data[3] / 255) == -1) {
                        this.opacitys.push(data[3] / 255);
                        let materialClone = material.clone();
                        materialClone.transparent = true;
                        materialClone.opacity = data[3] / 255;
                        this.materials.push(materialClone);
                    }
                    f.materialIndex = this.opacitys.indexOf(data[3] / 255);
                }
                v.set(x / w, -y / w, 0);
                this.vertices.push(v.clone());
                vectors.push(this.vertices.length - 1);

                v.set((x + 1) / w, -y / w, 0);
                this.vertices.push(v.clone());
                vectors.push(this.vertices.length - 1);

                v.set((x + 1) / w, (-y + 1) / w, 0);
                this.vertices.push(v.clone());
                vectors.push(this.vertices.length - 1);

                v.set(x / w, (-y + 1) / w, 0);
                this.vertices.push(v.clone());
                vectors.push(this.vertices.length - 1);

                v.set(x / w, -y / w, depth);
                this.vertices.push(v.clone());
                vectors.push(this.vertices.length - 1);

                v.set((x + 1) / w, -y / w, depth);
                this.vertices.push(v.clone());
                vectors.push(this.vertices.length - 1);

                v.set((x + 1) / w, (-y + 1) / w, depth);
                this.vertices.push(v.clone());
                vectors.push(this.vertices.length - 1);

                v.set(x / w, (-y + 1) / w, depth);
                this.vertices.push(v.clone());
                vectors.push(this.vertices.length - 1);

                f.set(vectors[2], vectors[1], vectors[0]);
                this.faces.push(f.clone());

                f.set(vectors[0], vectors[3], vectors[2]);
                this.faces.push(f.clone());

                f.set(vectors[4], vectors[5], vectors[6]);
                this.faces.push(f.clone());

                f.set(vectors[6], vectors[7], vectors[4]);
                this.faces.push(f.clone());

                //check left
                if (x - 1 < 0 || ctx.getImageData(x - 1, y, x, y + 1).data[3] == 0) {
                    vectors = [];
                    v.set(x / w, -y / w, 0);
                    this.vertices.push(v.clone());
                    vectors.push(this.vertices.length - 1);

                    v.set(x / w, (-y + 1) / w, 0);
                    this.vertices.push(v.clone());
                    vectors.push(this.vertices.length - 1);

                    v.set(x / w, (-y + 1) / w, depth);
                    this.vertices.push(v.clone());
                    vectors.push(this.vertices.length - 1);

                    v.set(x / w, -y / w, depth);
                    this.vertices.push(v.clone());
                    vectors.push(this.vertices.length - 1);

                    f.set(vectors[2], vectors[1], vectors[0]);
                    this.faces.push(f.clone());
                    f.set(vectors[0], vectors[3], vectors[2]);
                    this.faces.push(f.clone());
                }
                // check right
                if (x + 1 > w || ctx.getImageData(x + 1, y, x + 2, y + 1).data[3] == 0) {
                    vectors = [];
                    v.set((x + 1) / w, -y / w, 0);
                    this.vertices.push(v.clone());
                    vectors.push(this.vertices.length - 1);

                    v.set((x + 1) / w, (-y + 1) / w, 0);
                    this.vertices.push(v.clone());
                    vectors.push(this.vertices.length - 1);

                    v.set((x + 1) / w, (-y + 1) / w, depth);
                    this.vertices.push(v.clone());
                    vectors.push(this.vertices.length - 1);

                    v.set((x + 1) / w, -y / w, depth);
                    this.vertices.push(v.clone());
                    vectors.push(this.vertices.length - 1);

                    f.set(vectors[0], vectors[1], vectors[2]);
                    this.faces.push(f.clone());
                    f.set(vectors[2], vectors[3], vectors[0]);
                    this.faces.push(f.clone());
                }
                //check top
                if (y + 1 > h || ctx.getImageData(x, y + 1, x + 1, y + 2).data[3] == 0) {
                    vectors = [];
                    v.set(x / w, (-y) / w, 0);
                    this.vertices.push(v.clone());
                    vectors.push(this.vertices.length - 1);

                    v.set((x + 1) / w, (-y) / w, 0);
                    this.vertices.push(v.clone());
                    vectors.push(this.vertices.length - 1);

                    v.set((x + 1) / w, (-y) / w, depth);
                    this.vertices.push(v.clone());
                    vectors.push(this.vertices.length - 1);

                    v.set(x / w, (-y) / w, depth);
                    this.vertices.push(v.clone());
                    vectors.push(this.vertices.length - 1);

                    f.set(vectors[0], vectors[1], vectors[2]);
                    this.faces.push(f.clone());
                    f.set(vectors[2], vectors[3], vectors[0]);
                    this.faces.push(f.clone());
                }
                //check bottom
                if (y - 1 < 0 || ctx.getImageData(x, y - 1, x + 1, y).data[3] == 0) {
                    vectors = [];
                    v.set(x / w, (-y + 1) / w, 0);
                    this.vertices.push(v.clone());
                    vectors.push(this.vertices.length - 1);

                    v.set((x + 1) / w, (-y + 1) / w, 0);
                    this.vertices.push(v.clone());
                    vectors.push(this.vertices.length - 1);

                    v.set((x + 1) / w, (-y + 1) / w, depth);
                    this.vertices.push(v.clone());
                    vectors.push(this.vertices.length - 1);

                    v.set(x / w, (-y + 1) / w, depth);
                    this.vertices.push(v.clone());
                    vectors.push(this.vertices.length - 1);

                    f.set(vectors[0], vectors[3], vectors[2]);
                    this.faces.push(f.clone());
                    f.set(vectors[2], vectors[1], vectors[0]);
                    this.faces.push(f.clone());
                }
            }
        }
    }

    this.mergeVertices();
    this.computeFaceNormals();
    this.computeVertexNormals();
};

THREE.CanvasGeometry.prototype = Object.create(THREE.Geometry.prototype);
THREE.CanvasGeometry.prototype.constructor = THREE.CanvasGeometry;