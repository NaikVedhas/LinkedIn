import { useMessageUserContext } from "../context/MessageUserContext"

const ChatHeader = () => {
  
  const messageContext = useMessageUserContext();

  
  return (
    <div>ChatHeader</div>
  )
}
export default ChatHeader