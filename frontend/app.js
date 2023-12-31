import { io } from 'https://cdn.socket.io/4.4.1/socket.io.esm.min.js';

// Parse the query string to extract the room ID
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const roomId = urlParams.get('room_id');
var peers = {};

// If room ID is not set, create a new one
if (!roomId) {
  // Generate a new room ID
  const newRoomId = generateUniqueId(50);

  // Set the "room_id" parameter in the URL
  urlParams.set('room_id', newRoomId);

  // Update the URL with the new "room_id" parameter
  const newUrl = window.location.pathname + '?' + urlParams.toString();
  history.pushState({ path: newUrl }, '', newUrl);
}

console.log(`Room ID: ${roomId}`);

const roomIdHeader = document.getElementById('roomId');
const meetingStatusHeader = document.getElementById('meetingStatusId');
const myVideo = document.createElement('video');
const videoGrid = document.getElementById('video-grid');

// Mute your own microphone so you don't hear yourself
myVideo.muted = true;

roomIdHeader.innerHTML = roomId;
meetingStatusHeader.innerHTML = 'Connecting';

const serverUrl = 'wss://video-chat-api-duql.onrender.com'; //ws:localhost:5000 // WebSocket URL
const socketIo = io(serverUrl);

const myPeer = new Peer({
  host: 'simple-peerjs-server.onrender.com', // '/' on localhost
  port: '',
  secure: true, // when using the live server (https), on local set it to false
});

/**
 * Request access to the user's camera and microphone, then add the user's video stream.
 * @param {MediaStream} stream - The user's video and audio stream.
 */
navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
  addVideoStream(myVideo, stream);

  // Notify everyone when a new user is connected to the room
  socketIo.on('user-connected', (userId) => {
    console.log('User connected:', userId);
    meetingStatusHeader.innerHTML = 'New user connected';
    connectToNewUser(userId, stream);
  });

  // Listen for user disconnections
  socketIo.on('user-disconnected', (userId) => {
    console.log('disconnected', userId);
    meetingStatusHeader.innerHTML = 'New user disconnected';
    // Close the peer connection if it exists
    if (peers[userId]) peers[userId].close();
  });
});

// Listen for the 'connect' event to know when the WebSocket connection is established
socketIo.on('connect', () => {
  console.log('Connected to the server');
  meetingStatusHeader.innerHTML = 'Connected to socket server';
});

// Whenever a new peer is opened, take the ID and join the same room
myPeer.on('open', (id) => {
  socketIo.emit('join-room', roomId, id);
});

myPeer.on('call', (call) => {
  console.log('Joining room');
  meetingStatusHeader.innerHTML = 'Joining room';

  navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
    call.answer(stream);
  });

  // if (!globalVideoStream) console.log('No video stream available');

  const video = document.createElement('video');

  call.on('stream', (userVideoStream) => {
    addVideoStream(video, userVideoStream);
  });
});

/**
 * Generate a unique ID of a specified length.
 * @param {number} length - The length of the unique ID.
 * @returns {string} The generated unique ID.
 */
function generateUniqueId(length) {
  const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let uniqueId = '';

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    uniqueId += charset.charAt(randomIndex);
  }

  return uniqueId;
}

/**
 * Add a video stream to a video element and play it.
 * @param {HTMLVideoElement} video - The video element to display the stream.
 * @param {MediaStream} stream - The media stream to display.
 */
function addVideoStream(video, stream) {
  video.srcObject = stream;
  video.addEventListener('loadedmetadata', () => {
    video.play();
  });
  videoGrid.append(video);
}

/**
 * Connect to a new user and display their video stream.
 * @param {string} userId - The ID of the new user to connect to.
 * @param {MediaStream} stream - The user's video and audio stream.
 */
function connectToNewUser(userId, stream) {
  console.log('Calling', userId);
  meetingStatusHeader.innerHTML = 'Calling new user';

  const call = myPeer.call(userId, stream);
  const video = document.createElement('video');

  call.on('stream', (userVideoStream) => {
    addVideoStream(video, userVideoStream);
  });

  call.on('close', () => {
    video.style.display = 'none';
    video.remove();
  });

  // Store the peer connection if needed
  peers[userId] = call;
}
