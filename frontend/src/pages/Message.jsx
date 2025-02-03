import MessageSidebar from "../component/MessageSidebar"
import ChatHistory from "../component/ChatHistory"
import ChatHeader from "../component/ChatHeader"
import ChatPost from "../component/ChatPost"
import { useMessageUserContext } from "../context/MessageUserContext"

const Message = () => {
  
  const messageContext = useMessageUserContext();
  console.log(messageContext.selectedUser);
  
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <div className="lg:col-span-1">
      <MessageSidebar/>
      </div>
      <div className="bg-white m-2   border rounded-lg p-2">
        {messageContext?.selectedUser ? messageContext?.selectedUser.name : "Select a person to chat with"}
        
      <div>
        <ChatHeader />
        <ChatHistory />
        <ChatPost />
      </div>
      </div>

    </div>
  )
}
export default Message