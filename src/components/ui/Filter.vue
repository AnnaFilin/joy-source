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
import { useRouter, useRoute } from "vue-router";
import { ref } from "vue";

const router = useRouter();

const currFilter = ref({
  layer: ["playgrounds"],
  radius: 8,
});

const updateFilter = (key, value) => {
  if (key === "radius") currFilter.value.radius = value;
  else {
    if (!currFilter.value.layer.includes(value))
      currFilter.value.layer = [...currFilter.value.layer, value];
    else
      currFilter.value.layer = currFilter.value.layer.filter(
        (type) => type !== value
      );
  }

  const query = currFilter.value;
  console.log("query : ", query);

  router.push({ path: "/", query });
};
</script>

<style lang="scss" scoped></style>
