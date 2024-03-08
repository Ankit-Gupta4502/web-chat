import React from 'react'
import ChatSidebar from './ChatSidebar'

const ChatLayout = ({ children }: { children?: React.ReactNode }) => {
  return (
    <div className=' relative grid grid-cols-12 h-screen ' >
      <div className=' col-span-4  ' >
        <ChatSidebar />
      </div>
      <div className="col-span-8 absolute w-full h-full bg-primary/50 col-start-5">
        {children}
      </div>

    </div>
  )
}

export default ChatLayout