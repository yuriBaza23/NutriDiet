'use client'

import { useRouter } from 'next/navigation';
import { createContext, useEffect, useReducer, useState } from 'react';
import Socket from 'socket.io-client';
import { v4 as uuid } from 'uuid';
import { peersReducer } from '../lib/peerReducer';
import { addPeerAction, removePeerAction } from '../lib/peerActions';

type VideoCallContextType = {
  children: React.ReactNode;
}

type VideoCallContextValues = {
  socket: any;
  peer: any | undefined;
  iAmInCall: boolean;
  participants: Participants[];
  stream: MediaStream | null;
  peers: any;
  createRoom: () => void;
  joinRoom: (room: string, peerId: string) => void;
  getParticipants: (room: string) => void;
}

export interface Participants {
  peerId: string;
  socketId: string;
}

type VideoCallReturnParticipants = {
  roomId: string;
  participants: Participants[];
}

const webSocketUrl = 'http://localhost:3333'
const webSocket = Socket(webSocketUrl);

const defaultValues: VideoCallContextValues = {
  socket: webSocket,
  peer: undefined,
  iAmInCall: false,
  participants: [],
  stream: null,
  peers: {},
  createRoom: () => {},
  joinRoom: (_: string) => {},
  getParticipants: (_: string) => {},
}

export const VideoCallContext = createContext<VideoCallContextValues>(defaultValues);

export const VideoCallProvider = ({ children }: VideoCallContextType) => {
  const [myPeer, setMyPeer] = useState<any>()
  const [iAmInCall, setIAmInCall] = useState<boolean>(false)
  const [participants, setParticipants] = useState<Participants[]>([])
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [peers, dispatch] = useReducer(peersReducer, {})
  const history = useRouter()

  // useEffect to get the peerId and the stream
  useEffect(() => {
    import("peerjs").then(({ default: Peer }) => {
      const myId = uuid()
      const peer = new Peer(myId)
      setMyPeer(peer)

      try {
        navigator.mediaDevices.getUserMedia({ video: true, audio: true })
          .then((stream) => {
            setStream(stream)
          })
          .catch((err) => {
            console.log(err)
          })
      } catch (err) {
        console.log(err)
      }
    })
  }, [])

  // useEffect to listen to the socket events
  useEffect(() => {
    webSocket.on('connect', () => {})
    webSocket.on('roomCreated', (room: string) => {
      history.push(`/room/${room}`)
    })
    webSocket.on('getParticipants', (participants: VideoCallReturnParticipants) => {
      if(myPeer && participants.participants) {
        setParticipants(participants.participants)
        const index = participants.participants.findIndex((participant) => participant.peerId === myPeer._id)
        if(index >= 0) {
          setIAmInCall(true)
        }
      }
    })
    webSocket.on('participantLeft', (peerId: string) => {
      setParticipants((prev) => prev.filter((p) => p.peerId !== peerId))
      dispatch(removePeerAction(peerId))
    })
    webSocket.on('newParticipant', (participant: Participants) => {
      setParticipants((prev) => [...prev, participant])
    })
  }, [history, myPeer, iAmInCall, participants])

  // useEffect to listen to the peer events
  useEffect(() => {
    if(!myPeer) return;
    if(!stream) return;

    webSocket.on('newParticipant', (participant: Participants) => {
      const call = myPeer.call(participant.peerId, stream);
      call.on('stream', (peerStream: MediaStream) => {
        dispatch(addPeerAction(participant.peerId, peerStream))
      })
    })

    myPeer.on('call', (call: any) => {
      call.answer(stream)
      call.on('stream', (peerStream: MediaStream) => {
        dispatch(addPeerAction(call.peer, peerStream))
      })
    })
  }, [myPeer, stream])

  function getParticipants(room: string) {
    webSocket.emit('getParticipants', room)
  }

  function createRoom() {
    webSocket.emit('createRoom')
  }

  function joinRoom(room: string, myPeer: string) {
    webSocket.emit('joinRoom', room, myPeer)
  }

  return (
    <VideoCallContext.Provider value={{
      socket: webSocket,
      peer: myPeer,
      iAmInCall,
      participants,
      stream,
      peers,
      createRoom,
      joinRoom,
      getParticipants
    }}>
      {children}
    </VideoCallContext.Provider>
  );
};