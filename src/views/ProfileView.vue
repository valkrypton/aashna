<template>
  <div class="container light-style flex-grow-1 ">
    <h2 class="pt-3">
      Account settings
    </h2>
    <div class="card overflow-hidden">
      <div class="row g-0 row-bordered">
        <div class="col-md-3 pt-0">
          <div class="list-group list-group-flush account-settings-links">
            <a class="list-group-item list-group-item-action active" data-bs-toggle="list"
               href="#account-general">General</a>
            <a class="list-group-item list-group-item-action" data-bs-toggle="list"
               href="#account-change-password">Change
              password</a>
            <a class="list-group-item list-group-item-action" data-bs-toggle="list"
               href="#account-info">Info</a>
            <a class="list-group-item list-group-item-action" data-bs-toggle="list"
               href="#delete-account">Delete Account</a>
          </div>
        </div>
        <div class="col-md-9">
          <div class="tab-content">
            <div class="tab-pane fade active show" id="account-general">
              <div class="card-body d-flex align-items-center">
                <img :src="img_src" alt="profile_img" class="d-block ui-w-80">
                <div class="mx-3">
                  <label class="btn btn-outline-primary">
                    Upload new photo
                    <input @change="showImg" ref="file" accept="image/*" type="file" class="account-settings-fileinput">
                  </label> &nbsp;
                  <button type="button" class="btn btn-default md-btn-flat">Reset</button>
                  <div class="text-light small mt-1">Allowed JPG, GIF or PNG.</div>
                </div>
              </div>
              <hr class="border-light m-0">
              <div class="card-body">
                <div class="form-floating mb-3">
                  <input type="email" class="form-control" id="floatingInput" placeholder="email"
                         v-model="user.email" disabled>
                  <label for="floatingInput">Email address</label>
                </div>
                <div class="form-floating mb-3">
                  <input type="text" class="form-control" id="floatingInput1" placeholder="fname" v-model="user.fname">
                  <label for="floatingInput1">First Name</label>
                </div>
                <div class="form-floating mb-3">
                  <input type="text" class="form-control" id="floatingInput2" placeholder="lname" v-model="user.lname">
                  <label for="floatingInput2">Last Name</label>
                </div>
                <div class="form-floating mb-3">
                  <select id="gender" v-model="user.gender" name="gender" class="form-select">
                    <option class="option" value="" disabled selected>Gender</option>
                    <option class="option" value="0">Male</option>
                    <option class="option" value="1">Female</option>
                    <option class="option" value="2">Non-binary</option>
                  </select>
                  <label for="gender">Gender</label>
                </div>
              </div>
            </div>
            <div class="tab-pane fade" id="account-change-password">
              <div class="card-body pb-2">
                <div class="form-floating mb-3">
                  <input type="password" class="form-control" id="oldPw" placeholder="oldpass" v-model="oldPass">
                  <label for="oldPw">Old Password</label>
                </div>
                <div v-if="wrongPassword && oldPass.length!==0" class="alert alert-danger mb-3" role="alert">
                  Incorrect password entered
                </div>
                <div class="form-floating mb-3">
                  <input type="password" class="form-control" id="newPw" placeholder="pass" v-model="newPass">
                  <label for="newPw">New Password</label>
                </div>
                <div v-if="!validPass && newPass.length!==0" class="alert alert-danger" role="alert">
                  Password must contain at least 8 characters, at least one letter and at least one number
                </div>
                <div class="form-floating mb-3">
                  <input type="password" class="form-control" id="confrmPw" placeholder="cnfrmpass" v-model="cnfrmPass">
                  <label for="confrmPw">Confirm Password</label>
                </div>
                <div v-if="differentPass" class="alert alert-danger" role="alert">
                  Password entered are not same
                </div>
                <div v-if="passwordChanged" class="alert alert-success" role="alert">
                  Password successfully changed!
                </div>
                <div class="btn-group">
                  <div @click="changePassword" class="btn btn-outline-primary">
                    Change Password
                  </div>
                </div>
              </div>
            </div>
            <div class="tab-pane fade" id="account-info">
              <div class="card-body pb-2">
                <div class="form-floating mb-3">
                  <input v-model="user.dob" type="date" class="form-control" id="bday" placeholder="bday">
                  <label for="bday">BirthDay</label>
                </div>
                <div class="form-floating mb-3">
                  <textarea v-model="user.bio" class="form-control" placeholder="bio" id="bioArea"
                            style="height: 100px"></textarea>
                  <label for="bioArea">Bio</label>
                </div>
                <div class="form-floating mb-3">
                  <select id="genderpreference" v-model="user.gender_preference" name="genderpreference"
                          class="form-select">
                    <option class="option" value="" disabled selected>Gender Preference</option>
                    <option class="option" value="0">Male</option>
                    <option class="option" value="1">Female</option>
                    <option class="option" value="-1">None</option>
                  </select>
                  <label for="genderpreference">Gender Preference</label>
                </div>
                <div class="form-floating mb-3">
                  <select id="school" v-model="user.school" name="school" class="form-select">
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
                  <label for="school">School</label>
                </div>
                <div class="form-floating mb-3">
                  <select id="batch" v-model="user.batch" name="batch" class="form-select">
                    <option v-for="year in years" :value="year">{{ year }}</option>
                  </select>
                  <label for="batch">Batch</label>
                </div>
                <div class="btn-group">
                  <div class="btn btn-outline-primary" data-bs-toggle="modal" data-bs-target="#staticBackdrop">
                    Change interests
                  </div>
                </div>
              </div>
            </div>
            <div class="tab-pane fade" id="delete-account">
              <div class="card-body align-items-center pb-0">
                <h5 style="color: var(--secondary-color)" class="h5">Enter your email and password to delete your
                  account</h5>
              </div>
              <div class="card-body pb-2">
                <div class="form-floating mb-3">
                  <input type="text" v-model="email" class="form-control" id="delete-mail"
                         placeholder="delete email">
                  <label for="delete-mail">Email</label>
                </div>
                <div v-if="wrongEmail" class="alert alert-danger">
                  Wrong email!
                </div>
                <div class="form-floating mb-3">
                  <input type="password" v-model="pass" class="form-control" id="delete-pass"
                         placeholder="Delete Account">
                  <label for="delete-pass">Password</label>
                </div>
                <div v-if="wrongPassword" class="alert alert-danger" role="alert">
                  Wrong password!
                </div>
                <div class="btn-group">
                  <div @click="deleteAccount" class="btn btn-outline-danger">
                    Delete your account
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="btn-group save-button mt-3">
      <button @click="saveChanges" type="button" class="btn btn-primary">Save changes</button>&nbsp;
      <button @click="cancel" type="button" class="btn btn-secondary">Cancel</button>
    </div>
  </div>
  <Interests @interest-closed="getInterests"/>
</template>

<script setup>
import {onBeforeMount, ref, watch} from "vue";
import {useRoute, useRouter} from "vue-router";
import axios from "axios";
import {checkPwValidity} from "@/composables/validEmailPassword";
import Interests from "@/components/Interests";

const router = useRouter()
const route = useRoute()
const years = ref([])
const startYear = new Date().getFullYear() - 7;
const user = ref({
  user_id: "",
  fname: "",
  lname: "",
  school: "",
  batch: "",
  bio: "",
  interests: [{interest: ""}],
  img_url: ""
})

const oldPass = ref('')
const newPass = ref('')
const cnfrmPass = ref('')
const validPass = ref(false)
const wrongPassword = ref(false)
const passwordChanged = ref(false)
const differentPass = ref(false)
const wrongEmail = ref(false)
const close = ref(null)
const img_src = ref('')
const email = ref('')
const pass = ref('')
let file = null
let tempUser = {}
let interests = []
for (let i = 0; i < 8; i++) {
  years.value.push(startYear + i);
}

watch(newPass, () => {
  validPass.value = checkPwValidity(newPass.value)
  differentPass.value = false
})
watch(oldPass, () => {
  wrongPassword.value = false
})
watch(cnfrmPass, () => {
  differentPass.value = false
})
watch(email, () => {
  wrongEmail.value = false
})
watch(pass, () => {
  wrongPassword.value = false
})

function showImg(e) {
  file = e.target.files[0]
  user.value.img_url = ''
  let reader = new FileReader()
  reader.readAsDataURL(file)
  reader.onload = f => {
    img_src.value = f.target.result
  }
}

function saveChanges() {
  if (JSON.stringify(user.value) !== JSON.stringify(tempUser)) {
    const fd = new FormData()
    fd.set('id', user.value.user_id)
    fd.set('email', user.value.email)
    fd.set('fname', user.value.fname)
    fd.set('lname', user.value.lname)
    fd.set('bio', user.value.bio)
    fd.set('dob', user.value.dob)
    fd.set('school', user.value.school)
    fd.set('batch', user.value.batch)
    fd.set('gender', user.value.gender)
    fd.set('gender_preference', user.value.gender_preference)
    fd.set('img_url', user.value.img_url)
    if (file !== null) {
      fd.set('profile_img', file)
    }
    axios.post('http://localhost:3000/changeUserData', fd, {
      headers: {
        'content-type': 'multipart/form-data'
      }
    }).then(response => {
      if (response.data.token) {
        localStorage.setItem('jwt', response.data.token)
        router.push({name: 'homepage'})
      }
    }).catch(err => {
      console.log(err)
    })

  } else {
    router.push({name: 'homepage'})
  }
}

function changePassword() {
  if (newPass.value === cnfrmPass.value && validPass.value) {
    axios.post('http://localhost:3000/changePassword', {
      user_id: user.value.user_id,
      oldPass: oldPass.value,
      newPass: newPass.value,
    }).then(response => {
      if (response.data.wrongPassword === false) {
        wrongPassword.value = true
      } else {
        passwordChanged.value = true
        oldPass.value = ''
        newPass.value = ''
        cnfrmPass.value = ''
        setTimeout(() => {
          passwordChanged.value = false
        }, 2000)
      }
    }).catch(err => {
      console.log(err)
    })
  } else {
    differentPass.value = true
  }
}

function cancel() {
  if ((JSON.stringify(user.value) === JSON.stringify(tempUser))) {
    router.push({name: 'homepage'})
  } else {
    alert("You have some unsaved changes")
  }

}

function discard() {
  router.push({name: 'homepage'})
}

function deleteAccount() {
  if (email.value === user.value.email) {
    axios.post('http://localhost:3000/deleteAccount', {
      pass: pass.value,
      id: user.value.user_id
    }).then(() => {
      localStorage.removeItem('jwt')
      localStorage.removeItem('loggedUser')
      router.push('/')
    }).catch(err => {
      wrongPassword.value = true
      console.log(err)
    })
  } else {
    wrongEmail.value = true
  }
}

function getInterests(data) {
  interests = []
  interests = data
  console.log(interests)
}

onBeforeMount(() => {
  user.value = JSON.parse(localStorage.getItem('loggedUser'))
  img_src.value = user.value.img_url
  tempUser = JSON.parse(JSON.stringify(user.value))
})
</script>

<style scoped>
body {
  background: var(--bg-color);
  margin-top: 20px;
}

h2 {
  color: var(--secondary-color);
}

.alert-danger {
  height: 50px;
}


.ui-w-80 {
  width: 80px !important;
  height: auto;
}

label.btn {
  margin-bottom: 0;
}

.btn {
  cursor: pointer;
}

.text-light {
  color: #babbbc !important;
}

.card {
  background-clip: padding-box;
  box-shadow: 0 1px 4px rgba(24, 28, 33, 0.012);
}

.save-button {
  margin-left: 84%;
}

.row-bordered {
  overflow: hidden;
}

.account-settings-fileinput {
  position: absolute;
  visibility: hidden;
  width: 1px;
  height: 1px;
  opacity: 0;
}

.account-settings-links .list-group-item.active {
  font-weight: bold !important;
}

html .account-settings-links .list-group-item.active {
  background: transparent !important;
}


.light-style .account-settings-links .list-group-item {
  padding: 0.85rem 1.5rem;
  border-color: rgba(24, 28, 33, 0.03) !important;
}

.light-style .account-settings-links .list-group-item.active {
  color: #4e5155 !important;
}

label {
  color: #0E3EDA;
}

label.btn-outline-primary {
  color: black;
}

div.btn-outline-primary {
  color: black;
}

.btn-outline-primary {
  border-color: var(--complementary-color);
  background-color: var(--complementary-color);
}

.btn-outline-primary:hover {
  background-color: var(--secondary-color);
}
</style>