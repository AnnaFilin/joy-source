<template>
  <div>
    <button @click="toggleLayer('playgrounds')">Toggle Playgrounds</button>
    <button @click="toggleLayer('dogParks')">Toggle Dog Parks</button>
    <button @click="toggleLayer('bikeParking')">Toggle Bike Parking</button>
  </div>
  <div class="p-5">
    <div id="map" style="height: 90vh; width: 26rem"></div>
  </div>
  <!-- <div style="height: 90vh; width: 26rem" id="map"></div> -->
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useDataStore } from "../store/index";
import L from "leaflet";

const isLoading = ref(false);
const initialMap = ref(null);
const playgroundsLayer = ref(L.featureGroup());
const dogParksLayer = ref(L.featureGroup());
const layers = {
  playgrounds: playgroundsLayer,
  dogParks: dogParksLayer,
};

const store = useDataStore();

onMounted(async () => {
  console.log(initialMap.value);
  if (!initialMap.value) {
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
    await store.fetchData();

    store.playgrounds.forEach((point) => {
      console.log(point);
      L.marker([point.lat, point.lon])
        //   .bindPopup(
        //     `<b>Playground</b><br>Rating: ${point.rating}<br><img src="${point.image_url}" width="100" height="100">`
        //   )
        .addTo(playgroundsLayer.value);
    });

    store.dogParks.forEach((point) => {
      L.marker([point.lat, point.lon])
        //   .bindPopup(
        //     `<b>Dog Park</b><br>Rating: ${point.rating}<br><img src="${point.image_url}" width="100" height="100">`
        //   )
        .addTo(dogParksLayer.value);
    });

    //   store.bikeParking.forEach((point) => {
    //     L.marker([point.latitude, point.longitude])
    //       .bindPopup(
    //         `<b>Bike Parking</b><br>Rating: ${point.rating}<br><img src="${point.image_url}" width="100" height="100">`
    //       )
    //       .addTo(bikeParkingLayer.value);
    //   });
    isLoading.value = false;
  }
});

const toggleLayer = (layerName) => {
  if (map.value.hasLayer(layers[layerName].value)) {
    map.value.removeLayer(layers[layerName].value);
  } else {
    map.value.addLayer(layers[layerName].value);
  }
};

// return {
//   toggleLayer,
// };
//   },
// };
</script>

<style scoped>
#leaflet-map {
  height: 100vh;
  width: 100%;
  overflow: hidden;
}
</style>
