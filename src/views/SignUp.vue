<template>
  <NavBar/>
  <div class="signup">
    <div id="welcome-msg">
      <h3>Welcome! Enter your NUST email to get started</h3>
    </div>
    <div class="form">
      <form @submit.prevent="getCode()">
        <div class="mb-3">
          <label for="exampleInputEmail1" class="form-label">Email address</label>
          <input type="email" id="exampleInputEmail1" v-model="email" required>
          <div v-if="!validNust && email.length !== 0" class="alert alert-danger" role="alert">
            Entered email is not a valid NUST student email
          </div>
        </div>
        <div class="mb-3" v-if="codeSent">
          <label for="inputCode" class="form-label">One time code</label>
          <input id="inputCode" v-model="code" required>
        </div>
        <div id="button-div">
          <button v-if="!codeSent" type="submit"
                  :class="{btn : true, 'btn-primary': true, invalid: !validNust,disabled:!validNust}">
            Get code
          </button>
          <div v-else>
            <button class="btn btn-primary code-btn" @click="verifyCode()">Verify Code</button>
            <button class="btn btn-primary code-btn" @click="resendCode()">Resend Code</button>
          </div>

        </div>
        <br>
        <div v-if="codeEntered && invalidCode" class="alert alert-danger" role="alert">
          Entered code is wrong
        </div>
        <div v-if="userExists" class="alert alert-danger" role="alert">
          This email is already in use.
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
    const router = useRouter()
    let email = ref('')
    let code = ref('');
    let validNust = ref(false);
    let codeSent = ref(false);
    let invalidCode = ref(true);
    let codeEntered = ref(false);
    let userExists = ref(false)

    function checkValidity() {
      validNust.value = email.value.slice(email.value.length - 20, email.value.length)
          === "@student.nust.edu.pk" && email.value.length > 20;
    }

    watch(email, (newEmail) => checkValidity());

    function getCode() {
      if (validNust && !codeSent.value) {
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
            router.push({name:'signup-continue'})
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
      userExists
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
  font-size: 1.5rem;
}

input {
  display: block;
  width: 20%;
  padding: 0.5% 0;
  margin: auto;
  box-sizing: border-box;
  border: none;
  border-radius: 4px;
  border-bottom: 1px solid #ddd;
}

#button-div {
  text-align: center;
}

.form {
  text-align: center;
  margin: 5% auto;
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

.invalid {
  background-color: gray;
}

.code-btn {
  margin: 3px;
}

.alert-danger {
  max-width: 20%;
  margin: auto;
}
</style>