const {Server} = require("socket.io")
const http = require('http');

//We build socket server on the top of our app server(node+express).

const express = require('express');


const app = express();

const server = http.createServer(app);

const io= new Server(server,{
    cors:({      //we are usong this to handle cors error
        origin:"http://localhost:5173",
        credentials:true    // this means that allow origin to sned cookies along with response
    })
})

module.exports = {io,app,server}