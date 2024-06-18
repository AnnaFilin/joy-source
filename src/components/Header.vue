<template>
  <div class="flex justify-between items-center bg-citrine-700">
    <h1 class="text-seasalt text-5xl px-4 my-3">B7/4U</h1>
    <div class="flex gap-4 px-5 uppercase">
      <router-link class="text-seasalt hover:text-citrine" :to="'/about'"
        >About</router-link
      >
      <router-link class="text-seasalt hover:text-citrine" :to="'/'"
        >Home</router-link
      >
    </div>
  </div>
</template>

<script setup></script>

<style lang="scss" scoped></style>
