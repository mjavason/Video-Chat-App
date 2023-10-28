import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  // WebSocketServer,
} from '@nestjs/websockets';
// import { Socket } from 'dgram';
import { Socket, Server } from 'socket.io';
import generateUniqueId from 'src/utils/generate_unique_id.util';

@WebSocketGateway(80, {
  cors: {
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  },
})
export class RoomGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  // This method is called when a client connects to the WebSocket server.////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  handleConnection(client: Socket | any) {
    console.log(`Client connected: ${client.id}`);
  }

  // This event runs when join room is emitted /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  @SubscribeMessage('join-room')
  handleJoinRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: any,
  ) {
    console.log(payload);

    const roomId = payload[0];
    const userId = payload[1];

    client.join(roomId);
    client.emit('join-room', { roomId, userId });
    client.to(roomId).emit('user-connected', userId);

    client.emit('join-room', roomId, userId);
  }

  // This method is called when the WebSocket server is initialized. ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  afterInit(server: Server) {
    console.log('WebSocket server initialized');
  }

  // This method is called when a client disconnects from the WebSocket server//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);

    // client.to(roomId).emit('user-disconnected', client.id);
  }
}

///////////////////////////////////////////////////////////////////////

// This event runs when message is emitted //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// @SubscribeMessage('message')
// handleMessage(
//   @ConnectedSocket() client: Socket,
//   @MessageBody() payload: any,
// ): string {
//   console.log(payload);

//   // Send a message back to the client
//   client.emit(
//     'events',
//     'This is a message from the server. We got your package.',
//   );

//   return 'Hello world!';
// }
