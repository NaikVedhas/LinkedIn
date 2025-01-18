import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { axiosInstance } from "../lib/axios";
import UserCard from "../component/UserCard";
import Sidebar from "../component/Sidebar";
import { Search, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

const SearchUser = () => {
  const [name, setName] = useState("");
  const [isSearchCleared,setIsSearchCleared] = useState(false);     //we are specifically using this bec when the search bar is clear aftaer searching some we want to see the suggested users again 
  const { data: recommendedUsers } = useQuery({
    queryKey: ["recommendedUsers"],
    queryFn: async () => {
      try {
        const res = await axiosInstance.get("/users/suggestions");
        return res.data;
      } catch (error) {
        toast.error("Unable to fetch recommended users");
      }
    },
  });

  const { data: authUser } = useQuery({ queryKey: ["authUser"] });

  const { data: searchUsers,refetch } = useQuery({
    queryKey: ["searchUsers"],
    queryFn: async () => {
      const res = await axiosInstance.post("/users/searchUser", { name });
      return res.data;
    },
    enabled: !!name, //this function will run only when the name is not empty
  });

  useEffect(()=>{
    refetch(); //so that i continously fetch and give more exact results. Without this refetch also my search is dynamic ie as and when i typ i get results but more exact results are obtained by this 
    if (!name) {
      setIsSearchCleared(true); // When the search bar is cleared, update the state
    } else {
      setIsSearchCleared(false); // If there is any search term, reset the cleared state
    }
  },[name])

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Sidebar */}
      <div className="hidden lg:block lg:col-span-1">
        <Sidebar user={authUser} />
      </div>

      <div className="p-6 bg-white rounded-lg shadow-lg lg:col-span-3">
        {/* Search Bar */}
        {/* We cat add the icon directly in the placeholder so adjusted it such that it looks inside  */}
        <div className="mb-6 flex items-center border-b pb-3 relative">
        <Search size={28} className="absolute pb-2 left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={name}
            placeholder="Search by name"
            onChange={(e) => setName(e.target.value)}
            className="w-full  pl-10 py-2 text-base px-4 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button className="ml-2 text-gray-600 hover:text-blue-500">
           
          </button>
        </div>

        {/* Search Results */}
        {searchUsers && !isSearchCleared? (
          <div>
            {searchUsers?.length > 0 ? (
              searchUsers?.map((s) => (
                <div
                  key={s?._id}
                  className="flex items-center justify-between p-4 border mb-4 rounded-lg shadow-sm hover:shadow-2xl transition-all"
                >
                  <div className="flex items-center space-x-4">
                    {/* Profile Picture */}
                    <Link to={`/profile/${s?.username}`}>
                      <img
                        src={s?.profilePicture || "/avatar.png"}
                        alt={s?.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    </Link>
                    <div>
                      <Link
                        to={`/profile/${s?.username}`}
                        className="text-lg font-semibold text-gray-800 hover:underline flex items-center gap-1"
                      >
                        {s?.name}
                        <ExternalLink size={14} className="text-gray-400" />
                      </Link>
                      <p className="text-sm text-gray-600">{s?.headline}</p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-3xl text-gray-500">No users found</div>
            )}
          </div>
        ) : (
          // if user is not searching show this
          <div>
            <h1 className="text-2xl font-bold mb-6 text-gray-800">Suggested Users</h1>
            {recommendedUsers && recommendedUsers?.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {recommendedUsers?.map((r) => (
                  <div key={r?._id} className="border rounded-lg">
                    <UserCard user={r} isConnection={false} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-500">Nothing to show here</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchUser;
