<template>
  <div>
    Layout
    <Header />
    <main></main>
    <slot></slot>
  </div>
</template>

<script setup>
import Header from "./components/Header.vue";
</script>

<style lang="scss" scoped></style>
