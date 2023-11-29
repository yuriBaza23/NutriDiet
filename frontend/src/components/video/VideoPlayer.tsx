'use client'

import React, { useEffect, useRef } from 'react';

interface IVideoPlayerProps {
  stream: MediaStream | null;
}

function VideoPlayer({ stream }: IVideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  
  useEffect(() => {
    if(videoRef.current) videoRef.current.srcObject = stream
  }, [stream])

  return(
    <div className='flex items-center justify-center rounded-lg'>
      <video ref={videoRef} autoPlay muted={true} className='w-[90%] h-full lg:w-full rounded-lg'/>
    </div>
  );
}

export {VideoPlayer};