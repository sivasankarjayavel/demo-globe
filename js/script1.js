import * as THREE from 'https://cdn.skypack.dev/three@0.137';
import { OrbitControls } from "https://cdn.skypack.dev/three-stdlib@2.8.5/controls/OrbitControls";
// import { CSS3DRenderer, CSS3DObject } from 'https://cdn.jsdelivr.net/npm/three-css2drender-types@1.0.3/CSS2DRenderer.min.js';
import {
  CSS3DRenderer,
  CSS3DObject
} from "https://cdn.skypack.dev/three@0.136.0/examples/jsm/renderers/CSS3DRenderer.js";


var camera, scene, renderer;

var raycaster = new THREE.Raycaster();

var scene2, renderer2;

var controls;

// var frustumSize = 500;

// Initial camera height
var cameraY = 1000 * 10000;

var distanceRef = 1000;

var container = document.getElementById('container');

init();
animate();

function init() {
  var aspect = window.innerWidth / window.innerHeight;

  // orthographic camera
  // camera = new THREE.OrthographicCamera(
  //   (frustumSize * aspect) / -2,
  //   (frustumSize * aspect) / 2,
  //   frustumSize / 2,
  //   frustumSize / -2,
  //   1,
  //   10000
  // );

  //perspective camera
  camera = new THREE.PerspectiveCamera(
    70,
    aspect,
    0.001,
    999999999
  );

  camera.position.set(0, cameraY, 0);

  scene = new THREE.Scene();
  // scene.background = new THREE.Color(0.4, 0.4, 0.4);
  scene2 = new THREE.Scene();

  renderer = new THREE.WebGLRenderer({
    alpha: true
  });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  //The following 2 lines are needed to ensure that the two renders are aligned
  // renderer.domElement.style.position = "absolute";
  // renderer.domElement.style.top = 0;
  // Set zIndex
  renderer.domElement.style.zIndex = 0;
  container.appendChild(renderer.domElement);

  var globe = new THREE.Mesh(
    new THREE.SphereGeometry(90, 128, 128),
    new THREE.MeshPhongMaterial()
  );
  scene.add(globe);


  renderer2 = new CSS3DRenderer(globe);
  renderer2.setSize(window.innerWidth, window.innerHeight);

  //  The following 2 lines are needed to ensure that the two renders are aligned
  renderer2.domElement.style.position = "absolute";
  renderer2.domElement.style.top = 0;
  // Set zIndex
  renderer2.domElement.style.zIndex = -1;
  container.appendChild(renderer2.domElement);

  //controls act on the top-level domElement
  controls = new OrbitControls(camera, renderer.domElement);
  // var controls = new OrbitControls(camera, renderer2.domElement);

  // controls.minZoom = 1;
  // controls.maxZoom = 100;

  //Defines how the camera's position will move when panning
  controls.screenSpacePanning = false;

  // function createPlane(width, height, cssColor, pos, rot) {
  //   // var element = document.createElement("div");
  //   // element.style.width = width + "px";
  //   // element.style.height = height + "px";
  //   // element.style.opacity = 0.5;
  //   // element.style.background = cssColor;

  //   // var object = new CSS3DObject(element);
  //   // object.position.copy(pos);
  //   // object.rotation.copy(rot);
  //   // scene2.add(object);

  //   //Create an object with the same size and position as the css3d object and check whether the css3d object is correct
  //   var geometry =  new THREE.SphereGeometry(90, 128, 128)
  //   var mesh = new THREE.Mesh(geometry, material);
  //   mesh.position.copy(object.position);
  //   mesh.rotation.copy(object.rotation);
  //   scene.add(mesh);
  // }

  window.addEventListener("resize", onWindowResize, false);

}

function onWindowResize() {
  var aspect = window.innerWidth / window.innerHeight;
  // camera.left = (-frustumSize * aspect) / 2;
  // camera.right = (frustumSize * aspect) / 2;
  // camera.top = frustumSize / 2;
  // camera.bottom = -frustumSize / 2;

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);

  renderer2.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
  requestAnimationFrame(animate);

  renderer.render(scene, camera);
  renderer2.render(scene2, camera);

  controls.update();
}

///////////////////////////////////////////////////////////////

//The x-axis range corresponding to the unit longitude length in the world coordinate system
// var LONGITUDE_X = 10;

// The scaling effect can be achieved by adjusting LONGITUDE_X + dq()
// It can improve the problem of the previous method (camera controls scaling) causing lag and confusion after zooming in to a certain level.
// Need to recalculate the position of the object after scaling
var LONGITUDE_X = 111000;

// Calculate the {position.x} value in the world coordinate system based on {longitude}
function longitude2world(lon) {
  return lon * LONGITUDE_X;
}
function world2longitude(x) {
  return x / LONGITUDE_X;
}

// Calculate {Mercator y value}/{Mercator x value of unit longitude} corresponding to {latitude}
// Meaning: Given latitude, the calculation result is the {position.z} value of latitude in the current world coordinate system
// Note: The positive value of the z-axis is south latitude
function latitude2world(lat) {
  // Convert latitude from degrees to radians
  var a = lat * Math.PI / 180;
  // Calculate the Mercator projection
  var r = 180.0 / (2 * Math.PI) * Math.log((1.0 + Math.sin(a)) / (1.0 - Math.sin(a)));
  // Scale the result by the constant LONGITUDE_X
  r *= LONGITUDE_X;
  // Invert the result
  r = -r;
  // Return the calculated world coordinate
  return r;
}

// Inverse function of m function 
function world2latitude(z) {
  var zz = -z;
  zz = zz / LONGITUDE_X;
  var a = Math.exp(2 * Math.PI * zz / 180);
  var lat = Math.asin((a - 1) / (a + 1));
  lat = lat * 180 / Math.PI;
  return lat;
}

var mapDomWidth = 1500;
var mapDomHeight = 1500;
var element =  document.getElementById('map');
// element.style.width = mapDomWidth + "px";
// element.style.height = mapDomWidth + "px";
element.style.opacity = 1;

//map
var map = new ol.Map({
  target: "map",
  layers: [
    new ol.layer.Tile({
      source: new ol.source.OSM({
        wrapX: true,
      }),
    }),

    // new ol.layer.Tile({
    //   source: new ol.source.XYZ({
    //     url:
    //       'http://pngchart.ehanghai.cn/htcx/{z}/{y}/{x}.png'
    //     // 'https://www.chart.msa.gov.cn/arcgis/rest/services/CHARTCELL/MapServer/tile/{z}/{x}/{y}'
    //   }),
    // }),

    new ol.layer.Tile({
      source: new ol.source.TileDebug()
    }),

    // new ol.layer.Graticule({
    //   strokeStyle: new ol.style.Stroke({
    //     color: 'rgba(255,120,0,0.9)',
    //     width: 1,
    //     lineDash: [0.5, 4],
    //   }),
    //   showLabels: true,
    //   wrapX: true,
    // })
  ],
  view: new ol.View({
    center: ol.proj.fromLonLat([121, 20]),
    zoom: 4
  })
});

//css3d object
var mapObject = new CSS3DObject(element);
mapObject.position.set(100,0,100);
// mapObject.rotation.copy(rot);
mapObject.rotation.x = -Math.PI / 2;
scene2.add(mapObject);

var plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);

//todo is invalid, the source code needs to be changed
container.addEventListener("mousedown", function (e) {
  // console.log(e);
}, true);

//Click to show coordinates
container.addEventListener("click", function (event) {
  var mouse = new THREE.Vector3();

  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;

  //Mouse click point-->plane coordinates
  raycaster.setFromCamera(mouse, camera);
  var pos = new THREE.Vector3();
  raycaster.ray.intersectPlane(plane, pos);
  // console.log('center position', pos);

  var centerLongitude = world2longitude(pos.x);
  var centerLatitude = world2latitude(pos.z);
  console.log('long', centerLongitude, 'lat', centerLatitude);

}, true);


//Controls change events, align map when panning and zooming
var cameraPosition = new THREE.Vector3();
var cameraRotation = new THREE.Vector3();
controls.addEventListener("change", function (e) {

  // var mode = "none";
  // var NUMBER_MIN = 0.00000001;
  // if (
  //   cameraPosition.y == e.target.object.position.y &&
  //   Math.abs(cameraRotation.x - e.target.object.rotation.x) < NUMBER_MIN &&
  //   Math.abs(cameraRotation.y - e.target.object.rotation.y) < NUMBER_MIN &&
  //   Math.abs(cameraRotation.z - e.target.object.rotation.z) < NUMBER_MIN
  // ) {
  //   mode = "pan";
  // } else {
  //   if (Math.abs(cameraRotation.x - e.target.object.rotation.x) < NUMBER_MIN &&
  //     Math.abs(cameraRotation.y - e.target.object.rotation.y) < NUMBER_MIN &&
  //     Math.abs(cameraRotation.z - e.target.object.rotation.z) < NUMBER_MIN) {
  //     mode = "zoom"
  //   } else {
  //     mode = "rotate";
  //   }
  // }
  // cameraPosition.copy(e.target.object.position);
  // cameraRotation.copy(e.target.object.rotation);
  // // console.log(mode);

  // if (mode === "rotate") {
  //   return;
  // }

  dq();

});

//map alignment
function dq() {
  //Screen center point --> camera plane coordinates
  // var a = new THREE.Vector3( 0.5, 0.5, 0 ).unproject( camera );
  // console.log(a);
  // mapObject.position.x = a.x;
  // mapObject.position.y = a.y;
  // mapObject.position.z = a.z;

  //Screen center point-->plane coordinates
  raycaster.setFromCamera(new THREE.Vector3(0, 0, 0), camera);
  var pos = new THREE.Vector3();
  raycaster.ray.intersectPlane(plane, pos);
  // console.log(pos);

  var centerLongitude = world2longitude(pos.x);
  var centerLatitude = world2latitude(pos.z);
  // console.log('center long', centerLongitude, 'center lat', centerLatitude);

  var distance = raycaster.ray.distanceToPlane(plane);

  var scale = distance / distanceRef;

  var mapWidth = mapDomWidth * scale;//
  var mapHeight = mapDomHeight * scale;//

  var mapCenterLonLat = ol.proj.transform(map.getView().getCenter(), 'EPSG:3857', 'EPSG:4326')
  // console.log(mapCenterLonLat);

  //Latitude limit
  if (world2latitude(pos.z - mapHeight / 2) < 85
    && world2latitude(pos.z + mapHeight / 2) > -85) {

    //Translate and scale the mapObject, keeping the size of the css3 object in the screen coordinate system unchanged

    //Map alignment, center point
    mapObject.position.x = pos.x;
    mapObject.position.z = pos.z;
    map.getView().setCenter(ol.proj.fromLonLat([centerLongitude, centerLatitude]));

    //Map alignment, zoomLevel
    // Limit maximum zoomLevel
    let zoomLevel = Math.log2(
      (360.0 * mapDomWidth) / 256.0 / (mapWidth / LONGITUDE_X)
    );
    if (zoomLevel < 20) {
      mapObject.scale.set(scale, scale, scale);
      map.getView().setZoom(zoomLevel);
    } else {
      console.log("zoomLevel", zoomLevel);
    }

  } else {
    //Translate mapObject, x-axis
    mapObject.position.x = pos.x;

    //Map alignment, longitude direction
    map.getView().setCenter(ol.proj.fromLonLat([centerLongitude, mapCenterLonLat[1]]));

    return;
  }
  return;
}

// camera initial position

camera.position.set(longitude2world(121), cameraY, latitude2world(21));
controls.target = new THREE.Vector3(longitude2world(121), 0, latitude2world(21))
camera.updateProjectionMatrix ()
controls.update();

renderer.render(scene, camera);
renderer2.render(scene2, camera);

dq()