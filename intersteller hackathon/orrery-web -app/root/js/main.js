// main.js

// Using CDN for Three.js
import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js'; 
import { GLTFLoader } from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/examples/js/loaders/GLTFLoader.js'; // Load GLTFLoader from CDN
import { fetchNEOData } from './apiHandler.js';

let scene, camera, renderer;

// Initialize the 3D scene
function init3DScene() {
    // Scene setup
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('3d-canvas'), antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    
    // Load the Earth GLB model
    const loader = new GLTFLoader();
    loader.load('../orrery-web-app/assets/earth_globe.glb', (gltf) => {
        scene.add(gltf.scene);
        gltf.scene.scale.set(5, 5, 5); // Scale the model if necessary
    }, undefined, (error) => {
        console.error('Error loading model:', error);
    });

    camera.position.z = 10;

    // Start fetching NEO data
    fetchNEOData();

    animate();
}

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    if (scene.children.length > 0) {
        scene.children[0].rotation.y += 0.001; // Rotate the Earth model slowly
    }
    renderer.render(scene, camera);
}

// Initialize the scene
init3DScene();
