import "./css/style.css";
import scrollama from "scrollama";
import { figureUpdate } from "@/figure-update.js";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import * as turf from "@turf/turf";


let poly_centroid = null;
let staticURL = null;
var accessToken = "pk.eyJ1IjoicGxvdGxpbmUiLCJhIjoiY2xmOGo1NW4wMGVtNzNya2UyNnllZGcyciJ9.gUFn8Mj5HQbagkpQWaDqaw";
document.querySelector("#app").innerHTML = `
	<main>
        <div id="control-panel">
            <h1></h1>
        </div>
        <div id="static-frame">
            <h1></h1>
        </div>

        <div id="map"></div>
    </main>
`;
// return the height and wdith of the static frame
const staticFrameDimensions = [document.getElementById("static-frame").offsetWidth, document.getElementById("static-frame").offsetHeight];
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
map.addControl(new mapboxgl.NavigationControl());
map.on("load", () => {
    // add this as a polygon layer
    // map.addSource("poly-fill2", {
    //     type: "geojson",
    //     data: "https://s3.us-east-2.amazonaws.com/stories2.theplotline.org/cafo-explorer/data/poly-0102202024.geojson",
    // });
    // map.addLayer({
    //     id: "poly-fill3",
    //     type: "fill",
    //     source: "poly-fill2",
    //     paint: {
    //         "fill-color": "#F5C53B",
    //         "fill-opacity": 0.1,
    //     },
    // });

    // map.setPaintProperty("mapbox-satellite", "raster-opacity", 0.0);

    // make the element with id static frame have css static frame active when hovering over the map
    // map on click event
    map.on('click', function(e) {
        
        // add active to the static-frame id
        document.getElementById("static-frame").classList.add("active");
    });
    // when hovering over the layer poly-0102202024-41ymfd console.log (hello)
    map.on('mouseenter', 'poly-fill3', function(e) {
        document.getElementById("static-frame").classList.add("active");
        poly_centroid = turf.centroid(e.features[0]).geometry.coordinates
        console.log("🐓");
        console.log(poly_centroid);
        const bbox = turf.bbox(e.features[0]);
        // query rendered features in bbox in the building layer
        const queriedFeatures = map.queryRenderedFeatures(bbox, {
            layers: ["building"],
        });

        console.log("qf = ", queriedFeatures)
        // draw bounding box on map
        // map.addLayer({
        //     id: `bbox${e.lngLat}`,
        //     type: "line",
        //     source: {
        //         type: "geojson",
        //         data: turf.bboxPolygon(bbox),
        //     },
        //     paint: {
        //         "line-color": "#ff0000",
        //         "line-width": 2,
        //     },
        // });
        
        staticURL = `https://api.mapbox.com/styles/v1/plotline/clqybizqa00f101rj8l32czwr/static/${e.lngLat.lng},${e.lngLat.lat},15,0,0/${staticFrameDimensions[0]}x${staticFrameDimensions[1]}@2x?access_token=${accessToken}&attribution=false&logo=false`
        console.log(staticURL);
        // add a background image to the static frame
        document.getElementById("static-frame").style.backgroundImage = `url(${staticURL})`;

    });

    map.on('mouseleave', 'poly-fill', function() {
        console.log("hovering");
        document.getElementById("static-frame").classList.remove("active");
    });
    // map.on('zoomend', function() {
    //     const queriedFeatures = map.queryRenderedFeatures(, {
    //         layers: ["building"],
    //     });


    //     console.log(queriedFeatures)
    // });



//   map.addSource("cafos", {
//     type: "geojson",
//     data: "https://s3.us-east-2.amazonaws.com/stories2.theplotline.org/cafo-explorer/data/poly-0102202024.geojson",
//   });
//   map.addLayer({
//     id: "cafos",
//     type: "circle",
//     source: "cafos",
//     paint: {
//       "circle-radius": 5,
//       "circle-color": "#ff0000",
//       "circle-opacity": 0.8,
//     },
//   });
});
