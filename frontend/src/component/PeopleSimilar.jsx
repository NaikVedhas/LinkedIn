import { Link } from "react-router-dom";

const PeopleSimilar = ({ userData, isOwnProfile, authUser }) => {

  // We are showing the connections of the user
  const totalProfiles = userData?.connections?.length || 0;
  
  // Filter out the current user from the list of connections
  const filteredConnections = userData?.connections?.filter(
    (u) => u._id !== authUser._id
  );

  return (
    <div>
      {!isOwnProfile && userData && totalProfiles > 0 && (
        <div className="bg-white shadow rounded-lg mb-6 p-4">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">
            People similar to {userData?.name}
          </h2>

          {/* Profiles Container with Scroll */}
          <div
            className="flex overflow-x-auto space-x-4"  // due to overflow-x-auto we got a slider directly from chrome
            style={{
              scrollbarWidth: "thin",
              scrollbarColor: "#E5E7EB",
            }}
          >
            {/* Profiles */}
            {filteredConnections?.map((u) => (
              <Link
                key={u?._id}
                to={`/profile/${u?.username}`}
                className="flex flex-col items-center border border-gray-300 p-4 rounded-lg min-w-[150px] max-w-[200px] shadow-lg hover:shadow-2xl transition-shadow duration-300"
              >
                <img
                  src={u?.profilePicture || "/avatar.png"}
                  alt={u?.name}
                  className="h-20 w-20 rounded-full object-cover mb-2"
                />
                <p className="text-sm text-center font-semibold text-gray-800">{u?.name}</p>
                
                {/* Truncated Headline */}
                <p className="text-sm text-center text-gray-500 overflow-hidden text-ellipsis whitespace-nowrap max-w-[180px]">
                  {u?.headline}
                </p>

                <p className="text-sm text-center text-gray-400">
                  {u?.connections?.length} Connections
                </p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PeopleSimilar;
