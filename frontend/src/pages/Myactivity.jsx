import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../lib/axios";



const Myactivity = () => {

  const {data:authUser} = useQuery({queryKey:["authUser"]});

  const {data:likes} = useQuery({
    queryKey:["likes",authUser._id],
    queryFn: async () =>{
      const res = await axiosInstance("/posts/myActivity/like");
      return res.data;
    }
  });
  
  console.log("likes");
  console.log(likes);
  
  const {data:comments} = useQuery({
    queryKey:["comments",authUser._id],
    queryFn: async () =>{
      const res = await axiosInstance("/posts/myActivity/comment");
      return res.data;
    }
  })
  
  console.log("comments");
  console.log(comments);

  return (
    <div>Myactivity</div>
  )
}
export default Myactivity