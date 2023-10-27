const sendMessageButton = document.getElementById('sendMessage');

import { io } from 'https://cdn.socket.io/4.4.1/socket.io.esm.min.js';

const serverUrl = 'ws://localhost'; // WebSocket URL
const socket = io(serverUrl);

// // Listen for the 'connect' event to know when the WebSocket connection is established
socket.on('connect', () => {
  console.log('Connected to the WebSocket server');
  // You can perform any actions or display messages here to indicate a successful connection
});

// Listen for the 'events' event and handle the incoming data
socket.on('events', (message) => {
  console.log('Received event:', message);
  // Handle the received message here, e.g., display it in the UI
});

sendMessageButton.addEventListener('click', () => {
  const message = document.getElementById('message').value;
  socket.emit('events', message);
  document.getElementById('message').value = '';
});
