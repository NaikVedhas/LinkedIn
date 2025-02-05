import { useMessageUserContext } from "../context/MessageUserContext";

const ChatHeader = ({ onlineUsers }) => {
  const messageContext = useMessageUserContext();
  const selectedUser = messageContext?.selectedUser;

  


  return (
    <div className="bg-gray-100 border-b flex items-center p-3 shadow-sm">
      <img
        src={selectedUser?.profilePicture || "./avatar.png"}
        alt="User Avatar"
        className="w-16 h-16 rounded-full object-cover  "
      />
      <div className="ml-3">
        <h1 className="text-lg font-semibold text-gray-800">{selectedUser?.name || "Select a User"}</h1>
        <p
          className={`text-sm ${
            onlineUsers.includes(selectedUser?._id) ? "text-green-500" : "text-red-500"
          }`}
        >
          {onlineUsers.includes(selectedUser?._id) ? "Online" : "Offline"}
        </p>
      </div>
    </div>
  );
};

export default ChatHeader;
