<template>
  <div class="flex justify-between">
    <div>
      <p class="text-licorice">Area: {{ locationItem.sign }}</p>
      <p class="text-licorice">Length: {{ locationItem.NoSign }}</p>
    </div>
  </div>
</template>

<script setup>
const props = defineProps(["locationItem"]);
</script>

<style lang="scss" scoped></style>
