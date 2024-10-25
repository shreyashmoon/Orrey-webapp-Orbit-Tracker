
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('webgl-canvas') });

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const loader = new THREE.GLTFLoader();
const modelUrl = 'orrery-web -app/root/assets/earth_globe.glb'; // Update with your GLB file path

let earthModel; // Variable to hold the model

loader.load(modelUrl, (gltf) => {
    earthModel = gltf.scene; // Store the model
    scene.add(earthModel);
    earthModel.position.set(0, 10, 0); // Position the model as needed
});

camera.position.z = 15; // Adjust the camera position as needed

// Add OrbitControls for interactivity
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
controls.dampingFactor = 0.50; // smoothness of the movement

function animate() {
    requestAnimationFrame(animate);
    controls.update(); // only required if controls.enableDamping = true, or if controls.autoRotate = true

    // Rotate the Earth model automatically when not interacting
    if (!controls.enabled) {
        if (earthModel) {
            earthModel.rotation.y += 0.1; // Adjust rotation speed as needed
        }
    }

    renderer.render(scene, camera);
}

// Enable auto-rotation
controls.autoRotate = true; // Set to true for auto-rotation
controls.autoRotateSpeed = 2.0; // Adjust the speed of auto-rotation

animate();

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
// Select the zoom buttons
// Select the zoom buttons
const zoomInButton = document.getElementById("zoom-in");
const zoomOutButton = document.getElementById("zoom-out");

// Zoom settings
const zoomSpeed = 3.0; // Speed of zoom animation
// Assuming 'controls' is already initialized as your OrbitControls instance
controls.zoomSpeed = 3.5; // Adjust this value for sensitivity (default is 1.0)

const minFov = 20; // Minimum FOV for zoom in
const maxFov = 75; // Maximum FOV for zoom out
let targetFov = camera.fov; // Initial target FOV

// Smooth zoom function
function animateZoom() {
    if (Math.abs(camera.fov - targetFov) > 0.1) { // If FOV is not close enough to target
        camera.fov += (targetFov - camera.fov) * zoomSpeed; // Gradually move FOV towards target
        camera.updateProjectionMatrix(); // Update camera projection
        requestAnimationFrame(animateZoom); // Continue animating
    }
}

// Event listeners for zoom buttons
zoomInButton.addEventListener("click", () => {
    if (camera.fov > minFov) {
        targetFov -= 5; // Decrease FOV for zoom-in
        animateZoom();
    }
});

zoomOutButton.addEventListener("click", () => {
    if (camera.fov < maxFov) {
        targetFov += 5; // Increase FOV for zoom-out
        animateZoom();
    }
});

//reset the position after inactivity
let inactivityTimeout;
const inactivityDelay = 6000; // Delay of 6 seconds
const initialRotation = { x: 0, y: 0, z: 0 }; // Adjust this if the Earth has a different initial position
const resetSpeed = 0.55; // Adjust for reset speed

// Reset Earth to the initial position with a smooth transition
function resetEarthPosition() {
    const deltaX = initialRotation.x - earth.rotation.x;
    const deltaY = initialRotation.y - earth.rotation.y;
    const deltaZ = initialRotation.z - earth.rotation.z;

    // Smoothly move the Earth to the initial position using interpolation
    earth.rotation.x += deltaX * resetSpeed;
    earth.rotation.y += deltaY * resetSpeed;
    earth.rotation.z += deltaZ * resetSpeed;

    // Continue animation if not at the exact initial position
    if (Math.abs(deltaX) > 0.01 || Math.abs(deltaY) > 0.01 || Math.abs(deltaZ) > 0.01) {
        requestAnimationFrame(resetEarthPosition);
    }
}

// Reset the inactivity timer and start countdown
function resetInactivityTimer() {
    clearTimeout(inactivityTimeout);

    // Start the timer for inactivity
    inactivityTimeout = setTimeout(() => {
        requestAnimationFrame(resetEarthPosition);
    }, inactivityDelay);
}

// Detect user interaction to reset inactivity timer
window.addEventListener("mousemove", resetInactivityTimer);
window.addEventListener("touchmove", resetInactivityTimer);
window.addEventListener("mousedown", resetInactivityTimer);
window.addEventListener("touchstart", resetInactivityTimer);

// Initialize timer on load
resetInactivityTimer();
