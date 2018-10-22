var vacuumParms = {
    numSpheres: 6,
    color: 0x2f7dbd,
    opacity: 0.5,
    zoom: 5,
    radius: 0.5,
    rotateAnimation: false,
    rotateReset: false,
    roughness: 0.4,
    metalness: 0.4,
    depthTest: false,
    depthWrite: true,
    wireframe: false,
    wireframeline: 0.2
}

window.onload = function () {

    gui.add(vacuumParms, 'numSpheres', 0, 12, 1)
        .name("# of Spheres")
        .onChange(function (newValue) { // Listen to changes within the GUI
                       showSpheres(vacuumParms.numSpheres);
        })
        .listen(); // Listen to changes outside the GUI - GUI will update when changed from outside

    gui.addColor(vacuumParms, 'color')
        .onChange(function (newValue) {
           setMeshColor(newValue);
        })
        .listen();

    gui.add(vacuumParms, 'zoom', 1, 10)
        .onChange(function (newValue) {
            scaleCamera();
        })
        .listen();

    gui.add(vacuumParms, 'opacity', 0, 1)
        .onChange(function (newValue) {
           setMeshOpacity(newValue);
        })
        .listen(); // Listen to changes outside the GUI - GUI will update when changed from outside
    gui.add(vacuumParms, 'roughness', 0, 1)
        .name("Reflectivity")
        .onChange(function (newValue) {
            meshMaterial.roughness = vacuumParms.roughness;
            meshOuter.roughness = vacuumParms.roughness;
        })
        .listen();

    gui.add(vacuumParms, 'metalness', 0, 1)
        .name("Shine")
        .onChange(function (newValue) {
            meshMaterial.metalness = vacuumParms.metalness;
            meshOuter.metalness = vacuumParms.metalness;
        })
        .listen();

    gui.add(vacuumParms, 'depthTest')
        .name("Depth Overlay")
        .onChange(function (newValue) {
            meshMaterial.depthTest = vacuumParms.depthTest;
            meshOuter.depthTest = vacuumParms.depthTest;
        })
        .listen();

    gui.add(vacuumParms, 'depthWrite')
        .name("Depth Write")
        .onChange(function (newValue) {
            meshMaterial.depthWrite = vacuumParms.depthWrite;
            meshOuter.depthWrite = vacuumParms.depthWrite;
        })
        .listen();

    gui.add(vacuumParms, 'wireframe')
        .name('Wireframe')
        .onChange(function (newValue) {
            meshMaterial.wireframe = vacuumParms.wireframe;
            meshOuter.wireframe= vacuumParms.wireframe;
        })
        .listen();

    gui.add(vacuumParms, 'rotateAnimation')
        .name('Animate Rotation ')
        .onChange(function (newValue) {

        })
        .listen();

    gui.add(vacuumParms, 'rotateReset')
        .name('Rotation Reset')
        .onChange(function (newValue) {
            if (vacuumParms.rotateReset) {
                rotationReset();
                vacuumParms.rotateReset = false;
            }
        })
        .listen();
};