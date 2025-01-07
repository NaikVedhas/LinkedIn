import { useMutation, useQuery } from "@tanstack/react-query"
import { axiosInstance } from "../lib/axios"

const RecommendedUser = ({user}) => {

    //Based on connection we need 3 button one is if we are not connected so to send connection request, second is if they have send the request then to accept their request and third if they have send request then to reject their request

    const {data:connectionStatus,isLoading} = useQuery({
        queryKey:["connectionStatus",user._id],
        queryFn: async ()=>{
            const res = await axiosInstance.get(`/connections/status/${user._id}`);
            return res.data;
        },
    })


    const {mutate:sendConnectionRequest} = useMutation({
        queryFn: async ()=>{
            const res = await axiosInstance.post(`/connections/request/${user._id}`)
        },
        onSuccess:()=>{
            
        }
    })
  return (
    <div>RecommendedUser</div>
  )
}
export default RecommendedUser