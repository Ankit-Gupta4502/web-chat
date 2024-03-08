"use client"
import React,{memo, useEffect, useRef} from 'react'

const VideoParticipant = ({video}:{video:MediaStream}) => {
    const videoRef = useRef<HTMLVideoElement|null>(null)
    useEffect(()=>{
        if (videoRef.current && video) {
            videoRef.current.srcObject = video
            videoRef.current.play()
        }
    },[video,videoRef])
  return (
    <video className='relative z-10 w-full h-full object-cover' ref={videoRef}></video>
  )
}

export default memo(VideoParticipant)