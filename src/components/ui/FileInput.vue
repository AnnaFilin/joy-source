<template>
  <div>
    <input v-if="showInput" ref="file" @change="onFileChanged" type="file" />
    <!-- <Button v-else type="small" @onClick="handleClick"> -->
    <!-- (e) => {
      e.preventDefault();
      showInput = true;
    } -->
    <!-- Upload photo
    </Button> -->
    <button @click="handleClick">Upload photo</button>
  </div>
</template>

<script setup>
import Button from "@/components/ui/Button.vue";

const file = ref(null);
const showInput = ref(false);
const emit = defineEmits(["file-upload"]);

function handleClick(e) {
  console.log(e);
  e.preventDefault();
  showInput.value = true;
}

function onFileChanged(event) {
  console.log("target", event);
  const target = event.target;
  if (target && target.files) {
    file.value = target.files[0];
  }
  emit("file-upload", file.value);
  showInput.value = false;
}

// async function saveImage() {
//   console.log("file.value", file.value);
//   if (file.value) {
//     try {
//       // save file.value
//     } catch (error) {
//       console.error(error);
//       form.value?.reset();
//       file.value = null;
//     } finally {
//     }
//   }
// }
</script>

<style lang="scss" scoped></style>
