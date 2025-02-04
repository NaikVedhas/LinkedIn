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

  console.log(chats);
  

  return (
    <div className="flex flex-col  overflow-y-auto p-4 bg-white border rounded-lg shadow-md">
      {isLoading ? (
        <div className="flex justify-center items-center h-full text-gray-500">
          Loading messages...
        </div>
      ) : chats && chats.length > 0 ? (
        <div className="space-y-4">
          {chats.map((c, index) => {
            const isSentByUser = c.senderId === authUser?._id;
            return (
              <div
                key={index}
                className={`flex ${isSentByUser ? "justify-start" : "justify-end"}`}
              >
                <div
                  className={`max-w-xs p-3 rounded-lg shadow-md ${
                    isSentByUser ? "bg-gray-200 text-black" :"bg-blue-500 text-white"
                  }`}
                >
                  {c?.image && (
                    <img
                      src={c.image}
                      alt="Sent Image"
                      className="w-40 h-40 rounded-lg shadow-md mb-2"
                    />
                  )}
                  <p className="text-sm">{c.text}</p>
                  <p className="text-xs text-gray-300 mt-1 text-right">
                    {new Date(c.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            );
          })}
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
