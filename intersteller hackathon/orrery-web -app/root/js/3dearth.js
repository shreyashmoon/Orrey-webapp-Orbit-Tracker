
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('webgl-canvas') });

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const loader = new THREE.GLTFLoader();
const modelUrl = 'orrery-web -app/root/assets/earth_globe.glb'; // Update with your GLB file path

let earthModel; // Variable to hold the model

loader.load(modelUrl, (gltf) => {
    earthModel = gltf.scene;

    // Center the model's geometry on the origin (0,0,0)
    earthModel.position.set(0, 0, 0);

    // Add any necessary offset adjustments to ensure exact centering
    const box = new THREE.Box3().setFromObject(earthModel);
    const center = new THREE.Vector3();
    box.getCenter(center);
    earthModel.position.sub(center); // Center the model exactly

    scene.add(earthModel);
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
            earthModel.rotation.y += 2.0; // Adjust rotation speed as needed
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
// // Select the zoom buttons
// // Select the zoom buttons
// const zoomInButton = document.getElementById("zoom-in");
// const zoomOutButton = document.getElementById("zoom-out");

// Zoom settings
const zoomSpeed = 3.0; // Speed of zoom animation
// Assuming 'controls' is already initialized as your OrbitControls instance
controls.zoomSpeed = 3.5; // Adjust this value for sensitivity (default is 1.0)

// const minFov = 10; // Minimum FOV for zoom in
// const maxFov = 75; // Maximum FOV for zoom out
// let targetFov = camera.fov; // Initial target FOV

// // Smooth zoom function
// function animateZoom() {
//     if (Math.abs(camera.fov - targetFov) > 0.1) { // If FOV is not close enough to target
//         camera.fov += (targetFov - camera.fov) * zoomSpeed; // Gradually move FOV towards target
//         camera.updateProjectionMatrix(); // Update camera projection
//         requestAnimationFrame(animateZoom); // Continue animating
//     }
// }

// // Event listeners for zoom buttons
// zoomInButton.addEventListener("click", () => {
//     if (camera.fov > minFov) {
//         targetFov -= 5; // Decrease FOV for zoom-in
//         animateZoom();
//     }
// });

// zoomOutButton.addEventListener("click", () => {
//     if (camera.fov < maxFov) {
//         targetFov += 5; // Increase FOV for zoom-out
//         animateZoom();
//     }
// });

const apiKey = '0XZeXdg4mOmfnwVLdR0NFkVXOQAg9mLzl5uFX8hj'; // Replace with your API key
const neoUrl = `https://api.nasa.gov/neo/rest/v1/neo/browse?api_key=${apiKey}`;

// Function to create a dot for each NEO
function createNeoDot(neo) {
    const radius = 3; // Size of the dot
    const geometry = new THREE.SphereGeometry(radius, 8, 8);
    const material = new THREE.MeshBasicMaterial({ color: 0xff0000 }); // Red color for NEO
    const dot = new THREE.Mesh(geometry, material);

    // Example: Normalize and set position based on NEO data
    // Assume neo.orbitData is available and represents the distance
    const distanceFromEarth = neo.close_approach_data[0].miss_distance.kilometers / 10000; // Example conversion
    dot.position.set(distanceFromEarth, Math.random() * 2 - 1, Math.random() * 2 - 1); // Random y,z for visualization

    scene.add(dot); // Add dot to the scene
}

// Fetch NEO data and create dots
fetch(neoUrl)
    .then(response => response.json())
    .then(data => {
        const neos = data.near_earth_objects; // Access NEOs
        neos.forEach(neo => {
            createNeoDot(neo); // Create a dot for each NEO
        });
    })
    .catch(error => console.error('Error fetching NEO data:', error));

