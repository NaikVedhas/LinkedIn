import MessageSidebar from "../component/MessageSidebar";
import ChatHistory from "../component/ChatHistory";
import ChatHeader from "../component/ChatHeader";
import ChatPost from "../component/ChatPost";
import { useMessageUserContext } from "../context/MessageUserContext";
import { useState,useEffect } from "react";
import { useSockeetIoContext } from "../context/SocketIoContext";

const Message = () => {
  const messageContext = useMessageUserContext();
  console.log("messageContext.selectedUser",messageContext.selectedUser);
  const [onlineUsers,setOnlineUsers] = useState([]);
  const socket = useSockeetIoContext();
  
  console.log("in message");
  console.log("socketbro",socket?.socket);
  

  return (
    <div className="flex h-screen p-2">
      {/* Sidebar */}
      <div className="w-80">
        <MessageSidebar onlineUsers={onlineUsers} />
      </div>

      {/* Chat Section */}
      <div className="flex flex-col  flex-grow bg-white border border-gray-300 rounded-lg p-4 ml-2 shadow-lg">
        {messageContext?.selectedUser ? (
          <>
            <ChatHeader onlineUsers={onlineUsers} />
            <div className="flex flex-col flex-grow overflow-hidden">
              <ChatHistory />
            </div>
            <ChatPost />
          </>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500 text-5xl">
            Select a person to chat with
          </div>
        )}
      </div>
    </div>
  );
};

export default Message;
