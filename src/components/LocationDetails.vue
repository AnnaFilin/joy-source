<template>
  <div
    class="fixed top-0 left-0 w-full h-screen bg-transparent backdrop-blur-sm z-50 transition-all duration-500"
  >
    <div
      ref="target"
      class="flex justify-center lg:w-6/12 lg:inset-y-1/8 --> md:fixed md:right-1/4 right-0.5 sm:w-fill sm:h-fill transition-all duration-500 p-5 border ring ring-purple-200 rounded-md border-purple-700 bg-seasalt m-2"
    >
      <!-- lg:w-6/12 lg:inset-y-1/3 -->
      <div class="justify-self-center w-full">
        <div>
          <div class="flex flex-row align-end justify-between mb-2">
            <Button type="round" @onClick="$emit('close')"> &times; </Button>
            <div class="flex justify-end">
              <p class="text-purple-500 text-xl font-bold mb-0">
                {{ locationItem.name }}
              </p>
            </div>
          </div>
          <!---->
          <div
            v-if="locationItem.image"
            class="flex justify-center align-middle mb-3"
          >
            <img
              class="ring ring-purple-100 rounded-md object-cover w-10/12 h-10/12"
              :src="locationItem.image"
              alt="image"
            />
          </div>
          <div v-else class="flex justify-center align-middle">
            <p
              class="text-3xl text-purple-700 font-semibold p-16 mb-4 rounded-md ring-2 ring-purple-100 border border-1 border-citrine-500"
            >
              No photos available
            </p>
          </div>
        </div>
        <div class="mt-3 flex justify-between px-16">
          <ExpantionPanel :panel-name="'סוגי מתקנים'">
            <component :is="selectedTypeDetails" :locationItem="locationItem" />
          </ExpantionPanel>
        </div>
        <div class="mt-3 flex justify-between px-16">
          <Rating
            :value="rating"
            :max-rating="maxRating"
            @update-rating="rating = $event"
            :total-rates="locationItem.totalRates"
          />
          <FileInput @file-upload="handleFileUpload" />
        </div>
        <div class="mt-3 flex justify-between px-16">
          <ExpantionPanel :panel-name="'חוות דעת'">
            <Reviews
              v-if="locationItem.reviews"
              :reviews="locationItem.reviews"
            />
            <div class="mt-3 flex justify-end px-16" dir="rtl">
              <label for="תגובה">הוסף תגובה</label>
              <textarea
                name="review"
                v-model="review"
                @blur="addReview"
                class="mr-10 w-full rounded-md ring-2 ring-citrine-100 border border-1 border-purple-200"
              ></textarea>
            </div>
          </ExpantionPanel>
        </div>
        <div class="mt-3 flex justify-between px-16">
          <Button type="small">Share</Button>
          <Button type="small">Open issue</Button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { watch, toRaw, computed } from "vue";
import { useDataStore } from "../store";
import Reviews from "./ui/Reviews.vue";
import ExpantionPanel from "./ui/ExpantionPanel.vue";
import DogGardenDetails from "./DogGardenDetails.vue";
import PlaygroundDetails from "./playgrounds/PlaygroundDetails.vue";
import BikeParkingDetails from "./BikeParkingDetails.vue";
import Button from "./ui/Button.vue";
import FileInput from "./ui/FileInput.vue";

import Rating from "./ui/Rating.vue";

import { onClickOutside } from "@vueuse/core";

const emit = defineEmits(["close"]);
const target = ref(null);

onClickOutside(target, (event) => {
  console.log(event);
  closeDetails();
});

const store = useDataStore();
const maxRating = ref(5);
const review = ref("");

const props = defineProps(["locationItem", "type"]);
const { locationItem, type } = props;

const selectedTypeDetails = computed(() => {
  if (type === "playground") return PlaygroundDetails;
  if (type === "dogPark") return DogGardenDetails;
  else return BikeParkingDetails;
});

const rating = ref(locationItem.rating / locationItem.totalRates);
watch(rating, (val) => {
  // console.log(val);
  store.updateRating(toRaw(locationItem), val);
});

function addReview(e) {
  const dateAdded = new Date();
  const review = {
    review: e.target.value,
    dateAdded: dateAdded,
  };
  // console.log("review", review);
  e.preventDefault();
  store.addReview(toRaw(locationItem), review);
}

function handleFileUpload(image) {
  // console.log(image, locationItem.id);
  store.uploadPhoto(toRaw(locationItem), image);
}

function closeDetails() {
  // console.log("close details");
  emit("close");
}
</script>

<style scoped>
.details-popup {
  position: absolute;
  background: white;
  padding: 1rem;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  /* Other styles */
}
</style>
