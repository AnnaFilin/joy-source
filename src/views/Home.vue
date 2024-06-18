<template>
  <div class="flex flex-col mx-3">
    <!-- <div class="flex justify-between gap-1 p-2">
      <Button type="primary" @onClick="toggleLayer('playgrounds')">
        Playgrounds
      </Button>
      <Button type="primary" @onClick="toggleLayer('dogParks')">
        Dog gardens</Button
      >
      <Button type="primary" @onClick="toggleLayer('bikeParkings')">
        Bicycle parking</Button
      >
      <div class="flex flex-col justify-between gap-1">
        <Button type="small" @onClick="filterLocations(1)"> 1 km </Button>
        <Button type="small" @onClick="filterLocations(3)"> 3 km</Button>
        <Button type="small" @onClick="filterLocations(8)"> 8 km</Button>
      </div>
    </div> -->
    <!-- <p class="text-cyan-900"> -->
    <Filter />
    <LeafletMap />
    <!-- v-if="loaded" -->
    <!-- </p> -->
  </div>
</template>

<script setup>
import { useQuery } from "@tanstack/vue-query";

import { ref, onMounted, reactive, watch } from "vue";
import LeafletMap from "@/components/LeafletMap.vue";
// import Button from "@/components/ui/Button.vue";
import Filter from "@/components/ui/Filter.vue";
// import { useDataStore } from "../store";
import { getPlaygrounds } from "../hooks/usePlaygrounds";
import { getDogParks } from "../hooks/useDogParks";

// export default {
//   components: {
//     Filter,
//     LeafletMap,
//   },
// setup() {
const loaded = ref(false);

const { data: dogParksData, error: dogParksError } = useQuery({
  queryKey: ["dogGardens"],
  queryFn: getDogParks,
});
const { data: playgroundsData, error: playgroundsError } = useQuery({
  queryKey: ["playgrounds"],
  queryFn: getPlaygrounds,
});
// const selectedLayer = ref("");
// const locationType = useRouteQuery("locationType");
// const store = useDataStore();

// const toggleLayer = (layer) => {
//   // switch (layer) {
//   //   case 'playgrounds':
//   //     console.log('pl')
//   selectedLayer.value = layer;
//   // }

//   // store.toggleLayerVisibility(layer);
// };
// watch(() => {});

// const filterLocations = (radius) => {
//   store.filterLocations(radius);
// };

// onMounted(() => {
//   loaded.value = false;

//   store.fetchData();
//   loaded.value = true;
// });
const route = useRoute();
// const router = useRouter();

const data = ref([]);
// const title = ref("");

watchEffect(() => {
  const type = route.query.type;

  if (type === "playgrounds") {
    console.log("pl");
    // title.value = "Playgrounds";
    // useQuery(["playgrounds"], async () => {
    //   const { data: fetchedData, error } = await supabase
    //     .from("playgrounds")
    //     .select("*");
    //   if (error) {
    //     throw new Error(error.message);
    //   }
    // data.value = usePlaygrounds(); //fetchedData;
    // });
    // const {data: dogParksData} = getDogGardens();
    //usePlaygrounds();
    // console.log("ppl", data);
    // data.value = data;
  } else if (type === "dogParks") {
    console.log("dog");

    // const { data, isPending } = useQuery({
    //   queryKey: ["dogGardens"],
    //   queryFn: getDogParks,
    // }); //useDogParks();
    // console.log("d", data);
    // data.value = data;
    // });
  }
});

// function getDogGardens() {
//   const { data, error } = useQuery({
//     queryKey: ["playgrounds"],
//     queryFn: getPlaygrounds,
//   });
//   return data;
// }

//   return { data, title, route };
// },
// };
</script>

<style lang="scss" scoped></style>
