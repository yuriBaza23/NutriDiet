import { NutriDietLogger } from '../common/NutriDietLogger';
import { IRoom } from '../interfaces/IRoom';
import { createUUID } from '../utils/createUUID';

interface Participants {
  peerId: string;
  socketId: string;
}

const rooms: Record<string, Participants[]> = {};

export const roomHandler = (
  socket: IRoom['socket'],
  logger: NutriDietLogger,
) => {
  const joinRoom = (roomId: string, peerId: string) => {
    if (rooms[roomId]) {
      socket.join(roomId);
      rooms[roomId].push({
        peerId,
        socketId: socket.id,
      });
      logger.log(`Client joined room ${roomId} with peerId ${peerId}`);
      socket.emit('getParticipants', { roomId, participants: rooms[roomId] });
      socket.to(roomId).emit('newParticipant', {
        peerId,
        socketId: socket.id,
      });
    } else {
      socket.emit('roomNotFound');
      createRoom(roomId);
    }
  };

  const createRoom = (id?: string) => {
    const roomId = id || createUUID();
    rooms[roomId] = [];
    socket.emit('roomCreated', roomId);
    logger.log(`Client created room ${roomId}`);
  };

  const leaveRoom = () => {
    const getAllRooms = Object.keys(rooms);
    getAllRooms?.map((room) => {
      const getTheParticipant = rooms[room].filter(
        (participant) => participant.socketId === socket.id,
      );
      const getParticipants = rooms[room].filter(
        (participant) => participant.socketId !== socket.id,
      );

      if (getTheParticipant.length > 0) {
        rooms[room] = getParticipants;
        socket.leave(room);
        logger.log(
          `Client left room ${room} with peerId ${getTheParticipant[0].peerId}`,
        );
        socket.to(room).emit('participantLeft', getTheParticipant[0].peerId);
      }
    });
  };

  const getParticipants = (roomId: string) => {
    socket.emit('getParticipants', { roomId, participants: rooms[roomId] });
  };

  socket.on('joinRoom', joinRoom);
  socket.on('createRoom', createRoom);
  socket.on('disconnect', leaveRoom);
  socket.on('getParticipants', getParticipants);
};
