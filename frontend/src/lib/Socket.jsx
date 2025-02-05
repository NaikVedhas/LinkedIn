import {io} from "socket.io-client";

//create the socket
 const socket =  io(import.meta.env.VITE_BACKEND_URL,{
    // query:{
    //     userId:authUser._id     //we will send the connected userId to backend
    // },
    autoConnect:false,
    withCredentials:true
});

export default socket;
