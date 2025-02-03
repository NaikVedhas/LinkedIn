import { useQuery } from "@tanstack/react-query";
import { useMessageUserContext } from "../context/MessageUserContext";
import { axiosInstance } from "../lib/axios";

const ChatHistory = () => {
  const messageContext = useMessageUserContext();
  const { data: authUser } = useQuery({ queryKey: ["authUser"] });

  const { data: chats, isLoading } = useQuery({
    queryKey: ["chats", messageContext?.selectedUser?._id],
    queryFn: async () => {
      const response = await axiosInstance.get(`/messages/${messageContext?.selectedUser?._id}`);
      return response.data;
    },
  });

  return (
    <div className="flex flex-col h-[60vh] overflow-y-auto p-4 bg-gray-50 rounded-lg shadow-inner">
      {isLoading ? (
        <div className="flex justify-center items-center h-full text-gray-500">
          Loading messages...
        </div>
      ) : chats && chats.length > 0 ? (
        <div className="space-y-4">
          {chats.map((c, index) => (
            <div
              key={index}
              className={`flex items-end ${
                c.senderId === authUser?._id ? "justify-start" : "justify-end"
              }`}
            >
              <div
                className={`max-w-xs p-3 rounded-lg shadow-md text-white ${
                  c.senderId === authUser?._id ? "bg-grayue-500" : "bg-sky-500"
                }`}
              >
                <p className="text-sm">{c.text}</p>
                <p className="text-xs text-gray-200 mt-1 text-right">
                  {new Date(c.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex justify-center items-center h-full text-gray-500">
          Start a conversation!
        </div>
      )}
    </div>
  );
};

export default ChatHistory;
