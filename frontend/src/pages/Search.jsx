import { useState } from "react"
import {useQuery} from "@tanstack/react-query"
import { axiosInstance } from "../lib/axios";

const Search = () => {

    const [name,setName] = useState("");
    
    const {data:searchedUsers} = useQuery({
        queryKey:["searchedUsers"],
        queryFn: async ()=>{
            console.log({name});
            
            const res = await axiosInstance.post('/users/searchUser',{name});
            return res.data;
        }
    })
    
    console.log("searchedUsers",searchedUsers);
    
    const handleSubmit = (e) =>{
        e.preventDefault();
        // console.log(name);
        
    }
  return (
    <div>
        <form onSubmit={handleSubmit}>
            <input type="text"
            value={name}
            onChange={(e)=>setName(e.target.value)}
            />
            <button type="submit">Search</button>
        </form>
    </div>
  )
}
export default Search