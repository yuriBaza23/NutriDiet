'use client'

import { VideoVisualization } from "../../../components/video/VideoVisualization";
import { VideoRoomInformations } from "../../../components/video/VideoRoomInformations";
import { useEffect, useState } from "react";
import { useVideoCall } from "../../../hooks/useVideoCall";
import { MyVideoVisualizationInCall } from "../../../components/video/MyVideoVisualizationInCall";
import { VideoParticipants } from "../../../components/video/VideoParticipants";
import { CallInformationHeader } from "../../../components/video/CallInformationHeader";
import { VideoControls } from "../../../components/video/VideoControls";

interface Params {
  params: {
    id: string;
  };
}

export default function Room(params: Params) {
  const { joinRoom, peer, getParticipants, iAmInCall, participants, stream, peers } = useVideoCall()
  const [roomId, setRoomId] = useState<string>('')
  
  useEffect(() => {
    setRoomId(params.params.id)
    getParticipants(params.params.id)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.params.id, peer])

  return (
    <main className={`w-screen h-screen flex flex-col items-center justify-center p-10`}>
      { iAmInCall ? (
        <>
          <CallInformationHeader roomName={roomId} />
          <VideoParticipants 
            participants={participants} 
            peers={peers}
          />
          <VideoControls stream={stream} />
        </>
      ) : (
        <div className='flex w-full gap-10 p-32 items-center justify-center'>
          <VideoVisualization
            stream={stream}
          />
          <VideoRoomInformations 
            roomId={roomId}
            iAmInCall={iAmInCall}
            participants={participants}
            peer={peer}
            joinRoom={joinRoom}
          />
        </div>
      ) }
    </main>
  )
}
