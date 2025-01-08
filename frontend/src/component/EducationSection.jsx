import { useState } from "react"

const EducationSection = ({userData,isOwnProfile,onSave}) => {
  
  const [isEditing,setIsEditing] = useState(false);
  const [education,setEducation] = useState(userData.education || [])
  const [newEducation,setNewEducation]= useState({
    school:"",
    feildOfStudy:"",
    startYear:"",
    endYear:""
  })
  
  
  return (
    <div>EducationSection</div>
  )
}
export default EducationSection