<template>
  <div class="flex flex-col mx-3">
    <Filter />
    <LeafletMap
      v-if="allFetched"
      @update-location="handleUpdateLocation"
      :layers="layers"
      :dataPlaygrounds="dataPlaygrounds"
      :dataDogGardens="dataDogGardens"
      :dataBikeParkings="dataBikeParkings"
    />
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useQuery } from "@tanstack/vue-query";

import LeafletMap from "@/components/LeafletMap1.vue";
import Filter from "@/components/ui/Filter.vue";
import { supabase } from "../../supabase";

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
const allFetched =
  isFetchedDogGardens && isFetchedBikeParkings && isFetchedPlaygrounds;
</script>

<style lang="scss" scoped></style>
