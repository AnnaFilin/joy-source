<template>
  <div class="p-3 flex justify-center">
    <div
      id="map"
      class="z-20 rounded-sm ring ring-citrine-100 border border-1 border-citrine-700 w-screen h-full"
      style="height: 90vh"
    ></div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, reactive, computed } from "vue";
import "leaflet.locatecontrol"; // Import plugin
import "leaflet.locatecontrol/dist/L.Control.Locate.min.css"; // Import style
import "leaflet/dist/leaflet.css";
import * as L from "leaflet";
import { toRaw } from "vue";

import LocationDetails from "./LocationDetails.vue";
import { useRoute, useRouter } from "vue-router";
import { VueQueryPlugin } from "@tanstack/vue-query";
import { queryClient } from "../main.js"; // Import queryClient from main.js

const route = useRoute();
const router = useRouter();
console.log("router : ", router);

const selectedRadius = ref(route.query.radius || 8);
const currentLocation = ref({});
const initialMap = ref(null);

const emit = defineEmits(["update-location"]);
const props = defineProps([
  "layers",
  "dataPlaygrounds",
  "dataDogGardens",
  "dataBikeParkings",
]);

const dataPlaygroundsRef = ref(props.dataPlaygrounds);
const dataDogGardensRef = ref(props.dataDogGardens);
const dataBikeParkingsRef = ref(props.dataBikeParkings);

function filterByRadius() {
  console.log("filter currentLocation", currentLocation.value);
  const location = L.latLng(
    currentLocation.value.lat,
    currentLocation.value.lon
  );

  console.log("filterByRadius   location", location);
  dataPlaygroundsRef.value = props.dataPlaygrounds.filter((point) => {
    return (
      location.distanceTo([toRaw(point).lat, toRaw(point).lon]) <=
      selectedRadius.value * 1000
    );
  });
  dataDogGardensRef.value = props.dataDogGardens.filter((point) => {
    return (
      location.distanceTo([toRaw(point).lat, toRaw(point).lon]) <=
      selectedRadius.value * 1000
    );
  });
  dataBikeParkingsRef.value = props.dataBikeParkings.filter((point) => {
    return (
      location.distanceTo([toRaw(point).lat, toRaw(point).lon]) <=
      selectedRadius.value * 1000
    );
  });
}

const visibleLayers = ref({
  dogParks: false,
  playgrounds: false,
  bikeParkings: false,
});

const updateVisibility = (layer, isVisible) => {
  if (isVisible) {
    initialMap.value.addLayer(layer);
  } else {
    initialMap.value.removeLayer(layer);
  }
};

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

const updateLayer = (layer, data, type) => {
  layer.clearLayers();
  data.forEach((point) => {
    const marker = createMarker(point, type).addTo(layer);

    return marker;
  });
};

watch(route, () => {
  if (selectedRadius.value !== route.query.radius) {
    filterByRadius();
  }
  selectedRadius.value = route.query.radius;

  const routeQuery = route.query.layer;
  routeQuery.forEach((layer) => {
    visibleLayers.value[layer] = true;
  });

  for (const layer in visibleLayers.value) {
    if (visibleLayers.value[layer] && !routeQuery.includes(layer))
      visibleLayers.value[layer] = false;
  }

  for (const layer in visibleLayers.value) {
    const mapLayer =
      layer === "playgrounds"
        ? playgroundsLayer.value
        : layer === "dogParks"
          ? dogParksLayer.value
          : bikeParkingsLayer.value;
    const data =
      layer === "playgrounds"
        ? filteredPlaygroundsData()
        : layer === "dogParks"
          ? filteredDogGardensData()
          : filteredBikeParkingsData();

    updateLayer(mapLayer, data, layer);
    updateVisibility(mapLayer, visibleLayers.value[layer]);
  }
});

onMounted(() => {
  // console.log("nounted");
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
      currentLocation.value.lat = position.coords.latitude;
      currentLocation.value.lon = position.coords.longitude;
      const myLocation = {
        lat: position.coords.latitude,
        lon: position.coords.longitude,
      };

      console.log("currentLocation in monted", currentLocation.value);
      const myLocationMarker = L.marker([
        currentLocation.value.lat, //position.coords.latitude,
        currentLocation.value.lon, //position.coords.longitude,
      ]).addTo(initialMap.value);
    });
  }

  const location = L.latLng(
    currentLocation.value.lat,
    currentLocation.value.lon
  );
  console.log("mounted ---- location ", location);
  console.log("filteredPlaygroundsData", filteredPlaygroundsData.value);

  watch(
    () => [props.dataPlaygrounds, props.dataDogGardens, props.dataBikeParkings],
    ([newPlaygrounds, newDogGardens, newBikeParkings]) => {
      initialMap.value.eachLayer((layer) => {
        if (layer instanceof L.Marker) {
          initialMap.value.removeLayer(layer);
        }
      });

      newPlaygrounds.forEach((point) => {
        createMarker(point, "playgrounds").addTo(playgroundsLayer.value);
      });

      newDogGardens.forEach((point) => {
        createMarker(point, "dogGardens").addTo(dogParksLayer.value);
      });

      newBikeParkings.forEach((point) => {
        createMarker(point, "bikeParkings").addTo(bikeParkingsLayer.value);
      });
    },
    { immediate: true }
  );

  initialMap.value.on("click", function (e) {
    const lat = e.latlng.lat;
    const lng = e.latlng.lng;

    fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`
    )
      .then((response) => response.json())
      .then((data) => {
        const address = data.display_name;
        console.log("Address:", address);
        L.popup()
          .setLatLng([lat, lng])
          .setContent(`Address: ${address}`)
          .openOn(initialMap.value);
      })
      .catch((error) => console.error("Error:", error));
  });
});

function filteredPlaygroundsData() {
  console.log("filteredPlaygroundsData", currentLocation.value);
  const location = L.latLng(
    currentLocation.value.lat,
    currentLocation.value.lon
  );
  return props.dataPlaygrounds.filter((point) => {
    return (
      location.distanceTo([toRaw(point).lat, toRaw(point).lon]) <=
      selectedRadius.value * 1000
    );
  });
}

function filteredBikeParkingsData() {
  console.log("filteredPlaygroundsData", currentLocation.value);
  const location = L.latLng(
    currentLocation.value.lat,
    currentLocation.value.lon
  );
  return props.dataBikeParkings.filter((point) => {
    return (
      location.distanceTo([toRaw(point).lat, toRaw(point).lon]) <=
      selectedRadius.value * 1000
    );
  });
}

function filteredDogGardensData() {
  console.log("filteredPlaygroundsData", currentLocation.value);
  const location = L.latLng(
    currentLocation.value.lat,
    currentLocation.value.lon
  );
  return props.dataDogGardens.filter((point) => {
    return (
      location.distanceTo([toRaw(point).lat, toRaw(point).lon]) <=
      selectedRadius.value * 1000
    );
  });
}
function svgToDataUrl(svg) {
  const encoded = encodeURIComponent(svg)
    .replace(/'/g, "%27")
    .replace(/"/g, "%22");
  return `data:image/svg+xml;charset=UTF-8,${encoded}`;
}
// // https://data.gov.il/api/3/action/datastore_search

function createMarker(el, type) {
  console.log("el :", el, type);
  let markerOptions = {
    clickable: true,
    draggable: false,
  };
  let iconOptions = {
    shadowSize: [20, 17],
    iconAnchor: [10, 15],
    iconUrl: "",
  };
  const tooltipKey = "name";
  if (type === "dogParks") {
    iconOptions.iconUrl = "/dogs.svg";
    iconOptions.iconSize = [20, 20];
  }
  if (type === "playgrounds") {
    iconOptions.iconSize = [25, 20];
    iconOptions.className = " text-purple-500";
    iconOptions.iconUrl = "/playgrounds.svg"; //"/playgarden.jpg";
  }
  if (type === "bikeParkings") {
    iconOptions.iconUrl = "/bicycle.svg"; //"/bicycle.jpeg";
    iconOptions.iconSize = [20, 20];
  }

  const customIcon = L.icon(iconOptions);
  markerOptions.icon = customIcon;

  // Create a div element to hold the Vue component
  // const popupContent = document.createElement("div");
  // popupContent.className = "custom-popup";

  const marker = L.marker([toRaw(el).lat, toRaw(el).lon], markerOptions); //.bindPopup(popupContent, { maxWidth: "auto" });
  // Function to create and mount the Vue instance
  // const mountPopupContent = () => {
  //   const app = createApp({
  //     render: () =>
  //       h(LocationDetails, {
  //         locationItem: el,
  //         type: type,
  //         onLocationUpdated: async () => {
  //           await handleLocationUpdated(marker); // Wait for the update and refetch to complete
  //         },
  //       }),
  //   });
  //   app.use(VueQueryPlugin, { queryClient });
  //   app.mount(popupContent);

  //   marker.__vue_app__ = app; // Store the Vue instance for later unmounting
  // };
  marker.on("click", () => {
    console.log("in mmm ", `/location/${type}/${el.id}`);
    // router.push(
    //   {
    //     name: "location",
    //     params: { type: type, id: el.id },
    //   }
    //   // `/${type}/${el.id}`
    //   // props: { id: el.id, type: type },
    // );
    router.push(
      `/location/${type}/${el.id}`
      // {
      //   name: "location",
      //   params: { type: type, id: el.id },
      // }
      // `/${type}/${el.id}`
      // props: { id: el.id, type: type },
    );
  });

  // marker.on("popupopen", () => {
  //   // Clear the previous content
  //   popupContent.innerHTML = "";

  //   // Mount the Vue instance
  //   mountPopupContent();
  // });

  // marker.on("popupclose", () => {
  //   // Unmount the Vue instance
  //   if (marker.__vue_app__) {
  //     marker.__vue_app__.unmount();
  //     marker.__vue_app__ = null;
  //   }
  // });

  return marker;
}
function handleLocationUpdated(marker) {
  return new Promise((resolve) => {
    // Close the popup
    marker.closePopup();

    emit("update-location");
    resolve();
  });
}
</script>

<style scoped>
#leaflet-map {
  height: 100vh;
  width: 100%;
  overflow: hidden;
}

.leaflet-popup-content {
  width: auto !important;
}
.custom-popup {
  width: 90vw; /* 90% of viewport width */
  max-width: 600px; /* Maximum width */
  height: auto;
  max-height: 90vh; /* Maximum height */
  padding: 1rem;
  overflow-y: auto; /* Scroll if content overflows */
}

@media (min-width: 640px) {
  .custom-popup {
    width: 80vw;
  }
}

@media (min-width: 768px) {
  .custom-popup {
    width: 60vw;
  }
}

@media (min-width: 1024px) {
  .custom-popup {
    width: 40vw;
  }
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
