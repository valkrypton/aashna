<template>
  <!-- Chat Box-->
  <div class="col-7 px-0 overall">
    <div class="floating-container">

    </div>
    <div class="px-4 py-5 chat-box">
      <!-- Sender Message-->
      <template v-for="msg in all_msgs">
        <div v-if="msg.sender === receiverID" class="media mb-3 them-container">
          <img src="https://bootstrapious.com/i/snippets/sn-chat/avatar.svg" alt="user" width="50"
               class="rounded-circle">
          <div class="media-body ml-3">
            <div class="bg-light rounded-pill bg-white py-2 px-3 mb-2">
              <p class="text-small mb-0 text-muted">{{ msg.content }}</p>
            </div>
            <p class="small text-muted timestamp">{{ new Date(msg.timestamp) }}</p>
          </div>
        </div>

        <!-- Reciever Message-->
        <div v-else class="media w-25 us-container mb-3">
          <div class="media-body us-container">
            <div class="bg-primary rounded-pill py-2 px-3 mb-2">
              <p class="text-small mb-0 text-white">{{ msg.content }}</p>
            </div>
            <p class="small text-muted timestamp">{{}}</p>
          </div>
        </div>
      </template>
    </div>

    <!-- Typing area -->
    <!--    <div class="type-box-container">
            <div class="input-group">
              <input type="text" placeholder="Type a message" aria-describedby="button-addon2"
                     class="form-control border-0 py-4 bg-light">
              <div class="input-group-append">
                <button id="button-addon2" type="submit" class="btn btn-link"><i class="fa fa-paper-plane"></i></button>
              </div>
            </div>
        </div>-->
    <div class="text-box-container">
      <input v-model="msg" type="text" class="text-input" placeholder="enter message..">
      <button @click="sendMsg" id="button-addon2" type="submit" class="btn btn-link"><i class="fa fa-paper-plane"></i>
      </button>
    </div>

  </div>
</template>

<script setup>
import {onBeforeMount, onMounted, onUnmounted, ref} from "vue";
import axios from "axios";

const ours = ref([]);
const theirs = ref([]);
let all_msgs = ref([]);

const props = defineProps({
  senderID: Number,
  receiverID: Number
})

const msg = ref('')
const baseURL = 'http://localhost:3000'
const {io} = require('socket.io-client')

const token = localStorage.getItem("jwt");

const socket = io.connect('http://localhost:3000', {
  query: {token}
});

function sendMsg() {
  socket.emit('private_message', {
    content: msg.value,
    to: props.receiverID
  })
  all_msgs.value.push({sender: props.senderID, receiver: props.receiverID, content: msg.value});
}

socket.on('private message', ({content, from, to}) => {
  all_msgs.value.push({sender: from, receiver: to, content: content, timestamp: new Date()});
})

axios.get("http://localhost:3000/retrieve_messages?id=" + props.receiverID, {
  headers: {
    Authorization: "Bearer " + token
  }
}).then(response => {
  if (response.data) {
    all_msgs.value = response.data;
    console.log(all_msgs.value)
  } else
    console.log("no user returned")
})

onUnmounted(() => {
  socket.disconnect();

})

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
  outline: 1px solid slategrey;
  border-radius: 1rem;
}

.text-small {
  font-size: 0.9rem;
}

.messages-box,
.chat-box {
  height: 83vh;
  overflow-y: scroll;
}

.rounded-lg {
  border-radius: 0.5rem;
}


.overall {
  margin-left: 7px;
  width: 100%;

}

.us-container {
  margin-left: auto;
}

.them-container {
  display: flex;

}

.them-container img {
  margin-bottom: auto;
  margin-top: 6px;
  margin-right: 10px;
}

.text-box-container {
  background-color: white;
  width: 100%;
  height: 6vh;
  padding: 4px;
}

.text-input {
  border-radius: 50px;
  width: 96%;
  height: 90%;
  margin-left: 3px;
  border: 0;
  padding: 13px;
}

.text-box-container button {
  margin-bottom: 2px;
}

.rounded-pill p {
  padding: 0 3px 0 3px;
}

.them-container .timestamp {
  margin-left: 10px;
}

.us-container .timestamp {
  float: right;
  margin-right: 5px;
}
</style>