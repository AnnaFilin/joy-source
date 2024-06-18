<template>
  <div class="flex justify-between">
    <div>
      <p class="text-licorice">Area: {{ locationItem.area.toFixed(2) }}</p>
      <p class="text-licorice">Length: {{ locationItem.len.toFixed(2) }}</p>
    </div>
  </div>
</template>

<script setup>
const props = defineProps(["locationItem"]);
</script>

<style lang="scss" scoped></style>
