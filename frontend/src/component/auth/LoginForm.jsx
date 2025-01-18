import { useMutation, useQueryClient } from "@tanstack/react-query";
import {Loader} from "lucide-react";  // Icon from Lucide
import { useState } from "react";
import { axiosInstance } from "../../lib/axios";
import toast from "react-hot-toast";



const LoginForm = () => {


    const [username,setUsername] = useState('');
    const [password,setPassword] = useState('');

    const queryClient = useQueryClient();
    const {mutate:loginMutation,isLoading} = useMutation({
        mutationFn: async (data) =>{
            const res = await axiosInstance.post('/auth/login',data);
            return res;
        },
        onSuccess:()=>{
            toast.success("Logged in Successfully");
            queryClient.invalidateQueries({queryKey:["authUser"]});
        },
        onError:(err)=>{
            toast.error(err?.response?.data?.message || "Something went wrong");
        }
    })

    const handleLogin = (e)=> {
        e.preventDefault();
        loginMutation({username,password});
    }
  return (
    
    <div>
        <form onSubmit={handleLogin}  className="flex flex-col gap-2">

            <input 
            type="text"
            placeholder="username"
            value={username}
            onChange={(e)=>setUsername(e.target.value)}
            className="input input-bordered w-full"
            required            
            />
            <input 
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e)=>setPassword(e.target.value)}
            className="input input-bordered w-full"
            required            
            />
            <button 
            disabled={isLoading}
            type="submit"
            className="btn btn-primary w-full text-white"
            >
            {isLoading ? <Loader className='w-5 h-5 animate-spin mx-auto' />:"Login"}

            </button>
        </form>
    </div>
  )
}
export default LoginForm