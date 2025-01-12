# Zoom Image Viewer

This tool allows conservators and other users to compare multiple images in a simple, user-friendly interface. It is designed to work with standard image files (JPG, PNG, TIFF) that are processed locally by your browser. Images do not leave your system, ensuring privacy and security. This tool assumes images are co-registered (aligned). If they are not, misalignment may appear in the viewer as the tool does not perform image registration.

## Features

- **2x2 Grid Layout**: View up to four images simultaneously for easy comparison.
- **Dynamic Zoom and Pan**: Synchronize zoom and pan across all viewers for seamless navigation.
- **Curtain Mode**: Overlay images and adjust visibility dynamically by moving the cursor, enabling interactive comparisons.
- **Simple File Input**: Load images directly from your computer using the intuitive interface.
- **Privacy Assured**: Images remain on your system and are not uploaded to any server.

## Requirements

- A modern web browser (e.g., Chrome, Firefox, Edge) with support for HTML5 and JavaScript.

## Getting Started

1. **Open the Tool**:

   - Access the viewer at the web deployment: [https://charliewillard.github.io/ZoomImageViewer/](https://charliewillard.github.io/ZoomImageViewer/)

2. **Load Images**:

   - Use the input buttons labeled "Image 1", "Image 2", etc., to select and load image files from your computer.

3. **Navigate**:

   - Use your mouse to pan and zoom on any image. All images will synchronize automatically.

4. **Toggle Curtain Mode**:

   - Check the "Curtain Viewer Mode" box to overlay the images. Move your cursor within the viewer to adjust visibility boundaries dynamically.

## File Formats Supported

- **Standard Image Formats**: JPG, PNG, and TIFF are supported for easy comparison.
- **Tiled Image Formats**: While the libraries used (e.g., OpenSeadragon) support tiled formats for very high-resolution imagery, browser restrictions may cause issues when loading such formats from local files. To use tiled images, consider hosting them online and making minor edits to the code.

## Limitations

- Large image files may impact performance depending on your browser and system capabilities.
- Images must be pre-aligned (co-registered) for accurate comparisons.

## Acknowledgments

This tool leverages OpenSeadragon for zooming and panning functionality, providing a powerful interface for image navigation. It is inspired by Rob Erdmann's demonstrations of his curtain viewer and has been independently developed for broader conservation and comparison use cases.
