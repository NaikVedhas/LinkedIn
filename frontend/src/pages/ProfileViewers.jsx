import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../lib/axios";
import { Link } from "react-router-dom";
import Sidebar from "../component/Sidebar";
import { formatDistanceToNow } from "date-fns";
import {ExternalLink} from "lucide-react"

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

    const totalViewers = profile?.data?.profileViewers?.length || 0;

    return (
        <div className='grid grid-cols-1 lg:grid-cols-4 gap-6'>
            {/* Sidebar */}
            <div className='hidden lg:block lg:col-span-1'>
                <Sidebar user={authUser} />
            </div>

            {/* Main Content */}
            <div className='col-span-1 lg:col-span-3'>
                <div className='bg-white rounded-lg shadow p-6'>
                    <h1 className='text-2xl font-bold mb-2'>Profile Viewers</h1>
                    <p className='text-lg text-gray-700'>
                        {totalViewers} {totalViewers === 1 ? 'person' : 'people'} saw your profile
                    </p>

                    {totalViewers > 0 ? (
                        <ul>
                            {profile?.data?.profileViewers?.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).map((viewer) => (
                                <li
                                    key={viewer._id}
                                    className='bg-white border rounded-lg p-4 my-4 transition-all hover:shadow-md'
                                >
                                    <div className='flex items-center justify-between'>
                                        <div className='flex items-center space-x-4'>
                                            {/* Profile Picture */}
                                            <Link to={`/profile/${viewer.user.username}`}>
                                                <img
                                                    src={viewer.user.profilePicture || "/avatar.png"}
                                                    alt={viewer.user.name}
                                                    className='w-12 h-12 rounded-full object-cover'
                                                />
                                            </Link>

                                            {/* User Info */}
                                            <div>
                                            <Link
                                                to={`/profile/${viewer.user.username}`}
                                                className="text-lg font-bold hover:underline flex items-center gap-1"
                                                >
                                                {viewer.user.name}
                                                <ExternalLink size={14} className="text-gray-400" />
                                            </Link>
                                                <p className='text-sm text-gray-600'>{viewer.user.headline}</p>
                                            </div>
                                        </div>

                                        {/* Time of view */}
                                        <div className='text-sm text-gray-500'>
                                            {viewer.createdAt &&
                                                formatDistanceToNow(new Date(viewer.createdAt), {
                                                    addSuffix: true,
                                                })}
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
