// Globals...
var gui = new dat.GUI();
var scene = new THREE.Scene();
var aspect = window.innerWidth / window.innerHeight;
var frustumSize = 100;
var camera = new THREE.OrthographicCamera(frustumSize * aspect / -2, frustumSize * aspect / 2, frustumSize / 2, frustumSize / -2, .1, 2000);
var controls = null;
var renderer = new THREE.WebGLRenderer();
var meshMaterial = new THREE.MeshStandardMaterial({
    color: vacuumParms.color,
    opacity: vacuumParms.opacity,
    transparent: true,
    depthTest: vacuumParms.depthTest,
    depthWrite: vacuumParms.depthWrite,
    roughness: vacuumParms.roughness,
    wireframe: vacuumParms.wireframe
});
var outerOffset = 0.4;
var meshOuter = new THREE.MeshStandardMaterial({
    color: vacuumParms.color,
    opacity: vacuumParms.opacity - outerOffset,
    transparent: true,
    depthTest: vacuumParms.depthTest,
    depthWrite: vacuumParms.depthWrite,
    roughness: vacuumParms.roughness,
    wireframe: vacuumParms.wireframe
});

var geometryS = new THREE.SphereBufferGeometry(vacuumParms.radius, 22, 22);
var group = new THREE.Group();
//var controls = new THREE.OrbitControls(camera);

Initialize();
scaleCamera();

drawGeometry();

function scaleCamera() {
    camera.zoom = vacuumParms.zoom;
    camera.updateProjectionMatrix();
    controls.update();
}

function Initialize() {
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setClearColor(0x000000, 1);

    document.body.appendChild(renderer.domElement);

    camera.position.z = 54;
    camera.position.x = 0;
    camera.position.y = 0;

    controls = new THREE.OrbitControls(camera, renderer.domElement);

    initLights(scene);
}

function initLights(scene) {
    // Ambient light
    var light = new THREE.AmbientLight(0xFFFFFF, 2.5);
    scene.add(light);
    var lights = [];
    var distL = -400;
    var intensity = 0.3;
    lights[0] = new THREE.PointLight(0xffffff, intensity, distL);
    lights[1] = new THREE.PointLight(0xffffff, intensity, distL);
    lights[2] = new THREE.PointLight(0xffffff, intensity, distL);
    lights[3] = new THREE.PointLight(0xffffff, intensity, distL);

    lights[0].position.set(1000, 1000, -100);
    lights[1].position.set(-1000, 1000, 100);
    lights[2].position.set(-1000, -1000, -100);
    lights[3].position.set(1000, -1000, -100);

    for (var i = 0; i < lights.length; i++) {
        scene.add(lights[i]);
    }
}

function drawGeometry() {
    //meshMaterial = new THREE.MeshStandardMaterial({ color: 0x156289, opacity: vacuumParms.opacity, transparent: true });
    // var materialS = new THREE.LineBasicMaterial( {color: 0xffff00, wireframe: true} );
    // var sphere = new THREE.Line( geometryS, materialS );
    var sphere1 = new THREE.Mesh(geometryS, meshMaterial);
    //group.add(sphere1);

    //sphere1.material = chooseFromHash(gui, sphere1, geometryS);

    sphere1.position.x = vacuumParms.radius;
    sphere1.position.y = 0;
    sphere1.position.z = 0;

    scene.add(sphere1);

    AddSpheres(vacuumParms.radius, group, geometryS, meshMaterial, meshOuter);

    scene.add(group);

    //render();
    animate();
}

function animate() {
    requestAnimationFrame(animate);

    if (vacuumParms.rotateAnimation) {
        group.rotation.y += 0.01;
    }
    //controls.update();

    renderer.render(scene, camera);
};

function rotationReset() {
    group.rotation.y = 0;
    group.rotation.x = 0;
    group.rotation.z = 0;
}

function render() {
    // controls.update();
    renderer.render(scene, camera);
}

function AddSpheres(radius, group, geometry, meshInner, meshOuter) {
    var numberSpheres = 16;
    var numSegments = 10;
    var offset = 0;
    var diameter = 2 * radius;
    // add base 1 spheres
    for (var i = 0; i < numberSpheres; i++) {
        var sphere = new THREE.Mesh(geometry, meshInner);
        sphere.position.x = diameter * i + radius;
        sphere.position.y = 0;
        sphere.position.z = 0;

        group.add(sphere);

        sphere = new THREE.Mesh(geometry, meshInner);
        sphere.position.x = -diameter * i - radius;
        group.add(sphere);
    }

    // Draw inner circles of 2 diameter.
    var sphereGeo2 = new THREE.SphereBufferGeometry(diameter, numSegments, numSegments);
    for (var j = 0; j < numberSpheres; j++) {
        offset = 8 * radius * j;
        // Add base 2 spheres
        var sphere = new THREE.Mesh(sphereGeo2, meshInner);
        sphere.position.x = diameter * j;
        sphere.position.y = 0;
        sphere.position.z = 0;
        group.add(sphere);

        sphere = new THREE.Mesh(sphereGeo2, meshInner);
        sphere.position.x = -diameter * j;
        group.add(sphere);
    }

    // Draw inner circle of 3 diameter.
    var sphereGeo3 = new THREE.SphereBufferGeometry(3 * radius, numSegments, numSegments);
    for (var j = 0; j < numberSpheres / 4; j++) {
        // Add base 3 spheres
        // Draw first sphere that covers 3 diameters (base 1)
        var sphere = new THREE.Mesh(sphereGeo3, meshInner);
        sphere.position.x = 4 * diameter * j + 3 * radius;
        sphere.position.y = 0;
        sphere.position.z = 0;
        group.add(sphere);
        // Draw 2nd sphere that covers 3 diameters (base 1)
        sphere = new THREE.Mesh(sphereGeo3, meshInner);
        sphere.position.x = 4 * diameter * j + 3 * radius + diameter;
        sphere.position.y = 0;
        sphere.position.z = 0;
        group.add(sphere);

        // Draw negative axis side
        var sphere = new THREE.Mesh(sphereGeo3, meshInner);
        sphere.position.x = -4 * diameter * j - 3 * radius;
        sphere.position.y = 0;
        sphere.position.z = 0;
        group.add(sphere);

        sphere = new THREE.Mesh(sphereGeo3, meshInner);
        sphere.position.x = -4 * diameter * j - 3 * radius - diameter;
        sphere.position.y = 0;
        sphere.position.z = 0;
        group.add(sphere);
    }

    // Draw inner circle of radius of 2 diameter .
    var sphereGeo4 = new THREE.SphereBufferGeometry(2 * diameter, numSegments, numSegments);
    for (var j = 0; j < numberSpheres / 4; j++) {
        var sphere = new THREE.Mesh(sphereGeo4, meshInner);
        sphere.position.x = 4 * diameter * j + 2 * diameter;
        group.add(sphere);

        sphere = new THREE.Mesh(sphereGeo4, meshInner);
        sphere.position.x = -4 * diameter * j - 2 * diameter;
        group.add(sphere);
    }
    // Add Center one.
    sphere = new THREE.Mesh(sphereGeo4, meshInner);
    group.add(sphere);

    // draw outer circles with radius of 4 diameter
    numSegments = 16;
    var sphereGeo4 = new THREE.SphereBufferGeometry(4 * diameter, numSegments, numSegments);
    for (var j = 0; j < numberSpheres / 6; j++) {
        var sphere = new THREE.Mesh(sphereGeo4, meshOuter);
        sphere.position.x = 4 * diameter * j + 4 * diameter;
        group.add(sphere);

        sphere = new THREE.Mesh(sphereGeo4, meshOuter);
        sphere.position.x = -4 * diameter * j - 4 * diameter;
        group.add(sphere);
    }
    // Add Center one.
    sphere = new THREE.Mesh(sphereGeo4, meshOuter);
    group.add(sphere);

    // draw outer circles with radius of 6 diameter
    var sphereGeo6 = new THREE.SphereBufferGeometry(6 * diameter, numSegments, numSegments);
    for (var j = 0; j < numberSpheres / 8; j++) {
        var sphere = new THREE.Mesh(sphereGeo6, meshOuter);
        sphere.position.x = 4 * diameter * j + 6 * diameter;
        group.add(sphere);

        sphere = new THREE.Mesh(sphereGeo6, meshOuter);
        sphere.position.x = -4 * diameter * j - 6 * diameter;
        group.add(sphere);
    }
    // add center one.
    sphere = new THREE.Mesh(sphereGeo6, meshOuter);
    sphere.position.x = 0;
    group.add(sphere);

    // Draw outer circle with radius of 8 diameters.
    var sphereGeo8 = new THREE.SphereBufferGeometry(8 * diameter, numSegments, numSegments);
    for (var j = 0; j < numberSpheres / 16; j++) {
        sphere = new THREE.Mesh(sphereGeo8, meshOuter);
        sphere.position.x = 8 * diameter;
        group.add(sphere);

        sphere = new THREE.Mesh(sphereGeo8, meshOuter);
        sphere.position.x = -8 * diameter;
        group.add(sphere);
    }
    // Add Center one.
    sphere = new THREE.Mesh(sphereGeo8, meshOuter);
    group.add(sphere);

    // Draw outer circle with radius of 12 diameters.
    var sphereGeo12 = new THREE.SphereBufferGeometry(12 * diameter, numSegments, numSegments);
    for (var j = 0; j < numberSpheres / 16; j++) {
        sphere = new THREE.Mesh(sphereGeo12, meshOuter);
        sphere.position.x = 4 * diameter;
        group.add(sphere);

        sphere = new THREE.Mesh(sphereGeo12, meshOuter);
        sphere.position.x = -4 * diameter;
        group.add(sphere);
    }
    // Add Center one.
    sphere = new THREE.Mesh(sphereGeo12, meshOuter);
    group.add(sphere);

    // Draw over arching encompassing circle
    numSegments = 25;
    var sphereGeo16 = new THREE.SphereBufferGeometry(16 * diameter, numSegments, numSegments);
    sphere = new THREE.Mesh(sphereGeo16, meshOuter);
    group.add(sphere);
}

function setMeshColor(newColor) {
    meshMaterial.color.set(newColor);
    meshOuter.color.set(newColor);
}

function setMeshOpacity(newValue) {
    meshMaterial.opacity = vacuumParms.opacity;
    meshOuter.opacity = vacuumParms.opacity - outerOffset;
}

function drawCube() {
    var geometry = new THREE.BoxGeometry(2, .5, 1);
    var material = new THREE.MeshBasicMaterial({
        color: 0x9751bd
    });
    var cube = new THREE.Mesh(geometry, material);
    scene.add(cube);
    cube.position.x += 3;

    var animateCube = function () {
        requestAnimationFrame(animateCube);

        cube.rotation.x += 0.01;
        cube.rotation.y += 0.01;

        renderer.render(scene, camera);
    }
}