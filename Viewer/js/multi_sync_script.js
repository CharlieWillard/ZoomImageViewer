
var viewer1 = OpenSeadragon({
  id: "viewer1",
  prefixUrl: "img/",
  tileSources: "GeneratedImages/Img1/Img1.dzi",
  showNavigationControl: false,
  visibilityRatio: 1.0,
  defaultZoomLevel: 0.9,
  maxZoomPixelRatio: 4
});

var viewer2 = OpenSeadragon({
  id: "viewer2",
  prefixUrl: "img/",
  tileSources: "GeneratedImages/Img2/Img2.dzi",
  showNavigationControl: false,
  visibilityRatio: 1.0,
  defaultZoomLevel: 0.9,
  maxZoomPixelRatio: 4
});

var viewer3 = OpenSeadragon({
  id: "viewer3",
  prefixUrl: "img/",
  tileSources: "GeneratedImages/Img3/Img3.dzi",
  showNavigationControl: false,
  visibilityRatio: 1.0,
  defaultZoomLevel: 0.9,
  maxZoomPixelRatio: 4
});

var viewer4 = OpenSeadragon({
  id: "viewer4",
  prefixUrl: "img/",
  tileSources: "GeneratedImages/Img4/Img4.dzi",
  showNavigationControl: false,
  visibilityRatio: 1.0,
  defaultZoomLevel: 0.9,
  maxZoomPixelRatio: 4
});


var viewer1Leading = false;
var viewer2Leading = false;
var viewer3Leading = false;
var viewer4Leading = false;

var viewer1Handler = function() {
  if (viewer2Leading) {
    return;
  }

  if (viewer3Leading) {
    return;
  }
  
  if (viewer4Leading) {
    return;
  }
  
  viewer1Leading = true;
  viewer2.viewport.zoomTo(viewer1.viewport.getZoom());
  viewer3.viewport.zoomTo(viewer1.viewport.getZoom());
  viewer4.viewport.zoomTo(viewer1.viewport.getZoom());
  viewer2.viewport.panTo(viewer1.viewport.getCenter());
  viewer3.viewport.panTo(viewer1.viewport.getCenter());
  viewer4.viewport.panTo(viewer1.viewport.getCenter());
  viewer1Leading = false;
};

var viewer2Handler = function() {
  if (viewer1Leading) {
    return;
  }
  
  if (viewer3Leading) {
    return;
  }
  
  if (viewer4Leading) {
    return;
  }

  viewer2Leading = true;
  viewer1.viewport.zoomTo(viewer2.viewport.getZoom());
  viewer3.viewport.zoomTo(viewer2.viewport.getZoom());
  viewer4.viewport.zoomTo(viewer2.viewport.getZoom());
  viewer1.viewport.panTo(viewer2.viewport.getCenter());
  viewer3.viewport.panTo(viewer2.viewport.getCenter());
  viewer4.viewport.panTo(viewer2.viewport.getCenter());
  viewer2Leading = false;
};

var viewer3Handler = function() {
  if (viewer1Leading) {
    return;
  }
  
  if (viewer2Leading) {
    return;
  }
  
  if (viewer4Leading) {
    return;
  }

  viewer3Leading = true;
  viewer1.viewport.zoomTo(viewer3.viewport.getZoom());
  viewer2.viewport.zoomTo(viewer3.viewport.getZoom());
  viewer4.viewport.zoomTo(viewer3.viewport.getZoom());
  viewer1.viewport.panTo(viewer3.viewport.getCenter());
  viewer2.viewport.panTo(viewer3.viewport.getCenter());
  viewer4.viewport.panTo(viewer3.viewport.getCenter());
  viewer3Leading = false;
};

var viewer4Handler = function() {
  if (viewer1Leading) {
    return;
  }
  
  if (viewer2Leading) {
    return;
  }
  
  if (viewer3Leading) {
    return;
  }

  viewer4Leading = true;
  viewer1.viewport.zoomTo(viewer4.viewport.getZoom());
  viewer2.viewport.zoomTo(viewer4.viewport.getZoom());
  viewer3.viewport.zoomTo(viewer4.viewport.getZoom());
  viewer1.viewport.panTo(viewer4.viewport.getCenter());
  viewer2.viewport.panTo(viewer4.viewport.getCenter());
  viewer3.viewport.panTo(viewer4.viewport.getCenter());
  viewer4Leading = false;
};

viewer1.addHandler('zoom', viewer1Handler);
viewer2.addHandler('zoom', viewer2Handler);
viewer3.addHandler('zoom', viewer3Handler);
viewer4.addHandler('zoom', viewer4Handler);
viewer1.addHandler('pan', viewer1Handler);
viewer2.addHandler('pan', viewer2Handler);
viewer3.addHandler('pan', viewer3Handler);
viewer4.addHandler('pan', viewer4Handler);
