<template>
  <div class="flex flex-col mx-3">
    <Filter />
    <keep-alive>
      <LeafletMap1
        v-if="allFetched"
        @update-location="handleUpdateLocation"
        :layers="layers"
        :dataPlaygrounds="dataPlaygrounds"
        :dataDogGardens="dataDogGardens"
        :dataBikeParkings="dataBikeParkings"
      />
    </keep-alive>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useQuery } from "@tanstack/vue-query";
import emitter from "../utils/eventBus";

import LeafletMap1 from "@/components/LeafletMap1.vue";
import Filter from "@/components/ui/Filter.vue";
import { supabase } from "../../supabase";
import { queryClient } from "../main";

const fetchPlaygrounds = async () => {
  let { data, error } = await supabase.from("playgrounds").select("*");
  if (error) throw error;
  return data;
};

const fetchDogGardens = async () => {
  let { data, error } = await supabase.from("dogGardens").select("*");
  if (error) throw error;
  return data;
};

const fetchBikeParkings = async () => {
  let { data, error } = await supabase.from("bikeParkings").select("*");
  if (error) throw error;
  return data;
};

const { data: dataPlaygrounds, isFetched: isFetchedPlaygrounds } = useQuery({
  queryKey: ["playgrounds"],
  queryFn: () => fetchPlaygrounds(),
});
const { data: dataDogGardens, isFetched: isFetchedDogGardens } = useQuery({
  queryKey: ["dogGardens"],
  queryFn: () => fetchDogGardens(),
});
const { data: dataBikeParkings, isFetched: isFetchedBikeParkings } = useQuery({
  queryKey: ["bikeParkings"],
  queryFn: () => fetchBikeParkings(),
});
const layers = "playgrounds";

const allFetched = computed(() => {
  return (
    isFetchedPlaygrounds.value &&
    isFetchedDogGardens.value &&
    isFetchedBikeParkings.value
  );
});

watch(
  [isFetchedPlaygrounds, isFetchedDogGardens, isFetchedBikeParkings],
  () => {
    allFetched.value =
      isFetchedPlaygrounds.value &&
      isFetchedDogGardens.value &&
      isFetchedBikeParkings.value;
  }
);
onMounted(() => {
  emitter.on("locationUpdated", (data) => {
    // console.log("Location updated with data:", data);
    // Handle the data or update your component
    handleUpdateLocation(data);
  });
});
// Handle the data or update your component
// Handle the event from LeafletMap1 and invalidate queries
function handleUpdateLocation(data) {
  // console.log("home - update location", data);
  queryClient.refetchQueries(["playground", data.id]);
  queryClient.invalidateQueries(["playgrounds", "dogGardens", "bikeParkings"]);
}
</script>

<style lang="scss" scoped></style>
