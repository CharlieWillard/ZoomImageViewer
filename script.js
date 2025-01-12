let images = []; // Global array to store resampled images
let curtainViewers = []; // Global array to store curtain viewers
let viewers = []; // Global array for grid viewers
let maxWidth = 0; // Global max width
let maxHeight = 0; // Global max height
let isSyncing = false; // Flag to prevent recursive synchronization
let isCurtainMode = false; // Flag to track if curtain mode is active

// Set up event listeners for each image input
for (let i = 1; i <= 4; i++) {
    const input = document.getElementById(`imageInput${i}`);
    input.addEventListener('change', ((index) => (e) => loadImage(e, index))(i - 1));
}

// Function to load an image into a specific slot
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
            images[index] = resampledImage; // Update the global images array

            if (isCurtainMode) {
                initializeCurtainViewer(index, resampledImage);
            } else {
                initializeViewer(index, resampledImage);
            }
        };
    };
    reader.readAsDataURL(file);
}

// Function to initialize or update a grid viewer
function initializeViewer(index, imageSrc) {
    // If viewer already exists, destroy it first
    if (viewers[index]) {
        viewers[index].destroy();
    }

    const cellId = `viewer${index + 1}`;
    let cell = document.getElementById(cellId);

    // If cell doesn't exist, create it
    if (!cell) {
        cell = document.createElement('div');
        cell.className = 'image-cell';
        cell.id = cellId;
        document.getElementById('imageGrid').appendChild(cell);
    }

    // Style the grid cells
    cell.style.border = "none"; // Remove borders
    cell.style.backgroundColor = "black"; // Set background color

    // Create a new OpenSeadragon viewer
    const viewer = OpenSeadragon({
        id: cellId,
        prefixUrl: "https://cdnjs.cloudflare.com/ajax/libs/openseadragon/3.1.0/images/",
        tileSources: {
            type: 'image',
            url: imageSrc,
            cacheKey: `grid-image-${index}`, // Add a unique cacheKey
            getTileHashKey: function(level, x, y) {
                return `grid-image-${index}-${level}-${x}-${y}`; // Custom hash for tiles
            },
        },
        showNavigationControl: false, // Disable navigation buttons
        maxZoomLevel: 20, // Allow higher zoom levels
        visibilityRatio: 1.0,
        defaultZoomLevel: 0.9,
        maxZoomPixelRatio: 4,
        background: "black" // Set viewer background color
    });

    viewers[index] = viewer; // Store the viewer in the global array

    viewer.addHandler('zoom', () => handleViewerInteraction(viewers, index));
    viewer.addHandler('pan', () => handleViewerInteraction(viewers, index));
}

// Function to initialize or update a curtain viewer
function initializeCurtainViewer(index, imageSrc) {
    // If viewer already exists, destroy it first
    if (curtainViewers[index]) {
        curtainViewers[index].destroy();
    }

    const curtainDivId = `curtainViewer${index + 1}`;
    let curtainDiv = document.getElementById(curtainDivId);

    // If curtain div doesn't exist, create it
    if (!curtainDiv) {
        curtainDiv = document.createElement('div');
        curtainDiv.className = 'curtain-viewer';
        curtainDiv.id = curtainDivId;
        document.getElementById('imageGrid').appendChild(curtainDiv);

        // Style for curtain stacking
        curtainDiv.style.position = 'absolute';
        curtainDiv.style.top = '0';
        curtainDiv.style.left = '0';
        curtainDiv.style.width = '100%';
        curtainDiv.style.height = '100%';
        curtainDiv.style.clipPath = 'none'; // Initially no clipping
        curtainDiv.style.transition = 'clip-path 0s ease'; // Smooth transitions
        curtainDiv.style.zIndex = `${index + 1}`; // Ensure proper stacking order
    }

    // Create a new OpenSeadragon viewer
    const viewer = OpenSeadragon({
        id: curtainDivId,
        prefixUrl: "https://cdnjs.cloudflare.com/ajax/libs/openseadragon/3.1.0/images/",
        tileSources: {
            type: 'image',
            url: imageSrc,
            cacheKey: `curtain-image-${index}`, // Add a unique cacheKey
            getTileHashKey: function(level, x, y) {
                return `curtain-image-${index}-${level}-${x}-${y}`; // Custom hash for tiles
            },
        },
        showNavigationControl: false, // Disable navigation buttons
        maxZoomLevel: 20, // Allow higher zoom levels
        visibilityRatio: 1.0,
        defaultZoomLevel: 0.9,
        maxZoomPixelRatio: 4,
        background: "black" // Set viewer background color
    });

    curtainViewers[index] = viewer; // Store the viewer in the curtain array

    viewer.addHandler('zoom', () => handleViewerInteraction(curtainViewers, index));
    viewer.addHandler('pan', () => handleViewerInteraction(curtainViewers, index));
}

// Function to synchronize viewers when interaction happens
function handleViewerInteraction(viewersArray, leadingIndex) {
    if (isSyncing || !viewersArray[leadingIndex]) return; // Prevent recursive synchronization or undefined access
    isSyncing = true;

    const leadingViewer = viewersArray[leadingIndex];
    const leadingZoom = leadingViewer.viewport.getZoom();
    const leadingCenter = leadingViewer.viewport.getCenter();

    viewersArray.forEach((viewer, index) => {
        if (viewer && index !== leadingIndex) {
            viewer.viewport.zoomTo(leadingZoom, null, false); // Enable animation for smooth zoom
            viewer.viewport.panTo(leadingCenter, false); // Enable animation for smooth pan
        }
    });

    isSyncing = false; // Reset the flag after synchronization
}

// Function to resample an image
function resampleImage(image, targetWidth, targetHeight) {
    const canvas = document.createElement('canvas');
    canvas.width = targetWidth;
    canvas.height = targetHeight;

    const ctx = canvas.getContext('2d');
    ctx.drawImage(image, 0, 0, targetWidth, targetHeight);

    return canvas.toDataURL(); // Return the resampled image as a data URL
}

// Function to enable curtain mode
function enableCurtainMode(images, width, height) {
    isCurtainMode = true; // Set curtain mode flag

    const imageGrid = document.getElementById('imageGrid');
    imageGrid.innerHTML = ''; // Clear grid view
    imageGrid.style.position = 'relative'; // Prepare for stacking

    // Initialize OpenSeadragon viewers for curtain mode
    images.forEach((imageSrc, index) => {
        initializeCurtainViewer(index, imageSrc);
    });

    // Add curtain interactivity
    const imageGridContainer = document.getElementById('imageGrid');
    imageGridContainer.addEventListener('mousemove', updateCurtainBoundaries);
}

// Function to disable curtain mode and reload grid view
function disableCurtainMode(viewers) {
    isCurtainMode = false; // Clear curtain mode flag

    const imageGrid = document.getElementById('imageGrid');
    imageGrid.innerHTML = ''; // Clear curtain mode
    imageGrid.style.position = ''; // Reset position

    // Reinitialize viewers
    viewers.length = 0; // Clear the viewers array
    images.forEach((imageSrc, index) => {
        initializeViewer(index, imageSrc);
    });

    // Clear curtain viewers
    curtainViewers.length = 0;
}

// Function to update curtain boundaries
function updateCurtainBoundaries(event) {
    const rect = document.getElementById('imageGrid').getBoundingClientRect();
    const offsetX = 2; // Small horizontal offset
    const offsetY = 2; // Small vertical offset

    // Adjust cursor position to stay within bounds of Image 1
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

// Add event listener for curtain toggle
document.getElementById('toggleCurtainMode').addEventListener('change', (e) => {
    if (e.target.checked) {
        enableCurtainMode(images, maxWidth, maxHeight);
    } else {
        disableCurtainMode(viewers);
    }
});
