"use client";
import { useAuthContext } from "@/Context/AuthContext";
import React, { useEffect, useRef } from "react";
import VideoParticipant from "./VideoParticipant";

const VideoInterFace = () => {
  const { mediaStream, startVideo, setStartVideo, peerVideos,setCallEnded } =
    useAuthContext();
  const video = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (video.current && mediaStream) {
      video.current.srcObject = mediaStream;
      video.current.play();
      video.current.muted;
    }
  }, [mediaStream, video]);

  const cancelStream = () => {
    video.current?.pause();
    mediaStream?.getTracks().forEach((track) => track.stop());
    setStartVideo(false);
    setCallEnded(false)
  };

  return (
    <div
      className={`fixed z-50 inset-0 ${
        mediaStream && startVideo ? "scale-100" : "scale-0"
      }   duration-300 transition-all  grid grid-cols-2  `}
    >
      <video
        src=""
        className=" relative z-10 w-full h-full object-cover "
        ref={video}
      ></video>
      {peerVideos.map((item, ind) => {
        return <VideoParticipant key={ind} video={item} />;
      })}
      <button
        onClick={cancelStream}
        className=" z-[60] rounded-full  w-12 h-12 grid place-items-center  absolute  left-2/4 -translate-x-2/4 bottom-9  bg-rose-500 text-white  "
      >
        End{" "}
      </button>
    </div>
  );
};

export default VideoInterFace;
