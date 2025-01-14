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
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 bg-gray-100  ">
      {/* Sidebar */}
      <div className="col-span-1 lg:col-span-1">
        <Sidebar user={authUser} />
      </div>

      {/* Main Content */}
      <div className="col-span-1 lg:col-span-3 bg-white p-6">
      <h1 className='text-2xl font-bold mb-6'>My Activity</h1>


        {/* Likes Section */}
        <div className=" p-6 rounded-lg shadow-md mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold text-gray-800">Likes</h2>
            <ThumbsUp className="text-blue-500" />
            <button
              onClick={() => setIsLikesOpen(!isLikesOpen)}
              className="text-gray-500 hover:text-gray-700"
            >
              {isLikesOpen ? <ChevronUp /> : <ChevronDown />}
            </button>
          </div>

          {isLikesOpen && (
            <div className="space-y-4">
              {likes && likes.length > 0 ? (
                <ul>
                  {likes.map((l) => (
                    <div
                      key={l._id}
                      className="p-4 border-b border-gray-200 bg-white rounded-lg hover:bg-gray-50"
                    >
                      <Link
                        to={`/post/${l._id}`}
                        className="flex items-center space-x-4"
                      >
                        {l.image && (
                          <img
                            src={l.image}
                            alt="Post"
                            className="w-12 h-12 object-cover rounded-md"
                          />
                        )}
                        <div className="flex-1">
                          <p className="text-sm text-gray-600 truncate">
                            {l.content}
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
        <div className=" p-6 rounded-lg shadow-md mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold text-gray-800">Comments</h2>
            <MessageSquare className="text-green-500" />
            <button
              onClick={() => setIsCommentsOpen(!isCommentsOpen)}
              className="text-gray-500 hover:text-gray-700"
            >
              {isCommentsOpen ? <ChevronUp /> : <ChevronDown />}
            </button>
          </div>

          {isCommentsOpen && (
            <div className="space-y-4">
              {comments && comments.length > 0 ? (
                <ul>
                  {comments.map((c) => (
                    <div
                      key={c._id}
                      className="p-4 border-b border-gray-200 bg-white rounded-lg hover:bg-gray-50"
                    >
                      <p className="text-gray-700">
                        My Comment:{" "}
                        {c.comments.find((ce) => ce.user === authUser?._id)
                          ?.content || "No comments"}
                      </p>
                      <Link
                        to={`/posts/${c._id}`}
                        className="flex items-center space-x-4"
                      >
                        {c.image && (
                          <img
                            src={c.image}
                            alt="Post"
                            className="w-12 h-12 object-cover rounded-md"
                          />
                        )}
                        <div className="flex-1">
                          <p className="text-sm text-gray-600 truncate">
                            {c.content}
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
        <div className=" p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold text-gray-800">
            Visited Profiles
            </h2>
            <button
              onClick={() => setIsProfileViewersOpen(!isProfileViewersOpen)}
              className="text-gray-500 hover:text-gray-700"
            >
              {isProfileViewersOpen ? <ChevronUp /> : <ChevronDown />}
            </button>
          </div>

          {isProfileViewersOpen && (
            <div className="space-y-4">
              {myProfileViewers && myProfileViewers.length > 0 ? (
                myProfileViewers.map((p) => (
                  <div
                    key={p._id}
                    className="flex items-center space-x-4 border-b border-gray-200 pb-4"
                  >
                    <img
                      src={p.profilePicture || "/avatar.png"}
                      alt="Profile"
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-semibold text-gray-800">{p.name}</p>
                      <p className="text-sm text-gray-600">{p.headline}</p>
                    </div>
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
