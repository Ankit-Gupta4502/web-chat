"use client";
import React, { useState, useRef, useEffect } from "react";
import { Input } from "../ui/input";
import { HiPaperAirplane, HiVideoCamera } from "react-icons/hi2";
import { useAuthContext } from "@/Context/AuthContext";
import { format } from "date-fns";
const ChatInterface = () => {
  const {
    activeUser,
    socket,
    connectedRoom,
    user,
    activeChat,
    setActiveChat,
    socketRoom,
    setMediaStream,
    setStartVideo,
    myPeer,
    peerId
  } = useAuthContext();
  const [message, setMessage] = useState("");
  const mainElm = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (mainElm.current) {
      const elm = mainElm.current;

      elm.scroll({
        behavior: "smooth",
        top: elm.scrollHeight,
      });
    }
  }, [mainElm, connectedRoom]);

  if (!Object.keys(activeUser).length) {
    return <div className="bg-white/80  h-full"></div>;
  }

  const sendMessage = async () => {
    socket.emit("message:send", {
      senderId: user.id,
      recieverId: activeUser.id,
      message,
      socketRoom: connectedRoom,
      reciverRoom: activeUser.email,
    });
    const messageData = {
      id: 1,
      senderId: user.id,
      recieverId: activeUser.id,
      message,
      socketRoom,
      isDeleted: false,
      createdAt: new Date(),
      sender: {
        id: user.id,
        name: "",
        email: "",
      },
      reciever: {
        id: activeUser.id,
        name: "",
        email: "",
      },
    };
    setActiveChat((prev) => [...prev, messageData]);
    setMessage("");
  };
  const handleVideoCall = () => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {      
        socket.emit("video:call", { id:peerId, roomName: connectedRoom });
        setMediaStream(stream);
      })
      .catch((err) => console.error(err));
    setStartVideo(true);
  };

  return (
    <div className="flex flex-col bg-white/80  h-full ">
      <div className="px-8 flex justify-between items-center bg-white">
        <div className="flex py-7   items-center space-x-3">
          <div className="w-12 h-12 text-white rounded-full bg-rose-600 grid place-items-center">
            {activeUser.name[0]}
          </div>
          <h4 className=" font-semibold ">{activeUser.name}</h4>
        </div>

        <div
          onClick={handleVideoCall}
          role="button"
          className="w-12 cursor-pointer h-12 grid place-items-center rounded-full bg-green-900 text-white"
        >
          <HiVideoCamera size={20} />
        </div>
      </div>

      <main
        ref={mainElm}
        className="relative    space-y-4 flex pt-6 pb-24 px-4 flex-col flex-1 overflow-y-scroll max-h-[600px]"
      >
        {activeChat.map((chat) => {
          return (
            <div
              key={chat.id}
              className={` bg-white px-4 py-1 shadow-md rounded-xl w-fit max-w-md text-sm font-medium ${
                chat.senderId === user.id ? "self-end" : ""
              } `}
            >
              {chat.message}
              <small className="block  text-stone-700 text-[.6rem] ">
                {format(new Date(chat.createdAt), "dd-MM-yyyy hh:mm a")}
              </small>
            </div>
          );
        })}
        <div className="fixed ml-[33%] bottom-4 px-4 left-0 right-0">
          <Input
            onKeyUp={(e) =>
              e.key === "Enter" && message.trim() && sendMessage()
            }
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className=" py-8"
            placeholder=" Enter message to send"
          />
          <div
            onClick={(e) => message.trim() && sendMessage()}
            className="absolute right-8 text-white bg-green-900 w-10 h-10 grid place-items-center rounded-full top-2/4 -translate-y-2/4 "
          >
            <HiPaperAirplane />
          </div>
        </div>
      </main>
    </div>
  );
};

export default ChatInterface;
