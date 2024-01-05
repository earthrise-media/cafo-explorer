import "./css/style.css";
import scrollama from "scrollama";
import { figureUpdate } from "@/figure-update.js";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import * as turf from "@turf/turf";

let polyCentroid = null;
let staticURL = null;
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
  //   if page is showing dynamic frame console.log (hello)
  //   else if page is showing static frame console.log (hello)
  if (document.getElementById("static-frame").classList.contains("active")) {
    console.log("static frame is active");

    map.on("click", function (e) {
      // add active to the static-frame id
      document.getElementById("static-frame").classList.add("active");
    });
    // when hovering over the layer poly-0102202024-41ymfd console.log (hello)
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
      let bbox = turf.bbox(e.features[0]);
      console.log("Bounding Box: ", bbox);
      const queriedFeatures = map.queryRenderedFeatures(bbox, {
        layers: ["building"],
      });
      moveMiniMap(bbox, polyCentroid);

      // console.log("qf = ", queriedFeatures);
      // DEBUGGING
      // debugPoly(bbox, e.features[0]);

      // getStaticMap(polyCentroid[1], polyCentroid[0]);
    });

    map.on("mouseleave", "poly-fill", function () {
      // console.log("hovering");
      document.getElementById("static-frame").classList.remove("active");
    });
}
    map.on("zoomend", function () {
      document.getElementById("cafo-count").innerHTML = `${cafosVisible()}`;
      // document.getElementById("cafo-label").innerHTML = `Identified 🐓 CAFOs Visible`;
    });
    map.on("moveend", function () {
      document.getElementById("cafo-count").innerHTML = `${cafosVisible()}`;
      // document.getElementById("cafo-label").innerHTML = `Identified 🐓 CAFOs Visible`;
    });

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
  }

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
