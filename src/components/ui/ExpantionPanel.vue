<template>
  <div>
    <div class="flex">
      <button @click="isExpanded = !isExpanded">{{ panelName }}</button>
    </div>
    <div v-if="isExpanded">
      <slot> </slot>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
const props = defineProps(["panelName"]);
const { panelName } = props;
const isExpanded = ref(false);
</script>

<style lang="scss" scoped></style>
