<template>
  <NavBar/>
  <section class="home">
    <div>
      <img
          src="https://dynaimage.cdn.cnn.com/cnn/q_auto,w_412,c_fill,g_auto,h_412,ar_1:1/http%3A%2F%2Fcdn.cnn.com%2Fcnnnext%2Fdam%2Fassets%2F170914171335-blade-runner-fashion-story-top-re-up.jpg"
          alt="img" class="rounded-3">
    </div>
    <div>
      <span>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusantium adipisci aut consequuntur dolor dolore dolores dolorum ducimus, enim error fugit harum impedit laboriosam minima quaerat soluta sunt tenetur veniam voluptatibus.</span>
    </div>
  </section>
  <About/>
</template>

<script setup>
// @ is an alias to /src
import NavBar from "@/components/NavBar";
import About from "@/components/About";
import {onMounted} from "vue";
import axios from "axios";
import router from "@/router";

const baseURL = "http://localhost:3000"
onMounted(() => {
  axios.get(baseURL + '/sessionCheck').then(response => {
    console.log(response.data)
    if (response.data) {
      router.push("/home")
    }
  })
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
