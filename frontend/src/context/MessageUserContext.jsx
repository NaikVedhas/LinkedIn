//This context will store the selected whole user(the user whose chats will be shown)

import { useContext,createContext, useState } from "react";

export const MessageUserContext = createContext(null);

export const useMessageUserContext = () =>{
  return useContext(MessageUserContext);
}

export const MessageUserContextProvider = (props) => {
   
    const [selectedUser,setSelectedUser] = useState()

   return <MessageUserContext.Provider value={{selectedUser,setSelectedUser}}>
        {props.children}
    </MessageUserContext.Provider>
}