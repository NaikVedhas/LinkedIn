import { createContext, useContext, useState } from "react";
import {io} from "socket.io-client";


export const SocketIoContext =  createContext(null);

export const useSockeetIoContext = () => useContext(SocketIoContext);

export const SocketIoContextProvider = (props) => {







    //store all the socket io info and functions here
    const [socket,setSocket] = useState(null);
    const [socketId,setSocketId] = useState("");



    return <SocketIoContext.Provider value={{socketId,setSocketId,setSocket,socket}}>
        {props.children}
    </SocketIoContext.Provider>
}