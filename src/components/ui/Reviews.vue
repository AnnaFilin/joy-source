<template>
  <div class="border border-1 border-purple-200 p-2 rounded-md">
    <ul class="">
      <li v-for="review in reviews" class="text-purple-700">
        <span class="text-sm text-green-500">
          ({{
            review.dateAdded
              ? format(review.dateAdded, "MM/dd/yyyy")
              : "ללא תאריך"
          }})
        </span>
        <span class="font-semibold px-2">
          {{ review.review }}
        </span>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { format, compareAsc } from "date-fns";
const props = defineProps(["reviews"]);
const { reviews } = props;
</script>

<style lang="scss" scoped></style>
