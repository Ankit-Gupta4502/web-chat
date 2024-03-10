"use client";
import React, {
  SetStateAction,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { io } from "socket.io-client";
import type { Socket } from "socket.io-client";
import type { ChatRoom } from "@/components/Home/ChatSidebar";
import { getUserChats } from "@/components/Home/ChatSidebar";
import { useQuery, useQueryClient, useQueries } from "@tanstack/react-query";
import { toast } from "sonner";
import Peer, { type Peer as IPeer } from "peerjs";
export interface IUser {
  id: number;
  name: string;
  email: string;
  token: string;
  password: string;
  createdAt: string;
}
export interface IActiveUser {
  id: number;
  name: string;
  email: string;
}
interface IauthContext {
  user: IUser;
  setUser: React.Dispatch<SetStateAction<IUser>>;
  socket: Socket;
  connectedRoom: string;
  activeUser: IActiveUser;
  setActiveUser: React.Dispatch<SetStateAction<IActiveUser>>;
  setConnectedRoom: React.Dispatch<SetStateAction<string>>;
  activeChat: ChatRoom[];
  setActiveChat: React.Dispatch<SetStateAction<ChatRoom[]>>;
  socketRoom: number;
  setSocketRoom: React.Dispatch<SetStateAction<number>>;
  mediaStream: MediaStream | null;
  setMediaStream: React.Dispatch<SetStateAction<MediaStream | null>>;
  startVideo: boolean;
  setStartVideo: React.Dispatch<SetStateAction<boolean>>;
  myPeer: IPeer;
  setPeerVideos: React.Dispatch<SetStateAction<MediaStream[]>>;
  peerId: string;
  peerVideos: MediaStream[];
  setCallEnded: React.Dispatch<SetStateAction<boolean>>;
}
const Context = createContext<IauthContext>({} as IauthContext);
const getUserFromLocalStorage = (): IUser | {} => {
  if (typeof window !== "undefined") {
    const userJson = localStorage.getItem("user");
    if (userJson) {
      const user = JSON.parse(userJson) as IUser;
      return user;
    } else {
      return {};
    }
  } else {
    return {};
  }
};

const AuthContext = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<IUser>(getUserFromLocalStorage() as IUser);
  const [socket, setSocket] = useState<Socket>({} as Socket);
  const [connectedRoom, setConnectedRoom] = useState("");
  const [activeUser, setActiveUser] = useState<IActiveUser>({} as IActiveUser);
  const [activeChat, setActiveChat] = useState<ChatRoom[]>([] as ChatRoom[]);
  const [socketRoom, setSocketRoom] = useState<number>(0);
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
  const [startVideo, setStartVideo] = useState(false);
  const [myPeer, setMyPeer] = useState({} as IPeer);
  const [peerVideos, setPeerVideos] = useState<MediaStream[]>([]);
  const [peerId, setPeerId] = useState("");
  const [callEnded, setCallEnded] = useState(false);
  const query = useQueryClient();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const socket = io("http://localhost:8080/");
      const peer = new Peer();
      setMyPeer(peer);
      setSocket(socket);
      peer.on("open", (id) => {
        setPeerId(id);
      });
    }
  }, []);
  useEffect(() => {
    if (Object.keys(socket).length) {
      socket.emit("join", user.email);
      socket.on("recieve:private:message", (user) => {
        setActiveChat((prev) => [...prev, user]);
        toast(`New message`);
      });
      socket.on("incoming:messgae", (roomName: string) => {
        setConnectedRoom(roomName);
        query.fetchQuery({
          queryKey: ["connectedUsers"],
        });
        socket.emit("join", roomName);
      });
      socket.on(
        "incoming:videocall",
        ({ roomName, id }: { roomName: string; id: string }) => {
          setStartVideo(true);
          navigator.mediaDevices
            .getUserMedia({ video: true, audio: true })
            .then((stream) => {
              const call = myPeer.call(id, stream);
              call.on("stream", (userStream) => {
                setPeerVideos((prev) => [...prev, userStream]);
              });
              setMediaStream(stream);
            })
            .catch((err) => console.error(err));
        }
      );
    }
  }, [user, socket, query, mediaStream, myPeer]);

  useEffect(() => {
    if (mediaStream) {
      myPeer.on("call", (call) => {
        call.answer(mediaStream);
        call.on("stream", (stream) => {
          setPeerVideos((prev) => [...prev, stream]);
        });
        if (callEnded) {
          call.close();
          setMediaStream(null)
          setPeerVideos([])
          mediaStream.getTracks().forEach((track)=>track.stop())
        }
      });
    }
  }, [myPeer, mediaStream, callEnded]);

  return (
    <Context.Provider
      value={{
        user,
        setUser,
        socket,
        connectedRoom,
        activeUser,
        setActiveUser,
        setConnectedRoom,
        activeChat,
        setActiveChat,
        socketRoom,
        setSocketRoom,
        mediaStream,
        setMediaStream,
        startVideo,
        setStartVideo,
        myPeer,
        setPeerVideos,
        peerId,
        peerVideos,
        setCallEnded,
      }}
    >
      {" "}
      {children}{" "}
    </Context.Provider>
  );
};

export const useAuthContext = () => {
  return useContext(Context);
};

export default AuthContext;
