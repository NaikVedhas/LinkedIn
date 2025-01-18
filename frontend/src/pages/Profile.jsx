import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router"
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import ProfileHeader from "../component/ProfileHeader"
import ExperienceSection from "../component/ExperienceSection"
import EducationSection from "../component/EducationSection"
import AboutSection from "../component/AboutSection"
import SkillsSection from "../component/SkillSection"
import Sidebar from "../component/Sidebar";
import RecommendedUser from "../component/RecommendedUser";
import { Link } from "react-router-dom";
import { ExternalLink,Loader  } from "lucide-react";
import PeopleSimilar from "../component/PeopleSimilar"

const Profile = () => {
    
    //So we have 2 cases that we are viewing our own profile or other profile in our own profile we want edit option too. So in every section we will pass a isUser, userdata(which will again depend on isuser) and saveupdate function which will take the updated data and just update it from here
  
    const {username} = useParams();
    const queryClient = useQueryClient();
    const {data:authUser,isLoading} = useQuery({queryKey:["authUser"]});


    const {data:recommendedUsers} = useQuery({ 
        queryKey:["recommendedUsers"],
        queryFn:async () =>{
          try {
          const res = await axiosInstance.get("/users/suggestions");
          return res.data;
          } catch (error) {
            toast.error("Unable to fetch recommended users");        
          }
        },
      });


    const {data:userProfile, isLoading: isUserProfileLoading} =  useQuery({
        queryKey:["userProfile",username],
        queryFn :  async ()=>{
            const res = await axiosInstance.get(`/users/${username}`);
            return res.data;
        }
    })

    
    const {mutate:updateProfile} = useMutation({
        mutationFn: async(updatedData)=>{
            const res = await axiosInstance.put('/users/profile',updatedData);
            return res;
        },
        onSuccess:()=>{
            toast.success("Profile Updated");
            queryClient.invalidateQueries({queryKey:["authUser"]}); 

        },
        onError: (err)=>{
            toast.error(err?.response?.data?.message||"An error occured");
        }

    })


    if(isLoading || isUserProfileLoading) {
        return  (
          <div className="flex items-center justify-center min-h-screen">
          <div className="flex flex-col items-center">
            <Loader className="animate-spin text-blue-500  text-5xl w-24 h-24 mb-4" />
            <p className="text-2xl text-gray-700">Loading...</p>
          </div>
        </div>
        );
    }

    const isOwnProfile = authUser?.username === userProfile?.username; //This is a boolean
	  const userData = isOwnProfile ? authUser : userProfile; 


    const handleSave = (updatedData) => {  //whichever component we will updatewe want to call this function from here
		updateProfile(updatedData);
        
	};

    return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6"> 
        
        <div className='hidden lg:block lg:col-span-1'>
                <Sidebar user={authUser} />
              </div>
        <div className='col-span-1 lg:col-span-2 order-first lg:order-none'>
			<ProfileHeader userData={userData} isOwnProfile={isOwnProfile} onSave={handleSave} />
      <PeopleSimilar userData={userData} isOwnProfile={isOwnProfile} authUser={authUser}/>
			<AboutSection userData={userData} isOwnProfile={isOwnProfile} onSave={handleSave} />
			<ExperienceSection userData={userData} isOwnProfile={isOwnProfile} onSave={handleSave} />
			<EducationSection userData={userData} isOwnProfile={isOwnProfile} onSave={handleSave} />
			<SkillsSection userData={userData} isOwnProfile={isOwnProfile} onSave={handleSave} />
		</div>
        {recommendedUsers?.length > 0 && (
          <div className='col-span-1 lg:col-span-1 hidden lg:block'>
            <div className='bg-secondary rounded-lg shadow p-4'>
              <h2 className='font-semibold mb-4'>People you may know</h2>
              {recommendedUsers?.slice(0, 5).map((user) => (
                <RecommendedUser key={user._id} user={user} />
              ))}
              <div >
              <Link 
                to="/search" 
                className="flex items-center p-2 space-x-1 text font-medium text-gray-600 hover:text-primary"
              >
                <span>See all suggestions </span>
                <ExternalLink size={18} className="hover:text-primary" />
              </Link>
             
              </div>
            </div>
          </div>
        )}
    </div>
  )
}
export default Profile