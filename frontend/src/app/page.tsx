'use client'

import { Button } from '../components/ui/button';
import { useVideoCall } from '../hooks/useVideoCall';

export default function Home() {
  const { createRoom } = useVideoCall()

  function handleCreateRoom() {
    createRoom()
  }

  return (
    <main className='w-screen h-screen flex items-center justify-center'>
      <div>
        <Button onClick={handleCreateRoom}>Criar sala de atendimento</Button>
      </div>
    </main>
  )
}
