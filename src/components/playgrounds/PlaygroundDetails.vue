<template>
  <div class="flex flex-col justify-center">
    <div class="flex justify-between px-16 gap-16">
      <div class="w-full flex flex-col">
        <InfoRow label="אומגה" :value="locationItem.omega" />
        <InfoRow label="ברזייה" :value="locationItem.spring" />
        <InfoRow label="קרוסלה" :value="locationItem.carrousel" />
      </div>
      <div class="w-full flex flex-col">
        <InfoRow label="נדנדה" :value="locationItem.swing" />
        <InfoRow label="עלה ורד" :value="locationItem.roserose" />
        <InfoRow label="מגלשה" :value="locationItem.slide" />
      </div>
      <div class="w-full flex flex-col">
        <InfoRow label="משטח" :value="locationItem.surface" />
        <InfoRow label="הצללה" :value="locationItem.shadowing" />
      </div>
    </div>
    <div class="flex flex-col px-16">
      <p class="text-licorice">
        {{ locationItem.other }}<span class="pl-10">אחר </span>
      </p>
    </div>
  </div>
</template>

<script setup>
import InfoRow from "../ui/InfoRow.vue";
const props = defineProps(["locationItem"]);
const { locationItem } = props;
</script>

<style lang="scss" scoped></style>
