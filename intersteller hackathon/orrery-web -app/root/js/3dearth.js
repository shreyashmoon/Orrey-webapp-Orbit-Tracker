const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(100, window.innerWidth / window.innerHeight, 0.9, 5000);

const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('webgl-canvas') });

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const loader = new THREE.GLTFLoader();
const modelUrl = 'orrery-web -app/root/assets/earth_globe.glb';

let earthModel;

loader.load(modelUrl, (gltf) => {
    earthModel = gltf.scene;

    earthModel.position.set(0, 0, 0);

    const box = new THREE.Box3().setFromObject(earthModel);
    const center = new THREE.Vector3();
    box.getCenter(center);
    earthModel.position.sub(center);

    scene.add(earthModel);
});

camera.position.z = 15;

const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.50;

function animate() {
    requestAnimationFrame(animate);
    controls.update();

    if (!controls.enabled) {
        if (earthModel) {
            earthModel.rotation.y += 2.0;
        }
    }

    renderer.render(scene, camera);
}

controls.autoRotate = true;
controls.autoRotateSpeed = 2.0;

animate();

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

const zoomSpeed = 3.0;
controls.zoomSpeed = 3.5;

const minFov = 10;
const maxFov = 75;
let targetFov = camera.fov;

function animateZoom() {
    if (Math.abs(camera.fov - targetFov) > 0.1) {
        camera.fov += (targetFov - camera.fov) * zoomSpeed;
        camera.updateProjectionMatrix();
        requestAnimationFrame(animateZoom);
    }
}

const apiKey = '0XZeXdg4mOmfnwVLdR0NFkVXOQAg9mLzl5uFX8hj';
const neoUrl = `https://api.nasa.gov/neo/rest/v1/neo/browse?api_key=${apiKey}`;

function createNeoDot(neo) {
    const radius = 2.5;
    const geometry = new THREE.SphereGeometry(radius, 8, 8);
    const material = new THREE.MeshBasicMaterial({ color: 0xfffffff });
    const dot = new THREE.Mesh(geometry, material);

    const distanceFromEarth = neo.close_approach_data[0].miss_distance.kilometers / 100000;
    dot.position.set(distanceFromEarth, Math.random() * 2 - 1, Math.random() * 2 - 1);

    const phi = Math.random() * Math.PI;
    const theta = Math.random() * 2 * Math.PI;

    const x = distanceFromEarth * Math.sin(phi) * Math.cos(theta);
    const y = distanceFromEarth * Math.sin(phi) * Math.sin(theta);
    const z = distanceFromEarth * Math.cos(phi);

    dot.position.set(x, y, z);
    dot.userData = neo;

    scene.add(dot);
}

fetch(neoUrl)
    .then(response => response.json())
    .then(data => {
        const neos = data.near_earth_objects;
        neos.forEach(neo => {
            createNeoDot(neo);
        });
    })
    .catch(error => console.error('Error fetching NEO data:', error));

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

window.addEventListener('click', onMouseClick, false);

function onMouseClick(event) {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(scene.children);

    if (intersects.length > 0) {
        const clickedObject = intersects[0].object;
        if (clickedObject.userData) {
            displayObjectInfo(clickedObject.userData);
        }
    }
}

function displayObjectInfo(neo) {
    document.getElementById('object-name').textContent = `Name: ${neo.name || 'N/A'}`;
    document.getElementById('object-distance').textContent = `Distance: ${neo.close_approach_data[0].miss_distance.kilometers} km`;
    document.getElementById('object-speed').textContent = `Speed: ${neo.close_approach_data[0].relative_velocity.kilometers_per_hour} km/h`;

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
        document.getElementById('info-box').style.display = 'none';
    }
}
