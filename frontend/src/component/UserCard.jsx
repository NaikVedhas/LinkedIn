import MutualConnections from "./MutualConnections"
import { Link } from "react-router-dom";

function UserCard({ user}) {
	return (
		<div className='bg-white rounded-lg shadow p-4 flex flex-col items-center transition-all hover:shadow-2xl'>
			<Link to={`/profile/${user?.username}`} className='flex flex-col items-center'>
				<img
					src={user?.profilePicture || "/avatar.png"}
					alt={user?.name}
					className='w-24 h-24 rounded-full object-cover mb-4'
				/>
				<h3 className='font-semibold text-lg text-center'>{user?.name}</h3>
			<p className='text-gray-600 text-center'>{user?.headline}</p>
			<p className='text-sm text-gray-500 mt-2'>{user?.connections?.length} connections</p>
			</Link>
			{/* <button className='mt-4 bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark transition-colors w-full'>
				{isConnection ? "Connected" : "Connect"}
			</button> */}
			<MutualConnections user={user}/>
		</div>
	);
}

export default UserCard;
