import {useQuery} from "@tanstack/react-query"
import { axiosInstance } from "../lib/axios"
import toast from "react-hot-toast";
import Sidebar from "../component/Sidebar";
import PostCreation from "../component/PostCreation";

const Home = () => {
 
  const {data:authUser} = useQuery({queryKey:["authUser"]});

  const {data:recommendedUsers} = useQuery({ 
    queryKey:["recommendedUsers"],
    queryFn:async () =>{
      try {
      const res = await axiosInstance.get("/users/suggestions");
      return res.data;
      } catch (error) {
        toast.error(error.response.data.message || "Unable to fetch recommended users");        
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
        toast.error(error.response.data.message || "Unable to fetch posts");        
      }
    },
  });

  console.log("posts",posts);
  console.log("recommendedUsers",recommendedUsers);
  

 
 
  return (
    <div className='grid grid-cols-1 lg:grid-cols-4 gap-6'>
			<div className='hidden lg:block lg:col-span-1'>
				<Sidebar user={authUser} />
			</div>

			<div className='col-span-1 lg:col-span-2 order-first lg:order-none'>
				<PostCreation user={authUser} />
        </div>
        </div>
  )
}

export default Home