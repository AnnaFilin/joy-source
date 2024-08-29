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
import { ref, onMounted, onBeforeUnmount, watch } from "vue";
import "leaflet.locatecontrol";
import "leaflet.locatecontrol/dist/L.Control.Locate.min.css";
import "leaflet/dist/leaflet.css";
import * as L from "leaflet";
import { useRoute, useRouter } from "vue-router";
import { createMarker } from "../utils/helpers.js";

const route = useRoute();
const router = useRouter();

const selectedRadius = ref(route.query.radius || 8);
const currentLocation = ref({});
const initialMap = ref(null);
const playgroundsLayer = ref(L.featureGroup());
const dogParksLayer = ref(L.featureGroup());
const bikeParkingsLayer = ref(L.featureGroup());

const props = defineProps([
  "layers",
  "dataPlaygrounds",
  "dataDogGardens",
  "dataBikeParkings",
]);

const visibleLayers = ref({
  playgrounds: false,
  dogParks: false,
  bikeParkings: false,
});

// Update the visibility of layers based on the filters
function updateVisibility(layer, isVisible) {
  if (isVisible) {
    initialMap.value?.addLayer(layer);
  } else {
    initialMap.value?.removeLayer(layer);
  }
}

// Function to update markers on the layer based on filters
function updateLayer(layer, data, type) {
  layer.clearLayers(); // Clear previous markers
  data.forEach((point) => {
    const marker = createMarker(router, point, type).addTo(layer);
  });
}

watch(
  () => route.query.layer, // Watch for changes in the active layers from the route
  () => {
    // Determine which layers should be visible
    visibleLayers.value.playgrounds =
      route.query?.layer?.includes("playgrounds");
    visibleLayers.value.dogParks = route.query?.layer?.includes("dogParks");
    visibleLayers.value.bikeParkings =
      route.query?.layer?.includes("bikeParkings");

    // Update visibility of each layer based on the active filters
    updateVisibility(playgroundsLayer.value, visibleLayers.value.playgrounds);
    updateVisibility(dogParksLayer.value, visibleLayers.value.dogParks);
    updateVisibility(bikeParkingsLayer.value, visibleLayers.value.bikeParkings);
  },
  { immediate: true }
);

onMounted(() => {
  if (!initialMap.value) {
    initializeMap();
  }
});

onBeforeUnmount(() => {
  if (initialMap.value) {
    initialMap.value.remove(); // Properly remove the map instance on unmount
    initialMap.value = null;
  }
});

function initializeMap() {
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

      // console.log("currentLocation in monted", currentLocation.value);
      const myLocationMarker = L.marker([
        currentLocation.value.lat, //position.coords.latitude,
        currentLocation.value.lon, //position.coords.longitude,
      ]).addTo(initialMap.value);
    });
  }
  // Initially update layers
  updateLayer(playgroundsLayer.value, props.dataPlaygrounds, "playgrounds");
  updateLayer(dogParksLayer.value, props.dataDogGardens, "dogParks");
  updateLayer(bikeParkingsLayer.value, props.dataBikeParkings, "bikeParkings");

  // Set the initial visibility based on route query
  updateVisibility(playgroundsLayer.value, visibleLayers.value.playgrounds);
  updateVisibility(dogParksLayer.value, visibleLayers.value.dogParks);
  updateVisibility(bikeParkingsLayer.value, visibleLayers.value.bikeParkings);
}

function updateMapLayers() {
  console.log("update layers ");
  playgroundsLayer.value.clearLayers();
  dogParksLayer.value.clearLayers();
  bikeParkingsLayer.value.clearLayers();

  props.dataPlaygrounds.forEach((point) => {
    createMarker(router, point, "playgrounds").addTo(playgroundsLayer.value);
  });

  props.dataDogGardens.forEach((point) => {
    createMarker(router, point, "dogGardens").addTo(dogParksLayer.value);
  });

  props.dataBikeParkings.forEach((point) => {
    createMarker(router, point, "bikeParkings").addTo(bikeParkingsLayer.value);
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
