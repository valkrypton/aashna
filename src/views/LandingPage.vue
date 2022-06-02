<template>
  <NavBar/>
  <section class="home">
    <div>
      <img
          src="https://dynaimage.cdn.cnn.com/cnn/q_auto,w_412,c_fill,g_auto,h_412,ar_1:1/http%3A%2F%2Fcdn.cnn.com%2Fcnnnext%2Fdam%2Fassets%2F170914171335-blade-runner-fashion-story-top-re-up.jpg"
          alt="img" class="rounded-3">
    </div>
    <div>
      <span>Our project is Aashna, a friend finding app exclusively for Nustians. Our aim was to make a pleasant to use webapp that would allow Nustians to make new friends with people who shared similar interests to them</span>
    </div>
  </section>
  <About/>
</template>

<script setup>
// @ is an alias to /src
import NavBar from "@/components/NavBar";
import About from "@/components/About";
import {onBeforeMount} from "vue";
import axios from "axios";
import router from "@/router";

const baseURL = "http://localhost:3000"
onBeforeMount(() => {
  if (localStorage.getItem('jwt') != null) {
    axios.get(baseURL + "/sessionCheck", {
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('jwt')
      }
    }).then(response => {
      if (response.data.sessionExists)
        router.push("/home")
    }).catch(err => {
      console.log(err.message)
    })
  }
})

</script>

<style scoped>
.home {
  display: flex;
  flex-direction: row;
  place-items: center;
  padding: 3% 20%;
}

.home > div {
  padding: 0 5%;
}

span {
  font-size: 1.5rem;
}
</style>
