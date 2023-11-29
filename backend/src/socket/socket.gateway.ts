import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { NutriDietLogger } from '../common/NutriDietLogger';
import { roomHandler } from './roomHandler';

@WebSocketGateway({ cors: true })
export class SocketGateway {
  logger = new NutriDietLogger();

  constructor() {
    this.logger.setContext('Socket');
  }

  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    this.logger.log('New client connected');
    roomHandler(client, this.logger);
  }

  handleDisconnect(client: Socket) {
    roomHandler(client, this.logger);
    this.logger.log('Client disconnected');
  }
}
