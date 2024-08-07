<template>
  <div class="p-3 flex justify-center">
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

import LocationDetails from "./LocationDetails.vue";
import { useRoute } from "vue-router";
const route = useRoute();
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

  // console.log("dataPlaygroundsRef.value", dataPlaygroundsRef.value);
  // console.log("dataDogGardensRef.value", dataDogGardensRef.value);
  // console.log("dataBikeParkingsRef.value", dataBikeParkingsRef.value);
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

const handleCloseDetails = () => {
  // console.log("close details");
  showDetails.value = false;
  details.value = null;
  // console.log("showDetails.value", showDetails.value);
  // if (marker.value) {
  //   marker.value.closePopup();
  // }
};

const updateLayer = (layer, data, type) => {
  // console.log(" updateLayer = (layer, data, type) ", layer, data, type);
  layer.clearLayers();
  data.forEach((point) => {
    const marker = createMarker(point, type).addTo(layer);
    marker.on("popupopen", () => {
      document
        .querySelector(`.details-button[data-id="${point.id}"]`)
        .addEventListener("click", () => openDetails(point, type));
    });
    return marker;
  });
  // layer.clearLayers();
};

watch(route, () => {
  if (selectedRadius.value !== route.query.radius) {
    // console.log("playgroundsLayer", playgroundsLayer.value);
    filterByRadius();

    // console.log("lllllllllllll");
    // console.log("dataPlaygroundsRef.value", dataPlaygroundsRef.value);
    // console.log("dataDogGardensRef.value", dataDogGardensRef.value);
    // console.log("dataBikeParkingsRef.value", dataBikeParkingsRef.value);
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
          ? filteredDogGardensData() // dataDogGardensRef.value
          : filteredBikeParkingsData(); //dataBikeParkingsRef.value;

    // console.log("data", data);

    updateLayer(mapLayer, data, layer);
    updateVisibility(mapLayer, visibleLayers.value[layer]);
  }
});

onMounted(() => {
  console.log("nounted");
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
      console.log("currentLocation", currentLocation.value);
      const myLocation = {
        lat: position.coords.latitude,
        lon: position.coords.longitude,
      };
      console.log("my location ", myLocation);
      emit("update-location", myLocation);

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
  dataPlaygroundsRef.value.forEach((point) => {
    // .filter((point) => {
    // return (
    //   location.distanceTo([toRaw(point).lat, toRaw(point).lon]) <=
    //   selectedRadius.value * 1000
    // );
    // });
    // filteredPlaygroundsData.forEach((point) => {
    const marker = createMarker(point, "playgrounds", "מגרש משחקים").addTo(
      playgroundsLayer.value
    );
    marker.on("popupopen", () => {
      document
        .querySelector(`.details-button[data-id="${point.id}"]`)
        .addEventListener("click", () => openDetails(point, "playground"));
    });
    return marker;
  });
  visibleLayers.value.playgrounds = true;
  updateVisibility(playgroundsLayer.value, visibleLayers.value.playgrounds);

  dataDogGardensRef.value?.forEach((point) => {
    const marker = createMarker(point, "dogParks", "מגרש כלבים").addTo(
      dogParksLayer.value
    );
    marker.on("popupopen", () => {
      document
        .querySelector(`.details-button[data-id="${point.id}"]`)
        .addEventListener("click", () => openDetails(point, "dogPark"));
    });
    return marker;
  });

  if (route.query?.layer?.includes("dogParks"))
    visibleLayers.value.dogParks = true;
  updateVisibility(dogParksLayer.value, visibleLayers.value.dogParks);

  dataBikeParkingsRef.value?.forEach((point) => {
    const marker = createMarker(point, "bikeParkings", "עגינת אופניים").addTo(
      bikeParkingsLayer.value
    );
    marker.on("popupopen", () => {
      document
        .querySelector(`.details-button[data-id="${point.id}"]`)
        .addEventListener("click", () => openDetails(point, "bikeParking"));
    });
    return marker;
  });
  updateVisibility(bikeParkingsLayer.value, visibleLayers.value.bikeParkings);
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
    iconOptions.iconUrl = "/dog.png";
    iconOptions.iconSize = [20, 20];
  }
  if (type === "playgrounds") {
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
  return L.marker([toRaw(el).lat, toRaw(el).lon], markerOptions).bindPopup(
    `<b>${type}</b><br>Name: ${toRaw(el)[tooltipKey]}<br>  <button class="details-button text-sm bg-seasalt p-2 border border-purple-300 rounded-md text-purple-500" data-id="${el.id}">More Details</button>`
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
