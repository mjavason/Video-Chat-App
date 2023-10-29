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

@WebSocketGateway(5000, {
  cors: {
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  },
})
export class RoomGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private roomId = '';
  private userId = '';

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
    console.log('Room joined');

    this.roomId = payload[0];
    this.userId = payload[1];

    client.join(this.roomId);
    return client.to(this.roomId).emit('user-connected', this.userId);
  }

  // This method is called when the WebSocket server is initialized. ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  afterInit(server: Server) {
    console.log('WebSocket server initialized');
  }

  // This method is called when a client disconnects from the WebSocket server//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  handleDisconnect(@ConnectedSocket() client: Socket) {
    console.log(`Client disconnected: ${client.id}`, `room-id: ${this.roomId}`);
    client.to(this.roomId).emit('user-disconnected', this.userId);
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
