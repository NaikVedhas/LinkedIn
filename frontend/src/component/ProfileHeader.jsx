import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { axiosInstance } from "../lib/axios";
import { toast } from "react-hot-toast";
import { Camera, Clock, MapPin, UserCheck, UserPlus, X } from "lucide-react";
import { Link } from "react-router-dom";
import MutualConnections from "./MutualConnections";

const ProfileHeader = ({ userData, onSave, isOwnProfile }) => {
	
    const [isEditing, setIsEditing] = useState(false);
	const [editedData, setEditedData] = useState({});
	const [isFollower, setIsFollower] = useState(false);
	const queryClient = useQueryClient();
    
    
    //We wil show the connect buttons too and the renderfunction here again
	const {data:connectionStatus} = useQuery({
        queryKey:["connectionStatus",userData?._id],
        queryFn: async ()=>{
            const res = await axiosInstance.get(`/connections/status/${userData._id}`);
            return res.data;
        },
    })

    
   
	const { mutate: sendConnectionRequest } = useMutation({
		mutationFn: (userId) => axiosInstance.post(`/connections/request/${userId}`),
		onSuccess: () => {
			toast.success("Connection request sent");
			queryClient.invalidateQueries({queryKey:["connectionStatus"]}) //1 way more better way
			queryClient.invalidateQueries(["connectionRequests"]);  //2 way
            //both ways se extract kar sakte
		},
		onError: (error) => {
			toast.error(error?.response?.data?.message || "An error occurred");
		},
	});

	const { mutate: acceptRequest } = useMutation({
		mutationFn: (requestId) => axiosInstance.put(`/connections/accept/${requestId}`),
		onSuccess: () => {
			toast.success("Connection request accepted");
            queryClient.invalidateQueries({queryKey:["connectionStatus"]})
			queryClient.invalidateQueries(["connectionRequests"]);
		},
		onError: (error) => {
			toast.error(error?.response?.data?.message || "An error occurred");
		},
	});

	const { mutate: rejectRequest } = useMutation({
		mutationFn: (requestId) => axiosInstance.put(`/connections/reject/${requestId}`),
		onSuccess: () => {
			toast.success("Connection request rejected");
			queryClient.invalidateQueries({queryKey:["connectionStatus"]})
			queryClient.invalidateQueries(["connectionRequests"]);
		},
		onError: (error) => {
			toast.error(error?.response?.data?.message || "An error occurred");
		},
	});

	const { mutate: removeConnection } = useMutation({
		mutationFn: (userId) => axiosInstance.delete(`/connections/${userId}`),
		onSuccess: () => {
			toast.success("Connection removed");
			queryClient.invalidateQueries({queryKey:["connectionStatus"]})
			queryClient.invalidateQueries(["connectionRequests"]);
		},
		onError: (error) => {
			toast.error(error?.response?.data?.message || "An error occurred");
		},
	});

    const {mutate:followUser} = useMutation({
		mutationFn: async () =>{
			return await axiosInstance.post(`/connections/follow/${userData._id}`);
		},
		onSuccess:(response)=>{      //this response is the response that we get from backend we can name it anything	
			toast.success(response?.data?.message || "Followed");
			setIsFollower(true); // Directly update the state after successful follow
		},
		onError:(err)=>{
			toast.error(err?.response?.data?.message || "Something went wrong Please try again later")
		}
	})

	const {mutate:unFollowUser} = useMutation({
		mutationFn: async ()=>{
			return  await axiosInstance.post(`/connections/unfollow/${userData._id}`);
		},
		onSuccess:(response)=>{       
			toast.success( response.data.message ||"UnFollowed");
			setIsFollower(false); 
		},
		onError:(err)=>{
			toast.error(err?.response?.data?.message || "Something went wrong Please try again later")
		}
	});
  
    const renderConnectionButton = () => {
        const baseClass = "text-white py-1 px-4 rounded-full transition duration-300 flex items-center justify-center";
        switch (connectionStatus?.status) {
            case "connected":
                return (
                    <div className='flex gap-2 justify-center'>
                        <div className={`${baseClass} bg-green-500 hover:bg-green-600`}>
                            <UserCheck size={20} className='mr-2' />
                            Connected
                        </div>
                        <button
                            className={`${baseClass} bg-red-500 hover:bg-red-600 text-sm`}
                            onClick={handleRemoveConnection}
                        >
                            <X size={20} className='mr-2' />
                            Remove Connection
                        </button>
                    </div>
                );

            case "pending":
                return (
                    <button className={`${baseClass} bg-yellow-500 hover:bg-yellow-600`}>
                        <Clock size={20} className='mr-2' />
                        Pending
                    </button>
                );

            case "received":
                return (
                    <div className='flex gap-2 justify-center'>
                        <button
                            onClick={() => acceptRequest(connectionStatus?.requestId)}
                            className={`${baseClass} bg-green-500 hover:bg-green-600`}
                        >
                            Accept
                        </button>
                        <button
                            onClick={() => rejectRequest(connectionStatus?.requestId)}
                            className={`${baseClass} bg-red-500 hover:bg-red-600`}
                        >
                            Reject
                        </button>
                    </div>
                );
            default:
                return (
                    <button
                        onClick={() => sendConnectionRequest(userData?._id)}
                        className='bg-primary hover:bg-primary-dark text-white py-1 px-4 rounded-full transition duration-300 flex items-center justify-center'
                        >
                        <UserPlus size={20} className='mr-2' />
                        Connect
                    </button>
                );
        }
    };
    

	const renderFollowButton = () => {
		const baseClass = "text-white py-1 px-4 rounded-full transition duration-300 flex items-center justify-center";
	
		if (isFollower) {
			return (
				<button
					onClick={unFollowUser}
					className={`${baseClass} bg-red-500 hover:bg-red-600 `}
				>
					<X size={20} className="mr-2" />
					Unfollow
				</button>
			);
		} else {
			return (
				<button
					onClick={followUser}
					className={`${baseClass} bg-blue-500 hover:bg-blue-600 `}
				>
					<UserPlus size={20} className="mr-2" />
					Follow
				</button>
			);
		}
	};
    //yeh just is toast ke liye likha hai
    const handleRemoveConnection = ()=>{
        toast((t) => (
            <div className="p-4 flex flex-col gap-4 items-center">
              <p className="text-gray-800 text-sm">Are you sure ?</p>
              <div className="flex gap-4">
                <button
                  onClick={() => {
                    removeConnection(userData?._id); 
                    toast.dismiss(t.id); 
                  }}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                  Yes, Remove
                </button>
                <button
                  onClick={() => toast.dismiss(t.id)}
                  className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300"
                >
                  No 
                </button>
              </div>
            </div>
          ), {
            duration: Infinity,
          });
        
    }


	const handleImageChange = (event) => {
		const file = event.target.files[0];  //we select the file
		if (file) {
            const reader = new FileReader();
			reader.onloadend = () => {
				setEditedData((prev) => ({ ...prev, [event.target.name]: reader.result }));
			};
			reader.readAsDataURL(file);
		}
	};

	const handleSave = () => {
		onSave(editedData);
		setIsEditing(false);
	};

    //Now in return for every part we are seeing if isEditing is true and if it is true then show  a small icon which is acting as form and taking edited data and updating the ui and if we click save then sending to backend etc 
	return (
		<div className='bg-white shadow rounded-lg mb-6'>
			{/* BANNER image */}
            <div
				className='relative h-48 rounded-t-lg bg-cover bg-center'
				style={{
					backgroundImage: `url('${editedData?.bannerImg || userData?.bannerImg || "/banner.png"}')`,
				}}
			>
				{isEditing && (
					<label className='absolute top-2 right-2 bg-white p-2 rounded-full shadow cursor-pointer'>
						<Camera size={20} />
						<input
							type='file'
							className='hidden'
							name='bannerImg'
							onChange={handleImageChange}
							accept='image/*'
						/>
					</label>
				)}
			</div>
			<div className='p-4'>

                {/* Profile Picture  */}
				<div className='relative -mt-20 mb-4'>
					<img
						className='w-44 h-44 mx-3 rounded-full  object-cover'
						src={editedData?.profilePicture || userData?.profilePicture || "/avatar.png"}
						alt={userData?.name}
					/>

					{isEditing && (
						<label className='absolute bottom-0 ml-20 transform translate-x-16 bg-white p-2 rounded-full shadow cursor-pointer'>
							<Camera size={20} />
							<input
								type='file'
								className='hidden'
								name='profilePicture'
								onChange={handleImageChange}
								accept='image/*'
							/>
						</label>
					)}
				</div>
                {/* jaha pe text hai vaha pe agar edit true hai toh instead of value directly form dikha rahe hai */}
                {/* Name  */}
				<div className='text-left mx-5 mb-4'>
					{isEditing ? (
						<input
							type='text'
							value={editedData?.name ?? userData?.name}
							onChange={(e) => setEditedData({ ...editedData, name: e.target.value })}
							className='text-2xl font-bold mb-2  hover:cursor-pointer w-full'
						/>
					) : (
						<h1 className='text-2xl font-bold '>{userData?.name}</h1>
					)}

					{isEditing ? (
						<input
							type='text'
							value={editedData?.headline ?? userData?.headline}
							onChange={(e) => setEditedData({ ...editedData, headline: e.target.value })}
							className='text-gray-600  w-full hover:cursor-pointer'
						/>
					) : (
						<p className='text-gray-600'>{userData?.headline}</p>
					)}

					<div className='flex  items-center '>
						<MapPin size={16} className='text-gray-500 mr-1' />
						{isEditing ? (
							<input
								type='text'
								value={editedData?.location ?? userData?.location}
								onChange={(e) => setEditedData({ ...editedData, location: e.target.value })}
								className='text-gray-600 hover:cursor-pointer'
							/>
						) : (
							<span className='text-gray-600'>{userData?.location}</span>
						)}
					</div>
					<div className="text-blue-500 font-semibold">
						<Link to="/network">
						{userData?.connections?.length}+ Connections
						</Link>
					</div>
					<div>
						{isOwnProfile ? (
							<></>
						):(
							<div className="mt-2">
								<MutualConnections user={userData}/> 
							</div>
						)}
					</div>
				</div>
                {/* First check karre if its our profile then edit button show karo or else connection buttons is enabled */}
				{isOwnProfile ? (
					isEditing ? (
						<button
							className='w-full bg-primary text-white py-2 px-4 rounded-full hover:bg-primary-dark
							 transition duration-300'
							onClick={handleSave}
						>
							Save Profile
						</button>
					) : (
						<button
							onClick={() => setIsEditing(true)}
							className='w-full bg-primary text-white py-2 px-4 rounded-full hover:bg-primary-dark
							 transition duration-300'
						>
							Edit Profile
						</button>
					)
				) : (
					<div className=" mx-4 flex gap-4">
					<div>{renderFollowButton()}</div>
					<div>{renderConnectionButton()}</div>
					</div>

				)}
			</div>
		</div>
	);
};
export default ProfileHeader;