'use client'

import React, { useEffect, useRef } from 'react';

interface IVideoVisualizationProps {
  stream: MediaStream | null;
}

function VideoVisualization({ stream }: IVideoVisualizationProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  
  useEffect(() => {
    if(videoRef.current) videoRef.current.srcObject = stream
  }, [stream])

  return(
    <div className='h-96 bg-slate-200 flex items-center justify-center rounded'>
      <video ref={videoRef} autoPlay muted={true} className='w-full h-96 rounded'/>
    </div>
  );
}

export {VideoVisualization};