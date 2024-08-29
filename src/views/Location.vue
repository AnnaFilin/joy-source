<template>
  <div class="flex flex-col mx-3">
    <p>{{ route.id }}</p>
    <LocationDetails
      v-if="isFetched"
      :location-item="playgroundData"
      :type="route.type"
      :address="address"
    />
  </div>
</template>

<script setup>
import { useRoute } from "vue-router";
import LocationDetails from "../components/LocationDetails.vue";
import { onMounted, ref } from "vue";
import { useQuery } from "@tanstack/vue-query";
import { supabase } from "../../supabase";
import { fetchAddress } from "../utils/helpers";

const route = useRoute();
const { id } = route.params;
const { lat, lng } = route.query;
const address = ref("");

onMounted(async () => {
  //   console.log("onMounted - LOCATION", route.params, route.query);
  address.value = await fetchAddress(lat, lng);
});

const {
  data: playgroundData,
  isFetched,
  refetch,
} = useQuery({
  queryKey: ["playground", id],
  queryFn: () => fetchPlayground(id),
  refetchOnWindowFocus: true,
  cacheTime: 0,
  staleTime: 0,
});

const fetchPlayground = async (id) => {
  const { data, error, status } = await supabase
    .from("playgrounds")
    .select("*")
    .eq("id", id);
  if (error) {
    throw new Error(error.message);
  }
  return data[0];
};

watch(
  () => route.params.id,
  async () => {
    await refetch(); // Refetch data when the route changes
  }
);
</script>

<style lang="scss" scoped></style>
