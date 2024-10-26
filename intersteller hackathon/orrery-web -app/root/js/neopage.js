
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(100, window.innerWidth / window.innerHeight, 0.9, 5000); // Example values

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
// Zoom settings
const zoomSpeed = 3.0; // Speed of zoom animation
// Assuming 'controls' is already initialized as your OrbitControls instance
controls.zoomSpeed = 3.5; // Adjust this value for sensitivity (default is 1.0)

const minFov = 10; // Minimum FOV for zoom in
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



const apiKey = '0XZeXdg4mOmfnwVLdR0NFkVXOQAg9mLzl5uFX8hj'; // Replace with your API key
const neoUrl = `https://api.nasa.gov/neo/rest/v1/neo/browse?api_key=${apiKey}`;

// Function to create a dot for each NEO
function createNeoDot(neo) {
    const radius = 2.5; // Size of the dot
    const geometry = new THREE.SphereGeometry(radius, 8, 8);
    const material = new THREE.MeshBasicMaterial({ color: 0xfffffff }); // Red color for NEO
    const dot = new THREE.Mesh(geometry, material);

    // Example: Normalize and set position based on NEO data
    // Assume neo.orbitData is available and represents the distance
    const distanceFromEarth = neo.close_approach_data[0].miss_distance.kilometers / 100000; // Example conversion
    dot.position.set(distanceFromEarth, Math.random() * 2 - 1, Math.random() * 2 - 1); // Random y,z for visualization

    // Scatter NEOs in a spherical area around the Earth
    const phi = Math.random() * Math.PI; // Random angle for spherical coordinates
    const theta = Math.random() * 2 * Math.PI; // Random angle for spherical coordinates

    // Convert spherical coordinates to Cartesian coordinates
    const x = distanceFromEarth * Math.sin(phi) * Math.cos(theta);
    const y = distanceFromEarth * Math.sin(phi) * Math.sin(theta);
    const z = distanceFromEarth * Math.cos(phi);

    // Set position of the dot
    dot.position.set(x, y, z);
    dot.userData = neo; // Store NEO data for later use

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



    //sdfsdcsds
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    
    // Add an event listener to detect mouse clicks
    window.addEventListener('click', onMouseClick, false);
    
    function onMouseClick(event) {
        // Update mouse position for raycasting
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    
        // Set the raycaster with the camera and mouse position
        raycaster.setFromCamera(mouse, camera);
    
        // Calculate objects intersecting the raycaster
        const intersects = raycaster.intersectObjects(scene.children);
    
        if (intersects.length > 0) {
            const clickedObject = intersects[0].object;
            
            if (clickedObject.userData) { // Check if the object has userData
                displayObjectInfo(clickedObject.userData); // Pass the NEO data
            }
        }
    }
    
    function displayObjectInfo(neo) {
        // Display information in the info box
        document.getElementById('object-name').textContent = `Name: ${neo.name || 'N/A'}`;
        document.getElementById('object-distance').textContent = `Distance: ${neo.close_approach_data[0].miss_distance.kilometers} km`;
        document.getElementById('object-speed').textContent = `Speed: ${neo.close_approach_data[0].relative_velocity.kilometers_per_hour} km/h`;
    
        // Show the info box
        document.getElementById('info-box').style.display = 'block';
    }
    
    function onMouseClick(event) {
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(scene.children);
    
        if (intersects.length > 0 && intersects[0].object.userData) {
            displayObjectInfo(intersects[0].object.userData);
        } else {
            document.getElementById('info-box').style.display = 'none'; // Hide info box if not clicking on an object
        }
    }
    
    