import {io} from "socket.io-client";
//create the socket
import { useQuery } from "@tanstack/react-query";

const socketConnect = () =>{

    const {data:authUser} = useQuery({queryKey:["authUser"]});
    console.log("in socket",authUser);
    
    const socket =  io(import.meta.env.VITE_BACKEND_URL,{
        query:{
            userId:authUser?._id     //we will send the connected userId to backend
        },
        autoConnect:false,
        withCredentials:true
    });
    return socket;   
}


export default socketConnect;

