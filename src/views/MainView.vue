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

  <div class="tinder">
    <div class="tinder--status">
      <i class="fa fa-remove"></i>
      <i class="fa fa-heart"></i>
    </div>
    <div class="tinder--cards">
      <div v-for="user in users" :key="user.user_id" class="tinder--card">
        <div style="position: absolute;">
          <img width="300" height="400" :src="user.img_url" >
          <h3 style="position: fixed; top: 260px">{{ user.fname }}, {{ user.age }}</h3>
          <h3 style="position: fixed; top: 300px">{{ user.school }}</h3>
          <h3 style="position: fixed; top: 330px">{{ user.batch }}</h3>
          <p>{{ user.bio }}</p>
        </div>
      </div>
    </div>
    <div class="tinder--buttons">
      <button id="nope"><i class="fa fa-remove"></i></button>
      <button id="love"><i class="fa fa-heart"></i></button>
    </div>
  </div>

</template>

<script setup>
import hammer from "../hammerjs.js"
import {onBeforeMount, onMounted, onUpdated, ref, watch} from "vue";
import axios from "axios";
import {useRouter} from "vue-router";
import NavBarHome from "@/components/NavBarHome";


const user = ref(null)
const img_url = ref('')
const users = ref([])
const router = useRouter()

function logout() {
  localStorage.removeItem('jwt')
  router.push('/')
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
  var tinderContainer = document.querySelector('.tinder');
  var allCards = document.querySelectorAll('.tinder--card');
  console.log(allCards.length)
  var nope = document.getElementById('nope');
  var love = document.getElementById('love');

  function initCards(card, index) {
    var newCards = document.querySelectorAll('.tinder--card:not(.removed)');
    newCards.forEach(function (card, index) {
      card.style.zIndex = allCards.length - index;
      card.style.transform = 'scale(' + (20 - index) / 20 + ') translateY(-' + 30 * index + 'px)';
      card.style.opacity = (10 - index) / 10;
    });
    tinderContainer.classList.add('loaded');
  }

  initCards();

  allCards.forEach(function (el) {
    var hammertime = new Hammer(el);

    hammertime.on('pan', function (event) {
      el.classList.add('moving');
    });

    hammertime.on('pan', function (event) {
      if (event.deltaX === 0) return;
      if (event.center.x === 0 && event.center.y === 0) return;

      tinderContainer.classList.toggle('tinder_love', event.deltaX > 0);
      tinderContainer.classList.toggle('tinder_nope', event.deltaX < 0);

      var xMulti = event.deltaX * 0.03;
      var yMulti = event.deltaY / 80;
      var rotate = xMulti * yMulti;

      el.style.transform = 'translate(' + event.deltaX + 'px, ' + event.deltaY + 'px) rotate(' + rotate + 'deg)';
    });

    hammertime.on('panend', function (event) {
      el.classList.remove('moving');
      tinderContainer.classList.remove('tinder_love');
      tinderContainer.classList.remove('tinder_nope');

      var moveOutWidth = document.body.clientWidth;
      var keep = Math.abs(event.deltaX) < 80 || Math.abs(event.velocityX) < 0.5;

      el.classList.toggle('removed', !keep);

      if (keep) {
        el.style.transform = '';
      } else {
        var endX = Math.max(Math.abs(event.velocityX) * moveOutWidth, moveOutWidth);
        var toX = event.deltaX > 0 ? endX : -endX;
        var endY = Math.abs(event.velocityY) * moveOutWidth;
        var toY = event.deltaY > 0 ? endY : -endY;
        var xMulti = event.deltaX * 0.03;
        var yMulti = event.deltaY / 80;
        var rotate = xMulti * yMulti;

        el.style.transform = 'translate(' + toX + 'px, ' + (toY + event.deltaY) + 'px) rotate(' + rotate + 'deg)';
        initCards();
      }
    });
  });

  function createButtonListener(love) {
    return function (event) {
      var cards = document.querySelectorAll('.tinder--card:not(.removed)');
      var moveOutWidth = document.body.clientWidth * 1.5;

      if (!cards.length) return false;

      var card = cards[0];

      card.classList.add('removed');

      if (love) {
        card.style.transform = 'translate(' + moveOutWidth + 'px, -100px) rotate(-30deg)';
      } else {
        card.style.transform = 'translate(-' + moveOutWidth + 'px, -100px) rotate(30deg)';
      }

      initCards();

      event.preventDefault();
    };
  }

  let nopeListener = createButtonListener(false);
  let loveListener = createButtonListener(true);

  nope.onclick = nopeListener;
  love.onclick = loveListener;

})

</script>

<style scoped>
body {
  background-color: #FFF5FA;
}



.navigation {
  top: 0;
  z-index: 10;
  position: sticky;
  font-weight: bold;
  width: 100%;
  height: 3rem;
  background-color: white;
  display: inline-flex;
  text-align: center;
}

.navigation img {
  width: 40px;
  height: 40px;
  margin-left: 1%;
  margin-top: 0.3%;
}

.nav-uname {
  margin-left: 0.5%;
  margin-top: auto;
  margin-bottom: auto;
  color: var(--secondary-color);
}

.nav-brand {
  color: var(--main-color);
  font-size: 1.6rem;
  margin: auto;
}

.nav-logout {
  margin-right: 1%;
  margin-top: auto;
  margin-bottom: auto;
  cursor: pointer;
}

.nav-logout:hover {
  color: var(--main-color);
}

/**, *:before, *:after {
  box-sizing: border-box;
  padding: 0;
  margin: 0;
}*/


.tinder {
  width: 100vw;
  height: 100vh;
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
  display: inline-block;
  width: 30vw;
  max-width: 600px;
  height: 70vh;
  background: #FFFFFF;
  padding-bottom: 40px;
  border-radius: 8px;
  overflow: hidden;
  position: absolute;
  will-change: transform;
  transition: all 0.3s ease-in-out;
  cursor: grab;
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

.tinder--card p {
  margin-top: 24px;
  font-size: 20px;
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
</style>