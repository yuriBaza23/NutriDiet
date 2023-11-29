import { useContext } from "react"
import { VideoCallContext } from "../contexts/VideoCallContext"

export const useVideoCall = () => {
  return useContext(VideoCallContext)
}