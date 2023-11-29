import { Megaphone, UserPlus, UtensilsCrossed } from 'lucide-react';
import React from 'react';
import { Button } from '../ui/button';

interface ICallInformationHeaderProps {
  roomName: string;
}

function CallInformationHeader({ roomName }: ICallInformationHeaderProps) {
  return(
    <div className='absolute bg-slate-200 flex flex-col md:flex-row top-0 px-5 w-full justify-between items-center p-2 text-slate-600'>
      <div className='flex gap-2'>
        <Megaphone/>
        <h1>Sala: {roomName}</h1>
      </div>
      <div className='flex gap-2'>
        <Button variant='ghost' className='gap-2'>
          <UserPlus/>
          Convidar participante
        </Button>
        <Button variant='ghost' className='gap-2'>
          <UtensilsCrossed/>
          Abrir cardápio
        </Button>
      </div>
    </div>
  );
}

export {CallInformationHeader};