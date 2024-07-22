<template>
  <div class="p-3 flex justify-center">
    <!-- style="height: 90vh; width: 26rem" -->
    <div
      id="map"
      class="z-20 rounded-sm ring ring-citrine-100 border border-1 border-citrine-700 w-screen h-full"
      style="height: 90vh"
    ></div>
  </div>
</template>

<script setup>
import { defineComponent, onMounted, watch } from "vue";
import L from "leaflet";

const props = defineProps(["locations"]);
const { locations } = props;
// export default defineComponent({
//   props: {
//     locations: {
//       type: Array,
//       required: true,
//     },
//   },
//   setup(props) {
//     let map;
const initialMap = ref(null);

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

  watch(
    props.locations,
    (newLocations) => {
      if (newLocations)
        newLocations.forEach((location) =>
          createMarker(point, "playground", "מגרש משחקים").addTo(
            initialMap.value
          )
        );
    },
    { immediate: true }
  );
});

function createMarker(el, type, label) {
  console.log("el, type label : ", el, type, label);
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
  // console.log("markerOptions", markerOptions);
  return L.marker([toRaw(el).lat, toRaw(el).lon], markerOptions).bindPopup(
    `<b>${label}</b><br>Name: ${toRaw(el)[tooltipKey]}<br>  <button class="details-button text-sm bg-seasalt p-2 border border-purple-300 rounded-md text-purple-500" data-id="${el.id}">More Details</button>`
  );
}
//   },
// });
</script>

<style scoped>
#leaflet-map {
  height: 100vh;
  width: 100%;
  overflow: hidden;
}
</style>
