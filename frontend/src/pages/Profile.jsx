import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router"
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import ProfileHeader from "../component/ProfileHeader"
import ExperienceSection from "../component/ExperienceSection"
import EducationSection from "../component/EducationSection"
import AboutSection from "../component/AboutSection"
import SkillsSection from "../component/SkillSection"

const Profile = () => {
    
    //So we have 2 cases that we are viewing our own profile or other profile in our own profile we want edit option too. So in every section we will pass a isUser, userdata(which will again depend on isuser) and saveupdate function which will take the updated data and just update it from here
  
    const {username} = useParams();
    const queryClient = useQueryClient();
    const {data:authUser,isLoading} = useQuery({queryKey:["authUser"]});

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
            toast.error(err.response.data.message||"An error occured");
        }

    })


    if(isLoading || isUserProfileLoading) {
        return <div>Loading</div>
    }

    const isOwnProfile = authUser.username === userProfile?.username; 
	const userData = isOwnProfile ? authUser : userProfile; 


    const handleSave = (updatedData) => {  //whichever component we will updatewe want to call this function from here
		updateProfile(updatedData);
        
	};

    return (
    <div>
        <div className='max-w-4xl mx-auto p-4'>
			<ProfileHeader userData={userData} isOwnProfile={isOwnProfile} onSave={handleSave} />
			<AboutSection userData={userData} isOwnProfile={isOwnProfile} onSave={handleSave} />
			<ExperienceSection userData={userData} isOwnProfile={isOwnProfile} onSave={handleSave} />
			<EducationSection userData={userData} isOwnProfile={isOwnProfile} onSave={handleSave} />
			<SkillsSection userData={userData} isOwnProfile={isOwnProfile} onSave={handleSave} />
		</div>
    </div>
  )
}
export default Profile