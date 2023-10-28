import { io } from 'https://cdn.socket.io/4.4.1/socket.io.esm.min.js';
// import * as peer from 'https://unpkg.com/peerjs@1.5.1/dist/peerjs.min.js';

// Parse the query string
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const roomId = urlParams.get('room_id');

// if room id is not set, create a new one
if (!roomId) {
  // If "roomId" doesn't exist, generate a new room ID
  const newRoomId = generateUniqueId(50);

  // Set the "roomId" parameter in the URL
  urlParams.set('room_id', newRoomId);

  // Update the URL with the new "roomId" parameter
  const newUrl = window.location.pathname + '?' + urlParams.toString();
  history.pushState({ path: newUrl }, '', newUrl);
}

console.log(`Room ID: ${roomId}`);

// const sendMessageButton = document.getElementById('sendMessage');
const roomIdHeader = document.getElementById('roomId');
const myVideo = document.createElement('video');
const videoGrid = document.getElementById('video-grid');

//mute your own microphone, so you dont hear yourself
myVideo.muted = true;

roomIdHeader.innerHTML = roomId;

const serverUrl = 'ws://localhost'; // WebSocket URL
const socketIo = io(serverUrl);

// const peers = {};
const myPeer = new Peer(undefined, {
  host: '/',
  port: '3001',
});

navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
  addVideoStream(myVideo, stream);

  // Notify everyone when a new user is connected to our room
  socketIo.on('user-connected', (userId) => {
    console.log('User connected:', userId);
    connectToNewUser(userId, stream);
  });

  myPeer.on('call', (call) => {
    console.log('answering call');
    call.answer(stream);

    const video = document.createElement('video');

    call.on('stream', (userVideoStream) => {
      addVideoStream(video, userVideoStream);
    });
  });
});

// Listen for the 'connect' event to know when the WebSocket connection is established
socketIo.on('connect', () => {
  console.log('Connected to the server');
});

// whenever a new peer is opened, take the id and join the same room
myPeer.on('open', (id) => {
  socketIo.emit('join-room', roomId, id);
});
// Join a room immediately after the connection is established

/////////////////////////////////////////////////////////////////////////

socketIo.on('user-disconnected', (userId) => {
  console.log(userId);
  if (peers[userId]) peers[userId].close();
});

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

function connectToNewUser(userId, stream) {
  console.log('calling', userId);

  const call = myPeer.call(userId, stream);
  const video = document.createElement('video');

  call.on('stream', (userVideoStream) => {
    addVideoStream(video, userVideoStream);
  });

  call.on('close', () => {
    video.remove();
  });

  // peers[userId] = call;
}
