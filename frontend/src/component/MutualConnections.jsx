import { useQuery } from "@tanstack/react-query"
import { Link } from "react-router";
const MutualConnections = ({user}) => {

    const {data:authUser} = useQuery({queryKey:["authUser"]});

    //we will use set because it is more efficeint for larger data
    const set1 = new Set(authUser?.connections);  //authUser doesnt have connections populated ha so while creating mutual we want info of connections so use user only

    const mutual = user?.connections?.filter(u => set1.has(u._id));

    
    return (
        <div>
          {mutual && mutual?.length > 0 ? (
            <div>
              <div className="relative flex items-center">
                {/* Show images  */}
                {mutual.slice(0, 3).map((m, index) => (
                  <img
                    key={m._id}
                    className={`h-8 w-8 rounded-full object-cover absolute ${index === 0 ? "left-0" : index === 1 ? "left-5" : "left-10"}`} // fir the image overlapp effect
                    src={m?.profilePicture || "/avatar.png"}
                    alt={m?.name}
                  />
                ))}
                {/* Show names */}
                <div className="ml-12 px-2 text-gray-500" >
                  {mutual.slice(0, 3).map((m, index) => (
                    <Link key={m._id} to={`/profile/${m?.username}`} className=" text-base hover:text-primary">
                      {m?.name}
                      {index < mutual.slice(0, 3).length - 1 ? ", ":" "}
                    </Link>
                  ))}
                  {mutual?.length > 3 ? (
                    <span>and {mutual.length - 3} other mutual connections</span>
                  ) : (
                    <span>
                      are  mutual connection
                    </span>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div>No mutual connections</div>
          )}
        </div>
      );
    };
    
export default MutualConnections