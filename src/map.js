import "./css/style.css";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import * as turf from "@turf/turf";

let polyCentroid = null;
let staticURL = null;
let bbox = null;
var accessToken = "pk.eyJ1IjoicGxvdGxpbmUiLCJhIjoiY2xmOGo1NW4wMGVtNzNya2UyNnllZGcyciJ9.gUFn8Mj5HQbagkpQWaDqaw";
document.querySelector("#app").innerHTML = `
	<main>
        <div id="control-panel">
            <div id="cafo-count"></div>
            <div id="cafo-label"></div>
        </div>
        <div id="dynamic-frame">
        </div>
        <div id="static-frame">
        </div>
        <div id="curtain-1">
            <div class="instructions">Hover over an identified CAFO site</div>
        </div>
        <div id="curtain-2">
            <div class="instructions">Hover over an identified CAFO site</div>
        </div>

        <div id="map"></div>
    </main>
`;
// return the height and wdith of the static frame
const staticFrameDimensions = [document.getElementById("static-frame").offsetWidth, document.getElementById("static-frame").offsetHeight];
const dynamicFrameDimensions = [document.getElementById("dynamic-frame").offsetWidth, document.getElementById("dynamic-frame").offsetHeight];
mapboxgl.accessToken = accessToken;
const map = new mapboxgl.Map({
    container: "map",
    style: "mapbox://styles/plotline/clqx5xsyi00e001rd731u0axx",
    center: [-85.71, 32.78],
    zoom: 4.83,
    minZoom: 4,
    maxBounds: [-120, 7, -30, 60.38],
    hash: true,
});
const minimap = new mapboxgl.Map({
    container: "dynamic-frame",
    style: "mapbox://styles/plotline/clqzkitkx00eu01pz4nx9hvde",
    center: [-85.71, 32.78],
    zoom: 4.83,
    attributionControl: false,
    interactive: false,
});
const satmap = new mapboxgl.Map({
    container: "static-frame",
    style: "mapbox://styles/plotline/clqx5xsyi00e001rd731u0axx",
    center: [-85.71, 32.78],
    zoom: 4.83,
    attributionControl: false,
    interactive: false,
});

map.addControl(new mapboxgl.NavigationControl());
map.on("load", () => {
    document.getElementById("cafo-count").innerHTML = `${cafosVisible()}`;
    document.getElementById("cafo-label").innerHTML = `Identified 🐓 CAFO Sites Visible`;
    // style the map for the building-extrusion layer to have a hover state that turns the buildings red
    minimap.setPaintProperty("building-extrusion", "fill-extrusion-color", ["case", ["boolean", ["feature-state", "hover"], false], "#ffa201", "#9e8861"]);

    if (document.getElementById("static-frame")) {
        map.on("mouseenter", "poly-fill", function (e) {
            if (document.getElementById("curtain-1")) {
                document.getElementById("curtain-1").remove();
                document.getElementById("curtain-2").remove();
            }
            document.getElementById("static-frame").classList.add("active");
            polyCentroid = turf.centroid(e.features[0]).geometry.coordinates;

            console.log("🐓");
            console.log("Poly Centroid: ", polyCentroid);
            console.log("Polygon: ", e.features[0]);
            bbox = turf.bbox(e.features[0]);
            console.log("Bounding Box: ", bbox);
            moveMiniMap(bbox, polyCentroid);
            // query rendered features on minimap in the building-extrusion layer
            let queriedBuildings = minimap.queryRenderedFeatures({
                layers: ["building-extrusion"],
            });
            changeBuildingColor(queriedBuildings);
        });

        map.on("mouseleave", "poly-fill", function () {
            document.getElementById("static-frame").classList.remove("active");
        });
        map.on("zoomend", function () {
            document.getElementById("cafo-count").innerHTML = `${cafosVisible()}`;
            // document.getElementById("cafo-label").innerHTML = `Identified 🐓 CAFOs Visible`;
        });
        map.on("moveend", function () {
            document.getElementById("cafo-count").innerHTML = `${cafosVisible()}`;
        });
    }
});

// begin functions
function cafosVisible() {
    let pointsVisible = map.queryRenderedFeatures({
        layers: ["points-1"],
    });
    let polysVisible = map.queryRenderedFeatures({
        layers: ["poly-outline"],
    });
    return Math.max(pointsVisible.length, polysVisible.length);
}
function getStaticMap(lat, lon) {
    staticURL = `https://api.mapbox.com/styles/v1/plotline/clqybizqa00f101rj8l32czwr/static/${lon},${lat},15,0,0/${staticFrameDimensions[0]}x${staticFrameDimensions[1]}@2x?access_token=${accessToken}&attribution=false&logo=false`;
    console.log(staticURL);
    // add a background image to the static frame
    document.getElementById("static-frame").style.backgroundImage = `url(${staticURL})`;
}
function debugPoly(bbox, point) {
    map.addLayer({
        id: `bbox${bbox}`,
        type: "line",
        source: {
            type: "geojson",
            data: turf.bboxPolygon(bbox),
        },
        paint: {
            "line-color": "#ff0000",
            "line-width": 2,
        },
    });
    map.addLayer({
        id: `centroid${bbox}`,
        type: "circle",
        source: {
            type: "geojson",
            data: turf.centroid(point),
        },
        paint: {
            "circle-radius": 5,
            "circle-color": "#ff0000",
            "circle-opacity": 0.8,
        },
    });
}
function moveMiniMap(box, polyCentroid) {
    // add satellite map boundary movements here
    satmap.fitBounds(
        [
            [box[0], box[1]], // southwestern corner of the bounds
            [box[2], box[3]], // northeastern corner of the bounds
        ],
        { linear: true, pitch: 0 }
    );
    minimap.jumpTo({
        center: [polyCentroid[0], polyCentroid[1]],
        zoom: 17,
        pitch: 75,
        bearing: 0,
    });
    rotateCamera(0);
}
function rotateCamera(timestamp) {
    // clamp the rotation between 0 -360 degrees
    // Divide timestamp by 100 to slow rotation to ~10 degrees / sec
    minimap.rotateTo((timestamp / 100) % 360, { duration: 0 });
    // Request the next frame of the animation.
    requestAnimationFrame(rotateCamera);
}

function changeBuildingColor(queried) {
    queried.forEach((feature) => {
        minimap.setFeatureState({ source: feature.source, sourceLayer: feature.sourceLayer, id: feature.id }, { hover: true });
        // if (feature.properties.hover) {
        //     minimap.setFeatureState({ source: feature.source, sourceLayer: feature.sourceLayer, id: feature.id }, { hover: false });
        // }
        // // otherwise, set it to true
        // else {
        //     minimap.setFeatureState({ source: feature.source, sourceLayer: feature.sourceLayer, id: feature.id }, { hover: true });
        // }
    });
}
function queryBuildingFeatures(bbox) {
    // based on the tilequery constraints, you can only choose a point and query within a radius. For this to be functional, we'd need a large radius and then take all those features and determine which are within the bounding box
    const tilequeryUrl = `https://api.mapbox.com/v4/mapbox.mapbox-streets-v8/tilequery/${bbox[0]},${bbox[1]}.json?radius=1000?layers=building&access_token=${accessToken}`;
    console.log(tilequeryUrl)
    fetch(tilequeryUrl)
        .then(response => response.json())
        .then(data => {
            console.log("Building Features:", data.features);
        })
        .catch(error => {
            console.error("Error querying building features:", error);
        });
}
