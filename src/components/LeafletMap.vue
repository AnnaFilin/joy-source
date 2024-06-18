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
import { useQuery } from "@tanstack/vue-query";

import { ref, onMounted, watch } from "vue";
import "leaflet.locatecontrol"; // Import plugin
import "leaflet.locatecontrol/dist/L.Control.Locate.min.css"; // Import style
import "leaflet/dist/leaflet.css";
import * as L from "leaflet";
import { toRaw } from "vue";
import { useDataStore } from "../store";
import LocationDetails from "./LocationDetails.vue";

import { getPlaygrounds } from "../hooks/usePlaygrounds";
import { getDogParks } from "../hooks/useDogParks";
import { useBikeParkings } from "../hooks/useBikeParkings";
// const loaded = ref(false);

const {
  data: dogParksData,
  isFetched: isFetchedDogParks,
  error: dogParksError,
} = useQuery({
  queryKey: ["dogGardens"],
  queryFn: getDogParks,
});

// console.log("data pl:", dataPlaygrounds);
const {
  data: playgroundsData,
  isFetched: isFetchedPlaygrounds,
  error: playgroundsError,
} = useQuery({
  queryKey: ["playgrounds"],
  queryFn: getPlaygrounds,
});

const { data: bikeParkingsData, isFetched: isFetchedBikeP } = useBikeParkings();

const initialMap = ref(null);

const playgroundsLayer = ref(L.featureGroup());
const dogParksLayer = ref(L.featureGroup());
const bikeParkingsLayer = ref(L.featureGroup());

const showDetails = ref(false);
const details = ref({});
const locationType = ref("");

const store = useDataStore();

const playgroundIcon = ref("");

const openDetails = (item, type) => {
  // console.log("open", item, type);
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

const dataPlaygrounds = ref([]);
const dataDogGardens = ref([]);
const dataBikeParkings = ref([]);

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
      const myLocation = {
        lat: position.coords.latitude,
        lon: position.coords.longitude,
      };

      store.setCurrentLocation(myLocation);
      const myLocationMarker = L.marker([
        store.currentLocation.lat,
        store.currentLocation.lon,
      ]).addTo(initialMap.value);
    });
  }
  // const { data } = playgroundsData;
  // console.log("pl", toRaw(bikeParkingsData._object).data);
  // console.log("location type", locationType.value);
  // const dataPlaygrounds = toRaw(playgroundsData._object).data;
  // console.log("data pl:", dataPlaygrounds);
  // store.filteredPlaygrounds.forEach((point) => {
  // playgroundsData.forEach((point) => {
  //   createMarker(point, "playground")
  //     .bindPopup(`<b>Playground</b><br>Name: ${point.Name}<br>`)
  //     .addTo(playgroundsLayer.value);
  // });
  // store.filteredDogParks.forEach((point) => {
  // dogParksData.forEach((point) => {
  //   //   // console.log(point.name);
  //   createMarker(point, "dogPark")
  //     .bindPopup(`<b>Dog Park</b><br>Name: ${point.name}<br>`)
  //     .addTo(dogParksLayer.value);
  // });
  // store.filteredBikeParkings.forEach((point) => {
  //   createMarker(point, "bikeParkings")
  //     .bindPopup(`<b>Bike Parking</b><br>Name: ${point.Address}<br>`)
  //     .addTo(bikeParkingsLayer.value);
  // });
});

watch(isFetchedDogParks, (val, oldVal) => {
  console.log("watch dog parks val", val, oldVal);

  if (val) {
    dataDogGardens.value = toRaw(dogParksData._object).data;
    console.log(val, dogParksData);
    dataDogGardens.value.forEach((point) => {
      console.log(point.name);
      createMarker(point, "dogPark")
        .bindPopup(`<b>Dog Park</b><br>Name: ${point.name}<br>`)
        .addTo(dogParksLayer.value);
    });
  }
  initialMap.value.addLayer(dogParksLayer.value);
});

watch(isFetchedPlaygrounds, (val) => {
  // console.log("fetched playgrounds , ", playgroundsData);
  if (val) dataPlaygrounds.value = toRaw(playgroundsData._object).data;
  dataPlaygrounds.value.forEach((point) => {
    createMarker(point, "playground")
      .bindPopup(`<b>Playground</b><br>Name: ${point.Name}<br>`)
      .addTo(playgroundsLayer.value);
  });
  initialMap.value.addLayer(playgroundsLayer.value);
});

watch(isFetchedBikeP, (val) => {
  // console.log("fetched bikeP , ", bikeParkingsData);
  if (val) dataBikeParkings.value = toRaw(bikeParkingsData._object).data;
  dataBikeParkings.value.forEach((point) => {
    createMarker(point, "bikeParkings")
      .bindPopup(`<b>Bike Parking</b><br>Name: ${point.Name}<br>`)
      .addTo(bikeParkingsLayer.value);
  });
  initialMap.value.addLayer(bikeParkingsLayer.value);
});

const updateLayer = (layer, data, label, type) => {
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

const updateVisibility = (layer, isVisible) => {
  if (isVisible) {
    initialMap.value.addLayer(layer);
  } else {
    initialMap.value.removeLayer(layer);
  }
};

watch(
  () => store.filteredPlaygrounds,
  (newVal) => {
    updateLayer(playgroundsLayer.value, newVal, "Playground", "playground");
  }
);
watch(
  () => store.filteredDogParks,
  (newVal) => {
    updateLayer(dogParksLayer.value, newVal, "Dog Park", "dogPark");
  }
);
watch(
  () => store.filteredBikeParkings,
  (newVal) => {
    updateLayer(
      bikeParkingsLayer.value,
      newVal,
      "Bike Parking",
      "bikeParkings"
    );
  }
);

watch(
  () => store.layersVisibility,
  (newVal) => {
    updateVisibility(playgroundsLayer.value, newVal.playgrounds);
    updateVisibility(dogParksLayer.value, newVal.dogParks);
    updateVisibility(bikeParkingsLayer.value, newVal.bikeParkings);
  },
  { deep: true }
);

function svgToDataUrl(svg) {
  const encoded = encodeURIComponent(svg)
    .replace(/'/g, "%27")
    .replace(/"/g, "%22");
  return `data:image/svg+xml;charset=UTF-8,${encoded}`;
}
// // https://data.gov.il/api/3/action/datastore_search

function createMarker(el, type, label) {
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
    // console.log(playgroundIcon.value);
    iconOptions.iconUrl = playgroundIcon.value;

    //vectr.com/editor/57ef0934-2acc-4a5c-b5df-393e2ae2b071
    // iconUrl;
    iconOptions.className = " text-purple-500";
    iconOptions.iconUrl = "/playground.jpg";
    // https: console.log("ic", iconOptions.iconUrl);
  }
  if (type === "bikeParkings") {
    iconOptions.iconUrl = "/bicycle.jpeg";
    iconOptions.iconSize = [20, 20];
  }
  const customIcon = L.icon(iconOptions);
  markerOptions.icon = customIcon;
  // console.log(markerOptions);
  return L.marker([toRaw(el).lat, toRaw(el).lon], markerOptions).bindPopup(
    `<b>${label}</b><br>Name: ${el[tooltipKey]}<br>  <button class="details-button text-sm bg-seasalt p-2 border border-purple-300 rounded-md text-purple-500" data-id="${el.id}">More Details</button>`
  );
}
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
