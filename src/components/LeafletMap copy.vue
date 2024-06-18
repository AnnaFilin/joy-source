<template>
  <div class="p-5">
    <div id="map" style="height: 90vh; width: 26rem"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, defineProps, watch } from "vue";
import "leaflet.locatecontrol"; // Import plugin
import "leaflet.locatecontrol/dist/L.Control.Locate.min.css"; // Import style
import "leaflet/dist/leaflet.css";
import * as L from "leaflet";
import { isProxy, toRaw } from "vue";
import { useDataStore } from "../store";

const isLoading = ref(false);
const props = defineProps(["selectedLayers"]);

const initialMap = ref(null);

const playgroundsLayer = ref(L.featureGroup());
const dogParksLayer = ref(L.featureGroup());

// const

const store = useDataStore();
const layers = {
  playgrounds: playgroundsLayer,
  dogParks: dogParksLayer,
};

function initLeafletMap() {
  console.log("init mao");
  isLoading.value = true;
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
      //   const latit = position.coords.latitude;
      //   const longit = position.coords.longitude;
      // this is just a marker placed in that position
      var abc = L.marker([
        position.coords.latitude,
        position.coords.longitude,
      ]).addTo(initialMap.value);
      // move the map to have the location in its center
      //   initialMap.value.panTo(new L.LatLng(latit, longit));
    });
  }
  console.log("before");
  createMarkers();
  isLoading.value = false;
}

// https://data.gov.il/api/3/action/datastore_search

onMounted(() => {
  initLeafletMap();
});
onUpdated(() => {
  console.log("updates");
  createMarkers();
});
watch(props, (val) => {
  console.log("val chasnged, ", val);
});

function createMarker(el, type) {
  let markerOptions = {
    clickable: true,
    draggable: false,
  };
  let iconOptions = {
    shadowSize: [20, 17],
    iconAnchor: [10, 15],
  };

  if (type !== "playground") {
    iconOptions.iconUrl = "/dog.png";
    iconOptions.iconSize = [20, 20];
  } else {
    iconOptions.iconUrl = "/playground2.png";
    iconOptions.iconSize = [25, 20];
  }
  const customIcon = L.icon(iconOptions);
  markerOptions.icon = customIcon;

  return L.marker([toRaw(el).lat, toRaw(el).lon], markerOptions);
}

function createMarkers() {
  console.log(
    "create markers",
    toRaw(props.selectedLayers),
    toRaw(props.selectedLayers).includes("playgrounds"),
    toRaw(props.selectedLayers).includes("dogGardens")
  );

  if (toRaw(props.selectedLayers).includes("playgrounds")) {
    store.playgrounds.forEach((el) => {
      // console.log("props ", props.layer);
      console.log(el);
      playgroundsLayer.value.addLayer(createMarker(el, "playground"));
    });
    playgroundsLayer.value.addTo(initialMap.value);
  }

  if (toRaw(props.selectedLayers).includes("dogGardens")) {
    store.dogParks.forEach((el) => {
      dogParksLayer.value.addLayer(createMarker(el, "dogPark"));
    });
    dogParksLayer.value.addTo(initialMap.value);
  }
  if (toRaw(props.selectedLayers).includes("dogGardens")) {
    store.dogParks.forEach((el) => {
      dogParksLayer.value.addLayer(createMarker(el, "dogPark"));
    });
    dogParksLayer.value.addTo(initialMap.value);
  }
}
</script>

<style scoped>
#leaflet-map {
  height: 100vh;
  width: 100%;
  overflow: hidden;
}
</style>
