import { io } from 'https://cdn.socket.io/4.4.1/socket.io.esm.min.js';
import * as peer from 'https://unpkg.com/peerjs@1.5.1/dist/peerjs.min.js';

// const sendMessageButton = document.getElementById('sendMessage');
const roomIdHeader = document.getElementById('roomId');
const socketStatusHeader = document.getElementById('socketStatus');
const myVideo = document.createElement('video');
const videoGrid = document.getElementById('video-grid');

const roomId = 'aaabbbccc'; //generateUniqueId(20);
const userId = 'abc'; //generateUniqueId(6);

//mute your own microphone, so you dont hear yourself
myVideo.muted = true;

roomIdHeader.innerHTML = roomId;

navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
  addVideoStream(myVideo, stream);
  // myPeer.on('call', (call) => {
  //   call.answer(stream);
  //   call.on('stream', (userVideoStream) => {
  //     addVideoStream(video, userVideoStream);
  //   });
  // });
});

// console.log('roomId:', uniqueId);
// console.log('user id:', userId);

// const peers = {};
const myPeer = new Peer(undefined, {
  host: '/',
  port: '3001',
});
const serverUrl = 'ws://localhost'; // WebSocket URL
const socketIo = io(serverUrl);

// Listen for the 'connect' event to know when the WebSocket connection is established
socketIo.on('connect', () => {
  console.log('Connected to the server');
});

// whenever a new peer is opened, take the id and join the same room
myPeer.on('open', (id) => {
  socketIo.emit('join-room', roomId, id);
  socketStatusHeader.innerHTML = id + ' Online';
});
// Join a room immediately after the connection is established

// Notify everyone when a new user is connected to our room
socketIo.on('user-connected', (userId) => {
  console.log('User connected:', userId);
});

/////////////////////////////////////////////////////////////////////////

//   socketIo.on('user-connected', (userId) => {
//     connectToNewUser(userId, stream);
//   });
// });

// Handle other events inside the 'connect' event callback
// socketIo.on('join-room', (payload) => {
//   console.log('join room');
//   console.log(payload);
// });

// socketIo.on('user-disconnected', (userId) => {
//   console.log(userId);
//   if (peers[userId]) peers[userId].close();
// });

function generateUniqueId(length) {
  const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let uniqueId = '';

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    uniqueId += charset.charAt(randomIndex);
  }

  return uniqueId;
}

function addVideoStream(video, stream) {
  video.srcObject = stream;
  video.addEventListener('loadedmetadata', () => {
    video.play();
  });
  videoGrid.append(video);
}

// function connectToNewUser(user) {
//   const call = myPeer.call(userId, stream);
//   const video = document.createElement('video');
//   call.on('stream', (userVideoStream) => {
//     addVideoStream(userVideoStream);
//   });
//   call.on('close', () => {
//     video.remove();
//   });

//   peers[userId] = call;
// }

//////////////////////////////////////////////////////////////////////////////////////////

// sendMessageButton.addEventListener('click', () => {
//   const message = document.getElementById('message').value;
//   socket.emit('events', message);
//   document.getElementById('message').value = '';
// });
