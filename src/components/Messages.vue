<template>
  <!-- Chat Box-->
  <div class="col-7 px-0 overall">
    <div class="floating-container">

    </div>

    <div class="chat-box">
      <!-- Sender Message-->
      <template v-for="msg in all_msgs">
        <div v-if="msg.sender === theirID" class="media them-container">
          <img :src="them.img_url" alt="user" width="50" height="50" class="rounded-circle">
          <div class="py-2 mb-2 them-msg">
            <p class="text-small mb-0">{{ msg.content }}</p>
            <span class="small text-muted timestamp">{{ (new Date(msg.timestamp)).toLocaleString() }}</span>
          </div>
        </div>

        <!-- Reciever Message-->
        <div v-else class="media us-container">
          <div class="py-2 mb-2 us-msg">
            <span class="small text-muted timestamp">{{ (new Date(msg.timestamp)).toLocaleString() }}</span>
            <p class="text-small mb-0 text-white">{{ msg.content }}</p>
          </div>
        </div>
      </template>
    </div>

    <form @submit.prevent="() => {msg = ''}">
      <div class="text-box-container">
        <input v-model="msg" type="text" class="text-input" placeholder="enter message..">
        <button @click="sendMsg" id="button-addon2" type="submit" class="btn btn-link"><i class="fa fa-paper-plane"></i>
        </button>
      </div>
    </form>

  </div>
</template>

<script setup>
import {onBeforeMount, onMounted, onUnmounted, onUpdated, ref, watch} from "vue";
import axios from "axios";

const ours = ref([]);
const theirs = ref([]);
let all_msgs = ref([]);

const props = defineProps({
  ourID: Number,
  theirID: Number,
  us: Object,
  them: Object,
  socket: Object
})
console.log(props.them.img_url)
watch(props, () => {
  getAllMsgs();
})
const msg = ref('')
const emit = defineEmits(['mew-msg'])
const baseURL = 'http://localhost:3000'

function sendMsg() {
  props.socket.emit('private_message', {
    content: msg.value,
    to: props.theirID
  })
  all_msgs.value.push({sender: props.ourID, receiver: props.theirID, content: msg.value});
  emit("new-msg", props.them, {from: props.us, to: props.them, content: msg.value, timestamp: new Date()})
  setTimeout(() => {
    document.querySelector(".chat-box").scrollTop = document.querySelector(".chat-box").scrollHeight;
  }, 10)
}

props.socket.on('private_message', ({content, from, to}) => {
  all_msgs.value.push({sender: from, receiver: to, content: content, timestamp: new Date()});
  emit("new-msg", props.them, {from: props.them, to: props.us, content: msg.value, timestamp: new Date()})
  setTimeout(() => {
    document.querySelector(".chat-box").scrollTop = document.querySelector(".chat-box").scrollHeight;
  }, 10)
})

function getAllMsgs() {
  const token = localStorage.getItem("jwt");
  axios.get("http://localhost:3000/retrieve_messages?id=" + props.theirID, {
    headers: {
      Authorization: "Bearer " + token
    }
  }).then(response => {
    if (response.data) {
      all_msgs.value = response.data;
    } else
      console.log("no user returned")
  })
}

getAllMsgs();


</script>

<style scoped>

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
  border-radius: 1rem;
}

.text-small {
  font-size: 0.9rem;
}

.chat-box {
  height: 83vh;
  overflow-y: scroll;
}


.overall {
  margin-left: 7px;
  width: 100%;
}


.them-container, .us-container {
  width: 100%;
  word-break: break-word;
  display: flex;
}


.them-container img {
  margin: 6px 10px auto 15px;
}

.timestamp {
  visibility: hidden;
  position: absolute;
  width: 300px;
}

.them-container .timestamp {
  left: calc(110% + 10px);
  top: 30%;
  text-align: left;
}

.us-container .timestamp {
  right: calc(100% + 10px);
  text-align: right;
}

.them-msg, .us-msg {
  max-width: 40%;
  width: fit-content;
  padding: 0 13px 7px 13px;
  border-radius: 25px;
  position: relative;
}

.us-msg {
  background-color: var(--secondary-color);
  margin-left: auto;
  margin-right: 10px;
}

.them-msg {
  background-color: #e8e8e8;
  margin-top: auto;
  margin-bottom: auto;
}

.them-msg:hover .timestamp {
  visibility: visible;
}

.us-msg:hover .timestamp {
  visibility: visible;
}

.text-box-container {
  background-color: white;
  width: 100%;
  height: 6vh;
  padding: 10px 4px 4px 8px;
}

.text-input {
  background-color: #eaeaea;
  border-radius: 50px;
  width: 96%;
  height: 90%;
  margin-left: 3px;
  border: 2px solid black;
  padding: 13px;
}

.text-box-container button {
  margin-bottom: 2px;
}

.btn {
  padding-top: 2px;
}

.fa-paper-plane {
  font-size: large
}
</style>