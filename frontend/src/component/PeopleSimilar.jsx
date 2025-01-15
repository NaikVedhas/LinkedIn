import { Link } from "react-router-dom";

const PeopleSimilar = ({ userData, isOwnProfile }) => {
  const totalProfiles = userData?.connections?.length || 0;

  return (
    <div>
      {!isOwnProfile && userData && totalProfiles > 0 && (
         <div className="bg-white shadow rounded-lg mb-6 overflow-x-scroll scrollbar"> {/*due to overflow-x-scroll scrollbar we got that scrollbar and we have it style in index.css*/}
          <div className="flex space-x-4 min-w-max p-4">
            {userData?.connections?.map((u) => (
              <Link
                key={u._id}
                to={`/profile/${u.username}`}
                className="flex flex-col items-center border border-gray-300 p-4 rounded-lg"
              >
                <img
                  src={u.profilePicture || "/avatar.png"}
                  alt={u.name}
                  className="h-24 w-24 rounded-full object-cover mb-2"
                />
                <p className="text-sm text-center">{u.name}</p>
                <p className="text-sm text-center">{u.headline}</p>
                <p className="text-sm text-center">{u.connections?.length} Connections</p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PeopleSimilar;
