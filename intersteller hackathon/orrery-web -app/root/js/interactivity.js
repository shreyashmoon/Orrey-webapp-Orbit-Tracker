// interactivity.js

function createInfoPopup(name, details) {
    const popup = document.createElement("div");
    popup.className = "popup-info";
    popup.innerHTML = `<h3>${name}</h3><p>${details}</p>`;
    document.body.appendChild(popup);
    return popup;
}

function positionPopup(popup, event) {
    const padding = 10;
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const popupWidth = popup.offsetWidth;
    const popupHeight = popup.offsetHeight;

    let x = event.clientX + padding;
    let y = event.clientY + padding;

    if (x + popupWidth > viewportWidth) {
        x = viewportWidth - popupWidth - padding;
    }
    if (y + popupHeight > viewportHeight) {
        y = viewportHeight - popupHeight - padding;
    }

    popup.style.left = `${x}px`;
    popup.style.top = `${y}px`;
}

function handleObjectHover(event, object) {
    const popup = createInfoPopup(object.name, object.details);

    function onMouseMove(e) {
        positionPopup(popup, e);
    }
    document.addEventListener("mousemove", onMouseMove);

    function onMouseOut() {
        document.removeEventListener("mousemove", onMouseMove);
        popup.remove();
    }

    event.target.addEventListener("mouseleave", onMouseOut, { once: true });
}

// Helper function to detect the object being hovered in the 3D scene
function getIntersectedObject(event) {
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);

    const intersects = raycaster.intersectObjects(scene.children);
    return intersects.length > 0 ? intersects[0].object : null;
}

renderer.domElement.addEventListener("pointerover", (event) => {
    const intersects = getIntersectedObject(event);
    if (intersects) {
        handleObjectHover(event, intersects);
    }
});
