import { useState } from "react"

const ExperienceSection  = ({userData,isOwnProfile,onSave}) => {
  const [isEditing,setIsEditing] = useState(false);
  const [experience,setExperience] = useState(userData.experience || []);
  const [newExperience,setNewExperience] = useState({
    title:"",
    company:"",
    startDate :"",
    endDate :"",
    description:"",
    currentlyWorking:false
  });


  return (
    <div>
      {isOwnProfile && (
        isEditing ? (
          <>
          </>
        ) : (
          <>
          {experience && experience.map((e)=>(
            <div key={e._id}>
              <h1>{e.title}</h1>
              <h1>{e.company}</h1>
              <h1>{e.startDate}</h1>
              <h1>{e.endDate}</h1>

            </div>
          ))}
          </>
        )
      )}
      <>
      </>
    </div>
  )
}
export default ExperienceSection