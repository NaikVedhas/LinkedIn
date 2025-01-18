import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { axiosInstance } from "../lib/axios"
import toast from "react-hot-toast"
import {Link} from "react-router-dom"
import { Check, Clock, UserPlus, X } from "lucide-react";

const RecommendedUser = ({user}) => { //this is the recommended user

    //Based on connection we need 3 button one is if we are not connected so to send connection request, second is if they have send the request then to accept their request and third if they have send request then to reject their request

    const queryClient = useQueryClient();

    const {data:connectionStatus,isLoading} = useQuery({
        queryKey:["connectionStatus",user?._id],
        queryFn: async ()=>{
            const res = await axiosInstance.get(`/connections/status/${user._id}`);
            return res.data;
        }
    })
    
    

    const {mutate:sendConnectionRequest} = useMutation({
        mutationFn: async ()=>{
            const res = await axiosInstance.post(`/connections/request/${user._id}`);
            return res.data;
        },
        onSuccess:()=>{
            toast.success("Sent Connection Request");
            queryClient.invalidateQueries({ queryKey: ["connectionStatus", user._id] });
        },
        onError:(err)=>{
            toast.error(err?.response?.data?.message || "Error occured");
        }
    });

    const {mutate:acceptConnectionRequest} = useMutation({
        mutationFn: async (requestId) =>{
            return await axiosInstance.put(`/connections/accept/${requestId}`);
        },
        onSuccess:()=>{
            toast.success("Request Accepted");
            queryClient.invalidateQueries({queryKey:["recommendedUsers"]});  // do this to update and remove from suggested user
            queryClient.invalidateQueries({queryKey:["posts"]});     //so that we immediately see connections post
        },
        onError:()=>{
            toast.error(err?.response?.data?.message||"Error Occured");
        }
    });

    const {mutate:rejectConnectionRequest}= useMutation({
        mutationFn: async (requestId)=>{
            return await axiosInstance.put(`/connections/reject/${requestId}`);
        },
        onSuccess:()=>{
            toast.success("Request Rejected");
            queryClient.invalidateQueries({queryKey:["connectionStatus",user._id]})
        },
        onError:(err)=>{
            toast.error(err?.response?.data?.message||"Error occured");
        }
    })

    const handleConnect = () =>{
        if (connectionStatus?.status === "not_connected") {
			sendConnectionRequest();
		}
    }

    const renderButton = () => {
		if (isLoading) {
			return (
				<button className='px-3 py-1 rounded-full text-sm bg-gray-200 text-gray-500' disabled>
					Loading...
				</button>
			);
		}

		switch (connectionStatus?.status) {
			case "pending":
				return (
					<button
						className='px-3 py-1 rounded-full text-sm bg-yellow-500 text-white flex items-center'
						disabled
					>
						<Clock size={16} className='mr-1' />
						Pending
					</button>
				);
			case "received":
				return (
					<div className='flex gap-2 justify-center'>
						<button
							onClick={()=> acceptConnectionRequest(connectionStatus?.requestId)}
							className={`rounded-full p-1 flex items-center justify-center bg-green-500 hover:bg-green-600 text-white`}
						>
							<Check size={16} />
						</button>
						<button
							onClick={()=> rejectConnectionRequest(connectionStatus?.requestId)}
							className={`rounded-full p-1 flex items-center justify-center bg-red-500 hover:bg-red-600 text-white`}
						>
							<X size={16} />
						</button>
					</div>
				);
			default:
				return (
					<button
						className='px-3 py-1 rounded-full text-sm border border-primary text-primary hover:bg-primary hover:text-white transition-colors duration-200 flex items-center'
						onClick={handleConnect}
					>
						<UserPlus size={16} className='mr-1' />
						Connect
					</button>
				);
		}
	};


  return (
    <div className="flex items-center justify-between mb-4">
    <Link to={`/profile/${user?.username}`} className="flex items-center flex-grow">
        <img
            src={user.profilePicture || "/avatar.png"}
            alt={user.name}
            className="w-12 h-12 rounded-full mr-3 object-cover flex-shrink-0"
        />
        <div className="flex flex-col min-w-0">
            <h3 className="font-semibold text-sm">{user?.name}</h3>
            <p className="text-xs text-info break-words">{user?.headline}</p>
        </div>
    </Link>
    <div className="flex-shrink-0">
        {renderButton()}
    </div>
</div>

    );
}
export default RecommendedUser