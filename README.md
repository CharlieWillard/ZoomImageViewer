# ZoomImageViewer

This repository contains code for four synchronised high-resolution image viewers, used to display high-resolution images for comparison. 

The code is designed to run in a browser using javascript. 

A demo of the viewer using this source code is available here: [https://charliewillard.github.io/ZoomImageViewer/](https://charliewillard.github.io/ZoomImageViewer/).
The demo uses a high-resolution image of the [Girl with a Pearl Earring](https://commons.wikimedia.org/wiki/File:Girl_with_a_Pearl_Earring_(Full_Renovation).jpg) image publicly available on wikimedia commons. The top left image shows the RGB image, with the other three view panels populated by the Red, Green and Blue channels of the image to demonstrate use of the viewer. This viewer has also been used to show other imaging modalities (e.g. infrared) in these other view panels for comparison across image modalities. 

To use this viewer with your own high-resolution images, replace the files in [GeneratedImages](GeneratedImages). 
The images must be in Deep Zoom Image (DZI) format. High-resolution images can be converted to DZI format images using [VIPS](https://github.com/libvips/libvips) with the command ```vips.exe dzsave <InputImagePath> <OutputImagePath>```.
