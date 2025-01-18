import Sidebar from "../component/Sidebar"
import RecommendedUser from "../component/RecommendedUser"
import { useQuery } from "@tanstack/react-query";
import {ExternalLink} from "lucide-react"
import { Link } from "react-router";
import toast from "react-hot-toast";

const NotFound = () => {

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
  

  return (
    <div className='grid grid-cols-1 lg:grid-cols-4 gap-6'>
        <div className='hidden lg:block lg:col-span-1'>
          <Sidebar user={authUser} />
        </div>

        <div className="col-span-1 lg:col-span-2 order-first lg:order-none flex flex-col items-center justify-center  bg-white rounded-lg shadow-lg">
        <p className="text-2xl text-gray-600 mb-4 text-center">
          Sorry, the page you're looking for doesn't exist or has been moved!
        </p>
        <Link
          to={'/'}
          className="flex items-center p-2 space-x-1 text font-medium text-gray-600 hover:text-primary"
        >
          <span>Go to Home</span> 
          <ExternalLink size={18} className="hover:text-primary " />
        </Link>
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
export default NotFound