const {Server} = require("socket.io")
const http = require('http');

//We build socket server on the top of our app server(node+express).

const express = require('express');


const app = express();

const server = http.createServer(app);

const io= new Server(server,{
    cors:{      //we are usong this to handle cors error
        origin:"http://localhost:5173",
        credentials:true    // this means that allow origin to sned cookies along with response
    }
})

//used to store online users a mpan which has key as useriod and value as socketid

const userSocketMap = {}  // {userId:socketId}

io.on("connection",(socket)=>{

    console.log("A user connected",socket.id);

    const userId = socket.handshake.query.userId;     // this userId will come from frontend
    if(userId){
        userSocketMap[userId] = socket.id;    //add to map
        console.log(userSocketMap);
        
    } 
        


    //emit an event as soon as a usr is connected
    io.emit("getOnlineUsers",Object.keys(userSocketMap))      //we will send only the userid to frontend(this will show which users are online)


    socket.on("disconnect",()=>{
        console.log("A user disconnected",socket.id);
        delete userSocketMap(userId);
        io.emit("getOnlineUsers",Object.keys(userSocketMap)); //send the updated data to frontend
    })
    

})


module.exports = {io,app,server}