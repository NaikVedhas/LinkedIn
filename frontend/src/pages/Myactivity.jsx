import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../lib/axios";
import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import Sidebar from "../component/Sidebar";
import { ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";

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
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <div className="col-span-1 lg:col-span-1">
        <Sidebar user={authUser} />
      </div>

      <div className="col-span-1 lg:col-span-3 space-y-8">
        {/* Likes Section */}
        <div className="bg-white p-4 rounded-md shadow-md">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-semibold">Likes</h1>
            <button onClick={() => setIsLikesOpen(!isLikesOpen)} className="text-gray-500 hover:text-gray-700">
              {isLikesOpen ? <ChevronUp /> : <ChevronDown />}
            </button>
          </div>
          {isLikesOpen && (
            <div className="mt-4">
              {likes?.map((l) => (
                <div key={l._id} className="mb-4 p-4 border-b border-gray-200 bg-white rounded-lg">
                  <Link to={`/posts/${l._id}`} >
                  <div className="flex justify-between items-start">
                    <div className="flex items-center space-x-4">
                      <img src={l.author.profilePicture || "/avatar.png"} alt="Profile" className="w-12 h-12 rounded-full object-cover" />
                      <div>
                        <p className="font-semibold">{l.author.name}</p>
                        <p className="text-sm text-gray-600">{l.content}</p>
                      </div>
                    </div>
                  </div>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>


          //Here also i want to show post but first the comment and then the post 




        {/* Comments Section */}
        <div className="bg-white p-4 rounded-md shadow-md">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-semibold">Comments</h1>
            <button onClick={() => setIsCommentsOpen(!isCommentsOpen)} className="text-gray-500 hover:text-gray-700">
              {isCommentsOpen ? <ChevronUp /> : <ChevronDown />}
            </button>
          </div>
          {isCommentsOpen && (
            <div className="mt-4">
              {comments?.map((c) => (
                <div key={c._id} className="mb-4 p-4 border-b border-gray-200 bg-white rounded-lg">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center space-x-4">
                      <img src={c.author.profilePicture || "/avatar.png"} alt="Profile" className="w-12 h-12 rounded-full object-cover" />
                      <div>
                        <p className="font-semibold">{c.author.name}</p>
                        <p className="text-sm text-gray-600">{c.content}</p>
                        <p className="text-xs text-gray-500 mt-2">
                          {formatDistanceToNow(new Date(c.createdAt), { addSuffix: true })}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Profile Viewers Section */}
        <div className="bg-white p-4 rounded-md shadow-md">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-semibold">People Who Viewed My Profile</h1>
            <button onClick={() => setIsProfileViewersOpen(!isProfileViewersOpen)} className="text-gray-500 hover:text-gray-700">
              {isProfileViewersOpen ? <ChevronUp /> : <ChevronDown />}
            </button>
          </div>
          {isProfileViewersOpen && (
            <div className="mt-4">
              {myProfileViewers?.map((p) => (
                <div key={p._id} className="mb-4 p-4 border-b border-gray-200 bg-white rounded-lg">
                  <div className="flex items-center space-x-4">
                    <img src={p.profilePicture} alt="Profile" className="w-12 h-12 rounded-full object-cover" />
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
