<template>
  <div class="flex justify-between gap-1 p-2">
    <Button type="primary" @onClick="updateFilter('type', 'playgrounds')">
      Playgrounds
    </Button>
    <Button type="primary" @onClick="updateFilter('type', 'dogParks')">
      Dog gardens</Button
    >
    <Button type="primary" @onClick="updateFilter('type', 'bikeParkings')">
      Bicycle parking</Button
    >
    <div class="flex flex-col justify-between gap-1">
      <Button type="small" @onClick="updateFilter('radius', 1)"> 1 km </Button>
      <Button type="small" @onClick="updateFilter('radius', 3)"> 3 km</Button>
      <Button type="small" @onClick="updateFilter('radius', 8)"> 8 km</Button>
    </div>
  </div>
</template>

<script setup>
import Button from "@/components/ui/Button.vue";
import { toRaw } from "vue";
import { useRouter, useRoute } from "vue-router";

const router = useRouter();
const route = useRoute();

const updateFilter = (key, value) => {
  console.log("key", key, "val,", value);
  console.log("router", toRaw(router).currentRoute); //.currentRoute.value.query);
  console.log("route", toRaw(route));
  //   let currQuery = toRaw(router).currentRoute.value.query;

  let currQuery = toRaw(route).query; //.currentRoute.value.query;
  console.log("curr", currQuery);
  const query = { ...currQuery, [key]: value };
  console.log("query ", query);
  console.log("cdcdc", toRaw(route), query, query);
  router.push({
    ...toRaw(route),
    query: {
      ...toRaw(route).query,
      ...query,
      query,
    },
  });
};

// const router = useRouter()

// function pushWithQuery(query) {
//   router.push({
//     name: 'search',
//     query: {
//       ...route.query,
//       ...query,
//     },
//   })
// }
// const selectedLayer = ref("");
// // const locationType = useRouteQuery("locationType");
// // const store = useDataStore();

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
</script>

<style lang="scss" scoped></style>
