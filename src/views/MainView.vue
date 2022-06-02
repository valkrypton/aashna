<!--suppress EqualityComparisonWithCoercionJS, EqualityComparisonWithCoercionJS -->
<template>
  <NavBarHome :user="user" :logout="logout" :hide-msgs="hideMsgs"/>
  <div class="main">
    <div class="row rounded-lg overflow-hidden shadow x">
      <!-- Users box-->
      <div class="col-0 px-0">
        <div class="bg-white">
          <div class="bg-gray px-4 py-2 bg-light">
            <p class="h5 mb-0 py-1">Matches</p>
          </div>
          <div class="messages-container">
            <div class="list-group rounded-0">
              <a v-for="user in matchedUsers" :key="user.user_id"
                 :id="user.fname.trim().concat(user.user_id)"
                 class="list-group-item list-group-item-action text-white rounded-0">
                <div class="media usr-msg-container">
                  <img :src="user.img_url" alt="user" width="50"
                       height="50" class="rounded-circle" @click="openProfile(user)">
                  <div class="media-body ml-4" @click="renderMsgs($event, user)">
                    <div class="d-flex align-items-center justify-content-between nameDate">
                      <h6 class="mb-0">{{ user.fname }} {{ user.lname }}</h6>
                      <small class="small font-weight-bold"></small>
                    </div>
                    <p class="font-italic mb-0 text-small"></p>
                  </div>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-if="!renderMessages" class="tinder">
      <div class="tinder--status">
        <i class="fa fa-remove"></i>
        <i class="fa fa-heart"></i>
      </div>
      <div class="tinder--cards">
        <div v-for="user in users" :key="user.user_id" :id="user.user_id" class="tinder--card"
             data-mdb-perfect-scrollbar='true'>
          <div class="pic-info" style="position: absolute;">
            <img width="300" height="400" :src="user.img_url" alt="img">
            <h3 style="position: fixed; top: 260px">{{ user.fname }}, {{ getAge(user.dob) }}</h3>
            <h3 style="position: fixed; top: 300px; font-size: 1.5rem">{{ user.school }}</h3>
            <h3 style="position: fixed; top: 330px; font-size: 1.5rem">{{ user.batch }}</h3>
            <div class="card-section">
              <span class="title">Bio</span>
              <p style="font-weight: bold">{{ user.bio }}</p>
            </div>
            <div class="card-section">
              <span class="title">Interests</span>
              <div class="interests">
                <div v-for="interest in user.interests" :key="interest">
                  <p class="btn btn-light interests-item">{{ interest.interest }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="tinder--buttons">
        <button id="nope"><i class="fa fa-remove"></i></button>
        <button id="love"><i class="fa fa-heart"></i></button>
      </div>
    </div>
    <Messages :their-i-d="receiver.user_id"
              :our-i-d="Number(user.user_id)"
              :us="user"
              :them="receiver"
              :socket="socket"
              @new-msg="updateRecentMessages"
              v-else/>
  </div>
  <Teleport to="body">
    <Transition name="modal">
      <ProfileCard v-if="modalOpen" :user="modalUser" @modal-closed="modalOpen=false"/>
    </Transition>
  </Teleport>
</template>

<script setup>
import Hammer from "../hammerjs.js"
import {onBeforeMount, onUpdated, ref, watch} from "vue";
import axios from "axios";
import {useRouter} from "vue-router";
import NavBarHome from "@/components/NavBarHome";
import Messages from "@/components/Messages";
import ProfileCard from "@/components/ProfileCard";
import {getDate, getAge} from "@/composables/date";


const {io} = require('socket.io-client')
const user = ref({user_id: "", fname: "", school: "", batch: "", bio: "", interests: [{interest: ""}], img_url: ""})
const users = ref([{user_id: "", fname: "", school: "", batch: "", bio: "", interests: [{interest: ""}], img_url: ""}])
const router = useRouter()
const renderMessages = ref(false)
const matchedUsers = ref([])
const receiver = ref({})
const modalOpen = ref(false)
const modalUser = ref({})
let token = localStorage.getItem("jwt");
const socket = io.connect('http://localhost:3000', {
  query: {token}
});

socket.on("matched", function () {
  getMatchedUsers()
})

function logout() {
  localStorage.removeItem('jwt')
  localStorage.removeItem('loggedUser')
  socket.disconnect()
  router.push('/')
}

function getMatchedUsers() {
  axios.get('http://localhost:3000/matchedUsers', {
    headers: {
      Authorization: 'Bearer ' + token
    }
  }).then(response => {
    if (response.data) {
      matchedUsers.value = response.data
    }
  }).catch(err => {
    console.log(err.message)
  })
}

function recordSwipes() {
  let lefts = document.querySelectorAll(".left");
  for (let i = 0; i < lefts.length; ++i) {
    if (users.value.find(u => {
      return u.user_id == lefts[i].id;
    })) {
      recordLeftSwipe(lefts[i].id);
      users.value = users.value.filter(x => x.user_id !== lefts[i].id);
    }
    lefts[i].remove();
  }


  let rights = document.querySelectorAll(".right");
  for (let i = 0; i < rights.length; ++i) {
    if (users.value.find(u => {
      return u.user_id == rights[i].id;
    })) {
      recordRightSwipe(rights[i].id);
      users.value = users.value.filter(x => x.user_id !== rights[i].id);
    }
    rights[i].remove();
  }

}

function recordLeftSwipe(swipee) {
  axios.post("http://localhost:3000/leftSwipe", {"swipee": swipee}, {
    headers: {
      Authorization: "Bearer " + token
    }
  }).catch(err => {
    console.log(err.message)
  })
}

function recordRightSwipe(swipee) {
  axios.post("http://localhost:3000/rightSwipe", {"swipee": swipee}, {
    headers: {
      Authorization: "Bearer " + token
    }
  }).then(() => {
    getMatchedUsers();
    socket.emit("rightSwipe", {swipee: swipee});
  }).catch(err => {
    console.log(err.message)
  })
}

function renderMsgs(event, user) {
  document.querySelectorAll(".active").forEach((x) => {
    x.classList.remove("active")
  })
  receiver.value = user;
  renderMessages.value = true;
  document.querySelector("#" + user.fname.trim() + user.user_id).classList.add("active")
}

function hideMsgs() {
  document.querySelectorAll(".active").forEach((x) => {
    x.classList.remove("active")
  });
  renderMessages.value = false
}

function updateRecentMessages(them, msg) {
  if (msg.content === "") {
    axios.get("http://localhost:3000/get_last_message?id=" + them.user_id, {
      headers: {
        Authorization: "Bearer " + token
      }
    }).then(response => {
      if (response.data !== "none") {
        let messageContent = String(response.data.content);

        if (response.data.sender === user.value.user_id) {
          messageContent = ("You: " + messageContent);
          document.querySelector("#" + them.fname.trim() + them.user_id + " p").classList.remove("bold")
        } else {
          document.querySelector("#" + them.fname.trim() + them.user_id + " p").classList.add("bold")
        }

        if (messageContent.length >= 30) {
          messageContent = messageContent.slice(0, 30) + "..";
        }

        document.querySelector("#" + them.fname + them.user_id + " p").innerText = messageContent;

        let date = new Date(response.data.timestamp);
        if (date.getDate() === (new Date()).getDate()) {
          date = "Today";
        } else {
          date = date.toLocaleDateString();
        }
        document.querySelector("#" + them.fname + them.user_id + " small").innerText = date;

      } else {
        document.querySelector("#" + them.fname + them.user_id + " p").innerText = "You matched with " + them.fname + "!";
      }
      for (let i = 0; i < matchedUsers.value.length; ++i) {
        if (matchedUsers.value[i].user_id === them.user_id) {
          matchedUsers.value[i].mostRecentMessageTime = response.data.timestamp
        }
      }
      sortMatchesList()
    })
  } else {
    let messageContent = String(msg.content);

    if (msg.from.user_id === user.value.user_id) {
      messageContent = "You: " + messageContent;
      document.querySelector("#" + them.fname + them.user_id + " p").classList.remove("bold")
    } else {
      document.querySelector("#" + them.fname + them.user_id + " p").classList.add("bold")
    }

    if (messageContent.length >= 30) {
      messageContent = messageContent.slice(0, 30) + "..";
    }

    document.querySelector("#" + them.fname + them.user_id + " p").innerText = messageContent;

    let date = new Date(msg.timestamp);
    if (date.getDate() === (new Date()).getDate()) {
      date = "Today";
    } else {
      date = date.toLocaleDateString();
    }
    document.querySelector("#" + them.fname + them.user_id + " small").innerText = date;
    for (let i = 0; i < matchedUsers.value.length; ++i) {
      if (matchedUsers.value[i].user_id === them.user_id) {
        matchedUsers.value[i].mostRecentMessageTime = msg.timestamp
      }
    }
    sortMatchesList()
  }
}

function sortMatchesList() {
  matchedUsers.value.sort((x, y) => {
    if (!x.mostRecentMessageTime) {
      return 1;
    }
    if (!y.mostRecentMessageTime) {
      return -1
    }
    if (new Date(x.mostRecentMessageTime) < new Date(y.mostRecentMessageTime))
      return 1;
    return -1;
  })
}

watch(matchedUsers, () => {
  matchedUsers.value.forEach((x) => {
    updateRecentMessages(x, {content: ""})
  })
})


function openProfile(user) {
  modalOpen.value = true
  modalUser.value = user
}

onBeforeMount(() => {
  if (token != null) {
    axios.get("http://localhost:3000/currentUser", {
      headers: {
        Authorization: "Bearer " + token
      }
    }).then(response => {
      if (response.data) {
        user.value = response.data
        user.value.dob = getDate(user.value.dob)
        localStorage.setItem('loggedUser', JSON.stringify(user.value))
      } else
        console.log("no user returned")
    }).catch(err => {
      console.log(err)
    })
    axios.get("http://localhost:3000/getPeople", {
      headers: {
        Authorization: "Bearer " + token
      }
    }).then(response => {
      if (response.data) {
        users.value = response.data

        function comp(interest) {
          return !!user.value.interests.find((u_interest) => {
            return u_interest.interest === interest.interest;
          });

        }

        users.value.sort((x, y) => {
          if ((x.interests.filter(comp).length > y.interests.filter(comp).length))
            return -1;
          else
            return 1;
        })
      }
    }).catch(err => {
      console.log(err)
    })
    axios.get('http://localhost:3000/matchedUsers', {
      headers: {
        Authorization: 'Bearer ' + token
      }
    }).then(response => {
      if (response.data) {
        matchedUsers.value = response.data
      }
    }).catch(err => {
      console.log(err.message)
    })
  } else {
    router.push('/')
  }
})


onUpdated(() => {
  if (!renderMessages.value) {
    let tinderContainer = document.querySelector('.tinder');
    let allCards = document.querySelectorAll('.tinder--card');

    let nope = document.getElementById('nope');
    let love = document.getElementById('love');

    function initCards(card, index) {
      recordSwipes();
      let newCards = document.querySelectorAll('.tinder--card:not(.removed)');
      newCards.forEach(function (card, index) {
        card.style.zIndex = allCards.length - index;
        card.style.transform = 'scale(' + (20 - index) / 20 + ') translateY(-' + 30 * index + 'px)';
        card.style.opacity = (10 - index) / 10;
      });
      tinderContainer.classList.add('loaded');
    }

    initCards();

    allCards.forEach(function (el) {
      let hammertime = new Hammer(el);

      hammertime.on('pan', function (event) {
        el.classList.add('moving');
      });

      hammertime.on('pan', function (event) {
        if (event.deltaX === 0) return;
        if (event.center.x === 0 && event.center.y === 0) return;

        tinderContainer.classList.toggle('tinder_love', event.deltaX > 0);
        tinderContainer.classList.toggle('tinder_nope', event.deltaX < 0);

        let xMulti = event.deltaX * 0.03;
        let yMulti = event.deltaY / 80;
        let rotate = xMulti * yMulti;

        el.style.transform = 'translate(' + event.deltaX + 'px, ' + event.deltaY + 'px) rotate(' + rotate + 'deg)';
      });

      hammertime.handlers.panend = [function (event) {
        el.classList.remove('moving');
        tinderContainer.classList.remove('tinder_love');
        tinderContainer.classList.remove('tinder_nope');

        let moveOutWidth = document.body.clientWidth;
        let keep = Math.abs(event.deltaX) < 80 || Math.abs(event.velocityX) < 0.5;

        el.classList.toggle('removed', !keep);

        if (keep) {
          el.style.transform = '';
        } else {
          let endX = Math.max(Math.abs(event.velocityX) * moveOutWidth, moveOutWidth);
          let toX = event.deltaX > 0 ? endX : -endX;
          let endY = Math.abs(event.velocityY) * moveOutWidth;
          let toY = event.deltaY > 0 ? endY : -endY;
          let xMulti = event.deltaX * 0.03;
          let yMulti = event.deltaY / 80;
          let rotate = xMulti * yMulti;

          el.style.transform = 'translate(' + toX + 'px, ' + (toY + event.deltaY) + 'px) rotate(' + rotate + 'deg)';

          el.classList.toggle('right', event.deltaX > 0);
          el.classList.toggle('left', event.deltaX < 0);

          initCards();

        }
      }]

    });

    function createButtonListener(love) {
      return function (event) {
        let cards = document.querySelectorAll('.tinder--card:not(.removed)');
        let moveOutWidth = document.body.clientWidth * 1.5;

        if (!cards.length) return false;

        let card = cards[0];

        card.classList.add('removed');

        if (love) {
          card.style.transform = 'translate(' + moveOutWidth + 'px, -100px) rotate(-30deg)';
          card.classList.add("right")

        } else {
          card.style.transform = 'translate(-' + moveOutWidth + 'px, -100px) rotate(30deg)';
          card.classList.add("left")
        }

        setTimeout(() => {
          initCards();
        }, 200)

        event.preventDefault();
      };
    }

    let nopeListener = createButtonListener(false);
    let loveListener = createButtonListener(true);

    nope.onclick = nopeListener;
    love.onclick = loveListener;

  }
})

</script>

<style scoped>

body {
  background-color: #FFF5FA;
}

.main {
  display: grid;
  grid-template-columns: 20% 80%;
  width: 98.9vw;
  height: 89vh;
}

.tinder {
  overflow: hidden;
  display: flex;
  flex-direction: column;
  position: relative;
  opacity: 0;
  transition: opacity 0.1s ease-in-out;
}

.loaded.tinder {
  opacity: 1;
}

.tinder--status {
  position: absolute;
  top: 50%;
  margin-top: -30px;
  z-index: 2;
  width: 100%;
  text-align: center;
  pointer-events: none;
}

.tinder--status i {
  font-size: 100px;
  opacity: 0;
  transform: scale(0.3);
  transition: all 0.2s ease-in-out;
  position: absolute;
  width: 100px;
  margin-left: -50px;
}

.tinder_love .fa-heart {
  opacity: 0.7;
  transform: scale(1);
}

.tinder_nope .fa-remove {
  opacity: 0.7;
  transform: scale(1);
}

.tinder--cards {
  flex-grow: 1;
  padding-top: 40px;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  z-index: 1;
}

.tinder--card {
  background-color: var(--complementary-color);
  display: inline-block;
  width: 30vw;
  max-width: 600px;
  height: 70vh;
  padding-bottom: 40px;
  border-radius: 8px;
  overflow-y: scroll;
  position: absolute;
  will-change: transform;
  transition: all 0.3s ease-in-out;
  cursor: grab;
  margin-left: auto;
  margin-right: auto;
}

.moving.tinder--card {
  transition: none;
  cursor: grabbing;
}

.tinder--card img {
  width: 100%;

  pointer-events: none;
}

.tinder--card h3 {
  margin-top: 32px;
  font-size: 32px;
  padding: 0 16px;
  pointer-events: none;
}


.tinder--buttons {
  flex: 0 0 100px;
  text-align: center;
  padding-top: 20px;
}

.tinder--buttons button {
  border-radius: 50%;
  line-height: 60px;
  width: 60px;
  border: 0;
  background: #FFFFFF;
  display: inline-block;
  margin: 0 8px;
}

.tinder--buttons button:focus {
  outline: 0;
}

.tinder--buttons i {
  font-size: 32px;
  vertical-align: middle;
}

.fa-heart {
  color: #FFACE4;
}

.fa-remove {
  color: #CDD6DD;
}

.pic-info h3 {
  color: white;
  font-weight: bold;
}

.card-section {
  margin-top: 2%;
  font-size: 20px;
  padding: 0 16px;
  pointer-events: none;
  text-align: left;
}

.card-section .title {
  color: gray;
  font-size: 1.2rem
}

.interests {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
}

.interests-item {
  margin: 5px 5px 5px 0;
  border: 1px solid;
  font-weight: 600;
}


.btn-light {
  background-color: var(--bg-color);
  color: black;
  border: transparent;
  border-radius: 5%;
}

.btn-light:hover {
  background-color: #ffd1e8;
}

.text-small {
  font-size: 0.9rem;
}

.messages-container {
  cursor: pointer;
  height: 83vh;
  width: 100%;
  overflow-y: scroll;
}

.list-group-item {
  height: 70%;
}

input::placeholder {
  font-size: 0.9rem;
  color: #999;
}

.usr-msg-container {
  display: flex;
  color: black;
  padding: 5px 0 0 3px;
  height: 70px;
  width: 100%;
}

.usr-msg-container img {
  margin-right: 12px;

}

.active {
  background-color: var(--complementary-color);
  border-color: transparent;
}

.messages-container h6 {
  font-weight: 500;
  font-size: 1.1rem;
}

.nameDate {
  display: flex;
}

.small {
  float: right;
}

.usr-msg-container div {
  width: 100%;
}

.media-body {
  padding-top: 3px;
}

.modal-enter-active,
.modal-leave-active {
  transition: all 0.25s ease-in-out;
}

.modal-enter-from {
  opacity: 0;
  transform: scale(1.1);
}

.modal-leave-to {
  opacity: 0;
  transform: scale(0.9);
}
</style>