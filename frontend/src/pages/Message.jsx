import MessageSidebar from "../component/MessageSidebar";
import ChatHistory from "../component/ChatHistory";
import ChatHeader from "../component/ChatHeader";
import ChatPost from "../component/ChatPost";
import { useMessageUserContext } from "../context/MessageUserContext";
import { useSockeetIoContext } from "../context/SocketIoContext";
import { useEffect } from "react";

const Message = () => {
  const messageContext = useMessageUserContext();
  console.log("messageContext.selectedUser",messageContext.selectedUser);
  const socketContext = useSockeetIoContext();
  
  
  //Get Online Users
  useEffect(() => {
    
    if (socketContext?.socket) {
      socketContext?.socket.on("getOnlineUsers", (data) => {
        console.log("data", data);
        socketContext?.setOnlineUsers(data);
        console.log("onlineUsers", socketContext?.onlineUsers);
      });
    }
    return () => {
      // Clean up the event listener when the component unmounts
      if (socketContext?.socket) {
        socketContext?.socket.off("getOnlineUsers");
      }
    };
  }, [socketContext?.socket]); // Dependency on socket
  
  return (
    <div className="flex h-screen p-2">
      {/* Sidebar */}
      <div className="w-80">
        <MessageSidebar onlineUsers={socketContext?.onlineUsers} />
      </div>

      {/* Chat Section */}
      <div className="flex flex-col  flex-grow bg-white border border-gray-300 rounded-lg p-4 ml-2 shadow-lg">
        {messageContext?.selectedUser ? (
          <>
            <ChatHeader onlineUsers={socketContext?.onlineUsers} />
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
