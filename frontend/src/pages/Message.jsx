import MessageSidebar from "../component/MessageSidebar"
import { useMessageUserContext } from "../context/MessageUserContext"


const Message = () => {
  
  const messageContext = useMessageUserContext();
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <div className="lg:col-span-1">
      <MessageSidebar/>
      </div>
      <div>
        {messageContext.selectedUser}
      </div>
    

    </div>
  )
}
export default Message