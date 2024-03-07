import * as THREE from 'https://cdn.skypack.dev/three@0.137';
import { OrbitControls } from "https://cdn.skypack.dev/three-stdlib@2.8.5/controls/OrbitControls";

var renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
// renderer.physicallyCorrectLights = true;

var scene = new THREE.Scene();
// scene.background = new THREE.Color(0.4, 0.4, 0.4);

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

var galGeometry = new THREE.SphereGeometry(900, 300, 300)
var galMaterial = new THREE.MeshBasicMaterial({
    map: new THREE.TextureLoader().load("data/galaxy.png"),
    side: THREE.BackSide
})
var galaxy = new THREE.Mesh(galGeometry, galMaterial)
scene.add(galaxy);

var controls = new OrbitControls(camera, renderer.domElement);

controls.enablePan = false;
controls.enableZoom = true;
controls.enableDamping = false;
// controls.target.set(0, 0, 0);
controls.update();


// Lets start to create OL map 
var osm = new ol.layer.Tile({
    // extent: [-180, -90, 180, 90],
    source: new ol.source.OSM({
        preload: 10,
        tilePixelRatio: 2,
        MaxZoom: 15
    })
});

var view = new ol.View({
    projection: "EPSG:4326",
    // extent: [-180, -90, 180, 90],   //extent option in view - it will be return from pixel to coordinates accurately so its important to enable 
    zoom: 2,
    // center: [0, 0],
    center: ol.proj.fromLonLat([0, 0]),
    // duration: 500, // Set the duration in milliseconds
});
// var tileGrid = new ol.tilegrid.createXYZ({ extent: [-180, -90, 180, 90],tileSize: 256, maxZoom: 18 });
// var tile = tileGrid.fullTileRanges_
// console.log(tile);

var layers = new ol.layer.Tile({
    // extent: [-180, -90, 180, 90],
    source: new ol.source.OSM({
        projection: 'EPSG:4326',
    })
})

var map = new ol.Map({
    target: "map",
    // controls: ol.control.defaults({ rotate: true }),
    // interactions: ol.interaction.defaults({ doubleClickZoom: true }),
    layers: [
        layers,
        osm,
        new ol.layer.Tile({
            source: new ol.source.TileDebug()
        })
    ],
    view: view
});


// map.on('pointermove', function(evt) {
//     if (evt.dragging) return;

//     var pixel = evt.pixel;
//     // console.log(pixel)
//     var coord = evt.coordinate;
//     console.log(coord);
//     var hit = map.hasFeatureAtPixel(pixel);

//     // document.getElementById('map').innerHTML = hit ?
//     //   '&nbsp;&nbsp;&nbsp;&nbsp;' + formatCoordinate(coord) : '';
//   });


// map.on('dblclick', function (e) {
//     console.log(e.coordinate)
//     let lonlat = e.coordinate
//     // let latlon = proj4('EPSG:4326',[lonlat[0],lonlat[1]])
//     // // console.log(latlon);
//     alert("Longitude:" + lonlat[0] + " Latitude:" + lonlat[1])

//     var v1 = $('#longitude').val(lonlat[0])
//     console.log(v1);
//     $('#latitude').val(lonlat[1])
//     $('#altitude').val(lonlat[2])
// })

// map.getView().fit(tileGrid.getExtent(), map.getSize());

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
    texture.encoding = THREE.sRGBEncoding;
    // Assign the texture to the material of the globe
    globe.material.map = texture;
    // Notify THREE.js that the material needs an update
    globe.material.needsUpdate = true;

});



var raycaster = new THREE.Raycaster();

var currentWidth = 1000;

controls.addEventListener("end", function (event) {

    //  Raycasting is used to determine what objects in the scene the user is interacting and here based on the camera's view
    raycaster.setFromCamera({ x: 0, y: 0 }, camera);
    //  the code sets up a raycaster based on the camera's view and checks for intersections with a 3D object called "globe"
    let intersects = raycaster.intersectObject(globe);
    //  pixel-to-coordinate transformations.
    let x = -map.getCoordinateFromPixel([
        intersects[0].uv.x * currentWidth,
        (intersects[0].uv.y * currentWidth) / 2
    ])[1];

    //  pixel-to-coordinate transformations.

    let y = map.getCoordinateFromPixel([
        intersects[0].uv.x * currentWidth,
        (intersects[0].uv.y * currentWidth) / 2
    ])[0];

    // A circle feature is created with a specified center "[y, x]" and radius "1"
    var circle = new ol.Feature({
        geometry: new ol.geom.Circle([y, x], 1)
    });

    // The extent of the map (represented by "osm") is updated based on the extent of the circle feature.
    var circleSource = new ol.source.Vector({
        features: [circle]
    });

    osm.setExtent(circleSource.getExtent());

    var camZoom = Math.floor(camera.zoom)
    console.log(camZoom)

    if (camZoom > 300) {
        // Hide the globe and show the flat map
        globe.visible = false;
        map.getLayers().forEach(layers => {
            layers.setVisible(true);
        });
    } else {
        // Hide the flat map and show the globe
        globe.visible = true;
        map.getLayers().forEach(layer => {
            layer.setVisible(true);
        });
    }

    switch (camZoom) {
        case 1:
            document.getElementById("map").style.width = "1000px";
            document.getElementById("map").style.height = "500px";
            // document.getElementById("map").style.opacity = 1;
            if (currentWidth !== 1000) {
                map.updateSize();
                view.setResolution(0.36);
                currentWidth = 1000;
            }
            break;
        case 5:
            document.getElementById("map").style.width = "2000px";
            document.getElementById("map").style.height = "1000px";
            if (currentWidth !== 2000) {
                map.updateSize();
                view.setResolution(0.225);
                currentWidth = 2000;
                controls.rotateSpeed = 0.5;
            }
            break;
        case 8:
            document.getElementById("map").style.width = "3000px";
            document.getElementById("map").style.height = "1500px";
            if (currentWidth !== 3000) {
                map.updateSize();
                view.setResolution(0.18);
                currentWidth = 3000;
                controls.rotateSpeed = 0.025;
            }
            break;
        case 12:
            document.getElementById("map").style.width = "4000px";
            document.getElementById("map").style.height = "2000px";
            if (currentWidth !== 4000) {
                map.updateSize();
                view.setResolution(0.15);
                currentWidth = 4000;
                controls.rotateSpeed = 0.025;
            }
            break;
        case 18:
            document.getElementById("map").style.width = "6000px";
            document.getElementById("map").style.height = "3000px";
            if (currentWidth !== 6000) {
                map.updateSize();
                view.setResolution(0.1125);
                currentWidth = 6000;
                controls.rotateSpeed = 0.025;
            }
            break;
        case 22:
            document.getElementById("map").style.width = "8000px";
            document.getElementById("map").style.height = "4000px";
            if (currentWidth !== 8000) {
                map.updateSize();
                view.setResolution(0.09);
                currentWidth = 8000;
                controls.rotateSpeed = 0.025;
            }
            break;
        case 31:
            document.getElementById("map").style.width = "10000px";
            document.getElementById("map").style.height = "5000px";
            if (currentWidth !== 10000) {
                map.updateSize();
                view.setResolution(0.056);
                currentWidth = 10000;
                controls.rotateSpeed = 0.025;
            }
            break;
        case 36:
            document.getElementById("map").style.width = "12000px";
            document.getElementById("map").style.height = "6000px";
            if (currentWidth !== 12000) {
                map.updateSize();
                view.setResolution(0.045);
                currentWidth = 12000;
                controls.rotateSpeed = 0.025;
            }
            break;
        case 40:
            document.getElementById("map").style.width = "14000px";
            document.getElementById("map").style.height = "7000px";
            if (currentWidth !== 14000) {
                map.updateSize();
                view.setResolution(0.028);
                currentWidth = 14000;
                controls.rotateSpeed = 0.025;
            }
            break;
        case 46:
            document.getElementById("map").style.width = "16000px";
            document.getElementById("map").style.height = "8000px";
            if (currentWidth !== 16000) {
                map.updateSize();
                view.setResolution(0.0225);
                currentWidth = 16000;
                controls.rotateSpeed = 0.025;
            }
            break;
        case 50:
            document.getElementById("map").style.width = "18000px";
            document.getElementById("map").style.height = "9000px";
            if (currentWidth !== 18000) {
                map.updateSize();
                view.setResolution(0.0125);
                currentWidth = 18000;
                controls.rotateSpeed = 0.025;
            }
            break;
        case 51:
            document.getElementById("map").style.width = "20000px";
            document.getElementById("map").style.height = "10000px";
            if (currentWidth !== 20000) {
                map.updateSize();
                view.setResolution(0.035);
                currentWidth = 20000;
                controls.rotateSpeed = 0.025;
            }
            break;
        case 56:
            document.getElementById("map").style.width = "24000px";
            document.getElementById("map").style.height = "12000px";
            if (currentWidth !== 24000) {
                map.updateSize();
                view.setResolution(0.045);
                currentWidth = 24000;
                controls.rotateSpeed = 0.025;
            }
            break;
        case 60:
            document.getElementById("map").style.width = "30000px";
            document.getElementById("map").style.height = "15000px";
            if (currentWidth !== 30000) {
                map.updateSize();
                view.setResolution(0.052);
                currentWidth = 30000;
                controls.rotateSpeed = 0.025;
            }
            break;
        default:
            break;
    }
});



var container = document.getElementById("container");
container.appendChild(renderer.domElement);

function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
    // globe.rotation.y += 0.0005
    galaxy.rotation.y -= 0.0002
}
animate();

