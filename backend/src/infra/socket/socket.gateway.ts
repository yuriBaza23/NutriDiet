import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { NutriDietLogger } from '../common/NutriDietLogger';

@WebSocketGateway({ cors: true })
export class SocketGateway {
  logger = new NutriDietLogger();
  constructor() {
    this.logger.setContext('Socket');
  }

  @WebSocketServer()
  server: Server;

  handleConnection() {
    this.logger.log('New client connected');
  }
}
