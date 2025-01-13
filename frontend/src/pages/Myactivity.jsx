import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../lib/axios";
import { useState } from "react";
import Sidebar from "../component/Sidebar";
import { ExternalLink, ThumbsUp,MessageSquare,ChevronDown, ChevronUp } from "lucide-react";
import { Link } from "react-router-dom";

const Myactivity = () => {
  const { data: authUser } = useQuery({ queryKey: ["authUser"] });

  const { data: likes } = useQuery({
    queryKey: ["likes", authUser._id],
    queryFn: async () => {
      const res = await axiosInstance("/posts/myActivity/like");
      return res.data;
    },
  });

  const { data: comments } = useQuery({
    queryKey: ["comments", authUser._id],
    queryFn: async () => {
      const res = await axiosInstance("/posts/myActivity/comment");
      return res.data;
    },
  });

  const { data: myProfileViewers } = useQuery({
    queryKey: ["myProfileViewers", authUser._id],
    queryFn: async () => {
      const res = await axiosInstance("/users/myActivity/profileViewers");
      return res.data;
    },
  });

  const [isLikesOpen, setIsLikesOpen] = useState(false);
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  const [isProfileViewersOpen, setIsProfileViewersOpen] = useState(false);

  console.log("likes");
  console.log(likes);
  console.log("comments");
  console.log(comments);
  console.log("myProfileViewers");
  console.log(myProfileViewers);


  // console.log(myComment);
  


  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <div className="col-span-1 lg:col-span-1">
        <Sidebar user={authUser} />
      </div>

      <div className="col-span-1 lg:col-span-3 space-y-8">
        {/* Likes Section */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-semibold text-gray-800">Likes</h1>
            <ThumbsUp className="text-blue-500" />
            <button
              onClick={() => setIsLikesOpen(!isLikesOpen)}
              className="text-gray-500 hover:text-gray-700 focus:outline-none"
            >
              {isLikesOpen ? <ChevronUp /> : <ChevronDown />}
            </button>
          </div>

          {isLikesOpen && (
            <div className="space-y-4">
              {likes?.map((l) => (
                <div
                  key={l._id}
                  className="p-4 border-b border-gray-200 bg-white rounded-lg hover:bg-gray-50 transition-colors"
                >
                

                  <Link
                    to={`/post/${l._id}`}
                    className="mt-4 p-4 bg-gray-50 rounded-md flex items-center space-x-2 hover:bg-gray-100 transition-colors"
                  >
                    {l.image && (
                      <img
                        src={l.image}
                        alt="Post preview"
                        className="w-12 h-12 object-cover rounded-md"
                      />
                    )}
                    <div className="flex-1 overflow-hidden">
                      <p className="text-sm text-gray-600 truncate">
                        {l.content}
                      </p>
                    </div>
                    <ExternalLink size={16} className="text-gray-400" />
                  </Link>
                  <Link
                    to={`/profile/${l.author.username}`}
                    className="flex items-center space-x-4"
                  >
                    <img
                      src={l.author.profilePicture || "/avatar.png"}
                      alt="Profile"
                      className="w-14 h-14 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-semibold text-gray-800">
                        {l.author.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        {l.author.headline}
                      </p>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          )}









        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-semibold text-gray-800"><MessageSquare className='text-green-500' /></h1>
            <button
              onClick={() => setIsCommentsOpen(!isCommentsOpen)}
              className="text-gray-500 hover:text-gray-700 focus:outline-none"
            >
              {isCommentsOpen ? <ChevronUp /> : <ChevronDown />}
            </button>
          </div>

          {isCommentsOpen && (
            <div className="space-y-4">
              {comments?.map((c) => (
                <div
                  key={c._id}
                  className="p-4 border-b border-gray-200 bg-white rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Link
                    to={`/post/${c._id}`}
                    className="mt-4 p-4 bg-gray-50 rounded-md flex items-center space-x-2 hover:bg-gray-100 transition-colors"
                  >
                    {c.image && (
                      <img
                        src={c.image}
                        alt="Post preview"
                        className="w-12 h-12 object-cover rounded-md"
                      />
                    )}
                    <div className="flex-1 overflow-hidden">
                      <p className="text-sm text-gray-600 truncate">
                        {c.content}
                      </p>
                    </div>
                    <ExternalLink size={16} className="text-gray-400" />
                  </Link>
                  <Link
                    to={`/profile/${c.author.username}`}
                    className="flex items-center space-x-4"
                  >
                    <img
                      src={c.author.profilePicture || "/avatar.png"}
                      alt="Profile"
                      className="w-14 h-14 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-semibold text-gray-800">
                        {c.author.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        {c.author.headline}
                      </p>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
        
























        {/* Profile Viewers Section */}
        <div className="bg-white p-4 rounded-md shadow-md">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-semibold">
              People Who Viewed My Profile
            </h1>
            <button
              onClick={() => setIsProfileViewersOpen(!isProfileViewersOpen)}
              className="text-gray-500 hover:text-gray-700"
            >
              {isProfileViewersOpen ? <ChevronUp /> : <ChevronDown />}
            </button>
          </div>
          {isProfileViewersOpen && (
            <div className="mt-4">
              {myProfileViewers?.map((p) => (
                <div
                  key={p._id}
                  className="mb-4 p-4 border-b border-gray-200 bg-white rounded-lg"
                >
                  <div className="flex items-center space-x-4">
                    <img
                      src={p.profilePicture}
                      alt="Profile"
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-semibold">{p.name}</p>
                      <p className="text-sm text-gray-600">{p.headline}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Myactivity;
