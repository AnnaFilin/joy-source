<template>
  <div>
    <div class="border border-1 border-purple-200 overflow-y-scroll h-16">
      <ul>
        <li v-for="review in reviews" class="text-purple-700">
          <span>
            {{ review.review }}
          </span>
          <span>
            {{ review.dateAdded ? review.dateAdded : "ללא תאריך" }}
          </span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
// import Button from "./Button.vue";

const props = defineProps(["reviews"]);
const { reviews } = props;
// const showReviews = ref(false);
</script>

<style lang="scss" scoped></style>
