<template>
  <div
    ref="target"
    class="flex justify-center lg:w-6/12 lg:mx-auto w-fill md:right-1/4 right-0.5 sm:w-fill sm:h-fill transition-all duration-500 p-5 border ring ring-purple-200 rounded-md details-popup border-purple-700 bg-seasalt m-2"
  >
    <div class="justify-self-center w-full">
      <div>
        <div class="flex flex-row align-end justify-between mb-2">
          <router-link
            class="text-purple-700 font-bold text-xl hover:text-citrine"
            to="/"
            >&larr;</router-link
          >
          <div class="flex justify-end">
            <p class="text-purple-500 text-xl font-bold mb-0">
              {{ locationItem.name }}
            </p>
          </div>
        </div>
        <div>
          <p class="text-purple-500 text-lg font-semibold mb-2">
            {{ address }}
          </p>
        </div>
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
      <div class="mt-3 flex justify-between">
        <ExpantionPanel :panel-name="'סוגי מתקנים'">
          <component :is="selectedTypeDetails" :locationItem="locationItem" />
        </ExpantionPanel>
      </div>
      <div class="mt-3 flex flex-col justify-between">
        <ExpantionPanel :panel-name="'חוות דעת'">
          <Reviews
            v-if="locationItem.reviews"
            :reviews="locationItem.reviews"
          />
          <div class="p-2" dir="rtl" v-if="displayAddReview">
            <label for="תגובה" />
            <textarea
              name="review"
              placeholder="הוסף תגובה"
              v-model="review.review"
              class="w-full rounded-md p-2 ring-2 ring-citrine-100 border border-1 border-purple-200"
            ></textarea>
            <Button type="primary" @onClick="handleAdd">הוסף תגובה</Button>
          </div>
          <div v-else class="mt-2">
            <Button
              type="primary"
              @onClick="displayAddReview = !displayAddReview"
              >הוסף תגובה</Button
            >
          </div>
        </ExpantionPanel>
      </div>
      <div class="mt-3 flex justify-between">
        <Rating
          :value="rating"
          :max-rating="maxRating"
          @update-rating="rating = $event"
          :total-rates="locationItem.totalRates"
        />
        <FileInput @file-upload="handleFileUpload" />
      </div>
      <!-- <div class="mt-3 flex justify-between px-16">
          <Button type="small">Share</Button>
          <Button type="small">Open issue</Button>
        </div> -->
      <div class="mt-3 flex justify-between">
        <Button type="primary" @onClick="handleSubmit">Update</Button>
        <Button type="primary">Close</Button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { toRaw, computed } from "vue";
import Reviews from "./ui/Reviews.vue";
import ExpantionPanel from "./ui/ExpantionPanel.vue";
import DogGardenDetails from "./DogGardenDetails.vue";
import PlaygroundDetails from "./playgrounds/PlaygroundDetails.vue";
import BikeParkingDetails from "./BikeParkingDetails.vue";
import Button from "./ui/Button.vue";
import FileInput from "./ui/FileInput.vue";
import Rating from "./ui/Rating.vue";
import { useUpdatePlayground } from "../hooks/useUpdatePlayground";
import { useRouter } from "vue-router";
import emitter from "../utils/eventBus";
import { useQueryClient } from "@tanstack/vue-query";

const queryClient = useQueryClient();
const router = useRouter();

const emit = defineEmits(["location-updated"]);
const target = ref(null);

const maxRating = ref(5);
const review = ref({
  review: "",
  dateAdded: new Date(),
});

const props = defineProps(["locationItem", "type", "address"]);
const { locationItem, type } = props;

const displayAddReview = ref(false);

const selectedTypeDetails = computed(() => {
  if (type === "playground") return PlaygroundDetails;
  if (type === "dogPark") return DogGardenDetails;
  else return BikeParkingDetails;
});

const rating = ref(locationItem.rating / locationItem.totalRates);

const imageRef = ref(null);
function handleFileUpload(image) {
  imageRef.value = image;
}

function handleAdd() {}

const { updatePlayground, isUpdating } = useUpdatePlayground();
function handleSubmit() {
  const item = toRaw(locationItem);

  //FIX BUG HERE___ only if rating updated I should update and add it -> the same for total rates
  const ratingVal = item.rating + rating.value;
  let payload = {
    playgarden: item,
  };
  if (imageRef.value) payload = { ...payload, image: imageRef.value };
  if (review.value) {
    payload = {
      ...payload,
      review: toRaw(review.value),
    };
  }
  if (rating.value) {
    payload = {
      ...payload,
      rating: ratingVal,
      totalRates: item.totalRates + 1,
    };
  }
  try {
    updatePlayground(
      {
        playgarden: payload.playgarden,
        review: payload.review,
        rating: payload.rating,
        totalRates: payload.totalRates,
      },
      {
        onSuccess: () => {
          // Invalidate queries to refetch the latest data
          queryClient.invalidateQueries(["playgrounds"]);
          queryClient.invalidateQueries(["playground", item.id]); // Invalidate specific location data
          queryClient.invalidateQueries(["dogGardens"]);
          queryClient.invalidateQueries(["bikeParkings"]);
        },
        onSettled: () => {
          queryClient.refetchQueries(["playground", item.id]); // Ensure the query is refetched
          emitter.emit("location-updated");
          router.go(-1);
        },
      }
    );
  } catch (e) {
    console.log("Failed to update location", error);
  }
}
</script>

<style scoped>
.details-popup {
  padding: 1rem;
}
</style>
