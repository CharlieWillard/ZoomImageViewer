let images = []; // Global array to store resampled images
let curtainViewers = []; // Global array to store curtain viewers
let viewers = []; // Global array for grid viewers
let maxWidth = 0; // Global max width
let maxHeight = 0; // Global max height
let isSyncing = false; // Flag to prevent recursive synchronization
let isCurtainMode = false; // Flag to track if curtain mode is active

// Disable all inputs except the first one initially
function initializeImageInputs() {
    for (let i = 2; i <= 4; i++) {
        document.getElementById(`imageInput${i}`).disabled = true;
    }
}

// Enable the next input when the current image is loaded
function enableNextInput(currentIndex) {
    const nextInput = document.getElementById(`imageInput${currentIndex + 2}`);
    if (nextInput) {
        nextInput.disabled = false;
    }
}

// Set up event listeners for each image input
for (let i = 1; i <= 4; i++) {
    const input = document.getElementById(`imageInput${i}`);
    input.addEventListener('change', ((index) => (e) => {
        loadImage(e, index);
        enableNextInput(index);
    })(i - 1));
}

initializeImageInputs();

// Update grid layout dynamically based on the number of loaded images
function updateGridLayout(imageCount) {
    const grid = document.getElementById("imageGrid");

    if (imageCount === 1) {
        grid.style.gridTemplateColumns = "1fr";
        grid.style.gridTemplateRows = "1fr";
        grid.style.gridTemplateAreas = `"viewer1"`;
    } else if (imageCount === 2) {
        grid.style.gridTemplateColumns = "1fr 1fr";
        grid.style.gridTemplateRows = "1fr";
        grid.style.gridTemplateAreas = `"viewer1 viewer2"`;
    } else if (imageCount === 3) {
        grid.style.gridTemplateColumns = "1fr 1fr";
        grid.style.gridTemplateRows = "1fr 1fr";
        grid.style.gridTemplateAreas = `
            "viewer1 viewer2"
            "viewer3 viewer3"
        `;
    } else if (imageCount >= 4) {
        grid.style.gridTemplateColumns = "1fr 1fr";
        grid.style.gridTemplateRows = "1fr 1fr";
        grid.style.gridTemplateAreas = `
            "viewer1 viewer2"
            "viewer3 viewer4"
        `;
    }
}

// Initialize or update a viewer with the given image source
function initializeViewer(index, imageSrc) {
    // Destroy existing viewer if it exists
    if (viewers[index]) {
        viewers[index].destroy();
    }

    // Update grid layout
    const loadedImagesCount = images.filter((img) => img).length;
    updateGridLayout(loadedImagesCount);

    // Set up viewer cell
    const cellId = `viewer${index + 1}`;
    let cell = document.getElementById(cellId);

    if (!cell) {
        cell = document.createElement("div");
        cell.className = "image-cell";
        cell.id = cellId;
        document.getElementById("imageGrid").appendChild(cell);
    }

    cell.style.gridArea = `viewer${index + 1}`;
    cell.style.border = "none";
    cell.style.backgroundColor = "black";
    cell.style.display = "block"; // Ensure visibility

    // Create a new OpenSeadragon viewer
    const viewer = OpenSeadragon({
        id: cellId,
        prefixUrl: "https://cdnjs.cloudflare.com/ajax/libs/openseadragon/3.1.0/images/",
        tileSources: {
            type: "image",
            url: imageSrc,
            getTileHashKey: function (level, x, y) {
                return `grid-image-${index}-${level}-${x}-${y}`;
            },
        },
        showNavigationControl: false,
        maxZoomLevel: 20,
        visibilityRatio: 1.0,
        defaultZoomLevel: 0.9,
        maxZoomPixelRatio: 4,
        background: "black",
    });

    viewers[index] = viewer;
    viewer.addHandler("zoom", () => handleViewerInteraction(viewers, index));
    viewer.addHandler("pan", () => handleViewerInteraction(viewers, index));
}

// Load an image and dynamically adjust the layout
function loadImage(event, index) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
        const img = new Image();
        img.src = e.target.result;

        img.onload = () => {
            maxWidth = Math.max(maxWidth, img.width);
            maxHeight = Math.max(maxHeight, img.height);

            const resampledImage = resampleImage(img, maxWidth, maxHeight);
            images[index] = resampledImage;

            if (isCurtainMode) {
                initializeCurtainModeViewers();
            } else {
                initializeViewer(index, resampledImage);
            }
        };
    };
    reader.readAsDataURL(file);
}

// Resample an image to fit the target dimensions
function resampleImage(image, targetWidth, targetHeight) {
    const canvas = document.createElement("canvas");
    canvas.width = targetWidth;
    canvas.height = targetHeight;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(image, 0, 0, targetWidth, targetHeight);

    return canvas.toDataURL(); // Return the resampled image as a data URL
}

// Check if the device is touch-enabled
function isTouchDevice() {
    // Check if touch events are supported AND distinguish from hybrid laptops
    const hasTouchEvents = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const isMouseOnly = matchMedia('(pointer: fine)').matches;

    return hasTouchEvents && !isMouseOnly; // True only for genuine touch devices
}

// Initialize or update the curtain mode viewers
function initializeCurtainModeViewers() {
    const imageGrid = document.getElementById('imageGrid');
    imageGrid.innerHTML = '';

    // Determine how to distribute images across viewers
    const loadedImages = images.filter((img) => img);
    const imageCount = loadedImages.length;

    for (let i = 0; i < 4; i++) {
        let imageSrc;
        if (imageCount === 1) {
            imageSrc = loadedImages[0];
        } else if (imageCount === 2) {
            imageSrc = i % 2 === 0 ? loadedImages[0] : loadedImages[1];
        } else if (imageCount === 3) {
            imageSrc = i < 3 ? loadedImages[i] : loadedImages[2];
        } else {
            imageSrc = loadedImages[i];
        }

        initializeCurtainViewer(i, imageSrc);
    }

    const imageGridContainer = document.getElementById('imageGrid');

    if (isTouchDevice()) {
        // For touch devices, center the splits
        setCentralSplitForTouch();
        console.log("Touch device detected: Fixed central split applied.");
        imageGridContainer.removeEventListener('mousemove', updateCurtainBoundaries); // Ensure no mousemove event
    } else {
        // For non-touch devices, enable cursor-based splits
        imageGridContainer.addEventListener('mousemove', updateCurtainBoundaries);
        console.log("Non-touch device detected: Reactive split applied.");
    }
}


// Function to initialize or update a curtain viewer
function initializeCurtainViewer(index, imageSrc) {
    if (curtainViewers[index]) {
        curtainViewers[index].destroy();
    }

    const curtainDivId = `curtainViewer${index + 1}`;
    let curtainDiv = document.getElementById(curtainDivId);

    if (!curtainDiv) {
        curtainDiv = document.createElement("div");
        curtainDiv.className = "curtain-viewer";
        curtainDiv.id = curtainDivId;
        document.getElementById("imageGrid").appendChild(curtainDiv);

        curtainDiv.style.position = "absolute";
        curtainDiv.style.top = "0";
        curtainDiv.style.left = "0";
        curtainDiv.style.width = "100%";
        curtainDiv.style.height = "100%";
        curtainDiv.style.clipPath = "none";
        curtainDiv.style.transition = "clip-path 0s ease";
        curtainDiv.style.zIndex = `${index + 1}`;
    }

    const viewer = OpenSeadragon({
        id: curtainDivId,
        prefixUrl: "https://cdnjs.cloudflare.com/ajax/libs/openseadragon/3.1.0/images/",
        tileSources: {
            type: "image",
            url: imageSrc,
            getTileHashKey: function (level, x, y) {
                return `curtain-image-${index}-${level}-${x}-${y}`;
            },
        },
        showNavigationControl: false,
        maxZoomLevel: 20,
        visibilityRatio: 1.0,
        defaultZoomLevel: 0.9,
        maxZoomPixelRatio: 4,
        background: "black",
    });

    curtainViewers[index] = viewer;
    viewer.addHandler("zoom", () => handleViewerInteraction(curtainViewers, index));
    viewer.addHandler("pan", () => handleViewerInteraction(curtainViewers, index));
}

// Set central split for curtain mode on touch devices
function setCentralSplitForTouch() {
    curtainViewers.forEach((viewer, index) => {
        const element = document.getElementById(`curtainViewer${index + 1}`);
        if (element) {
            let clipPath;
            switch (index) {
                case 0: // Top-left
                    clipPath = `polygon(0 0, 0 50%, 50% 50%, 50% 0)`;
                    break;
                case 1: // Top-right
                    clipPath = `polygon(50% 0, 50% 50%, 100% 50%, 100% 0)`;
                    break;
                case 2: // Bottom-left
                    clipPath = `polygon(0 50%, 0 100%, 50% 100%, 50% 50%)`;
                    break;
                case 3: // Bottom-right
                    clipPath = `polygon(50% 50%, 50% 100%, 100% 100%, 100% 50%)`;
                    break;
            }
            element.style.clipPath = clipPath;
        }
    });
}

// Update curtain boundaries based on mouse movement (for non-touch devices)
function updateCurtainBoundaries(event) {
    const rect = document.getElementById('imageGrid').getBoundingClientRect();
    const offsetX = 2; // Small horizontal offset
    const offsetY = 2; // Small vertical offset

    const adjustedX = Math.min(Math.max(event.clientX - rect.left + offsetX, 0), rect.width);
    const adjustedY = Math.min(Math.max(event.clientY - rect.top + offsetY, 0), rect.height);

    const xPercent = (adjustedX / rect.width) * 100;
    const yPercent = (adjustedY / rect.height) * 100;

    curtainViewers.forEach((viewer, index) => {
        const element = document.getElementById(`curtainViewer${index + 1}`);
        if (element) {
            let clipPath;
            switch (index) {
                case 0: // Top-left
                    clipPath = `polygon(0 0, 0 ${yPercent}%, ${xPercent}% ${yPercent}%, ${xPercent}% 0)`;
                    break;
                case 1: // Top-right
                    clipPath = `polygon(${xPercent}% 0, ${xPercent}% ${yPercent}%, 100% ${yPercent}%, 100% 0)`;
                    break;
                case 2: // Bottom-left
                    clipPath = `polygon(0 ${yPercent}%, 0 100%, ${xPercent}% 100%, ${xPercent}% ${yPercent}%)`;
                    break;
                case 3: // Bottom-right
                    clipPath = `polygon(${xPercent}% ${yPercent}%, ${xPercent}% 100%, 100% 100%, 100% ${yPercent}%)`;
                    break;
            }
            element.style.clipPath = clipPath;
        }
    });
}
// Synchronize viewers when interaction happens
function handleViewerInteraction(viewersArray, leadingIndex) {
    if (isSyncing || !viewersArray[leadingIndex]) return;
    isSyncing = true;

    const leadingViewer = viewersArray[leadingIndex];
    const leadingZoom = leadingViewer.viewport.getZoom();
    const leadingCenter = leadingViewer.viewport.getCenter();

    viewersArray.forEach((viewer, index) => {
        if (viewer && index !== leadingIndex) {
            viewer.viewport.zoomTo(leadingZoom, null, false);
            viewer.viewport.panTo(leadingCenter, false);
        }
    });

    isSyncing = false;
}

// Add event listener for curtain toggle
document.getElementById('toggleCurtainMode').addEventListener('change', (e) => {
    const imageGridContainer = document.getElementById('imageGrid');

    if (e.target.checked) {
        isCurtainMode = true;
        initializeCurtainModeViewers();
    } else {
        isCurtainMode = false;
        imageGridContainer.removeEventListener('mousemove', updateCurtainBoundaries);
        disableCurtainMode(viewers);
    }
});

// Disable curtain mode and reload grid view
function disableCurtainMode(viewers) {
    isCurtainMode = false;

    const imageGrid = document.getElementById('imageGrid');
    imageGrid.innerHTML = '';
    imageGrid.style.position = '';

    viewers.length = 0;
    images.forEach((imageSrc, index) => {
        initializeViewer(index, imageSrc);
    });

    curtainViewers.length = 0;
}
