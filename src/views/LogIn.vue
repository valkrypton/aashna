<template>
  <NavBar/>
  <div class="page-content">
    <div class="form-v10-content">
      <div id="welcome-msg">
        <h3>Log in to your account!</h3>
      </div>
      <form class="form-detail" id="my-form" @submit.prevent="login">
        <div class="form-left">
          <div class="form-row">
            <input type="email" name="email" id="email" placeholder="xyz@student.nust.edu.pk" v-model="user.email"
                   required>
            <div v-if="!validNust && user.email.length !== 0" class="alert alert-danger" role="alert">
              Entered email is not a valid NUST student email
            </div>
          </div>
          <div class="form-row">
            <input type="password" name="password" v-model="user.pass" id="password" placeholder="Password" required>
            <div v-if="!validPw && user.pass.length !== 0" class="alert alert-danger" role="alert">
              Password must contain at least 8 characters, at least one letter and at least one number
            </div>
            <div class="form-row">
              <input class="register" type="submit" value="Login">
            </div>
            <div v-if="!userExists" class="alert alert-danger" role="alert">
              There is no account associated with this email.
            </div>
            <div v-if="incorrectPass" class="alert alert-danger" role="alert">
              The entered password is wrong.
            </div>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import NavBar from "@/components/NavBar";
import {ref, watch} from "vue";
import {checkEmailValidity, checkPwValidity} from "@/composables/validEmailPassword";
import axios from "axios";

const baseURL = "http://localhost:3000"
const validNust = ref(false)
const validPw = ref(false)
const incorrectPass = ref(false)
const userExists = ref(true)
const user = ref({
  email: '',
  pass: ''
})
watch(user.value, () => {
  validNust.value = checkEmailValidity(user.value.email)
  validPw.value = checkPwValidity(user.value.pass)
  incorrectPass.value = false
  userExists.value = true

})

function login() {
  axios.post(baseURL + '/login', {
    userData: user.value
  }).then(response => {
    if (!response.data.userExists && !response.data.passwordVerified) {
      userExists.value = false
    } else if (response.data.userExists && !response.data.passwordVerified) {
      incorrectPass.value = true
    } else
      console.log(response.data.userData)
  })
}
</script>

<style scoped>

body {
  margin: 0;
}

#welcome-msg {
  text-align: center;
  margin: 5% 0 0 0;
}

#welcome-msg h3 {
  color: #F900BF;
}

.page-content {
  width: 100%;
  margin: 0 auto;
  background: var(--bg-color);
  display: flex;
  display: -webkit-flex;
  justify-content: center;
  -webkit-justify-content: center;
  align-items: center;

}

.form-v10-content {
  background: #fff;
  width: 500px;
  border-radius: 10px;
  -moz-border-radius: 10px;
  -webkit-border-radius: 10px;
  box-shadow: 0 8px 20px 0 rgba(0, 0, 0, 0.15);
  -o-box-shadow: 0 8px 20px 0 rgba(0, 0, 0, 0.15);
  -moz-box-shadow: 0 8px 20px 0 rgba(0, 0, 0, 0.15);
  -webkit-box-shadow: 0 8px 20px 0 rgba(0, 0, 0, 0.15);
  margin: 95px 0;
  position: relative;
  font-family: 'Montserrat', sans-serif;
}

.form-v10-content .form-detail {
  position: relative;
  width: 100%;
  display: flex;
  display: -webkit-flex;
}


.form-v10-content .form-detail .form-left {
  border-top-left-radius: 10px;
  border-bottom-left-radius: 10px;
  width: 100%;
}


.form-v10-content .form-detail .form-row {
  position: relative;
  padding-left: 60px;
  padding-right: 50px;
  text-align: center;
  margin: 5% 0;
}


.form-v10-content .form-detail input {
  width: 100%;
  padding: 11px 15px 15px 15px;
  border: 1px solid transparent;
  background: transparent;
  appearance: unset;
  -moz-appearance: unset;
  -webkit-appearance: unset;
  outline: none;
  font-family: 'Montserrat', sans-serif;
  font-size: 16px;
  box-sizing: border-box;
  -moz-box-sizing: border-box;
  -webkit-box-sizing: border-box;
  color: black;
  font-weight: bold;
}


.form-v10-content .form-detail .form-left input {
  color: #000;
}

.form-v10-content .form-detail .form-left input {
  border-left: 2px solid lightgray;
  border-bottom: 2px solid lightgray;
  border-radius: 7px;
}

.form-v10-content .form-detail .form-left input:focus {
  border-color: var(--secondary-color);
}

.form-v10-content .form-detail .form-right input {
  border-left: 2px solid gray;
  border-bottom: 2px solid gray;
  border-radius: 7px;

}

.form-v10-content .form-detail .form-right input:focus {
  border-color: var(--secondary-color);
}


.form-v10-content .form-detail .form-left .register {
  background: white;
  border-radius: 25px;
  -moz-border-radius: 25px;
  -webkit-border-radius: 25px;
  box-shadow: 0 6px 17px 0 rgba(0, 0, 0, 0.15);
  -o-box-shadow: 0 6px 17px 0 rgba(0, 0, 0, 0.15);
  -moz-box-shadow: 0 6px 17px 0 rgba(0, 0, 0, 0.15);
  -webkit-box-shadow: 0 6px 17px 0 rgba(0, 0, 0, 0.15);
  width: 180px;
  border: none;
  margin: 6px 0 50px 0;
  cursor: pointer;
  color: black;
  font-weight: 700;
  font-size: 15px;

}

.form-v10-content .form-detail .form-left .register:hover {
  background-color: var(--secondary-color);
  color: white;
}

.form-v10-content .form-detail .form-left input::-webkit-input-placeholder { /* Chrome/Opera/Safari */
  color: #666;
  font-size: 16px;
}

.form-v10-content .form-detail .form-left input::-moz-placeholder { /* Firefox 19+ */
  color: #666;
  font-size: 16px;
}

.form-v10-content .form-detail .form-left input:-ms-input-placeholder { /* IE 10+ */
  color: #666;
  font-size: 16px;
}

.form-v10-content .form-detail .form-left input:-moz-placeholder { /* Firefox 18- */
  color: #666;
  font-size: 16px;
}

/* Responsive */
@media screen and (max-width: 1199px) {
  .form-v10-content {
    margin: 95px 20px;
  }
}

@media screen and (max-width: 991px) and (min-width: 768px) {

}

@media screen and (max-width: 767px) {
  .form-v10-content .form-detail {
    flex-direction: column;
    -ms-flex-direction: column;
    -webkit-flex-direction: column;
  }

  .form-v10-content .form-detail .form-left {
    padding-bottom: 50px;
  }
}

@media screen and (max-width: 575px) {

  .form-v10-content .form-detail h2 {
    padding: 33px 30px 0 30px;
  }

}


h5 {
  color: #f2f2f2;
  font-weight: 400;
}

.alert {
  width: 100%;
  text-align: center;
  font-size: 1rem;
  margin: 0;
}
</style>