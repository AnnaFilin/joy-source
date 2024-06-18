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

<script setup></script>

<style scoped>
.modal {
  display: block;
  position: fixed;
  z-index: 900;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgb(0, 0, 0);
  background-color: rgba(0, 0, 0, 0.4);
}
.modal-content {
  background-color: #fefefe;
  margin: 15% auto;
  padding: 20px;
  border: 1px solid #888;
  width: 80%;
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
