'use client'

import React from 'react';
import { Button } from '../ui/button';
import { Participants } from '../../contexts/VideoCallContext';

interface IVideoRoomInformationsProps {
  roomId: string;
  iAmInCall: boolean;
  participants: Participants[];
  peer: any;
  joinRoom: (room: string, peerId: string) => void;
}

function VideoRoomInformations({ roomId, iAmInCall, participants, peer, joinRoom }: IVideoRoomInformationsProps) {
  return(
    <div className='w-1/3 p-10 flex flex-col gap-10'>
      <div>
        <h1 className='text-3xl font-semibold'>Atendimento nutricional</h1>
        <p className='text-gray-400 text-sm'>Sala: {roomId}</p>
      </div>

      { !iAmInCall && <Button onClick={() => joinRoom(roomId, peer._id)}>Entrar na sala</Button> }
      { iAmInCall && <h1>Em atendimento</h1> }
      
      <div>
        <h1 className='text-md font-semibold'>Participantes</h1>
        <div className='flex flex-col gap-2'>
          {participants.map((participant, index) => (
            <p key={index}>{participant.peerId}</p>
          ))}
          {!participants.length && <p>Só há você aqui</p>}
        </div>
      </div>
    </div>
  );
}

export {VideoRoomInformations};