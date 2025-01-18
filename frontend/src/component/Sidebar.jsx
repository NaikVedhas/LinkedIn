import { NavLink } from "react-router-dom";
import { Home, Bell,Shield,Users } from "lucide-react";

export default function Sidebar({ user }) {
    return (
        <div className='bg-secondary rounded-lg shadow'>
            <div className='p-4 text-center'>
                <div
                    className='h-16 rounded-t-lg bg-cover bg-center'
                    style={{
                        backgroundImage: `url("${user?.bannerImg || "/banner.png"}")`,
                    }}
                />
                <NavLink to={`/profile/${user?.username}`}>
                    <img
                        src={user?.profilePicture || "/avatar.png"}
                        alt={user?.name}
                        className='w-20 h-20 rounded-full object-cover mx-auto mt-[-40px]'
                    />
                    <h2 className='text-xl font-semibold mt-2'>{user?.name}</h2>
                </NavLink>
                <p className='text-info'>{user?.headline}</p>
                <p className='text-info text-xs'>{user?.connections?.length} connections</p>
            </div>
            <div className='border-t border-base-100 p-4'>
                <nav>
                    <ul className='space-y-2'>
                        <li>
                            <NavLink
                                to='/'
                                className={({ isActive }) =>
                                    `flex items-center py-2 px-4 rounded-md transition-colors ${
                                        isActive
                                            ? "bg-primary text-white"
                                            : "hover:bg-primary hover:text-white"
                                    }`
                                }
                            >
                                <Home className='mr-2' size={20} /> Home
                            </NavLink>
                        </li>
                        <li>
                            <NavLink
                                to='/profileViewers'
                                className={({ isActive }) =>
                                    `flex items-center py-2 px-4 rounded-md transition-colors ${
                                        isActive
                                            ? "bg-primary text-white"
                                            : "hover:bg-primary hover:text-white"
                                    }`
                                }
                            >
                                <Shield className='mr-2' size={20} /> Profile Viewers
                            </NavLink>
                        </li>
                        <li>
                            <NavLink
                                to='/network'
                                className={({ isActive }) =>
                                    `flex items-center py-2 px-4 rounded-md transition-colors ${
                                        isActive
                                            ? "bg-primary text-white"
                                            : "hover:bg-primary hover:text-white"
                                    }`
                                }
                            >
                                <Users className='mr-2' size={20} /> My Network
                            </NavLink>
                        </li>
                        <li>
                            <NavLink
                                to='/notifications'
                                className={({ isActive }) =>
                                    `flex items-center py-2 px-4 rounded-md transition-colors ${
                                        isActive
                                            ? "bg-primary text-white"
                                            : "hover:bg-primary hover:text-white"
                                    }`
                                }
                            >
                                <Bell className='mr-2' size={20} /> Notifications
                            </NavLink>
                        </li>
                    </ul>
                </nav>
            </div>
            <div className='border-t border-base-100 p-4'>
                <NavLink to={`/profile/${user?.username}`} className='text-sm font-semibold'>
                    Visit your profile
                </NavLink>
            </div>
        </div>
    );
}
