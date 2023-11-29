import { Socket } from 'socket.io';
import { NutriDietLogger } from '../common/NutriDietLogger';

export interface IRoom {
  socket: Socket;
  logger?: NutriDietLogger;
}

export type IRoomHandlerConstructor = Omit<IRoom, 'socket'>;
