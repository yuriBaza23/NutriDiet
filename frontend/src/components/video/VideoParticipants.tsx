import React from 'react';
import { Participants } from '../../contexts/VideoCallContext';
import { PeerState } from '../../lib/peerReducer';
import { VideoPlayer } from './VideoPlayer';

interface IVideoParticipantsProps {
  participants: Participants[];
  peers: any;
}

function VideoParticipants({
  participants,
  peers
}: IVideoParticipantsProps) {
  if(Object.values(peers as PeerState).length === 0) return(
    <div/>
  )

  if(Object.values(peers as PeerState).length === 1) return(
    <div/>
  )

  if(Object.values(peers as PeerState).length === 2) return(
    <div className='h-screen w-full flex flex-col lg:flex-row items-center justify-center gap-10'>
      {Object.values(peers as PeerState).map((peer) => {
        return(
          <VideoPlayer key={peer.stream.id} stream={peer.stream}/>
        )
      })}
    </div>
  )

  return(
    <div/>
  );
}

export {VideoParticipants};