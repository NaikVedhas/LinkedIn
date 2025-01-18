import {useQuery} from "@tanstack/react-query"
import { axiosInstance } from "../lib/axios"
import toast from "react-hot-toast";
import Sidebar from "../component/Sidebar";
import PostCreation from "../component/PostCreation";
import Post from "../component/Post";
import RecommendedUser from "../component/RecommendedUser";
import {ExternalLink} from "lucide-react"
import { Link } from "react-router";


const Home = () => {
 
  const {data:authUser} = useQuery({queryKey:["authUser"]});

  const {data:recommendedUsers} = useQuery({ 
    queryKey:["recommendedUsers"],
    queryFn:async () =>{
      try {
      const res = await axiosInstance.get("/users/suggestions");
      return res.data;
      } catch (error) {
        toast.error("Unable to fetch recommended users");        
      }
    },
  });

  const {data:posts} = useQuery({ 
    queryKey:["posts"],
    queryFn:async () =>{
      try {
      const res = await axiosInstance.get("/posts");
      return res.data;
      } catch (error) {
        toast.error("Unable to fetch posts");        
      }
    },
  });

 
  return (
    <div className='grid grid-cols-1 lg:grid-cols-4 gap-6'>
			<div className='hidden lg:block lg:col-span-1'>
				<Sidebar user={authUser} />
			</div>

			<div className='col-span-1 lg:col-span-2 order-first lg:order-none'>
				<PostCreation user={authUser} />
        {posts && posts?.length>0 ? (
          <div>
            {posts?.map((post) => (
              <Post key={post._id} post={post} />
            ))}
          </div>
        ):(
        <div className="text-center my-10">
          <div className="text-gray-600 text-3xl font-semibold mb-3">
            Follow or Connect with people to see their posts
          </div>
          <div className="text-gray-500 text-xl flex items-center justify-center gap-1">
            <Link
              to={`/search`}
              className="text-blue-600 hover:text-blue-800 underline transition-colors duration-200"
            >
              Find people
            </Link>
            <ExternalLink size={20} className="text-blue-600 hover:text-blue-800" />
          </div>
        </div>
        )}
        

      </div>
        {recommendedUsers?.length > 0 && (
          <div className='col-span-1 lg:col-span-1 hidden lg:block'>
            <div className='bg-secondary rounded-lg shadow p-4'>
              <h2 className='font-semibold mb-4'>People you may know</h2>
              {recommendedUsers?.slice(0, 5).map((user) => (
                <RecommendedUser key={user._id} user={user} />
              ))}
              <div >
              <Link 
                to="/search" 
                className="flex items-center p-2 space-x-1 text font-medium text-gray-600 hover:text-primary"
              >
                <span>See all suggestions</span>
                <ExternalLink size={18} className="hover:text-primary" />
              </Link>
              </div>
            </div>
          </div>
        )}
        </div>
  )
}

export default Home