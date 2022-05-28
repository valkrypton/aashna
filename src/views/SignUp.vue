<template>
  <NavBar/>
  <div id="welcome-msg">
    <h3>Welcome! Enter your details to get started</h3>
  </div>
  <div class="page-content">
    <div class="form-v10-content">
      <form ref="form" class="form-detail" id="myform" enctype="multipart/form-data" @submit.prevent="submitForm">
        <div class="form-left">
          <h2>General Information</h2>
          <div class="form-row">
            <input type="email" name="email" id="email" placeholder="xyz@student.nust.edu.pk" v-model="email"
                   required>
            <div v-if="!validNust && email.length !== 0" class="alert alert-danger" role="alert">
              Entered email is not a valid NUST student email
            </div>
            <div v-if="userExists" class="alert alert-danger" role="alert">
              This email is already in use.
            </div>
          </div>
          <div class="form-row">
            <input type="password" name="password" v-model="pass" id="password" placeholder="Password" required>
            <div v-if="!validPw && pass.length !== 0" class="alert alert-danger" role="alert">
              Password must contain at least 8 characters, at least one letter and at least one number
            </div>
          </div>
          <div class="form-group">
            <div class="form-row form-row-1">
              <input type="text" name="first_name" id="first_name" class="input-text"
                     placeholder="First Name" required>
            </div>
            <div class="form-row form-row-2">
              <input type="text" name="last_name" id="last_name" class="input-text"
                     placeholder="Last Name" required>
            </div>
          </div>
          <div class="form-row">
            <select name="gender" class="custom-select" required>
              <option class="option" value="" disabled selected>Gender</option>
              <option class="option" value="0">Male</option>
              <option class="option" value="1">Female</option>
              <option class="option" value="2">Non-binary</option>
            </select>
          </div>
          <div class="form-row">
            <input id="dob" placeholder="Date of Birth" type="text" @focusin="date" @focusout="text" name="DOB"
                   required>
          </div>
          <div v-if="img_src" class="form-row img-div">
            <img :src="img_src" alt="profile_img" class="profile-img">
          </div>
          <div class="form-row">
            <input id="avi" type="file" accept="image/*" name="profile_img" @change="showImg" required/>
          </div>
        </div>
        <div class="form-right">
          <h2>Details</h2>
          <div class="form-row">
            <select name="school" required>
              <option value="" disabled selected>School</option>
              <option value="SCEE">SCEE</option>
              <option value="SCME">SCME</option>
              <option value="SEECS">SEECS</option>
              <option value="SMME">SMME</option>
              <option value="NICE">NICE</option>
              <option value="NBS">NBS</option>
              <option value="SADA">SADA</option>
              <option value="S3H">S3H</option>
              <option value="ASAB">ASAB</option>
              <option value="SNS">SNS</option>
            </select>
          </div>
          <div class="form-row">
            <select name="batch" required>
              <option value="" disabled selected>Batch</option>
              <option v-for="year in years" :value="year">{{ year }}</option>
            </select>
          </div>
          <div class="form-row">
            <select name="genderpreference" required>
              <option class="option" value="" disabled selected>Gender Preference</option>
              <option class="option" value="0">Male</option>
              <option class="option" value="1">Female</option>
              <option class="option" value="-1">None</option>
            </select>
          </div>
          <div class="form-row">
            <textarea class="" placeholder="A short bio.." name="bio" required></textarea>
          </div>
          <div class="form-row">
            <input class="register" type="button" data-bs-toggle="modal" data-bs-target="#staticBackdrop"
                   value="Add your interests">
          </div>
          <Transition name="otp-btn">
            <div class="form-row" v-if="!codeSent">
              <input class="register" type="button" @click="getCode" value="Get OTP">
            </div>
          </Transition>
          <div v-if="codeSent" class="form-row">
            <h5 style="color: black">One Time Code</h5>
            <input id="inputCode" v-model="code" required autocomplete="off">
            <input class="register" @click="verifyCode()" type="button" value="Verify OTP"
                   style="margin-right: 5px">
            <input class="register" @click="resendCode()" type="button" value="Resend OTP"
                   style="margin-left: 5px">
            <div v-if="codeEntered && invalidCode" class="alert alert-danger" role="alert">
              Entered code is wrong
            </div>
          </div>
          <div class="form-row" v-if="!invalidCode">
            <input type="submit" class="register" value="Register">
          </div>
          <Interests @interest-closed="getInterests"/>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>

import NavBar from "@/components/NavBar";
import {ref} from "vue";
import {watch} from 'vue';
import axios from "axios";
import {useRouter} from "vue-router";
import {checkEmailValidity, checkPwValidity} from "@/composables/validEmailPassword";

import Interests from '../components/Interests'

const baseURL = "http://localhost:3000"
const router = useRouter();
let code = ref('');
let validNust = ref(false);
let validPw = ref(false);
let codeSent = ref(false);
let invalidCode = ref(true);
let codeEntered = ref(false);
let userExists = ref(false)
let interests = []
const form = ref(null)
const years = ref([]);
const email = ref('')
const pass = ref('')
const img_src = ref(null)
let startYear = new Date().getFullYear() - 7;


watch(email, () => {
      validNust.value = checkEmailValidity(email.value)
      userExists.value = false
    }
)
watch(pass, () => {
  validPw.value = checkPwValidity(pass.value)
  userExists.value = false
})

function getCode() {
  //form input validation
  if ([...form.value.querySelectorAll('input,select,textarea')].every(input => input.reportValidity())) {
    if (validNust.value && validPw.value && !codeSent.value) {
      axios.get(baseURL + '/getverificationcode?id=' + String(email.value))
          .then(response => {
            if (response.data.userExists) {
              userExists.value = true
            } else {
              codeSent.value = true
            }
          })
          .catch(err => {
            console.log(err.message)
          })
    }
  }
}

function submitForm() {
  const fd = new FormData(form.value)
  fd.append('interest', interests)
  axios.post(baseURL + '/registerUser', fd, {
    headers: {
      'content-type': 'multipart/form-data'
    }
  }).then(response => {
    if (response.data.token) {
      localStorage.setItem("jwt", response.data.token);
      router.push('/home');
    }
  }).catch(err => {
    console.log(err)
  })

}

function verifyCode() {
  if (codeSent.value) {
    codeEntered.value = true;
    axios.get(baseURL + "/verifycode?id=" + email.value + "&code=" + code.value).then(function (response) {
      invalidCode.value = !response.data.validOTP;
    })
  }
}

function getInterests(data) {
  interests = []
  interests = data
}

function date(e) {
  e.target.type = 'date'
  e.target.placeholder = ''
}

function text(e) {
  e.target.type = 'text'
  e.target.placeholder = 'Date of Birth'
}

function resendCode() {
  codeSent.value = false;
  invalidCode.value = false;
  codeEntered.value = false;
  code.value = '';
  getCode();
}


for (let i = 0; i < 8; i++) {
  years.value.push(startYear + i);
}

function showImg(e) {
  const file = e.target.files[0]
  let reader = new FileReader()
  reader.readAsDataURL(file)
  reader.onload = f => {
    img_src.value = f.target.result
  }
}
</script>

<style scoped>

body {
  margin: 0;
}

#welcome-msg {
  text-align: center;
  margin: 1% 0 0 0;
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
  width: 1100px;
  border-radius: 10px;
  -moz-border-radius: 10px;
  -webkit-border-radius: 10px;
  box-shadow: 0 8px 20px 0 rgba(0, 0, 0, 0.15);
  -o-box-shadow: 0 8px 20px 0 rgba(0, 0, 0, 0.15);
  -moz-box-shadow: 0 8px 20px 0 rgba(0, 0, 0, 0.15);
  -webkit-box-shadow: 0 8px 20px 0 rgba(0, 0, 0, 0.15);
  margin: 95px 0;
  position: relative;
}

.form-v10-content .form-detail {
  position: relative;
  width: 100%;
  display: flex;
  display: -webkit-flex;
}

.form-v10-content .form-detail h2 {
  font-weight: bold;
  font-size: 25px;
  margin-bottom: 34px;
  padding: 33px 50px 0 60px;
}

.form-v10-content .form-detail .form-left {
  border-top-left-radius: 10px;
  border-bottom-left-radius: 10px;
  width: 100%;
}

.form-v10-content .form-detail .form-left h2 {
  color: var(--secondary-color);
}

.form-v10-content .form-detail .form-right {
  width: 100%;
  background: var(--main-color);
  border-top-right-radius: 10px;
  border-bottom-right-radius: 10px;
  overflow: hidden;
}

.form-v10-content .form-detail .form-right h2 {
  color: #fff;
}

.form-v10-content .form-detail .form-group {
  display: flex;
  display: -webkit-flex;
}

.form-v10-content .form-detail .form-row {
  position: relative;
  margin-bottom: 24px;
  padding-left: 60px;
  padding-right: 50px;
}

.form-v10-content .form-detail .form-left .form-group .form-row.form-row-1 {
  width: 50%;
  padding: 0 12px 0 60px;
}

.form-v10-content .form-detail .form-left .form-group .form-row.form-row-2 {
  width: 50%;
  padding: 0 50px 0 12px;
}

.form-v10-content .form-detail .form-right .form-group .form-row.form-row-1 {
  width: 50%;
  padding: 0 12px 0 60px;
}

.form-v10-content .form-detail .form-right .form-group .form-row.form-row-2 {
  width: 100%;
  padding: 0 50px 0 12px;
}

.form-v10-content .form-detail select,
.form-v10-content .form-detail input {
  width: 100%;
  padding: 11px 15px 15px 15px;
  border: 1px solid transparent;
  background: transparent;
  appearance: unset;
  -moz-appearance: unset;
  -webkit-appearance: unset;
  outline: none;
  font-size: 16px;
  box-sizing: border-box;
  -moz-box-sizing: border-box;
  -webkit-box-sizing: border-box;
  color: black;
  font-weight: bold;
}

.form-v10-content .form-detail select {
  background: 0 0;
  position: relative;
  z-index: 9;
  cursor: pointer;
}

.form-v10-content .form-detail .form-left select {
  color: black;
}

.form-v10-content .form-detail .form-right select {
  color: #f2f2f2;
}

.form-v10-content .form-detail .form-left input {
  color: #000;
}

.form-v10-content .form-detail .form-right input {
  color: #fff;
}

.form-v10-content .form-detail .form-left input,
.form-v10-content .form-detail .form-left select {
  border-left: 2px solid lightgray;
  border-bottom: 2px solid lightgray;
  border-radius: 7px;
}

.form-v10-content .form-detail .form-left input:focus,
.form-v10-content .form-detail .form-left select:focus {
  border-color: var(--secondary-color);
}

.form-v10-content .form-detail .form-right input,
.form-v10-content .form-detail .form-right select {
  border-left: 2px solid gray;
  border-bottom: 2px solid gray;
  border-radius: 7px;

}

.form-v10-content .form-detail .form-right input:focus,
.form-v10-content .form-detail .form-right select:focus {
  border-color: var(--secondary-color);
}

.form-v10-content .form-detail .form-right select option {
  color: black;
  background: white;
}


.form-v10-content .form-detail .form-checkbox input {
  position: absolute;
  opacity: 0;
}

.form-v10-content .form-detail .form-checkbox p {
  margin-left: 34px;
  color: #e5e5e5;
  font-size: 14px;
  font-weight: 400;
}

.form-v10-content .form-detail .form-left .register:hover {
  background-color: var(--secondary-color);
  color: white;
}

.form-v10-content .form-detail .form-right .register {
  background: white;
  border-radius: 25px;
  box-shadow: 0 6px 17px 0 rgba(0, 0, 0, 0.15);
  -o-box-shadow: 0 6px 17px 0 rgba(0, 0, 0, 0.15);
  -moz-box-shadow: 0 6px 17px 0 rgba(0, 0, 0, 0.15);
  -webkit-box-shadow: 0 6px 17px 0 rgba(0, 0, 0, 0.15);
  width: max-content;
  border: none;
  margin: 6px auto;
  cursor: pointer;
  color: black;
  font-weight: 700;
  font-size: 15px;
}

.form-v10-content .form-detail .form-right .register:hover {
  background-color: var(--secondary-color);
  color: white;
}

.form-v10-content .form-detail .form-right .form-row-last input {
  padding: 1.5rem;
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

.form-v10-content .form-detail .form-right input::-webkit-input-placeholder { /* Chrome/Opera/Safari */
  color: #f2f2f2;
  font-size: 16px;
}

.form-v10-content .form-detail .form-right input::-moz-placeholder { /* Firefox 19+ */
  color: #f2f2f2;
  font-size: 16px;
}

.form-v10-content .form-detail .form-right input:-ms-input-placeholder { /* IE 10+ */
  color: #f2f2f2;
  font-size: 16px;
}

.form-v10-content .form-detail .form-right input:-moz-placeholder { /* Firefox 18- */
  color: #f2f2f2;
  font-size: 16px;
}

.profile-img {
  width: 50%;
  height: fit-content;
}



/* Responsive */
@media screen and (max-width: 1199px) {
  .form-v10-content {
    margin: 95px 20px;
  }
}

@media screen and (max-width: 991px) and (min-width: 768px) {
  .form-v10-content .form-detail .form-group {
    flex-direction: column;
    -ms-flex-direction: column;
    -webkit-flex-direction: column;
  }

  .form-v10-content .form-detail .form-left .form-group .form-row.form-row-1,
  .form-v10-content .form-detail .form-left .form-group .form-row.form-row-2,
  .form-v10-content .form-detail .form-right .form-group .form-row.form-row-1,
  .form-v10-content .form-detail .form-right .form-group .form-row.form-row-2 {
    width: auto;
    padding: 0 50px 0 60px;
  }

}

@media screen and (max-width: 767px) {
  .form-v10-content .form-detail {
    flex-direction: column;
    -ms-flex-direction: column;
    -webkit-flex-direction: column;
  }

  .form-v10-content .form-detail .form-right {
    border-top-right-radius: 0;
    border-bottom-left-radius: 10px;
  }

  .form-v10-content .form-detail .form-left {
    padding-bottom: 50px;
  }
}

@media screen and (max-width: 575px) {
  .form-v10-content .form-detail .form-group {
    flex-direction: column;
    -ms-flex-direction: column;
    -webkit-flex-direction: column;
  }

  .form-v10-content .form-detail .form-row,
  .form-v10-content .form-detail .form-left .form-group .form-row.form-row-1,
  .form-v10-content .form-detail .form-left .form-group .form-row.form-row-2,
  .form-v10-content .form-detail .form-right .form-group .form-row.form-row-1,
  .form-v10-content .form-detail .form-right .form-group .form-row.form-row-2 {
    width: auto;
    padding: 0 30px;
  }

  .form-v10-content .form-detail h2 {
    padding: 33px 30px 0 30px;
  }

}

textarea {
  border-left: 2px solid gray;
  border-bottom: 2px solid gray;
  border-radius: 7px;
  width: 100%;
  padding: 11px 15px 0 15px;
  background: transparent;
  appearance: unset;
  -moz-appearance: unset;
  -webkit-appearance: unset;
  outline: none;
  font-size: 16px;
  box-sizing: border-box;
  -moz-box-sizing: border-box;
  -webkit-box-sizing: border-box;
  color: white;

}

textarea::-webkit-input-placeholder {
  color: #B4B4B4FF;
}

textarea:-moz-placeholder { /* Firefox 18- */
  color: #B4B4B4FF;
}

textarea::-moz-placeholder { /* Firefox 19+ */
  color: #B4B4B4FF;
}

textarea:-ms-input-placeholder {
  color: #B4B4B4FF;
}

textarea::placeholder {
  color: #B4B4B4FF;
}

textarea:focus {
  border-color: var(--secondary-color);
}

h5 {
  color: #f2f2f2;
  font-weight: 400;
}

.alert {
  display: flex;
  width: 100%;
  margin: 3% 0 5%;
}

#dob {
  cursor: pointer;
}
</style>