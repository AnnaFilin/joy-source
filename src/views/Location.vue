<template>
  <div v-if="isFetched" class="flex flex-col mx-3">
    <p>{{ route.id }}</p>
    <LocationDetails :location-item="playgroundData" :type="route.type" />
  </div>
  <!-- v-if="isFetched"
  :location-item="playgroundData"
  :type="'playground'" -->
</template>

<script setup>
import { useRoute } from "vue-router";
import LocationDetails from "../components/LocationDetails.vue";
import { onMounted } from "vue";
import { useQuery } from "@tanstack/vue-query";
import { supabase } from "../../supabase";
import { usePlayground } from "../hooks/usePlayground";

// defineProps({
//   id: String,
//   type: String,
// });
// function usePlayground() {
const route = useRoute();
const { id } = route.params;
onMounted(() => {
  console.log(route.params);
  console.log("mounted");
  //   fetchPlayground();
});

const { data: playgroundData, isFetched } = useQuery({
  queryKey: ["playground", id],
  queryFn: () => fetchPlayground(id),
  // keepPreviousData: true,
});
//   console.log("use playgroundg ", playgroundData, isFetched);
//   const data = toRaw(playgroundsData);
//   return { data, isFetched, error };
// }

const fetchPlayground = async (id) => {
  console.log("id", id);
  const { data, error, status } = await supabase
    .from("playgrounds")
    .select("*")
    .eq("id", id);
  console.log("data : ", data[0]);
  if (error) {
    throw new Error(error.message);
  }
  return data[0];
};

// const { data: dataPlayground, isFetched } = usePlayground(id);
</script>

<style lang="scss" scoped></style>
