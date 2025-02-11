import { createContext, useContext, useEffect, useState } from "react";
import {io} from "socket.io-client";
import { useQuery } from "@tanstack/react-query";


export const SocketIoContext =  createContext(null);

export const useSockeetIoContext = () => useContext(SocketIoContext);

export const SocketIoContextProvider = (props) => {

    //store all the socket io info and functions here
    const [socketId,setSocketId] = useState("");
    const [socket,setSocket] = useState(null); 
    const [onlineUsers,setOnlineUsers] = useState([]);
    const {data:authUser} = useQuery({queryKey:["authUser"]});

    useEffect(()=>{
        if(authUser){
        const socket =  io(import.meta.env.VITE_BACKEND_URL,{
            query:{
                userId:authUser?._id     //we will send the connected userId to backend
            },
            autoConnect:false,
            withCredentials:true
        });
        setSocket(socket);
        if(socket){
            socket.connect();
            console.log("Called me socketcontext");
            setSocketId(socket.id);
        }
    }
        
    },[authUser])

    
    return <SocketIoContext.Provider value={{socketId,setSocketId,socket,setSocket,onlineUsers,setOnlineUsers}}>
        {props.children}
    </SocketIoContext.Provider>
}