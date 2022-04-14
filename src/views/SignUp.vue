<template>
  <NavBar/>
  <div class="signup">
    <div id="welcome-msg">
      <h3>Welcome! Let's get you started</h3>
    </div>
    <div class="form">
      <form @submit.prevent>
        <div class="mb-3">
          <label for="exampleInputEmail1" class="form-label">Email address</label>
          <input type="email" id="exampleInputEmail1" v-model="email" required>
          <div id="emailHelp" class="form-text">We'll never share your email with anyone else.</div>
        </div>
        <div class="mb-3">
          <label for="exampleInputPassword1" class="form-label">One time code</label>
          <input type="number" id="exampleInputPassword1" v-model="code" required>
        </div>
        <div id="button-div">
          <button type="submit" class="btn btn-primary">Get code</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import NavBar from "@/components/NavBar";
import {ref} from "vue";

export default {
  name: "SignUp",
  components: {NavBar},
  setup(){
    let email = ref('')
    let code = ref('')

    return{
      email,
      code
    }
  }
}
</script>

<style scoped>

#welcome-msg {
  text-align: center;
  margin: 5% 0 0 0;
}

#welcome-msg h3 {
  color: #F900BF;
}

label {
  font-size: 2.5vh;
}

input {
  display: block;
  padding: 3%;
  width: 100%;
  box-sizing: border-box;
  border: none;
  border-radius: 4px;
  border-bottom: 1px solid #ddd;
}

#button-div {
  text-align: center;
}

.form {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.btn-primary {
  background-color: var(--secondary-color);
  border: none;
  color: var(--bg-color);
  width: fit-content;
}

.btn-primary:hover {
  background-color: var(--main-color);
}
</style>