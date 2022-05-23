<template>
  <!--  <nav class="navbar navbar-expand-lg navbar-light bg-white sticky-top">
      <div class="container-fluid">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <li class="nav-item">
            <img :src="img_url" alt="" width="50" height="50" class="mb-lg-0 mr-1">
            <span class="navbar-link active">{{ user.fname }}</span>
          </li>
        </ul>
        <a class="navbar-brand font-weight-bold" style="color: #0E3EDA;" href="#">Aashna</a>
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <li class="nav-item">
            <a class="nav-link active" @click="logout" style="cursor: pointer">Logout</a>
          </li>
        </ul>
      </div>
    </nav>-->

  <NavBarHome :user_name="user.fname" :img_url="img_url" :logout="logout  "/>
  <div class="main">
    <div class="row rounded-lg overflow-hidden shadow x">
      <!-- Users box-->
      <div class="col-0 px-0">
        <div class="bg-white">

          <div class="bg-gray px-4 py-2 bg-light">
            <p class="h5 mb-0 py-1">Recent</p>
          </div>

          <div class="messages-box">
            <div class="list-group rounded-0">
              <a @click="renderMsgs" class="list-group-item list-group-item-action active text-white rounded-0">
                <div class="media"><img src="https://bootstrapious.com/i/snippets/sn-chat/avatar.svg" alt="user"
                                        width="50" class="rounded-circle">
                  <div class="media-body ml-4">
                    <div class="d-flex align-items-center justify-content-between mb-1">
                      <h6 class="mb-0">Jason Doe</h6><small class="small font-weight-bold">25 Dec</small>
                    </div>
                    <p class="font-italic mb-0 text-small">Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed
                      do eiusmod tempor incididunt ut labore.</p>
                  </div>
                </div>
              </a>

              <a href="#" class="list-group-item list-group-item-action list-group-item-light rounded-0">
                <div class="media"><img src="https://bootstrapious.com/i/snippets/sn-chat/avatar.svg" alt="user"
                                        width="50" class="rounded-circle">
                  <div class="media-body ml-4">
                    <div class="d-flex align-items-center justify-content-between mb-1">
                      <h6 class="mb-0">Jason Doe</h6><small class="small font-weight-bold">14 Dec</small>
                    </div>
                    <p class="font-italic text-muted mb-0 text-small">Lorem ipsum dolor sit amet, consectetur.
                      incididunt ut labore.</p>
                  </div>
                </div>
              </a>

              <a href="#" class="list-group-item list-group-item-action list-group-item-light rounded-0">
                <div class="media"><img src="https://bootstrapious.com/i/snippets/sn-chat/avatar.svg" alt="user"
                                        width="50" class="rounded-circle">
                  <div class="media-body ml-4">
                    <div class="d-flex align-items-center justify-content-between mb-1">
                      <h6 class="mb-0">Jason Doe</h6><small class="small font-weight-bold">9 Nov</small>
                    </div>
                    <p class="font-italic text-muted mb-0 text-small">consectetur adipisicing elit, sed do eiusmod
                      tempor incididunt ut labore.</p>
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
            <img width="300" height="400" :src="user.img_url">
            <h3 style="position: fixed; top: 260px">{{ user.fname }}, {{ user.age }}</h3>
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
    <Messages v-else/>
  </div>

</template>

<script setup>
import Hammer from "../hammerjs.js"
import {onBeforeMount, onMounted, onUpdated, ref, watch} from "vue";
import axios from "axios";
import {useRouter} from "vue-router";
import NavBarHome from "@/components/NavBarHome";
import {rightSwipe} from "../../server/api/swiping";
import Messages from "@/components/Messages";


const user = ref({user_id: "", fname: "", school: "", batch: "", bio: "", interests: [{interest: ""}], img_url: ""})
const img_url = ref('')
const users = ref([{user_id: "", fname: "", school: "", batch: "", bio: "", interests: [{interest: ""}], img_url: ""}])
const router = useRouter()
const renderMessages = ref(false)

function logout() {
  localStorage.removeItem('jwt')
  router.push('/')
}

function recordSwipes() {
  let lefts = document.querySelectorAll(".left");
  for(let i = 0; i < lefts.length; ++i){
    if (users.value.find(u => {
      return u.user_id == lefts[i].id;
    })) {
      recordLeftSwipe(lefts[i].id);
      users.value = users.value.filter(x => x.user_id !== lefts[i].id);
    }
    lefts[i].remove();
  }


  let rights = document.querySelectorAll(".right");
  for(let i = 0; i < rights.length; ++i){
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
  const token = localStorage.getItem("jwt");
  axios.post("http://localhost:3000/leftSwipe", {"swipee": swipee}, {
    headers: {
      Authorization: "Bearer " + token
    }
  }).then(response => {

  })
}

function recordRightSwipe(swipee) {
  const token = localStorage.getItem("jwt");
  axios.post("http://localhost:3000/rightSwipe", {"swipee": swipee}, {
    headers: {
      Authorization: "Bearer " + token
    }
  }).then(response => {

  })
}

function renderMsgs() {
  renderMessages.value = true
}

onBeforeMount(() => {

  const token = localStorage.getItem("jwt")
  if (token != null) {
    axios.get("http://localhost:3000/currentUser", {
      headers: {
        Authorization: "Bearer " + token
      }
    }).then(response => {
      if (response.data) {
        user.value = response.data
        img_url.value = "http://localhost:3000/" + user.value.img_url
      } else
        console.log("no user returned")
    })

    axios.get("http://localhost:3000/getPeople", {
      headers: {
        Authorization: "Bearer " + token
      }
    }).then(response => {
      if (response.data) {
        users.value = response.data
        for (let i = 0; i < response.data.length; ++i) {
          users.value[i].img_url = "http://localhost:3000/" + users.value[i].img_url
        }

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
    })
  }

})
onMounted(() => {
  let fontScript = document.createElement('script')
  fontScript.setAttribute('src', 'https://kit.fontawesome.com/0654960685.js')
  fontScript.setAttribute('crossorigin', 'anonymous')
  document.head.appendChild(fontScript)
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


.navigation img {
  width: 40px;
  height: 40px;
  margin-left: 1%;
  margin-top: 0.3%;
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

::-webkit-scrollbar {
  width: 5px;
}

::-webkit-scrollbar-track {
  width: 5px;
  background: #f5f5f5;
}

::-webkit-scrollbar-thumb {
  width: 1em;
  background-color: #ddd;
  outline: 1px solid slategrey;
  border-radius: 1rem;
}

.text-small {
  font-size: 0.9rem;
}

.messages-box,
.chat-box {
  cursor: pointer;
  height: 83vh;
  overflow-y: scroll;
}

.rounded-lg {
  border-radius: 0.5rem;
}

input::placeholder {
  font-size: 0.9rem;
  color: #999;
}

</style>