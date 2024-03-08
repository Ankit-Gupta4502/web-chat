"use client"
import React, { useEffect, useState } from 'react'
import { Input } from '../ui/input'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { IUser, useAuthContext } from '@/Context/AuthContext'
import useDebounce from '@/hooks/useDebounce'



export interface IconnectedUser {
    id: number;
    socketId: string;
    senderId: number;
    recieverId: number;
    createdAt: Date;
    sender: Reciever;
    reciever: Reciever;
}

export interface Reciever {
    id: number;
    name: string;
    email: string;
}




export interface ISocketChat {
    id: number;
    socketId: string;
    senderId: number;
    recieverId: number;
    createdAt: Date;
    sender: DataReciever;
    reciever: DataReciever;
    chatRooms: ChatRoom[];
}

export interface ChatRoom {
    id: number;
    senderId: number;
    recieverId: number;
    message: string;
    socketRoom: number;
    isDeleted: boolean;
    createdAt: Date;
    sender: ChatRoomReciever;
    reciever: ChatRoomReciever;
}

export interface ChatRoomReciever {
    id: number;
    name: string;
}

export interface DataReciever {
    id: number;
    name: string;
    email: string;
    password: string;
    createdAt: Date;
}

export const getUserChats = async (id: number): Promise<ISocketChat> => {
    try {
        const { data } = await axios(`/api/user/get-users-chat`, {
            params: {
                roomId: id
            }
        })
        return data.data
    } catch (error) {
        console.error(error);
        return {} as ISocketChat
    }


}


const ChatSidebar = () => {
    const [search, setSearch] = useState("")
    const debounced = useDebounce(search)
    const [show, setShow] = useState(false)
    const { user, socket, setActiveUser, setConnectedRoom,setActiveChat,setSocketRoom } = useAuthContext()
    const getUser = async (): Promise<IUser[]> => {
        const { data } = await axios(`/api/user/get-users`, { params: { name: debounced } })
        return data.data as IUser[]
    }
    const getConnectedUsers = async (): Promise<IconnectedUser[]> => {
        const { data } = await axios(`/api/user/connected-users`)
        return data.data as IconnectedUser[]
    }


    const { data } = useQuery<IUser[]>({
        queryKey: ["getUsers", debounced],
        queryFn: getUser,
    })

    const { data: connectedUsers } = useQuery({
        queryKey: ["connectedUsers"],
        queryFn: getConnectedUsers
    })



    const handleChat = (otherUser: IUser) => {
        socket.emit("private:chat", { roomName: otherUser.email, userEmail: otherUser.email, senderId: user.id, recieverId: otherUser.id })
        setActiveUser({ id: otherUser.id, name: otherUser.name, email: otherUser.email })
        setShow(false)
        setSearch("")
        setConnectedRoom(otherUser.email)
        setActiveChat([])
    }

    const openExistingChat = async (roomName: string, userEmail: string, id: number) => {
        socket.emit("private:chat", { roomName, userEmail })
        const data = await getUserChats(id)
        const reciver = data.senderId === user.id ? data.reciever : data.sender
        setActiveUser(reciver)
        setConnectedRoom(roomName)
        setSocketRoom(data.id)
        setActiveChat(data.chatRooms)
    }

    useEffect((() => {
        if (data?.length) {
            setShow(true)
        }
    }), [data?.length])


    return (
        <>
            <div className=' flex relative  z-10 py-6 px-2  bg-green-900  ' >
                <Input value={search} onChange={((e) => setSearch(e.target.value))} placeholder='enter user name or email to chat ' className='focus:outline-0 h-14 ' />
                {(!!data?.length && show) && <div className="absolute bg-white p-5 left-0 top-24 z-20 right-0 shadow-2xl ">
                    {
                        data?.map((user) => {
                            return <div onClick={() => handleChat(user)} className=' cursor-pointer items-center flex space-x-4 py-4 border-b ' key={user.id}>
                                <div className="w-12 flex-shrink-0 font-medium h-12 text-white bg-rose-600 rounded-full flex items-center justify-center">
                                    {user.name[0]}
                                </div>
                                <div>
                                    <span>
                                        {user.name}
                                    </span>
                                    <small className=' block' >
                                        {user.email}
                                    </small>
                                </div>

                            </div>
                        })
                    }
                </div>}

            </div>

            <div className='  px-4  ' >
                {
                    connectedUsers?.map((connectedUser) => {
                        const otherUser = connectedUser.senderId === user.id ? connectedUser.reciever : connectedUser.sender
                        return <div onClick={() => openExistingChat(connectedUser.socketId, otherUser.email, connectedUser.id)}
                            className=' cursor-pointer items-center flex space-x-4 py-4 border-b ' key={connectedUser.id}>
                            <div className="w-10 flex-shrink-0 font-medium h-10 text-white bg-rose-600 rounded-full flex items-center justify-center">
                                {otherUser.name[0]}
                            </div>
                            <div>
                                <span>
                                    {otherUser.name}
                                </span>
                                <small className=' block' >
                                    {otherUser.email}
                                </small>
                            </div>
                        </div>
                    })
                }

            </div>

        </>
    )
}

export default ChatSidebar