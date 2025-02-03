import { useMutation } from "@tanstack/react-query";
import { useRef, useState } from "react";
import { axiosInstance } from "../lib/axios";
import { useMessageUserContext } from "../context/MessageUserContext";
import toast from "react-hot-toast";
import { Send, Image, X } from "lucide-react";

const ChatPost = () => {
  const [text, setText] = useState("");
  const [image, setImage] = useState(null);
  const fileInputRef = useRef(null);

  const messagecontext = useMessageUserContext();
  const { mutate } = useMutation({
    mutationFn: async () => {
      await axiosInstance.post(`/messages/send/${messagecontext?.selectedUser?._id}`, { text: text.trim(), image: image });
    },
    onError: (e) => {
      toast.error(e.response.data.message || "Error sending message");
    }
  });

  const removeImage = () => {
    setImage(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file || !file.type.startsWith("image/")) {
      toast.error("Please select an image file only!");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim() && !image) return;
    toast.success("efbbyewfv")
    await mutate();
    setText("");
    setImage(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="p-3 bg-gray-100 rounded-lg border">
      {/* Image Preview */}
      {image && (
        <div className="relative w-24 h-24 mb-2">
          <img src={image} alt="Preview" className="w-full h-full rounded-md object-cover shadow-md" />
          <button
            onClick={removeImage}
            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* Chat Input Form */}
      <form onSubmit={handleSubmit} className="flex items-center space-x-2">
        {/* Textarea */}
        <input
          type="text"
          className="flex-1 p-2 h-10 bg-white border rounded-lg resize-none focus:ring-2 focus:ring-blue-300"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a message..."
        ></input>

        {/* Image Upload */}
        <label className="cursor-pointer hover:text-blue-500 transition">
          <Image size={24} />
          <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
        </label>

        {/* Send Button */}
        <button
          type="submit"
          disabled={!text && !image}
          className={`p-2 rounded-full transition ${!text && !image ? "text-gray-400 cursor-not-allowed" : "text-blue-500 hover:text-blue-700"}`}
        >
          <Send size={24} />
        </button>
      </form>
    </div>
  );
};

export default ChatPost;
