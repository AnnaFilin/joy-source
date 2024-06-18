<template>
  <button :class="styles[type]" :disabled="disabled" @click="$emit('onClick')">
    <slot></slot>
  </button>
</template>

<script setup>
import { defineProps } from "vue";

const props = defineProps(["type"]);

const base =
  "bg-seasalt text-sm inline-block rounded-lg focus:bg-citrine-100 border font-semibold uppercase tracking-wide border-1 border-purple-200 text-purple-700 transition-colors duration-300 hover:bg-citrine-100 focus:bg-citrine-100 focus:ring focus:ring-offset-2 disabled:cursor-not-allowed focus:ring-citrine-200";

const styles = {
  primary: base + " px-4 py-3 sm:px-6 sm:py-4 md:py-4",
  small: base + "text-xs py-2 md:py-2.5 px-4 md:px-5 text-xs",
  round: base + " px-2.5 py-1 md:px-3.5 md:py-2 text-sm",
  secondary:
    " inline-block  px-4 py-2.5 sm:px-6 md:py-3.5 rounded-full bg-transparent border-2 border-purple  font-semibold uppercase tracking-wide text-licrice transition-colors duration-300 hover:bg-citrine-100 hover:text-purple-800 focus:text-purple-500 focus:bg-citrine-100 focus:ring-citrine-100 focus:outline-none focus:ring focus:ring-offset-2 disabled:cursor-not-allowed ",
};
</script>

<style lang="scss" scoped></style>
