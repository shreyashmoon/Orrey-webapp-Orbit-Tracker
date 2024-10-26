// Basic setup for fetching NEO data
const apiKey = 'CJahiZPNM0cBf2eRaPuqaa19y75Nct8w1l5nK4Nb';
const apiUrl = `https://api.nasa.gov/neo/rest/v1/feed?start_date=2024-10-01&end_date=2024-10-07&api_key=${apiKey}`;

async function fetchNeoData() {
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        displayNeoData(data.near_earth_objects);
    } catch (error) {
        console.error('Error fetching NEO data:', error);
    }
}

function displayNeoData(neoData) {
    const container = document.getElementById('visualization-container');
const hammer = new Hammer(container);

let scale = 1;

hammer.get('pinch').set({ enable: true });
hammer.on('pinch', (e) => {
    scale = Math.min(Math.max(1, scale * e.scale), 6); // Limit zoom range
    container.style.transform = `scale(${scale})`;
});


    Object.values(neoData).forEach((dayData) => {
        dayData.forEach((asteroid) => {
            // Create an element for each asteroid
            const asteroidEl = document.createElement('div');
            asteroidEl.className = 'asteroid';
            asteroidEl.innerText = asteroid.name;

            // Style and animate the asteroid
            asteroidEl.style.position = 'absolute';
            asteroidEl.style.top = `${Math.random() * 90}%`;
            asteroidEl.style.left = `${Math.random() * 90}%`;
            container.appendChild(asteroidEl);

            asteroidEl.addEventListener('click', () => {
                showAsteroidInfo(asteroid);
            });
        });
    });
}

function showAsteroidInfo(asteroid) {
    alert(`Asteroid: ${asteroid.name}\nSize: ${asteroid.estimated_diameter.kilometers.estimated_diameter_max} km\nVelocity: ${asteroid.position}`);
}

// Initiate data fetching
fetchNeoData();
