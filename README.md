# Video Chat API

This is a simple video chat API built using Nest.js, Socket.io, and WebRTC. It allows users to create or join video chat rooms and communicate with each other via video and audio. Currently available at [Backend](https://video-chat-api-duql.onrender.com) and [Frontend](https://video-chat-frontend-ux5u.onrender.com)

## Installation

To set up the Video Chat API locally, follow these steps:

1. Clone this repository to your local machine:

   ```bash
   git clone https://github.com/mjavason/Video-Chat-App
   ```

2. Navigate to the project directory:

   ```bash
   cd video-chat-api
   ```

3. Install the required dependencies:

   ```bash
   npm install
   ```

## Usage

### Running the API

To run the API, execute one of the following commands:

- **Development Mode (with auto-reloading):**

  ```bash
  npm run start:dev
  ```

  The API will start with auto-reloading enabled, allowing you to make changes and see the effects in real-time.

- **Production Mode:**

  ```bash
  npm run start:prod
  ```

  The API will start in production mode for a stable and optimized deployment.

- **Debug Mode (with auto-reloading):**

  ```bash
  npm run start:debug
  ```

  This will start the API in debug mode with auto-reloading.

The API will be available at `http://localhost:3000`.

### Connecting to the WebSocket

To connect to the WebSocket for real-time communication, use the following URL:

- `ws://localhost`

### Frontend

To showcase the video chat functionality, you can use the provided frontend located in the "frontend" folder. The frontend is a simple HTML, CSS, and JavaScript application that connects to the API and allows users to create or join video chat rooms.

To run the frontend:

1. Install peer npm package and run this command:

```bash
peerjs --port 3001
```

This helps setup the peerjs server which handles the webRTC traffic.

2. Navigate to the "frontend" folder:

   ```bash
   cd frontend
   ```

3. Open the "index.html" file in your web browser. You can use a development server or a simple HTTP server to serve the HTML file.

4. Follow the on-screen instructions to create or join a chat room and start video chatting with others.

## Configuration

You can customize the API's configuration by editing the `app.module.ts` file and adjusting settings such as server ports, CORS policies, and more. The main code is located at the gateway folder, inside rooms.gateway.ts

## Support

If you encounter any issues or have questions, please [open an issue](https://github.com/mjavason/Video-Chat-App/issues) on the GitHub repository. We appreciate your feedback and contributions!

Happy video chatting!
