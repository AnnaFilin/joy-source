<template>
  <div class="flex justify-between text-licorice-500">
    <p>{{ label }}</p>
    <p>{{ value }}</p>
  </div>
</template>

<script setup>
const props = defineProps(["label", "value"]);
const { label, value } = props;
</script>

<style lang="scss" scoped></style>
