<template>
  <nav class="navbar navbar-expand-lg bg-light sticky-top">
    <div class="container-fluid">
      <router-link class="navbar-brand" to="/profile">
        <img :src="img_url" height="50" width="50" alt="logo" class="profile-img">
      </router-link>
      <div class="collapse navbar-collapse nav-div">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <li class="nav-item">
            <p class="nav-link">{{user_name}}</p>
          </li>
          <li>
            <p class="nav-link brand-name">Aashna</p>
          </li>
        </ul>
        <div>
          <ul class="navbar-nav me-auto mb-2 mb-lg-0">
            <li class="nav-item">
              <p class="nav-link" @click="logout">Logout</p>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import {ref} from "vue";

const props = defineProps({
  img_url:String,
  user_name:String,
  logout:Function
})

</script>

<style scoped>
.brand-name{
  position: absolute;
  left: 50%;
  transform: translate(-50%);
  color: var(--main-color);
}
div a {
  font-size: 1.5rem;
  color: var(--secondary-color);
  text-decoration: none;
  font-weight: bold;
}

div p {
  font-size: 1.5rem;
  color: var(--secondary-color);
  text-decoration: none;
  font-weight: bold;
  margin: 0;
  cursor: pointer;
}

div a:hover {
  color: var(--main-color);
}

div p:hover {
  color: var(--main-color);
}

div a.router-link-active {
  text-decoration: none;
  color: var(--main-color);
}
.profile-img{
  border-radius: 100%;
}
</style>