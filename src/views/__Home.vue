<template>
  <div class="flex flex-col mx-3">
    <Filter />
    <LeafletMap
      v-if="!loading"
      @update-location="handleUpdateLocation"
      :layers="selectedLayers"
      :dataPlaygrounds="dataPlaygrounds"
      :dataDogGardens="dataDogGardens"
      :dataBikeParkings="dataBikeParkings"
    />
    <!-- :displayedLocations="displayedLocations" -->
  </div>
</template>

<script setup>
import { onBeforeMount, reactive, ref } from "vue";
// import { useQuery } from "@tanstack/vue-query";
import { toRaw } from "vue";
import { supabase } from "../../supabase";
import { usePlaygrounds } from "../hooks/usePlaygrounds";
import { useDogParks } from "../hooks/useDogParks";
import { useBikeParkings } from "../hooks/useBikeParkings";
import { useRoute } from "vue-router";
import LeafletMap from "@/components/LeafletMap1.vue";
import Filter from "@/components/ui/Filter.vue";

const loading = ref(true);

const route = useRoute();
const dataPlaygrounds = getPlaygrounds();
async function getPlaygrounds() {
  loading.value = true;
  try {
    const { data, error, status } = await supabase
      .from("playgrounds")
      .select("*");
    if (error && status !== 406) throw error;
    if (data) {
      console.log("data", data);
      dataPlaygrounds.value = data;
    }
  } catch (error) {
    alert(error.message);
  } finally {
    // loading.value = false;
  }
}

const dataDogGardens = getDogParks();

async function getDogParks() {
  loading.value = true;
  try {
    const {
      data: dogGardensData,
      error: errorDogGardens,
      status: statusDogGardens,
    } = await supabase.from("dogGardens").select("*");

    if (errorDogGardens && statusDogGardens !== 406) throw error;
    if (dogGardensData) {
      console.log("data", dogGardensData);
      dataDogGardens.value = dogGardensData;
    }
  } catch (error) {
    alert(error.message);
  } finally {
    // loading.value = false;
  }
}

const dataBikeParkings = ref([]);

const displayedLocations = ref({
  filteredPlaygrounds: [],
  filteredDogParks: [],
  filteredBikeParkings: [],
});

const selectedRadius = ref(route.query.radius || 3);
const selectedLayers = ref(route.query.layer || ["playgrounds"]);
console.log("sekelekm", selectedLayers.value);
const location = ref(null);

onMounted(() => {
  console.log("on mounted HOME", selectedLayers.value);

  console.log(
    "layer : ",
    selectedLayers.value,
    " radius = ",
    selectedRadius.value
  );

  displayedLocations.filteredPlaygrounds = dataPlaygrounds.value;
  displayedLocations.filteredDogParks = dataDogGardens.value;

  loading.value = false;
});

function handleUpdateLocation(e) {
  console.log("update loc ", e);
  location.lat = e.lat;
  location.lon = e.lon;
}

watchEffect(() => {
  const layer = route.query.layer;
  const radius = route.query.radius;
  console.log(
    "layer : ",
    layer,
    " radius = ",
    radius,
    displayedLocations.value
  );

  selectedLayers.value = layer;
});

function filterRadius() {
  console.log("filter by radius", selectedRadius.value);
  if (!selectedRadius.value) return;
  // if (!location?.lat || !location?.lon) return;
  console.log("mmmlll");
  const currentLocation = L.latLng(location.lat, location.lon);
  console.log(
    "plplaygroundsData, ",
    // typeof dataPlaygrounds,
    dataPlaygrounds.value
    // toRaw(dataPlaygrounds.value)
  );

  console.log(
    "filteredPlaygrounds.value",
    displayedLocations.filteredPlaygrounds
  );
}
</script>

<style lang="scss" scoped></style>
