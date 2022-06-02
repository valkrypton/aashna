<template>
  <div class="profile--cards">
    <div class="profile--card"
         data-mdb-perfect-scrollbar='true'>
      <div class="pic-info" style="position: absolute;">
        <img width="300" height="400" :src="user.img_url" alt="user_img">
        <h3 style="position: fixed; top: 260px">{{ user.fname }}, {{ getAge(user.dob) }}</h3>
        <h3 style="position: fixed; top: 300px; font-size: 1.5rem">{{ user.school }}</h3>
        <h3 style="position: fixed; top: 330px; font-size: 1.5rem">{{ user.batch }}</h3>
        <div class="card-section">
          <span class="title">Bio</span>
          <p style="font-weight: bold">{{ user.bio }}</p>
        </div>
        <div class="card-section">
          <span class="title">Interests</span>
          <div class="interests">
            <div v-for="interest in user.interests" :key="interest">
              <p class="btn btn-light interests-item">{{ interest.interest }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <button id="close" @click="closeModal"><i class="fa fa-remove"></i></button>
  </div>
</template>

<script setup>
import {getAge} from "@/composables/date";

const props = defineProps({
  user: Object
})
const emits = defineEmits(['modal-closed'])
function closeModal(){
  emits('modal-closed')
}
</script>

<style scoped>

.profile--cards {
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: 100vw;
  flex-grow: 1;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  z-index: 1;
  background-color: rgba(0, 0, 0, 0.4);
}

.profile--card {
  background-color: var(--complementary-color);
  display: inline-block;
  width: 30vw;
  max-width: 600px;
  height: 70vh;
  border-radius: 8px;
  overflow-y: scroll;
  position: absolute;
  will-change: transform;
  top: 50%;
  left: 60%;
  bottom: 0;
  right: 0;
  transform: translate(-50%, -50%);
}

.profile--card img {
  width: 100%;
  pointer-events: none;
}

.profile--card h3 {
  margin-top: 32px;
  font-size: 32px;
  padding: 0 16px;
  pointer-events: none;
}

.card-section {
  margin-top: 2%;
  font-size: 20px;
  padding: 0 16px;
  pointer-events: none;
  text-align: left;
}

.card-section .title {
  color: gray;
  font-size: 1.2rem
}

.fa-remove {
  color: #CDD6DD;
  font-size: 1.4rem;
  vertical-align: middle;
}

.interests {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
}

.interests-item {
  margin: 5px 5px 5px 0;
  border: 1px solid;
  font-weight: 600;
}

.pic-info h3 {
  color: white;
  font-weight: bold;
}

#close {
  position: absolute;
  top: 11%;
  left: 95%;
  border-radius: 50%;
  line-height: 40px;
  width: 40px;
  border: 0;
  background: #FFFFFF;
  display: inline-block;
}

#close:focus {
  outline: 0;
}
</style>