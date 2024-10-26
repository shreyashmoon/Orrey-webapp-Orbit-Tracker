// NEO Filter and Display Script
async function fetchNEOData() {
    const apiKey = '0XZeXdg4mOmfnwVLdR0NFkVXOQAg9mLzl5uFX8hj';
    const url = `https://api.nasa.gov/neo/rest/v1/feed?start_date=2024-01-01&end_date=2024-01-07&api_key=${apiKey}`;
    
    try {
        const response = await fetch(url);
        const data = await response.json();
        return Object.values(data.near_earth_objects).flat(); // Flatten array of dates
    } catch (error) {
        console.error('Error fetching NEO data:', error);
        return [];
    }
}

// Filter NEAs function
async function filterNEAs() {
    const allNEOs = await fetchNEOData();

    // Adjusted filter criteria; update if orbit class is not found in returned structure
    const neas = allNEOs.filter(neo => {
        const orbitClass = neo.orbit_class?.description || '';
        return orbitClass.includes("Apollo") || orbitClass.includes("Amor") || orbitClass.includes("Aten");
    });

    console.log('Filtered NEAs:', neas); // Logging NEAs to verify filtering
    return neas;
}

// Dot creation function with color input
function createNeoDot(neo, color = 0xfffffff) {
    const geometry = new THREE.SphereGeometry(0.2, 8, 8);
    const material = new THREE.MeshBasicMaterial({ color });
    const dot = new THREE.Mesh(geometry, material);

    // Example positioning
    const distanceFromEarth = neo.close_approach_data[0].miss_distance.kilometers / 100000; 
    const phi = Math.random() * Math.PI;
    const theta = Math.random() * 2 * Math.PI;
    const x = distanceFromEarth * Math.sin(phi) * Math.cos(theta);
    const y = distanceFromEarth * Math.sin(phi) * Math.sin(theta);
    const z = distanceFromEarth * Math.cos(phi);

    dot.position.set(x, y, z);
    dot.userData = neo;
    scene.add(dot);
}

// Fetch and display NEAs with a specific color
async function displayNEAs() {
    const neas = await filterNEAs();
    neas.forEach(nea => {
        createNeoDot(nea, 0xff0000); // Red color for NEAs
    });
}

// Main function to run the NEO filter and display
(async function runNEODisplay() {
    await displayNEAs();
})();

// Renderer and Animation Setup
function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}
animate();
