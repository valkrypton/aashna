<template>
  <nav class="navbar navbar-expand bg-light sticky-top">
    <div class="container-fluid">
      <router-link to="/">
        <img src="../assets/logo.png" height="50" width="50" alt="logo">
      </router-link>
      <div class="navbar-collapse">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <li class="mx-2 nav-item">
            <router-link class="nav-link" to="/">Home</router-link>
          </li>
          <li class="mx-2 nav-item">
            <router-link class="nav-link" to="/about" href="#about">About</router-link>
          </li>
          <li class="mx-2 nav-item">
            <router-link class="nav-link" to="/contact">Contact</router-link>
          </li>
        </ul>
        <div>
          <ul class="navbar-nav me-auto mb-2 mb-lg-0">
            <li class="mx-2 nav-item">
              <router-link class="nav-link" :to="{name:'login'}">Log in</router-link>
            </li>
            <li class="mx-2 nav-item">
              <router-link class="nav-link" :to="{name:'signup'}">Sign up</router-link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>

export default {
  name: "NavBar",
  setup() {

  }
}
</script>

<style scoped>


div a {
  font-size: 1.5rem;
  color: var(--secondary-color);
  text-decoration: none;
  font-weight: bold;
}

div a:hover {
  color: var(--main-color);
}

div a.router-link-active {
  text-decoration: none;
  color: var(--main-color);
}

.navbar-expand {
  height: 4.25rem;
  padding-left: 0;
  padding-right: 0;
}
</style>