# ZoomImageViewer

This repository contains code for four synchronised high-resolution image viewers, used to display high-resolution images for comparison. 

The code is designed to run in a browser using javascript. 

A demo of the viewer using this source code is available here: [https://charliewillard.github.io/ZoomImageViewer/](https://charliewillard.github.io/ZoomImageViewer/).
The demo uses a high-resolution image of the [Girl with a Pearl Earring](https://commons.wikimedia.org/wiki/File:Girl_with_a_Pearl_Earring_(Full_Renovation).jpg) image publicly available on wikimedia commons. The top left image shows the RGB image, with the other three view panels populated by the Red, Green and Blue channels of the image to demonstrate use of the viewer. This viewer has also been used to show other imaging modalities (e.g. infrared) in these other view panels for comparison across image modalities. 

To use this viewer with your own high-resolution images, replace the files in [GeneratedImages](GeneratedImages). 
The images must be in Deep Zoom Image (DZI) format. High-resolution images can be converted to DZI format images using [VIPS](https://github.com/libvips/libvips) with the command ```vips.exe dzsave <InputImagePath> <OutputImagePath>```. The file organisation must also remain unchanged, with images in DZI format stored within folders [/GeneratedImages/Img1](GeneratedImages/Img1), [/GeneratedImages/Img2](GeneratedImages/Img2), [/GeneratedImages/Img3](GeneratedImages/Img3), [/GeneratedImages/Img4](GeneratedImages/Img4).

To use this viewer locally (viewing files which are not hosted online), many browsers restrict the access to local files for security reasons. In Chrome this can be overridden with a flag such as --allow-file-access-from-files when starting. This can be achieved on Windows by creating a shortcut with the following target: ``` "C:\Program Files (x86)\Google\Chrome\Application\chrome.exe" file:///<full file path to index>index.html --allow-file-access-from-files ``` with ```<full file path to index>``` updated to the file path of your local file system (e.g. ```C:\Users\Username\Documents\ZoomViewer\index.html```). 
