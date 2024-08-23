<template>
  <div v-if="showDetails" class="modal">
    <div class="modal-content">
      <span class="close" @click="showDetails = false">&times;</span>
      <h2 class="text-licorice bg-citrine">
        {{ details.lat }} {{ details.lon }}
      </h2>
      <p class="text-licorice">{{ details.name }}</p>
      <!-- Add more details as needed -->
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps(["details", "showDetails", "markerPosition"]);

const modalStyle = computed(() => {
  if (!props.markerPosition) return {};

  return {
    left: `${props.markerPosition.left}px`,
    top: `${props.markerPosition.top}px`,
    transform: "translate(-50%, -50%)",
    position: "absolute",
    zIndex: 900,
  };
});
</script>

<style scoped>
.modal {
  display: block;
  position: fixed;
  z-index: 900;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  height: 100%;
  overflow: auto;
  /* background-color: rgb(0, 0, 0); */
  background-color: rgba(0, 0, 0, 0.4);
}
.modal-content {
  background-color: #fefefe;
  /* margin: 15% auto; */
  margin: auto;
  padding: 20px;
  border: 1px solid #888;
  width: 80%;
  max-width: 600px;
}
.close {
  color: #aaa;
  float: right;
  font-size: 28px;
  font-weight: bold;
}
.close:hover,
.close:focus {
  color: black;
  text-decoration: none;
  cursor: pointer;
}
</style>
