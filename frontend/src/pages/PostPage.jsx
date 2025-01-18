import { useParams } from "react-router"
import Post from "../component/Post";
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../lib/axios";
import Sidebar from "../component/Sidebar";
import {Loader} from "lucide-react"

const PostPage = () => {

    const {postId} = useParams();

    const {data:authUser} = useQuery({queryKey:["authUser"]});
    const {data:post,isLoading} = useQuery({
        queryKey:["posts",postId],
        queryFn: async ()=> await axiosInstance.get(`/posts/${postId}`)
        
    });

    if (isLoading){
      return (
        <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center">
          <Loader className="animate-spin text-blue-500  text-5xl w-24 h-24 mb-4" />
          <p className="text-2xl text-gray-700">Loading...</p>
        </div>
      </div>
      );
    } 

	if (!post?.data){

    return  (<div className="flex flex-col items-center justify-center h-screen">
    <h1 className="text-2xl font-bold">Post not found</h1>
    <p className="mt-2 text-gray-400">Sorry, we couldn't find the post you're looking for.</p>
    <a
      href="/"
      className="mt-4 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
    >
      Go Back Home
    </a>
    </div>
  );
  }

  return(
		<div className='grid grid-cols-1 lg:grid-cols-4 gap-6'>
			<div className='hidden lg:block lg:col-span-1'>
				<Sidebar user={authUser} />
			</div>

			<div className='col-span-1 lg:col-span-2'>
				<Post post={post?.data} />
			</div>
		</div>
	);
}
export default PostPage;