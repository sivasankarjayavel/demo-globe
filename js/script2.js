import * as THREE from 'https://cdn.skypack.dev/three@0.137';
import { OrbitControls } from "https://cdn.skypack.dev/three-stdlib@2.8.5/controls/OrbitControls";
import {CSS3DObject,CSS3DRenderer} from 'https://cdn.skypack.dev/three@0.136.0/examples/jsm/renderers/CSS3DRenderer.js'

var renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
// renderer.physicallyCorrectLights = true;

var raycaster = new THREE.Raycaster();

var scene = new THREE.Scene();
scene.background = new THREE.Color(0xa0a0a0);

// var hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444,1);  //( skyColor : Integer, groundColor : Integer, intensity : Float )
// var dirLight = new THREE.DirectionalLight(0xffffff,0.1);
// hemiLight.position.set(0, 100, 0);
// hemiLight.matrixAutoUpdate = false;
// hemiLight.updateMatrix();

// dirLight.position.set(3, 10, 1000);
// dirLight.castShadow = true;

// scene.add(hemiLight);
// scene.add(dirLight);

// Lights
const ambientlight = new THREE.AmbientLight(0xffffff);    //(color,intensity)  - light globally illuminates all objets means emitted all point in all directions
scene.add(ambientlight);

var camera = new THREE.OrthographicCamera(
    -window.innerWidth / 4,
    window.innerWidth / 4,
    window.innerHeight / 4,
    -window.innerHeight / 4,
    1,
    1000
);

camera.position.set(0, 0, 100);

var globe = new THREE.Mesh(
    new THREE.SphereGeometry(90, 128, 128),
    new THREE.MeshPhongMaterial()
);
scene.add(globe);

var controls = new OrbitControls(camera, renderer.domElement);

controls.enablePan = false;
controls.enableZoom = true;
controls.enableDamping = false;
controls.target.set(0, 0, 0);
controls.update();
controls.screenSpacePanning = false;

var osm = new ol.layer.Tile({
    // extent: [-180, -90, 180, 90],
    source: new ol.source.OSM({
        // preload:5,
        // tilePixelRatio: 2
    })
});

var view = new ol.View({
    projection: "EPSG:4326",
    extent: [-180, -90, 180, 90],
    // center: [40.0, -110.0],
    center: ol.proj.fromLonLat([121, 20]),
    // duration: 500, // Set the duration in milliseconds
    zoom: 2
});

var map = new ol.Map({
    layers: [
        new ol.layer.Tile({
            extent: [-180, -90, 180, 90],
            source: new ol.source.OSM({
                wrapX: true,
                // maxZoom: 2
            })
        }),
        osm,
        new ol.layer.Tile({
            source: new ol.source.TileDebug()
        })
    ],
    target: "map",
    view: view
});


map.on("rendercomplete", function () {
    // Create a new canvas element
    var mapCanvas = document.createElement("canvas");
    // Get the size of the map in pixels
    var size = map.getSize();
    // console.log(size);
    // Set the width and height of the canvas, taking into account the device pixel ratio
    mapCanvas.width = size[0] * window.devicePixelRatio;
    mapCanvas.height = size[1] * window.devicePixelRatio;
    // Get the 2D rendering context of the canvas
    var mapContext = mapCanvas.getContext("2d");
    // Iterate through all canvas elements in the OpenLayers map layers
    Array.prototype.forEach.call(
        document.querySelectorAll(".ol-layer canvas"),
        function (canvas) {
            if (canvas.width > 0) {
                // Get the opacity of the canvas's parent node
                var opacity = canvas.parentNode.style.opacity;
                // Set the global alpha (transparency) of the rendering context
                mapContext.globalAlpha = opacity === "" ? 1 : Number(opacity);
                // Get the transform style of the canvas
                var transform = canvas.style.transform;
                // Parse the transform matrix values
                var matrix = transform
                    .match(/^matrix\(([^\(]*)\)$/)[1]
                    .split(",")
                    .map(Number);
                // Apply the transform matrix to the rendering context
                CanvasRenderingContext2D.prototype.setTransform.apply(
                    mapContext,
                    matrix
                );
                // Draw the canvas onto the new canvas
                mapContext.drawImage(canvas, 0, 0);
            }
            else {
                console.error('Error');
            }
        }
    );
    // Create a THREE.js CanvasTexture using the generated canvas
    var texture = new THREE.CanvasTexture(mapCanvas);
    // Assign the texture to the material of the globe
    globe.material.map = texture;
    // Notify THREE.js that the material needs an update
    globe.material.needsUpdate = true;
});

function _getMercator(poi) {//[114.32894, 30.585748]
    var mercator = {};
    var earthRad = 6378137.0;
    // console.log("mercator-poi",poi);
    mercator.x = poi.lng * Math.PI / 180 * earthRad;
    var a = poi.lat * Math.PI / 180;
    mercator.y = earthRad / 2 * Math.log((1.0 + Math.sin(a)) / (1.0 - Math.sin(a)));
    console.log("mercator",mercator);
    return mercator; //[12727039.383734727, 3579066.6894065146]
}

function _getLngLat(poi) {
    var lnglat = {};
    lnglat.lng = poi.x / 20037508.34 * 180;
    var mmy = poi.y / 20037508.34 * 180;
    lnglat.lat = 180 / Math.PI * (2 * Math.atan(Math.exp(mmy * Math.PI / 180)) - Math.PI / 2);
    return lnglat;
}

var LONGITUDE_X = 111000;

// Calculate the {position.x} value in the world coordinate system based on {longitude}
function longitude2world(lon) {
    return lon * LONGITUDE_X;
}
function world2longitude(x) {
    return x / LONGITUDE_X;
}

function latitude2world(lat) {
    var a = lat * Math.PI / 180;
    var r = 180.0 / (2 * Math.PI) * Math.log((1.0 + Math.sin(a)) / (1.0 - Math.sin(a)));
    r *= LONGITUDE_X;
    r = -r;
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

//grid
// var gridHelper = new THREE.GridHelper(360 * LONGITUDE_X, 36, 0xff0000);
// var gridHelper = new THREE.GridHelper(100, 100, 0xff0000);
// gridHelper.position.x = longitude2world(121);
// gridHelper.position.z = latitude2world(21);
// gridHelper.rotation.x = - Math.PI / 2;
// scene.add(gridHelper);

//Auxiliary line to check whether the latitude is correct
// function initLines(lat) {
//     var material = new THREE.LineBasicMaterial({
//         color: 0x0000ff
//     });
//     var points = [];
//     points.push(new THREE.Vector3(longitude2world(- 180), 0, latitude2world(lat)));
//     points.push(new THREE.Vector3(longitude2world(180), 0, latitude2world(lat)));
//     var geometry = new THREE.BufferGeometry().setFromPoints(points);
//     var line = new THREE.Line(geometry, material);
//     // scene.add(line);
// }
// initLines(0);
// initLines(10);
// initLines(20);
// initLines(30);
// initLines(40);
// initLines(50);
// initLines(60);



//Small squares for testing
// The block size corresponds to about 1 minute on the map
// for (let i = 0; i < 1000; i++) {
//     var geometry = new THREE.BoxBufferGeometry(1 / 3600 * LONGITUDE_X, 1 / 3600 * LONGITUDE_X, 1 / 3600 * LONGITUDE_X);
//     var material = new THREE.MeshBasicMaterial({
//         color: 0xff0000,
//         // wireframe: true,
//         wireframeLinewidth: 1,
//         // side: THREE.DoubleSide
//     });
//     var mesh = new THREE.Mesh(geometry, material);
//     mesh.position.x = longitude2world(121 + i * 1 / 3600)
//     mesh.position.z = latitude2world(21)
//     scene.add(mesh);
// }


var mapDomWidth = 100
var mapDomHeight = 100
var element = document.getElementById("map");
element.style.width = mapDomWidth + "px";
element.style.height = mapDomHeight + "px";
element.style.opacity = 1;

var axesHelper = new THREE.AxesHelper(300);
scene.add(axesHelper);

var plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
// var helper = new THREE.PlaneHelper(plane, 350, 0x000000);
// scene.add(helper);
// var container = document.getElementById('map')


var container = document.getElementById("container");
container.addEventListener("mousedown", function (e) {
    // console.log(e);
}, true);

//Click to show coordinates
container.addEventListener("click", function (event) {
    var mouse = new THREE.Vector2();

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
    // console.log(e);
    // console.log(e.target.object.rotation);

    // pan、rotate、Determination of zoom
    var mode = "none";
    var NUMBER_MIN = 0.00000001;
    if (
        cameraPosition.y == e.target.object.position.y &&
        Math.abs(cameraRotation.x - e.target.object.rotation.x) < NUMBER_MIN &&
        Math.abs(cameraRotation.y - e.target.object.rotation.y) < NUMBER_MIN &&
        Math.abs(cameraRotation.z - e.target.object.rotation.z) < NUMBER_MIN
    ) {
        mode = "pan";
    } else {
        if (Math.abs(cameraRotation.x - e.target.object.rotation.x) < NUMBER_MIN &&
            Math.abs(cameraRotation.y - e.target.object.rotation.y) < NUMBER_MIN &&
            Math.abs(cameraRotation.z - e.target.object.rotation.z) < NUMBER_MIN) {
            mode = "zoom"
        } else {
            mode = "rotate";
        }
    }
    cameraPosition.copy(e.target.object.position);
    cameraRotation.copy(e.target.object.rotation);
    // console.log(mode);

    if (mode === "rotate") {
        return;
    }

});

var currentWidth = 1000;

controls.addEventListener("end", function (event) {

    raycaster.setFromCamera({ x: 0, y: 0 }, camera);

    let intersects = raycaster.intersectObject(globe);

    let x = -map.getCoordinateFromPixel([
        intersects[0].uv.x * currentWidth,
        (intersects[0].uv.y * currentWidth) / 2
    ])[1];

    // console.log(x);

    let y = map.getCoordinateFromPixel([
        intersects[0].uv.x * currentWidth,
        (intersects[0].uv.y * currentWidth) / 2
    ])[0];

    // console.log(y);

    var circle = new ol.Feature({
        geometry: new ol.geom.Circle([y, x], 20)
    });

    // console.log(circle)

    var circleSource = new ol.source.Vector({
        features: [circle]
    });
    osm.setExtent(circleSource.getExtent());

    // var camZoom = Math.floor(camera.zoom)
    // // console.log(camZoom)
    // if (camZoom > 25) {
    //     // Hide the globe and show the flat map
    //     globe.visible = false;
    //     map.getLayers().forEach(layers => {
    //         layers.setVisible(true);
    //     });
    // } else {
    //     // Hide the flat map and show the globe
    //     globe.visible = true;
    //     map.getLayers().forEach(layer => {
    //         layer.setVisible(true);
    //     });
    // }

    // switch (camZoom) {
    //     case 1:
    //         document.getElementById("map").style.width = "1000px";
    //         document.getElementById("map").style.height = "500px";
    //         if (currentWidth !== 1000) {
    //             map.updateSize();
    //             view.setResolution(0.36);
    //             currentWidth = 1000;
    //         }
    //         break;
    //     case 2:
    //         document.getElementById("map").style.width = "2000px";
    //         document.getElementById("map").style.height = "1000px";
    //         if (currentWidth !== 2000) {
    //             map.updateSize();
    //             view.setResolution(0.225);
    //             currentWidth = 2000;
    //         }
    //         break;
    //     case 3:
    //         document.getElementById("map").style.width = "3000px";
    //         document.getElementById("map").style.height = "1500px";
    //         if (currentWidth !== 3000) {
    //             map.updateSize();
    //             view.setResolution(0.18);
    //             currentWidth = 3000;
    //         }
    //         break;
    //     case 4:
    //         document.getElementById("map").style.width = "4000px";
    //         document.getElementById("map").style.height = "2000px";
    //         if (currentWidth !== 4000) {
    //             map.updateSize();
    //             view.setResolution(0.15);
    //             currentWidth = 4000;
    //         }
    //         break;
    //     case 5:
    //         document.getElementById("map").style.width = "5000px";
    //         document.getElementById("map").style.height = "2500px";
    //         if (currentWidth !== 5000) {
    //             map.updateSize();
    //             view.setResolution(0.12);
    //             currentWidth = 5000;
    //         }
    //         break;
    //     case 6:
    //         document.getElementById("map").style.width = "6000px";
    //         document.getElementById("map").style.height = "3000px";
    //         if (currentWidth !== 6000) {
    //             map.updateSize();
    //             view.setResolution(0.17);
    //             currentWidth = 6000;
    //         }
    //         break;
    //     case 6:
    //         document.getElementById("map").style.width = "8000px";
    //         document.getElementById("map").style.height = "4000px";
    //         if (currentWidth !== 8000) {
    //             map.updateSize();
    //             view.setResolution(0.17);
    //             currentWidth = 8000;
    //         }
    //         break;
    //     default:
    //         break;
    // }
});

container.appendChild(renderer.domElement);


function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}
animate();