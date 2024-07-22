<template>
  <div class="p-3 flex justify-center">
    <!-- style="height: 90vh; width: 26rem" -->
    <div
      id="map"
      class="z-20 rounded-sm ring ring-citrine-100 border border-1 border-citrine-700 w-screen h-full"
      style="height: 90vh"
    ></div>
    <LocationDetails
      v-if="showDetails"
      :location-item="details"
      :type="locationType"
      @close="handleCloseDetails"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, watch, reactive, computed } from "vue";
import "leaflet.locatecontrol"; // Import plugin
import "leaflet.locatecontrol/dist/L.Control.Locate.min.css"; // Import style
import "leaflet/dist/leaflet.css";
import * as L from "leaflet";
import { toRaw } from "vue";
import { useDataStore } from "../store";
import LocationDetails from "./LocationDetails.vue";

const currentLocation = ref({});
const emit = defineEmits(["update-location"]);
const props = defineProps([
  "dataPlaygrounds",
  "dataDogParks",
  "dataBikeParkings",
]);
const { dataPlaygrounds, dataDogParks, dataBikeParkings } = props;
const visibleLayers = ref({
  dogParks: false,
  playgrounds: false,
  bikeParkings: false,
});

// watch(displayedLocations, (val) => {
//   console.log("displayedLocations, ", toRaw(displayedLocations));
// });

// watch(currentLocation, (val) => {

// });
// watch(props, (val) => {
//   console.log("curr loc ", currentLocation.lon, currentLocation.lat);
//   if (!currentLocation.lat || !currentLocation.lon) return;
//   console.log("layer : ", val);
//   const { layer, radius } = val;
//   console.log("layer, radius ", layer, radius);

//   if (radius) filterRadius(radius, currentLocation);

//   if (layer) {
//     console.log("laaaa", visibleLayers.value, visibleLayers.value[layer]);

//     visibleLayers.value[layer] = !visibleLayers.value[layer];
//     console.log("");
//   }

//   switch (layer) {
//     case "playgrounds":
//       dataPlaygrounds.value = toRaw(playgroundsData._object).data;
//       dataPlaygrounds.value.forEach((point) => {
//         const marker = createMarker(point, "playground", "מגרש משחקים").addTo(
//           playgroundsLayer.value
//         );

//         marker.on("popupopen", () => {
//           document
//             .querySelector(`.details-button[data-id="${point.id}"]`)
//             .addEventListener("click", () => openDetails(point, "playground"));
//         });
//         return marker;
//       });
//       initialMap.value.addLayer(playgroundsLayer.value);
//       break;
//     case "dogParks":
//       dataDogGardens.value = toRaw(dogParksData._object).data;
//       console.log(val, dogParksData);
//       dataDogGardens.value.forEach((point) => {
//         console.log(point.name);
//         const marker = createMarker(point, "dogPark", "פארק כלבים").addTo(
//           dogParksLayer.value
//         );

//         marker.on("popupopen", () => {
//           document
//             .querySelector(`.details-button[data-id="${point.id}"]`)
//             .addEventListener("click", () => openDetails(point, "dogPark"));
//         });
//         return marker;
//       });

//       initialMap.value.addLayer(dogParksLayer.value);
//       break;
//     case "bikeParkings":
//       dataBikeParkings.value = toRaw(bikeParkingsData._object).data;
//       dataBikeParkings.value.forEach((point) => {
//         const marker = createMarker(
//           point,
//           "bikeParkings",
//           "מתקן אופניים"
//         ).addTo(bikeParkingsLayer.value);

//         marker.on("popupopen", () => {
//           document
//             .querySelector(`.details-button[data-id="${point.id}"]`)
//             .addEventListener("click", () =>
//               openDetails(point, "bikeParkings")
//             );
//         });
//         return marker;
//       });
//       initialMap.value.addLayer(bikeParkingsLayer.value);

//       break;
//     default:
//       return;
//   }
// });

// watch(
//   visibleLayers,
//   (val) => {
//     console.log("val,oldVal", toRaw(val));
//     updateVisibility(playgroundsLayer.value, toRaw(val).playgrounds);
//     updateVisibility(dogParksLayer.value, toRaw(val).dogParks);
//     updateVisibility(bikeParkingsLayer.value, toRaw(val).bikeParkings);
//   },
//   { deep: true }
// );

const updateVisibility = (layer, isVisible) => {
  console.log("layer, isVisible", layer, isVisible);
  if (isVisible) {
    initialMap.value.addLayer(layer);
  } else {
    initialMap.value.removeLayer(layer);
  }
};

const initialMap = ref(null);

const playgroundsLayer = ref(L.featureGroup());
const dogParksLayer = ref(L.featureGroup());
const bikeParkingsLayer = ref(L.featureGroup());

const showDetails = ref(false);
const details = ref({});
const locationType = ref("");

const openDetails = (item, type) => {
  console.log("open", item, type);
  details.value = toRaw(item);
  locationType.value = type;
  showDetails.value = true;
};

const handleCloseDetails = () => {
  // console.log("close details");
  showDetails.value = false;
  details.value = null;
  // console.log("showDetails.value", showDetails.value);
  // if (marker.value) {
  //   marker.value.closePopup();
  // }
};

onMounted(() => {
  initialMap.value = L.map("map").locate({
    setView: true,
    maxZoom: 16,
    zoom: 13,
  });
  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution:
      '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  }).addTo(initialMap.value);

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function (position) {
      currentLocation.lat = position.coords.latitude;
      currentLocation.lon = position.coords.longitude;

      const myLocation = {
        lat: currentLocation.lat,
        lon: currentLocation.lon,
      };
      console.log("my location ", myLocation);
      emit("update-location", myLocation);
      const myLocationMarker = L.marker([
        position.coords.latitude,
        position.coords.longitude,
      ]).addTo(initialMap.value);
    });
  }

  const playgrounds = Array.from(dataPlaygrounds);

  playgrounds.forEach((point) => {
    const marker = createMarker(point, "playground", "מגרש משחקים").addTo(
      playgroundsLayer.value
    );
    marker.on("popupopen", () => {
      document
        .querySelector(`.details-button[data-id="${point.id}"]`)
        .addEventListener("click", () => openDetails(point, "playground"));
    });
    return marker;
  });
  initialMap.value.addLayer(playgroundsLayer.value);
});

// watch(isFetchedDogParks, (val, oldVal) => {
watch(visibleLayers.dogParks, (val, oldVal) => {
  console.log("watch dog parks val", val, oldVal);

  if (val) {
    dataDogGardens.value = toRaw(dogParksData._object).data;
    console.log(val, dogParksData);
    dataDogGardens.value.forEach((point) => {
      console.log(point.name);
      createMarker(point, "dogPark", "פארק כלבים")
        // .bindPopup(`<b>Dog Park</b><br>Name: ${point.name}<br>`)
        .addTo(dogParksLayer.value);
    });
  }
  initialMap.value.addLayer(dogParksLayer.value);
});

// watch(isFetchedPlaygrounds, (val) => {
watch(visibleLayers.playgrounds, (val) => {
  console.log("fetched playgrounds , ", playgroundsData);
  if (val) dataPlaygrounds.value = toRaw(playgroundsData._object).data;
  dataPlaygrounds.value.forEach((point) => {
    createMarker(point, "playground", "מגרש משחקים")
      // .bindPopup(`<b>Playground</b><br>Name: ${point.name}<br>`)
      .addTo(playgroundsLayer.value);
  });
  initialMap.value.addLayer(playgroundsLayer.value);
});

// watch(isFetchedBikeP, (val) => {
watch(visibleLayers.value.bikeParkings, (val) => {
  console.log("fetched bikeP , ", bikeParkingsData);
  if (val) dataBikeParkings.value = toRaw(bikeParkingsData._object).data;
  dataBikeParkings.value.forEach((point) => {
    createMarker(point, "bikeParkings", "מתקן אופניים")
      // .bindPopup(`<b>Bike Parking</b><br>Name: ${point.name}<br>`)
      .addTo(bikeParkingsLayer.value);
  });
  initialMap.value.addLayer(bikeParkingsLayer.value);
});

const updateLayer = (layer, data, label, type) => {
  console.log("layer, data, label, type", layer, data, label, type);
  layer.clearLayers();
  data.forEach((point) => {
    console.log(point, type);
    const marker = createMarker(point, type, label).addTo(layer);
    marker.on("popupopen", () => {
      document
        .querySelector(`.details-button[data-id="${point.id}"]`)
        .addEventListener("click", () => openDetails(point, type));
    });
    return marker;
  });
  if (store.layersVisibility[label.toLowerCase().replace(" ", "")]) {
    initialMap.value.addLayer(layer);
  }
};

// watch(
//   () => store.filteredPlaygrounds,
//   (newVal) => {
//     updateLayer(playgroundsLayer.value, newVal, "Playground", "playground");
//   }
// );

// watch(
//   () => store.layersVisibility,
//   (newVal) => {
//     updateVisibility(playgroundsLayer.value, newVal.playgrounds);
//     updateVisibility(dogParksLayer.value, newVal.dogParks);
//     updateVisibility(bikeParkingsLayer.value, newVal.bikeParkings);
//   },
//   { deep: true }
// );

function svgToDataUrl(svg) {
  const encoded = encodeURIComponent(svg)
    .replace(/'/g, "%27")
    .replace(/"/g, "%22");
  return `data:image/svg+xml;charset=UTF-8,${encoded}`;
}
// // https://data.gov.il/api/3/action/datastore_search

function createMarker(el, type, label) {
  // console.log("el, type label : ", el, type, label);
  let markerOptions = {
    clickable: true,
    draggable: false,
  };
  let iconOptions = {
    shadowSize: [20, 17],
    iconAnchor: [10, 15],
  };
  const tooltipKey = "name";
  if (type === "dogPark") {
    iconOptions.iconUrl = "/dog.png";
    iconOptions.iconSize = [20, 20];
  }
  if (type === "playground") {
    iconOptions.iconSize = [25, 20];
    //vectr.com/editor/57ef0934-2acc-4a5c-b5df-393e2ae2b071
    iconOptions.className = " text-purple-500";
    iconOptions.iconUrl = "/playgarden.jpg";
    // https://api.geoapify.com/v1/icon/?type=material&color=%23f38f39&icon=child&iconType=awesome&apiKey=YOUR_API_KEY
  }
  if (type === "bikeParkings") {
    iconOptions.iconUrl = "/bicycle.jpeg";
    iconOptions.iconSize = [20, 20];
  }
  const customIcon = L.icon(iconOptions);
  markerOptions.icon = customIcon;
  // console.log("markerOptions", markerOptions);
  return L.marker([toRaw(el).lat, toRaw(el).lon], markerOptions).bindPopup(
    `<b>${label}</b><br>Name: ${toRaw(el)[tooltipKey]}<br>  <button class="details-button text-sm bg-seasalt p-2 border border-purple-300 rounded-md text-purple-500" data-id="${el.id}">More Details</button>`
  );
}

// function filterRadius(radius, currLocation) {
//   if (!currLocation.lat || !currLocation.lon) return;

//   const currentLocation = L.latLng(currLocation.lat, currLocation.lon);

//   filteredPlaygrounds.value = dataPlaygrounds.value.filter((point) => {
//     // console.log("p", point);
//     return (
//       currentLocation.distanceTo([toRaw(point).lat, toRaw(point).lon]) <=
//       radius * 1000
//     );
//   });

//   filteredDogParks.value = dataDogGardens.value.filter(
//     (point) =>
//       currentLocation.distanceTo([toRaw(point).lat, toRaw(point).lon]) <=
//       radius * 1000
//   );
//   filteredBikeParkings.value = dataBikeParkings.value.filter(
//     (point) =>
//       currentLocation.distanceTo([toRaw(point).lat, toRaw(point).lon]) <=
//       radius * 1000
//   );
// }
</script>

<style scoped>
#leaflet-map {
  height: 100vh;
  width: 100%;
  overflow: hidden;
}

.close {
  color: #aaa;
  float: right;
  font-size: 28px;
  font-weight: bold;
}
.close:hover,
.close:focus {
  color: black;
  text-decoration: none;
  cursor: pointer;
}
</style>
