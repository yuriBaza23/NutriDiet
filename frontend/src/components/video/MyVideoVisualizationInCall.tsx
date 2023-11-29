'use client'

import React, { useEffect, useRef } from 'react';

interface IVideoVisualizationProps {
  stream: MediaStream | null;
}

function MyVideoVisualizationInCall({ stream }: IVideoVisualizationProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  
  useEffect(() => {
    if(videoRef.current) videoRef.current.srcObject = stream
  }, [stream])

  return(
    <div className='h-20 bg-slate-200 flex items-center justify-center rounded'>
      <video ref={videoRef} autoPlay muted={true} className='w-full h-12 rounded'/>
    </div>
  );
}

export {MyVideoVisualizationInCall};