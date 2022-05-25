<template>
  <div class="drop"
       :class="{isDraggingClass:isDragging}"
       @dragover.prevent="dragOver"
       @dragleave.prevent="dragLeave"
       @drop.prevent="onDrop">
    <img :src="img_src" v-if="img_src" alt="profile_img"/>
    <h1 v-if="!img_src && !isDragging && !wrongFile">Drop an image</h1>
    <h1 v-if="wrongFile">Wrong file type</h1>
  </div>

</template>

<script setup>
import {ref} from "vue";

let isDragging = ref(false)
let wrongFile = ref(false)
let img_src = ref('')
const emit = defineEmits(['imageUploaded'])

function dragOver() {
  isDragging.value = true
}

function dragLeave() {
  isDragging.value = false
  wrongFile.value = false
  console.log(true)
}

function onDrop(e) {
  let file = e.dataTransfer.files[0]
  wrongFile.value = false
  if (file.type.startsWith("image/")) {
    let reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = f => {
      img_src.value = f.target.result
      isDragging.value = false
      emit('imageUploaded', img_src.value)
    }
  } else {
    wrongFile.value = true
    img_src.value = null
    isDragging.value = false
    file = null
  }

}
</script>

<style scoped>
.drop {
  width: 80%;
  height: 25%;
  margin: auto;

  border: 1px solid #eee;
  border-radius: 7px;
  display: flex;
  align-items: center;
  justify-content: center;

  transition: background-color .2s ease-in-out;
  font-family: sans-serif;
}

.isDraggingClass {
  background-color: #999;
  border-color: #fff;
}

img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}
</style>