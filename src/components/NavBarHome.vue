<template>
  <nav class="navbar navbar-expand bg-light ">
    <div class="container-fluid">
      <router-link :to="{name:'profile-page'}">
        <img type="icon" :src="user.img_url" height="50" width="50" alt="logo" class="profile-img">
      </router-link>
      <div class="navbar-collapse nav-div">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <router-link :to="{name:'profile-page'}">
            <li class="nav-item">
              <p class="nav-link">{{ user.fname }}</p>
            </li>
          </router-link>
          <li>
            <p class="nav-link brand-name" @click="hideMsgs">Aashna</p>
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
const props = defineProps({
  user: Object,
  logout: Function,
  hideMsgs: Function
})

const baseURL = 'http://localhost:3000'
</script>

<style scoped>
.brand-name {
  font-size: 2rem;
  position: absolute;
  left: 50%;
  bottom: 5%;
  transform: translate(-50%);
  color: var(--main-color);
}

.brand-name:hover {
  color: var(--secondary-color);
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

.profile-img {
  border-radius: 100%;
}

.navbar-expand {
  height: 4.25rem;
  padding-left: 0;
  padding-right: 0;
}
</style>