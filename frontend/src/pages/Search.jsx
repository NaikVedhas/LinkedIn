import { useMutation } from "@tanstack/react-query";
import { useState } from "react"
import { axiosInstance } from "../lib/axios";



// Show  all the users first here and then 
const Search = () => {
  
  
  const [name,setName] = useState("");

  const {data:searchUsers,mutate} = useMutation({
    mutationKey:["searchUsers"],
    mutationFn: async (name)=>{
        const res = await axiosInstance.post('/users/searchUser',{name})
        return res.data;
    },
    onError: async (error) =>{
        toast.error(error.message || "Something went wrong try again");
    }
  })
  
   
   const handleSubmit = (e)=>{
    console.log("Inisde handleSubmit");
    e.preventDefault();
 
    mutate(name);
   }
   console.log("searchUsers",searchUsers);
   
    return (
    <div>
        <form onSubmit={handleSubmit}>
            <input 
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            />
            <button>Submit</button>
        </form>
        {searchUsers && searchUsers}
    </div>
  )
}
export default Search