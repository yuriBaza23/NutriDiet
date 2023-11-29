import React from 'react';
import { Button } from '../ui/button';
import { Headphones, Mic, PhoneOff, Users, Video } from 'lucide-react';
import { MyVideoVisualizationInCall } from './MyVideoVisualizationInCall';

interface IVideoControlsProps {
  stream: MediaStream | null;
}

function VideoControls({ stream }: IVideoControlsProps) {
  return(
    <div className='absolute bg-slate-200 flex h-24 bottom-0 px-5 w-full p-2 text-slate-600 items-center justify-between'>
      <MyVideoVisualizationInCall stream={stream} />

      <div className='flex gap-2'>
        <Button>
          <Mic/>
        </Button>

        <Button>
          <Video/>
        </Button>

        <Button>
          <Headphones/>
        </Button>

        <Button variant='destructive'>
          <PhoneOff/>
        </Button>
      </div>

      <div>
        <Button variant='ghost'>
          <Users/>
        </Button>
      </div>
    </div>
  );
}

export {VideoControls};