<template>
  <div class="flex flex-col mx-3">
    <Filter />
    <!-- <h3>{{ title }}</h3> -->
    <LeafletMap :locations="data" />
    <!-- <div v-if="error">{{ error.message }}</div> -->
  </div>
</template>

<script setup>
import { defineComponent, ref, computed, onMounted, watchEffect } from "vue";
import { useRoute } from "vue-router";
// import { supabase } from "../supabaseClient";
import { supabase } from "../../supabase";
import Filter from "@/components/ui/Filter.vue";
import LeafletMap from "../components/LeafMap.vue";

// export default defineComponent({
//   components: {
//     Filter,
//     LeafletMap,
//   },
//   setup() {
const route = useRoute();
const type = computed(() => route.query.type || "playgrounds"); // Default to 'playgrounds' if not specified
const data = ref([]);
const error = ref(null);
const title = computed(() => {
  if (type.value === "playgrounds") return "Playgrounds";
  if (type.value === "dogParks") return "Dog Parks";
  if (type.value === "bikeParkings") return "Bike Parkings";
  return "";
});

const fetchData = async () => {
  try {
    let result;
    if (type.value === "playgrounds") {
      const { data, error } = await supabase.from("playgrounds").select("*");
      if (error) throw error;
      result = data;
    } else if (type.value === "dogParks") {
      const { data, error } = await supabase.from("dog_parks").select("*");
      if (error) throw error;
      result = data;
    } else if (type.value === "bikeParkings") {
      const { data, error } = await supabase.from("bikeParkings").select("*");
      if (error) throw error;
      result = data;
    }
    data.value = result;
  } catch (err) {
    error.value = err;
  }
};

onMounted(() => {
  fetchData();
});

watchEffect(() => {
  fetchData();
});

// return {
//   data,
//   error,
//   title,
// };
//   },
// });
</script>
