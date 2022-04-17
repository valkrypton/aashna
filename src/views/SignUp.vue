<template>
  <NavBar/>
  <div id="welcome-msg">
    <h3>Welcome! Enter your details to get started</h3>
  </div>
  <div class="page-content">
    <div class="form-v10-content">
      <form class="form-detail" id="myform" @submit.prevent = "getCode" method="post" action="/registerUser">
        <div class="form-left">
          <h2>General Infomation</h2>
          <div class="form-row">
            <input type="email" name="email" id="email" placeholder="xyz@student.nust.edu.pk" v-model="email" required>
            <div v-if="!validNust && email.length !== 0" class="alert alert-danger" role="alert" >
              Entered email is not a valid NUST student email
            </div>
            <div v-if="userExists" class="alert alert-danger" role="alert">
              This email is already in use.
            </div>
          </div>
          <div class="form-row">
            <input type="password" name="password" v-model="password" id="password" placeholder="Password" required>
            <div v-if="!validPw && password.length !== 0" class="alert alert-danger" role="alert" >
              Password must contain at least 8 characters, at least one letter and at least one number
            </div>
          </div>
          <div class="form-group">
            <div class="form-row form-row-1">
              <input type="text" name="first_name" id="first_name" class="input-text" placeholder="First Name" required>
            </div>
            <div class="form-row form-row-2">
              <input type="text" name="last_name" id="last_name" class="input-text" placeholder="Last Name" required>
            </div>
          </div>
          <div class="form-row">
            <select name="gender" class="custom-select" required>
              <option class="option" value="" disabled selected>Gender</option>
              <option class="option" value="Male">Male</option>
              <option class="option" value="Female">Female</option>
              <option class="option" value="Non-binary">Non-binary</option>
            </select>
            <span class="select-btn">
						  	<i class="zmdi zmdi-chevron-down"></i>
						</span>
          </div>
          <div class="form-row">
            <select name="School" required>
              <option value="School" disabled selected>School</option>
              <option value="scee">SCEE</option>
              <option value="scme">SCME</option>
              <option value="seecs">SEECS</option>
              <option value="smme">SMME</option>
              <option value="nice">NICE</option>
              <option value="nbs">NBS</option>
              <option value="sada">SADA</option>
              <option value="s3h">S3H</option>
              <option value="asab">ASAB</option>
              <option value="sns">SNS</option>
            </select>
            <span class="select-btn">
						  	<i class="zmdi zmdi-chevron-down"></i>
						</span>
          </div>
          <div class="form-row">
            <select name="Batch" required>
              <option value="Batch" disabled selected>Batch</option>
              <option v-for="year in years">{{year}}</option>
            </select>
            <span class="select-btn">
						  	<i class="zmdi zmdi-chevron-down"></i>
						</span>
          </div>
        </div>
        <div class="form-right">
          <h2>Details</h2>
          <div class="form-row">
            <select name="genderpreference" required>
              <option class="option" value="preference" disabled selected>Gender Preference</option>
              <option class="option" value="Male">Male</option>
              <option class="option" value="Female">Female</option>
              <option class="option" value="None">None</option>
            </select>
            <span class="select-btn">
						  	<i class="zmdi zmdi-chevron-down"></i>
						</span>
          </div>
          <div class="form-row" >
            <textarea class="" placeholder="A short bio.." required></textarea>
          </div>
          <div class="form-row">
            <h5>Select up to 8 interests</h5>
            <div class="interests">
              <div v-for="interest in interests" >
                <input type="checkbox" class="btn-check" :id="interest.name" autocomplete="off" v-model="interest.checked" @click="check">
                <label class="btn btn-light interests-item" :for="interest.name">{{interest.name}}</label>
              </div>
            </div>
          </div>
          <div class="form-row" v-if="codeSent">
            <h5>One Time Code</h5>
            <input id="inputCode" v-model="code" required>
            <div v-if="codeEntered && invalidCode" class="alert alert-danger" role="alert">
              Entered code is wrong
            </div>
          </div>
          <div v-if="!codeSent" class="form-row-last">
            <input type="submit" name="register" class="register"  value="Register">
          </div>
          <div v-else class="form-row">
            <input class="register" type="submit" @click="verifyCode()" value="Verify Code" style="margin-right: 5px">
            <input class="register" type="submit" @click="resendCode()" value="Resend Code" style="margin-left: 5px">
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import NavBar from "@/components/NavBar";
import {ref} from "vue";
import {watch} from 'vue';
import axios from "axios";
import {checkIfUserExists} from "@/apiCalls/calls";
import {useRouter} from "vue-router";

export default {

  name: "SignUp",
  components: {NavBar},
  setup() {
    const baseURL = "http://localhost:3000"
    const router = useRouter();
    let email = ref('');
    let password = ref('');
    let code = ref('');
    let validNust = ref(false);
    let validPw = ref(false);
    let codeSent = ref(false);
    let invalidCode = ref(true);
    let codeEntered = ref(false);
    let userExists = ref(false)

    function checkEmailValidity() {
      validNust.value = email.value.slice(email.value.length - 20, email.value.length)
          === "@student.nust.edu.pk" && email.value.length > 20;
    }

    function checkPwValidity() {
      const pwRegex = new RegExp("^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d]{8,}$");
      validPw.value = pwRegex.test(password.value);
    }

    watch(password, (newpw) => checkPwValidity());

    watch(email, (newEmail) => checkEmailValidity());

    function getCode() {
      if (validNust.value && validPw.value && !codeSent.value) {
        axios.get(baseURL + '/getverificationcode?id=' + String(email.value))
            .then(response => {
              if (response.data.userExists) {
                console.log('exists')
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

    function verifyCode() {
      if (codeSent.value) {
        invalidCode.value = false;
        codeEntered.value = true;
        axios.get("http://localhost:3000/verifycode?id=" + email.value + "&code=" + code.value).then(function (response) {
          console.log(response.data)
          if (response.data.validOTP) {
            console.log("ok")
            router.push({name: 'signup-continue', query: {email: email.value}});
          } else {
            console.log("ayo?")
            invalidCode.value = true;
          }
        })
      }
    }

    function resendCode() {
      codeSent.value = false;
      invalidCode.value = false;
      codeEntered.value = false;
      code.value = '';
      getCode();
    }

    const years = ref([]);
    let startYear = new Date().getFullYear() - 7;
    const interests = ref([{name: 'Cricket', checked: false},
      {name: 'Football', checked: false}, {name: 'Fitness', checked: false},
      {name: 'Environmentalism', checked: false}, {name: 'Leftism', checked: false},
      {name: 'Conservativism', checked: false}, {name: 'Feminism', checked: false},
      {name: 'Urdu Poetry', checked: false}, {name: 'Documentaries', checked: false},
      {name: 'Comedy Shows', checked: false}, {name: 'English Poetry', checked: false},
      {name: 'Hip-Hop', checked: false}, {name: 'Rock', checked: false},
      {name: 'Pop Music', checked: false}, {name: 'South Asian Classical Music', checked: false},
      {name: 'Western Classical Music', checked: false}, {name: 'Experimental Music', checked: false},
      {name: 'Non-Fiction Books', checked: false}, {name: 'Dramas', checked: false},
      {name: 'K-Pop', checked: false}, {name: 'K-Dramas', checked: false},
      {name: 'Pakistani Television', checked: false}, {name: 'Making Music', checked: false},
      {name: 'Theatre', checked: false}, {name: 'Filmmaking', checked: false},
      {name: 'Action Flicks', checked: false}, {name: 'Comedy Flicks', checked: false},
      {name: 'Sci-Fi', checked: false}, {name: 'TV shows', checked: false},
      {name: 'RnB Music', checked: false}, {name: 'Electronic Music', checked: false},
      {name: 'South Asian Films', checked: false}, {name: 'Traveling', checked: false},
      {name: 'Foodie', checked: false}, {name: 'Crypto', checked: false},
      {name: 'Memes', checked: false}, {name: 'Chess', checked: false},
      {name: 'Video Games', checked: false}, {name: 'Painting', checked: false},
      {name: 'Fantasy Books', checked: false}, {name: 'Writing Poetry', checked: false},
      {name: 'Writing Articles', checked: false}, {name: 'Art House Cinema', checked: false},
      {name: 'Comic Books', checked: false}, {name: 'Comic Book Movies', checked: false},
      {name: 'South Asian Music', checked: false}, {name: 'Horror Films', checked: false},
      {name: 'Horror Books', checked: false}, {name: 'Romantic Films', checked: false},
      {name: 'Romantic Books', checked: false},
      {name: 'Cooking', checked: false}, {name: 'History', checked: false},
      {name: 'True Crime Books', checked: false}, {name: 'True Crime TV', checked: false},
      {name: 'Metal', checked: false}, {name: 'Digital Art', checked: false},
      {name: 'Sketching', checked: false}, {name: 'DIY', checked: false},
      {name: 'Singing', checked: false}, {name: 'Fashion', checked: false},
      {name: 'Board Games', checked: false}, {name: 'Tech', checked: false}]);

    ((array) =>{
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
    })(interests.value)

    for (let i = 0; i < 8; i++) {
      years.value.push(startYear + i);
    }

    function check(e) {
      if (interests.value.filter(i => i.checked).length >= 8) {
        e.target.checked = false;
      }
    }

    return {
      email,
      validNust,
      getCode,
      codeSent,
      code,
      verifyCode,
      invalidCode,
      codeEntered,
      resendCode,
      userExists,
      validPw,
      password,
      years,
      interests,
      check
    }
  }


}
</script>

<style scoped>

body {
  margin:  0;
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
  margin:  0 auto;
  background: var(--bg-color);
  display: flex;
  display: -webkit-flex;
  justify-content: center;
  -webkit-justify-content: center;
  align-items: center;

}
.form-v10-content  {
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
  font-family: 'Montserrat', sans-serif;
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
  overflow: auto;
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
  font-family: 'Montserrat', sans-serif;
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
.form-v10-content .form-detail .select-btn {
  z-index: 0;
  position: absolute;
  top: 30%;
  right: 11.5%;
  font-size: 18px;
}
.form-v10-content .form-detail .form-left .select-btn {
  color: #666;
}
.form-v10-content .form-detail .form-right .select-btn {
  color: #f2f2f2;
}
.form-v10-content .form-detail .form-group .form-row.form-row-4 .select-btn {
  top: 20%;
  right: 26%;
}
.form-v10-content .form-detail .form-right .form-group .form-row.form-row-2 .select-btn {
  top: 20%;
  right: 19%;
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
  background: white;
}
.form-v10-content .form-detail .form-right select option {
  color: black;
}
.form-v10-content .form-detail .form-checkbox {
  margin-top: 37px;
  padding: 0 50px 0 60px;
  position: relative;
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
.form-v10-content .form-detail .form-right .form-row-last {
  padding-left: 60px;
  margin: 44px 0 10px;
}
.form-v10-content .form-detail .form-right .register {
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
.form-v10-content .form-detail .form-right .register:hover {
  background-color: var(--secondary-color);
  color: white;
}
.form-v10-content .form-detail .form-right .form-row-last input {
  padding: 12.5px;
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

/* Responsive */
@media screen and (max-width: 1199px) {
  .form-v10-content {
    margin:  95px 20px;
  }
}
@media screen and (max-width: 991px) and (min-width: 768px) {
  .form-v10-content .form-detail .form-group {
    flex-direction:  column;
    -ms-flex-direction:  column;
    -webkit-flex-direction:  column;
  }
  .form-v10-content .form-detail .form-left .form-group .form-row.form-row-1,
  .form-v10-content .form-detail .form-left .form-group .form-row.form-row-2,
  .form-v10-content .form-detail .form-right .form-group .form-row.form-row-1,
  .form-v10-content .form-detail .form-right .form-group .form-row.form-row-2 {
    width: auto;
    padding: 0 50px 0 60px;
  }
  .form-v10-content .form-detail .select-btn,
  .form-v10-content .form-detail .form-left .form-group .form-row.form-row-4 .select-btn,
  .form-v10-content .form-detail .form-right .form-group .form-row.form-row-2 .select-btn {
    right: 15%;
  }

}
@media screen and (max-width: 767px) {
  .form-v10-content .form-detail {
    flex-direction:  column;
    -ms-flex-direction:  column;
    -webkit-flex-direction:  column;
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
    flex-direction:  column;
    -ms-flex-direction:  column;
    -webkit-flex-direction:  column;
  }
  .form-v10-content .form-detail .form-row,
  .form-v10-content .form-detail .form-left .form-group .form-row.form-row-1,
  .form-v10-content .form-detail .form-left .form-group .form-row.form-row-2,
  .form-v10-content .form-detail .form-right .form-group .form-row.form-row-1,
  .form-v10-content .form-detail .form-right .form-group .form-row.form-row-2 {
    width: auto;
    padding: 0 30px;
  }
  .form-v10-content .form-detail .select-btn,
  .form-v10-content .form-detail .form-left .form-group .form-row.form-row-4 .select-btn,
  .form-v10-content .form-detail .form-right .form-group .form-row.form-row-2 .select-btn {
    right: 15%;
  }
  .form-v10-content .form-detail h2 {
    padding: 33px 30px 0 30px;
  }
  .form-v10-content .form-detail .form-right .form-row-last {
    padding-left: 0;
    text-align: center;
    margin: 44px 0 30px;
  }
}
textarea{
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
  font-family: 'Montserrat', sans-serif;
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

textarea::-moz-placeholder {  /* Firefox 19+ */
  color: #B4B4B4FF;
}

textarea:-ms-input-placeholder {
  color: #B4B4B4FF;
}

textarea::placeholder {
  color: #B4B4B4FF;
}

textarea:focus{
  border-color: var(--secondary-color);
}
.interests{
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
}

.interests-item{
  margin: 5px 5px 5px 0;
}
.btn-check:checked+.btn-light{
  background-color: var(--secondary-color);
  border-color: transparent;
}

.btn-light{
  background-color: var(--bg-color);
  color: black;
  border: transparent;
}

.btn-light:hover{
  background-color: #ffd1e8;
}

h5{
  color: white;
  font-weight: 400;
}

.alert{
  display: flex;
  width: 100%;
  margin: 3% 0 5%;
}
</style>