import { useState } from "react"
import { formatDate } from "../utils/dateUtils";
import { Briefcase, X } from "lucide-react";

const ExperienceSection  = ({userData,isOwnProfile,onSave}) => {
  const [isEditing,setIsEditing] = useState(false);
  const [experience,setExperience] = useState(userData?.experience || []);
  const [newExperience,setNewExperience] = useState({
    title:"",
    company:"",
    startDate :"",
    endDate :"",
    description:"",
    currentlyWorking:false  //see isme yeh extra property humne dali hai from frontend so backend mein toh yeh pura jayega but backend mein hum extract kar rahe hai properties from that object if u look carefuk=lly so extra chheze bhi chalenge
  });

  
  const handleAddExperience = () =>{
    if(newExperience.title && newExperience.company && newExperience.startDate){
      setExperience([...experience,newExperience]);
      setNewExperience({
        title:"",
        company:"",
        startDate :"", //JavaScript automatically updates the type from an empty string to a date string(because state values can change their type dynamically in JavaScript.)
        endDate :"",  // Mongoose is implicitly converting the empty string to null for Date fields as we are sending empty string for no end date
        description:"",
        currentlyWorking:false
      })
    }
  }

  const handleDeleteExperience = (id) =>{
    setExperience(experience.filter((e)=> e._id!==id));
  }

  const handleCurrentlyWorkingChange = (e) => {
		setNewExperience({
			...newExperience,
			currentlyWorking: e.target.checked,
			endDate: e.target.checked ? "" : newExperience.endDate,
		});
	};

  const handleSave = () =>{
    onSave({experience});
    setIsEditing(false);
  }


  return (
    <div className='bg-white shadow rounded-lg p-6 mb-6'>
			<h2 className='text-xl font-semibold mb-4'>Experience</h2>
			{experience?.map((exp) => (
				<div key={exp._id} className='mb-4 flex justify-between items-start'>
					<div className='flex items-start'>
						<Briefcase size={20} className='mr-2 mt-1' />
						<div>
							<h3 className='font-semibold'>{exp.title}</h3>
							<p className='text-gray-600'>{exp.company}</p>
							<p className='text-gray-500 text-sm'>
								{formatDate(exp.startDate)} - {exp.endDate ? formatDate(exp.endDate) : "Present"}
							</p>
							<p className='text-gray-700'>{exp.description}</p>
						</div>
					</div>
					{isEditing && (
						<button onClick={() => handleDeleteExperience(exp._id)} className='text-red-500'>
							<X size={20} />
						</button>
					)}
				</div>
			))}


      {/* Only if it is our profile */}
			{isEditing && (
				<div className='mt-4'>
					<input
						type='text'
						placeholder='Title'
						value={newExperience.title}
						onChange={(e) => setNewExperience({ ...newExperience, title: e.target.value })} //...newExperience: This is the spread operator. It copies all properties of the existing newExperience object into a new object.
						className='w-full p-2 border rounded mb-2'
					/>
					<input
						type='text'
						placeholder='Company'
						value={newExperience.company}
						onChange={(e) => setNewExperience({ ...newExperience, company: e.target.value })}
						className='w-full p-2 border rounded mb-2'
					/>
					<input
						type='date'
						placeholder='Start Date'
						value={newExperience.startDate}
						onChange={(e) => setNewExperience({ ...newExperience, startDate: e.target.value })}
						className='w-full p-2 border rounded mb-2'
					/>
					<div className='flex items-center mb-2'>
						<input
							type='checkbox'
							id='currentlyWorking'
							checked={newExperience.currentlyWorking}// this checked is a boolean and can be accessed by e.target.checked
							onChange={handleCurrentlyWorkingChange}
							className='mr-2'
						/>
						<label htmlFor='currentlyWorking'>I currently work here</label>
					</div>
					{!newExperience.currentlyWorking && (
						<input
							type='date'
							placeholder='End Date'
							value={newExperience.endDate}
							onChange={(e) => setNewExperience({ ...newExperience, endDate: e.target.value })}
							className='w-full p-2 border rounded mb-2'
						/>
					)}
					<textarea
						placeholder='Description'
						value={newExperience.description}
						onChange={(e) => setNewExperience({ ...newExperience, description: e.target.value })}
						className='w-full p-2 border rounded mb-2'
					/>
					<button
						onClick={handleAddExperience}
						className='bg-primary text-white py-2 px-4 rounded hover:bg-primary-dark transition duration-300'
					>
						Add Experience
					</button>
				</div>
			)}

			{isOwnProfile && (
				<>
					{isEditing ? (
						<button
							onClick={handleSave}
							className='mt-4 bg-primary text-white py-2 px-4 rounded hover:bg-primary-dark transition duration-300'
						>
							Save Changes
						</button>
					) : (
						<button
							onClick={() => setIsEditing(true)}
							className='mt-4 text-primary hover:text-primary-dark transition duration-300'
						>
							Edit Experiences
						</button>
					)}
				</>
			)}
		</div>
	);
  
}


export default ExperienceSection