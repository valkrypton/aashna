<template>
  <div class="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1"
       aria-labelledby="staticBackdropLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content modal-dialog-centered modal-dialog-scrollable">
        <div class="modal-header">
          <h5 class="modal-title" id="staticBackdropLabel">Select upto 8 interests</h5>
          <button @click="close" type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <div class="container">
            <div class="row mb-3">
              <h3>Sports</h3>
              <div v-for="interest in sports" class="col-md-auto">
                <input name="interests" type="checkbox" :value="interest.name" class="btn-check" :id="interest.name"
                       autocomplete="off"
                       v-model="interest.checked" @click="check">
                <label class="btn btn-light interests-item" :for="interest.name">{{
                    interest.name
                  }}</label>
              </div>
            </div>
            <div class="row mb-3">
              <h3>Cinema</h3>
              <div v-for="interest in movies" class="col-md-auto">
                <input name="interests" type="checkbox" :value="interest.name" class="btn-check" :id="interest.name"
                       autocomplete="off"
                       v-model="interest.checked" @click="check">
                <label class="btn btn-light interests-item" :for="interest.name">{{
                    interest.name
                  }}</label>
              </div>
            </div>
            <div class="row mb-3">
              <h3>Television</h3>
              <div v-for="interest in television" class="col-md-auto">
                <input name="interests" type="checkbox" :value="interest.name" class="btn-check" :id="interest.name"
                       autocomplete="off"
                       v-model="interest.checked" @click="check">
                <label class="btn btn-light interests-item" :for="interest.name">{{
                    interest.name
                  }}</label>
              </div>
            </div>
            <div class="row mb-3">
              <h3>Music</h3>
              <div v-for="interest in music" class="col-md-auto">
                <input name="interests" type="checkbox" :value="interest.name" class="btn-check" :id="interest.name"
                       autocomplete="off"
                       v-model="interest.checked" @click="check">
                <label class="btn btn-light interests-item" :for="interest.name">{{
                    interest.name
                  }}</label>
              </div>
            </div>
            <div class="row mb-3">
              <h3>Reading</h3>
              <div v-for="interest in reading" class="col-md-auto">
                <input name="interests" type="checkbox" :value="interest.name" class="btn-check" :id="interest.name"
                       autocomplete="off"
                       v-model="interest.checked" @click="check">
                <label class="btn btn-light interests-item" :for="interest.name">{{
                    interest.name
                  }}</label>
              </div>
            </div>
            <div class="row mb-3">
              <h3>Writing</h3>
              <div v-for="interest in writing" class="col-md-auto">
                <input name="interests" type="checkbox" :value="interest.name" class="btn-check" :id="interest.name"
                       autocomplete="off"
                       v-model="interest.checked" @click="check">
                <label class="btn btn-light interests-item" :for="interest.name">{{
                    interest.name
                  }}</label>
              </div>
            </div>
            <div class="row mb-3">
              <h3>Going Out</h3>
              <div v-for="interest in going_out" class="col-md-auto">
                <input name="interests" type="checkbox" :value="interest.name" class="btn-check" :id="interest.name"
                       autocomplete="off"
                       v-model="interest.checked" @click="check">
                <label class="btn btn-light interests-item" :for="interest.name">{{
                    interest.name
                  }}</label>
              </div>
            </div>
            <div class="row mb-3">
              <h3>Staying in</h3>
              <div v-for="interest in staying_in" class="col-md-auto">
                <input name="interests" type="checkbox" :value="interest.name" class="btn-check" :id="interest.name"
                       autocomplete="off"
                       v-model="interest.checked" @click="check">
                <label class="btn btn-light interests-item" :for="interest.name">{{
                    interest.name
                  }}</label>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button @click="close" type="button" class="btn btn-primary" data-bs-dismiss="modal">Add interests</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>

import {
  going_out,
  movies,
  music,
  reading,
  sports,
  staying_in,
  television,
  writing
} from "@/composables/possibleInterests";

const userInterests = new Set()
const emits = defineEmits(['interest-closed'])


function check(e) {
  if (!userInterests.has(e.target.value)) {
    if (userInterests.size + 1 <= 8) {
      userInterests.add(e.target.value)
      e.target.checked = true
    } else {
      e.target.checked = false
    }
  } else {
    userInterests.delete(e.target.value)
    e.target.checked = false
  }
}

function close() {
  emits('interest-closed', Array.from(userInterests))
}
</script>

<style scoped>

.interests-item {
  margin: 5px 5px 5px 0;
}

.btn-check:checked + .btn-light {
  background-color: var(--secondary-color);
  border-color: transparent;
}

.btn-light {
  background-color: var(--bg-color);
  color: black;
  border: transparent;
}

.btn-light:hover {
  background-color: #ffd1e8;
}
</style>