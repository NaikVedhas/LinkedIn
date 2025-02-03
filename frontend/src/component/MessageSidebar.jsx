import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../lib/axios";
import { Loader } from "lucide-react";

const MessageSidebar = () => {
  const { data: authUser } = useQuery({ queryKey: ["authUser"] });

  const { data: SidebarMessages, isLoading } = useQuery({
    queryKey: ["SidebarMessages", authUser],
    queryFn: async () => {
      const response = await axiosInstance.get("/messages/users");
      return response.data;
    },
  });


  const onlineUsers = [];      
  
  console.log("sidebarmessage", SidebarMessages);

  return (
    <div className="w-72 bg-white border-r border-gray-300 h-screen p-4">
      <h1 className="text-xl font-semibold text-gray-800 mb-4">Message Them</h1>

      {isLoading ? (
        <div className="flex justify-center items-center h-20">
          <Loader size={25} className="animate-spin text-blue-500" />
        </div>
      ) : SidebarMessages?.length > 0 ? (
        <div className="space-y-3 overflow-y-auto max-h-[80vh]">
          {SidebarMessages.map((m) => (
            <div
              key={m._id}
              className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 transition"
            >
              <img
                src={m.profilePicture || "./avatar.png"}
                alt="Profile"
                className="w-10 h-10 rounded-full object-cover border border-gray-300"
              />
              <h2 className="text-gray-700 font-medium">{m.name}</h2>
            </div>
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
