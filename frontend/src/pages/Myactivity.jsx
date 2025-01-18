import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../lib/axios";
import { useState } from "react";
import Sidebar from "../component/Sidebar";
import {
  ExternalLink,
  ThumbsUp,
  MessageSquare,
  ChevronDown,
  ChevronUp,
  Shield,
} from "lucide-react";
import { Link } from "react-router-dom";

const Myactivity = () => {
  const { data: authUser } = useQuery({ queryKey: ["authUser"] });

  const { data: likes } = useQuery({
    queryKey: ["likes", authUser?._id],
    queryFn: async () => {
      const res = await axiosInstance.get("/posts/myActivity/like");
      return res.data;
    },
  });

  const { data: comments } = useQuery({
    queryKey: ["comments", authUser?._id],
    queryFn: async () => {
      const res = await axiosInstance.get("/posts/myActivity/comment");
      return res.data;
    },
  });

  const { data: myProfileViewers } = useQuery({
    queryKey: ["myProfileViewers", authUser?._id],
    queryFn: async () => {
      const res = await axiosInstance.get("/users/myActivity/profileViewers");
      return res.data;
    },
  });

  const [isLikesOpen, setIsLikesOpen] = useState(false);
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  const [isProfileViewersOpen, setIsProfileViewersOpen] = useState(false);


  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 bg-gray-100 ">
      {/* Sidebar */}
      <div className="hidden lg:block lg:col-span-1">
        <Sidebar user={authUser} />
      </div>

      {/* Main Content */}
      <div className="col-span-1 lg:col-span-3 bg-white p-6 rounded-lg" >
        <h1 className="text-2xl font-bold mb-6">My Activity</h1>

        {/* Likes Section */}
        <div className="p-6 rounded-lg shadow-md mb-6">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center space-x-2">
              <ThumbsUp className="text-blue-500" />
              <h2 className="text-2xl font-semibold text-gray-800">Likes</h2>
            </div>
            <button
              onClick={() => setIsLikesOpen(!isLikesOpen)}
              className="text-gray-500 hover:text-gray-700"
            >
              {isLikesOpen ? <ChevronUp /> : <ChevronDown />}
            </button>
          </div>

          {isLikesOpen && (
            <div className="space-y-4">
              {likes && likes?.length > 0 ? (
                <ul>
                  {likes?.map((l) => (
                    <div
                      key={l._id}
                      className="p-4 my-3 border border-gray-200 bg-gray-50 rounded-lg hover:bg-gray-50"
                    >
                      <Link
                        to={`/posts/${l?._id}`}
                        className="flex items-center space-x-4"
                      >
                        {l?.image && (
                          <img
                            src={l?.image}
                            alt="Post"
                            className="w-16 h-16 object-cover rounded-md" 
                          />
                        )}
                        <div className="flex-1">
                          <p className="text-lg text-gray-600 truncate">
                            {" "}
                            {l?.content}
                          </p>
                        </div>
                        <ExternalLink size={16} className="text-gray-400" />
                      </Link>
                    </div>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-600">Like posts to see them here.</p>
              )}
            </div>
          )}
        </div>

        {/* Comments Section */}
        <div className="p-6 rounded-lg shadow-md mb-6">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center space-x-2">
              <MessageSquare className="text-green-500" />
              <h2 className="text-2xl font-semibold text-gray-800">Comments</h2>
            </div>
            <button
              onClick={() => setIsCommentsOpen(!isCommentsOpen)}
              className="text-gray-500 hover:text-gray-700"
            >
              {isCommentsOpen ? <ChevronUp /> : <ChevronDown />}
            </button>
          </div>

          {isCommentsOpen && (
            <div className="space-y-4">
              {comments && comments?.length > 0 ? (
                <ul>
                  {comments?.map((c) => (
                    <div
                      key={c?._id}
                      className="p-4 my-3 border border-gray-300 bg-gray-100 rounded-lg" // Added gray border
                    >
                      <div className="relative mb-4 space-y-3">
                        <h1>Your Comments:</h1>
                        {c?.comments
                          ?.filter((ce) => ce.user === authUser?._id) // Filter comments by logged-in user
                          .map((userComment) => (
                            <div
                              key={userComment?._id}
                              className="p-2 bg-white rounded-lg flex items-start space-x-3"
                            >
                              <p className="text-sm font-semibold text-gray-700">
                                {userComment?.content}
                              </p>{" "}
                            </div>
                          ))}
                      </div>

                      <Link
                        to={`/posts/${c?._id}`}
                        className="flex items-center space-x-6 bg-gray-100 rounded-lg p-4" // Added padding for better alignment
                      >
                        {c?.image && (
                          <img
                            src={c?.image}
                            alt="Post"
                            className="w-16 h-16 object-cover rounded-md" // Increased size
                          />
                        )}
                        <div className="flex-1">
                          <p className="text-lg text-gray-600 truncate">
                            {" "}
                            {c?.content}
                          </p>
                        </div>
                        <ExternalLink size={16} className="text-gray-400" />
                      </Link>
                    </div>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-600">
                  Comment on posts to see them here.
                </p>
              )}
            </div>
          )}
        </div>

        {/* Profile Viewers Section */}
        <div className="p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center space-x-2">
              <Shield className="text-purple-500" />
              <h2 className="text-2xl font-semibold text-gray-800">
                Visited Profiles
              </h2>
            </div>
            <button
              onClick={() => setIsProfileViewersOpen(!isProfileViewersOpen)}
              className="text-gray-500 hover:text-gray-700"
            >
              {isProfileViewersOpen ? <ChevronUp /> : <ChevronDown />}
            </button>
          </div>

          {isProfileViewersOpen && (
            <div className="space-y-4">
              {myProfileViewers && myProfileViewers?.length > 0 ? (
                myProfileViewers?.map((p) => (
                  <div
                    key={p?._id}
                    className="flex items-center border rounded-lg p-3 space-x-4 bg-gray-50 border-b border-gray-200 pb-4 hover:bg-gray-100"
                  >
                    <Link
                      to={`/profile/${p?.username}`}
                      className="flex items-center space-x-4"
                    >
                      <img
                        src={p?.profilePicture || "/avatar.png"}
                        alt="Profile"
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div className="flex flex-col">
                        <div className="text-lg font-bold hover:underline flex items-center gap-1">

                        <p className="font-semibold text-gray-800">{p?.name}</p>
                        <ExternalLink size={14} className="text-gray-400" />
                        </div>
                        <p className="text-sm text-gray-600">{p?.headline}</p>
                      </div>
                    </Link>
                  </div>
                ))
              ) : (
                <p className="text-gray-600">
                  Visit profiles to see them here.
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Myactivity;
