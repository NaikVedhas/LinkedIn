import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../lib/axios";
import { Link } from "react-router-dom";
import Sidebar from "../component/Sidebar";

const ProfileViewers = () => {
    const { data: authUser } = useQuery({ queryKey: ["authUser"] });

    const { data: profile, isLoading } = useQuery({
        queryKey: ["profileViewers", authUser?._id],
        queryFn: async () => {
            const res = await axiosInstance.get('/users/profileViewers');
            return res;
        },
    });

    if (isLoading) {
        return <p>Loading profile viewers...</p>;
    }

    console.log(profile?.data?.profileViewers);
    
    return (
        <div className='grid grid-cols-1 lg:grid-cols-4 gap-6'>
            {/* Sidebar */}
            <div className='col-span-1 lg:col-span-1'>
                <Sidebar user={authUser} />
            </div>

            {/* Main Content */}
            <div className='col-span-1 lg:col-span-3'>
                <div className='bg-white rounded-lg shadow p-6'>
                    <h1 className='text-2xl font-bold mb-6'>Profile Viewers</h1>

                    {profile?.data?.profileViewers?.length > 0 ? (
                        <ul>
                            {profile?.data?.profileViewers.map((viewer) => (
                                <li
                                    key={viewer._id}
                                    className='bg-white border rounded-lg p-4 my-4 transition-all hover:shadow-md'
                                >
                                    <div className='flex items-center space-x-4'>
                                        {/* Profile Picture */}
                                        <Link to={`/profile/${viewer.user.name}`}>
                                            <img
                                                src={viewer.user.profilePicture || "/avatar.png"}
                                                alt={viewer.user.name}
                                                className='w-12 h-12 rounded-full object-cover'
                                            />
                                        </Link>

                                        {/* User Info */}
                                        <div>
                                            <Link
                                                to={`/profile/${viewer.username}`}
                                                className='text-lg font-bold hover:underline'
                                            >
                                                {viewer.user.name}
                                            </Link>
                                            <p className='text-sm text-gray-600'>{viewer.user.headline}</p>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No one has viewed your profile yet.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProfileViewers;
