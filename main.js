
import MouseLookController from './js/MouseLookController.js';
import { Renderer, Scene, Node, Mesh, Primitive, BasicMaterial, CubeMapMaterial, PerspectiveCamera, vec3,PhongMaterial,PhongShader,vec4 } from './lib/engine';
import Light from "./lib/engine/src/light/Light.js";


// Create a Renderer and append the canvas element to the DOM.
let renderer = new Renderer(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

let time = 0.001;

// A scenegraph consists of a top-level Node, called Scene and an arbitrary number of nodes forming a DAG.
const scene = new Scene();

// We load some textures and instantiate materials from them:
const sunMaterial = new BasicMaterial({
    map: renderer.loadTexture('resources/sun.jpg')
});

const earthMaterial = new PhongMaterial({
    map: renderer.loadTexture('resources/earth_daymap.jpg')
});

const moonMaterial = new PhongMaterial({
    map: renderer.loadTexture('resources/2k_mercury.jpg')
});

const marsMaterial = new PhongMaterial({
   map: renderer.loadTexture('resources/2k_mars.jpg')
});

const venusMaterial = new PhongMaterial({
    map: renderer.loadTexture('resources/2k_venus_surface.jpg')
});
const satMaterial = new PhongMaterial({
    map: renderer.loadTexture('resources/sattelitt.jpg')
});
const jupMaterial = new PhongMaterial({
    map: renderer.loadTexture('resources/2k_jupiter.jpg')
});


// Get more textures here:
// https://www.solarsystemscope.com/textures/

// Get relative sizes here:
// http://www.exploratorium.edu/ronh/solar_system/
// You dont have to use these, as the planets may be too tiny to be visible.

// A Primitive consists of geometry and a material.
// We create a sphere Primitive using the static method 'createSphere'.
// The generated geometry is called a UV-sphere and it has 32 vertical and horizontal subdivisions (latitude and longitude).
// Additionally, we specify that we want the Primitive to be drawn with sunMaterial.
const sunPrimitive = Primitive.createSphere(sunMaterial, 32, 32);

// A Primitive is only drawn as part of a Mesh,
// so we instantiate a new Mesh with the sunPrimitive.
// (A Mesh can consist of multiple Primitives. )
const sun = new Mesh([sunPrimitive]);

// Finally, we add the sun to our scene.
// Only meshes that have been added to our scene, either as a child or as a descendant, will be drawn.
scene.add(sun);


const sunLight  = new Light({
    diffuse: vec4.fromValues(1.0,1.0,1.0,1.0),
    specular: vec4.fromValues(0.1,0.1,0.1,1.0)
});
scene.add(sunLight);

// We also want to draw the earth, so we use the static method 'from' to create a new Primitive based on the previous one.
// Using this function ensures that we're reusing the same buffers for geometry, while allowing us to specify a different material.
const earthPrimitive = Primitive.from(sunPrimitive, earthMaterial);

// Next we create a Node that represents the Earths orbit.
// This node is not translated at all, because we want it to be centered inside the sun.
// It is however rotated in the update-loop at starting at line 215.
const earthOrbitNode = new Node(scene);

// This node represents the center of the earth.
const earthCenterNode = new Node(earthOrbitNode);
// We translate it along the x-axis to a suitable position.
// When the earthOrbitNode is rotated, this node will orbit about the center of the sun.
earthCenterNode.setTranslation(11.45, 0, 0);

// Create a new Mesh for the Earth.
const earth = new Mesh([earthPrimitive]);

// We add it to the earthCenterNode, so that it orbits around the sun.
earthCenterNode.add(earth);

// True scale: earth.setScale(0.0091, 0.0091, 0.0091);
earth.setScale(0.191, 0.191, 0.191); // 10 times larger than irl

// Moon
const moonPrimitive = Primitive.from(earthPrimitive, moonMaterial);
const moonOrbitNode = new Node(earthCenterNode);
const moonCenterNode = new Node(moonOrbitNode);
moonCenterNode.setTranslation(1.5, 0, 0);
const moon = new Mesh([moonPrimitive]);
moonCenterNode.add(moon);
moon.setScale(0.091, 0.091, 0.091);
// Moon Finished

// Satellite
const satPrimitive = Primitive.from(moonPrimitive, satMaterial);
const satOrbitNode = new Node(moonCenterNode);
const satCenterNode = new Node(satOrbitNode);
satCenterNode.setTranslation(0.3, 0, 0);
const sat = new Mesh([satPrimitive]);
satCenterNode.add(sat);
sat.setScale(0.04, 0.04, 0.04);
// Satellite Finito

// Venus
const venusPrimitive = Primitive.from(sunPrimitive, venusMaterial);
const venusOrbidNode = new Node(scene);
const venusCenterNode = new Node(venusOrbidNode);
venusCenterNode.setTranslation(8, 0, 0);
const venus = new Mesh([venusPrimitive]);
venusCenterNode.add(venus);
venus.setScale(0.09, 0.09, 0.09);
// Venus Done

// Mars
const marsPrimitive = Primitive.from(sunPrimitive, marsMaterial);
const marsOrbitNode = new Node(scene);
const marsCenterNode = new Node(marsOrbitNode);
marsCenterNode.setTranslation(14.00, 0, 0);
const mars = new Mesh([marsPrimitive]);
marsCenterNode.add(mars);
mars.setScale(0.189, 0.189, 0.189);
// Mars ends

// Jupiter
const jupPrimitive = Primitive.from(sunPrimitive, jupMaterial);
const jupOrbitNode = new Node(scene);
const jupCenterNode = new Node(jupOrbitNode);
jupCenterNode.setTranslation(20, 0, 0);
const jupiter = new Mesh([jupPrimitive]);
jupCenterNode.add(jupiter)
jupiter.setScale(0.9, 0.9, 0.9);
// Jupiter finished


// We create a Node representing movement, in order to decouple camera rotation.
// We do this so that the skybox follows the movement, but not the rotation of the camera.
const player = new Node();

let skyBoxMaterial = new CubeMapMaterial({
    map: renderer.loadCubeMap([
        'resources/skybox/right.png',
        'resources/skybox/left.png',
        'resources/skybox/top.png',
        'resources/skybox/bottom.png',
        'resources/skybox/front.png',
        'resources/skybox/back.png'
    ])
});

let skyBoxPrimitive = Primitive.createCube(skyBoxMaterial, true); // Second argument tells the createBox function to invert the faces and normals of the box.

let skyBox = new Mesh([skyBoxPrimitive]);
skyBox.setScale(1500, 1500, 1500);

// Attaching the skybox to the player gives the illusion that it is infinitely far away.
player.add(skyBox);

// We create a PerspectiveCamera with a fovy of 70, aspectRatio, and near and far clipping plane.
const camera = new PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 5000);
camera.setTranslation(0, 0, 5);

player.add(camera);

scene.add(player);

// We need to update some properties in the camera and renderer if the window is resized.
window.addEventListener('resize', () => {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);

}, false);


// We create a MouseLookController to enable controlling camera pitch and yaw with mouse input.
const mouseLookController = new MouseLookController(camera);

// We attach a click lister to the canvas-element so that we can request a pointer lock.
// https://developer.mozilla.org/en-US/docs/Web/API/Pointer_Lock_API
const canvas = renderer.domElement;
canvas.addEventListener('click', () => {
    canvas.requestPointerLock();
});

let yaw = 0;
let pitch = 0;
function updateCamRotation(event) {
    // Add mouse movement to the pitch and yaw variables so that we can update the camera rotation in the loop below.
    yaw -= event.movementX * 0.001;
    pitch -= event.movementY * 0.001;
}

document.addEventListener('pointerlockchange', () => {
    if (document.pointerLockElement === canvas) {
        canvas.addEventListener('mousemove', updateCamRotation, false);
    } else {
        canvas.removeEventListener('mousemove', updateCamRotation, false);
    }
});


let move = {
    forward: false,
    backward: false,
    left: false,
    right: false,
    speed: 0.05
};

window.addEventListener('keydown', (e) => {
    e.preventDefault();
    if (e.code === 'KeyW') {
        move.forward = true;
    } else if (e.code === 'KeyS') {
        move.backward = true;
    } else if (e.code === 'KeyA') {
        move.left = true;
    } else if (e.code === 'KeyD') {
        move.right = true;
    } else if (e.code === 'ArrowUp') {
        time = Math.min(time * 1.05, 10);
    } else if (e.code === 'ArrowDown') {
        time = Math.max(0.000001, time * 0.95);
    }
});

window.addEventListener('keyup', (e) => {
    e.preventDefault();
    if (e.code === 'KeyW') {
        move.forward = false;
    } else if (e.code === 'KeyS') {
        move.backward = false;
    } else if (e.code === 'KeyA') {
        move.left = false;
    } else if (e.code === 'KeyD') {
        move.right = false;
    }
});

// We create a vec3 to hold the players velocity (this way we avoid allocating a new one every frame).
const velocity = vec3.fromValues(0.0, 0.0, 0.0);

const TICK_RATE = 1000 / 60; // 60 fps is the reference Hz.

let then = 0;

/////////////////////////////////////////////////////////////////////////////////

function loop(now) {

    let delta = now - then;
    then = now;

    const deltaCorrection = (delta / TICK_RATE); // The deviation factor from the targeted TICK_RATE of 60 Hz

    const moveSpeed = move.speed * deltaCorrection;

    // Reduce accumulated velocity by 25% each frame.
    vec3.scale(velocity, velocity, 0.75);
    //vec3.set(velocity, 0.0, 0.0, 0.0); // (Alternatively remove it completely, feels more responsive?)

    if (move.left) {
        velocity[0] -= moveSpeed;
    }

    if (move.right) {
        velocity[0] += moveSpeed;
    }

    if (move.forward) {
        velocity[2] -= moveSpeed;
    }

    if (move.backward) {
        velocity[2] += moveSpeed;
    }

    // Given the accumulated mouse movement this frame, use the mouse look controller to calculate the new rotation of the camera.
    mouseLookController.update(pitch, yaw);

    // Camera rotation is represented as a quaternion.
    // We rotate the velocity vector based the cameras rotation in order to translate along the direction we're looking.
    const translation = vec3.transformQuat(vec3.create(), velocity, camera.rotation);
    player.applyTranslation(...translation);

    // Animate bodies:
    const orbitalRotationFactor = time * deltaCorrection; // The amount the earth rotates about the sun every tick.
    venusOrbidNode.rotateY(orbitalRotationFactor * 1.2);
    earthOrbitNode.rotateY(orbitalRotationFactor);
    marsOrbitNode.rotateY(orbitalRotationFactor / 1.2);
    moonOrbitNode.rotateY(orbitalRotationFactor * 24);
    satOrbitNode.rotateY(orbitalRotationFactor * 24);
    jupOrbitNode.rotateY(orbitalRotationFactor / 1.6);
    
    earth.rotateY(orbitalRotationFactor * 365); // The Earth rotates approx. 365 times per year.
    moon.rotateY(orbitalRotationFactor * 24);
    sat.rotateY(orbitalRotationFactor * 10);
    sun.rotateY(orbitalRotationFactor * 25); // The Sun rotates approx. 25 times per year.
    mars.rotateY(orbitalRotationFactor * 687); // Mars rotates approx. 687 times per year.
    venus.rotateY(orbitalRotationFactor * 225);
    jupiter.rotateY(orbitalRotationFactor * (365/12));

    // Reset mouse movement accumulator every frame.
    yaw = 0;
    pitch = 0;

    // Update the world matrices of the entire scene graph.
    scene.update();

    // Render the scene.
    renderer.render(scene, camera);

    // Ask the the browser to draw when it's convenient
    window.requestAnimationFrame(loop);

}

///////////////////////////////////////////////////////////////////////////////////////

window.requestAnimationFrame(loop);