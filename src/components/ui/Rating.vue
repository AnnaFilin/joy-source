<template>
  <div class="wrapper">
    <span
      v-for="star in maxRating"
      :key="star"
      class="star"
      :class="{ filled: star <= value }"
      @click="setRating(star)"
      >★</span
    >
    <span> / {{ totalRates }}</span>
  </div>
</template>

<script setup>
import { defineEmits } from "vue";

const props = defineProps(["value", "maxRating", "totalRates"]);
// console.log("props->", props.value);
const emit = defineEmits(["update-rating"]);

const setRating = (star) => {
  emit("update-rating", star);
};
</script>

<style scoped>
.wrapper {
  display: flex;
  align-items: center;
  gap: 2px;
}

.star {
  cursor: pointer;
  color: #d8d8d8;
}

.star:hover,
.star:active,
.star.filled {
  color: orange;
}
/* .active {
    border-color: purple;
  }
  
  .active button {
  }
  ul {
    list-style: none;
    margin: 0.5rem 0;
    padding: 0;
    display: flex;
  }
  
  li {
    margin: 0 1rem;
    border: 1px solid #ccc;
    padding: 1rem;
    display: flex;
    justify-content: center;
    align-items: center;
  } */
</style>
