// apiHandler.js

const apiKey = 'CJahiZPNM0cBf2eRaPuqaa19y75Nct8w1l5nK4Nb'; // Your NASA API Key

// Function to fetch NEO data from NASA API
async function fetchNEOData(startDate, endDate) {
    const url = `https://api.nasa.gov/neo/rest/v1/feed?start_date=${startDate}&end_date=${endDate}&api_key=${apiKey}`;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        displayNEOs(data.near_earth_objects);
    } catch (error) {
        console.error("Failed to fetch NEO data:", error);
    }
}

// Function to display NEOs in the 3D scene
function displayNEOs(NEOData) {
    Object.keys(NEOData).forEach(date => {
        NEOData[date].forEach(neo => {
            const radius = neo.estimated_diameter.meters.estimated_diameter_max / 1000; // Scale down for visualization
            const geometry = new THREE.SphereGeometry(radius, 32, 32);
            const material = new THREE.MeshBasicMaterial({ color: 0xff0000, transparent: true, opacity: 0.8 });
            const neoMesh = new THREE.Mesh(geometry, material);
            neoMesh.name = neo.name;
            neoMesh.details = `Estimated Diameter: ${neo.estimated_diameter.meters.estimated_diameter_max.toFixed(2)} meters\n` +
                              `Close Approach Date: ${neo.close_approach_data[0].close_approach_date}\n` +
                              `Miss Distance: ${neo.close_approach_data[0].miss_distance.kilometers} kilometers`;

            neoMesh.position.set(
                Math.random() * 200 - 100, // Random x position
                Math.random() * 200 - 100, // Random y position
                Math.random() * 200 - 100  // Random z position
            );

            scene.add(neoMesh);
        });
    });
}

// Example: Fetch NEO data for a specific date range
const today = new Date();
const startDate = today.toISOString().split('T')[0]; // Today's date in YYYY-MM-DD
const endDate = new Date(today.setDate(today.getDate() + 7)).toISOString().split('T')[0]; // 7 days from today
fetchNEOData(startDate, endDate);
