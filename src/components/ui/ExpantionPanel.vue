<template>
  <div class="w-full">
    <div class="flex border border-1 border-citrine-800 rounded-md my-1">
      <button @click="isExpanded = !isExpanded" class="w-full">
        {{ panelName }}
      </button>
    </div>
    <div
      v-if="isExpanded"
      class="border border-1 rounded-md border-citrine-800 my-1 p-3"
    >
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
