import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../lib/axios";
import { Loader } from "lucide-react";
import { useMessageUserContext } from "../context/MessageUserContext";

const MessageSidebar = ({onlineUsers}) => {
  const { data: authUser } = useQuery({ queryKey: ["authUser"] });

  const messageContext = useMessageUserContext();

  const { data: SidebarMessages, isLoading } = useQuery({
    queryKey: ["SidebarMessages", authUser],
    queryFn: async () => {
      const response = await axiosInstance.get("/messages/users");
      return response.data;
    },
  });

  console.log("sidebarmessage", SidebarMessages);

  const handleClick = (user) => {
    messageContext?.setSelectedUser(user); // Set the user
  };

  // useEffect(() => {
  //   console.log("Online users updated in Sidebar:", onlineUsers);
  // }, [onlineUsers]); // This ensures Sidebar updates whenever online users change
  

  return (
    <div className="w-72 bg-white border border-gray-300 p-4 rounded-lg shadow-lg ml-5 ">
      <h1 className="text-xl justify-center flex items-center font-semibold text-gray-800 mb-4">Message Them</h1>

      {isLoading ? (
        <div className="flex justify-center items-center h-20">
          <Loader size={25} className="animate-spin text-blue-500" />
        </div>
      ) : SidebarMessages?.length > 0 ? (
        <div className="space-y-3 overflow-y-auto max-h-[80vh]">
          {SidebarMessages.map((m) => (
            <button
              key={m._id}
              onClick={() => handleClick(m)}
              className={`flex items-center space-x-3 p-3 rounded-lg w-full border transition ${
                messageContext?.selectedUser?._id === m._id
                  ? "bg-gray-100 text-white" 
                  : "hover:bg-gray-100"
              }`}
            >
              <img
                src={m.profilePicture || "./avatar.png"}
                alt="Profile"
                className="w-10 h-10 rounded-full object-cover "
              />
              <div className="flex flex-col w-full">
                <h2 className="text-gray-700 font-medium">{m.name}</h2>
                <div
                  className={`text-sm mt-1 ${
                    onlineUsers.includes(m?._id)
                      ? "text-green-500"
                      : "text-red-500"
                  }`}
                >
                  {onlineUsers.includes(m?._id) ? "Online" : "Offline"}
                </div>
              </div>
            </button>
          ))}
        </div>
      ) : (
        <div className="text-gray-500 text-sm mt-4">
          <p>Please connect with users to message them.</p>
          <p>Your connections will appear here.</p>
        </div>
      )}
    </div>
  );
};

export default MessageSidebar;
