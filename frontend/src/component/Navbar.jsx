import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { Link, NavLink } from "react-router-dom";
import { Bell, Home, LogOut, User, Users,Activity,Shield, Search   } from "lucide-react";

const Navbar = () => {
  const { data: authUser } = useQuery({ queryKey: ["authUser"] });
  const queryClient = useQueryClient();

  // Now we want to get notifications and connections only when we have authUser
  const { data: notifications } = useQuery({
    queryKey: ["notifications"],
    queryFn: async () => {
      const res = await axiosInstance.get("/notifications/");
      return res;
    },
    enabled: !!authUser, // this means that this query will run only when we have authUser
  });

  const { data: connectionRequests } = useQuery({
    queryKey: ["connectionRequests"],
    queryFn: async () => {
      const res = await axiosInstance.get("/connections/requests");
      return res;
    },
    enabled: !!authUser,
  });

  const { mutate: logout } = useMutation({
    mutationFn: async () => axiosInstance.post("/auth/logout"),
    onSuccess: () => {
      toast.success("Logged Out");
      queryClient.invalidateQueries({ queryKey: ["authUser"] }); // so it will refresh this and authUser is null we will be redirected to login pages without refreshing
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Something went wrong");
    },
  });

  const unreadNotificationCount = notifications?.data?.filter(
    (notif) => !notif.read
  ).length;
  const unreadConnectionRequestsCount = connectionRequests?.data?.length;

  return (
    <nav className="bg-secondary shadow-md sticky top-0 z-10 mb-5">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center py-3">
          <div className="flex items-center space-x-4">
            <Link to="/">
              <img className="h-8 rounded" src="/small-logo.png" alt="LinkedIn" />
            </Link>
          </div>
          <div className="flex items-center gap-2 md:gap-6">
            {authUser ? (
              <>
                <NavLink
                  to="/"
                  className={({ isActive }) =>
                    isActive
                      ? "text-primary flex flex-col items-center font-bold" // active icon becomes bold and colored
                      : "text-neutral flex flex-col items-center hover:text-primary"
                  }
                >
                  <Home size={20} />
                  <span className="text-xs hidden md:block">Home</span>
                </NavLink>
                <NavLink
                  to="/search"
                  className={({ isActive }) =>
                    isActive
                      ? "text-primary flex flex-col items-center font-bold" 
                      : "text-neutral flex flex-col items-center hover:text-primary"
                  }
                >
                  <Search size={20} />
                  <span className="text-xs hidden md:block">Search</span>
                </NavLink>
                <NavLink
                  to="/network"
                  className={({ isActive }) =>
                    isActive
                      ? "text-primary flex flex-col items-center font-bold relative"
                      : "text-neutral flex flex-col items-center hover:text-primary relative"
                  }
                >
                  <Users size={20} />
                  <span className="text-xs hidden md:block">My Network</span>
                  {unreadConnectionRequestsCount > 0 && (
                    <span
                      className="absolute top-0 right-0 md:right-4 bg-blue-500 text-white text-xs 
                      rounded-full h-4 w-4 flex items-center justify-center"
                    >
                      {unreadConnectionRequestsCount}
                    </span>
                  )}
                </NavLink>
                <NavLink
                  to="/notifications"
                  className={({ isActive }) =>
                    isActive
                      ? "text-primary flex flex-col items-center font-bold relative"
                      : "text-neutral flex flex-col items-center hover:text-primary relative"
                  }
                >
                  <Bell size={20} />
                  <span className="text-xs hidden md:block">Notifications</span>
                  {unreadNotificationCount > 0 && (
                    <span
                      className="absolute top-0 right-0 md:right-4 bg-blue-500 text-white text-xs 
                      rounded-full h-4 w-4 flex items-center justify-center"
                    >
                      {unreadNotificationCount}
                    </span>
                  )}
                </NavLink>
                <NavLink
                  to="/myactivity"
                  className={({ isActive }) =>
                    isActive
                      ? "text-primary flex flex-col items-center font-bold relative"
                      : "text-neutral flex flex-col items-center hover:text-primary relative"
                  }
                >
                  <Activity  size={20} />
                  <span className="text-xs hidden md:block">Activity</span>
                </NavLink>

                <NavLink
                  to="/profileViewers"
                  className={({ isActive }) =>
                    isActive
                      ? "text-primary flex flex-col items-center font-bold relative"
                      : "text-neutral flex flex-col items-center hover:text-primary relative"
                  }
                >
                  <Shield     size={20} />
                  <span className="text-xs hidden md:block">Profile Viewers</span>
                </NavLink>



                <NavLink
                  to={`/profile/${authUser?.username}`}
                  className={({ isActive }) =>
                    isActive
                      ? "text-primary flex flex-col items-center font-bold" // active icon becomes bold and colored
                      : "text-neutral flex flex-col items-center hover:text-primary"
                  }
                >
                  <User size={20} />
                  <span className="text-xs hidden md:block">Me</span>
                </NavLink>
                <button
                  className="flex items-center space-x-1 text-sm text-gray-600 hover:text-primary hover:font-bold"
                  onClick={() => logout()}
                >
                  <LogOut size={20}  />
                  <span className="hidden md:inline ">Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-ghost">
                  Sign In
                </Link>
                <Link to="/signup" className="btn btn-primary">
                  Join now
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
