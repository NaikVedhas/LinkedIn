const  ConnectionRequest  = require("../models/connectionModel");
const User = require("../models/userModel")
const Notification = require('../models/notificationModel')
require('dotenv').config();

const getUserConnections = async (req,res)=>{

    try {
        
        const connections = await User.findById(req.user._id).select("connections").sort({createdAt:-1});

        if(!connections){
            return res.status(404).json({message:"No connections found"});
        }

        res.status(200).json(connections);
    } catch (error) {
        console.log("Error in getUSerConnections",error);
        res.status(500).json({message:"Server error"});
    }

}


const sendConnectionRequest = async (req,res)=>{

    try {
        
        const userId = req.params.id; //the user to which we are sending request

        if(userId.toString()===req.user._id){
            return res.status(400).json({message:"You cannot send request to yourself"});
        }

        if(req.user.connections.includes(userId)){
            return res.status(400).json({message:"You are already connected"});
        }

        const existingRequest = await ConnectionRequest.findOne({
            sender:req.user._id,
            recipient:userId,
            status:"pending"
        });

        if(existingRequest){
            return res.status(400).json({message:"Request is already send"});
        }

        const newRequest = ConnectionRequest.create({
            sender:req.user._id,
            recipient:userId,
        });

        if(!newRequest){
            return res.status(400).json({message:"Error in sending connection request"});
        }

        res.status(200).json({mesage:"Connection request snet succcessfully"});

    } catch (error) {
        console.log("Error in Error in sending connection request");
        res.status(500).json({message:"Server Error"});
    }
}

const acceptConnectionRequest = async (req,res)=>{
    
    try {
        const requestId = req.params.id;  //this is the id of connection document in connectionrequest model.
        
        const request = await ConnectionRequest.findById(requestId)
        .populate("sender","name username connections email")    //we will send a email to sender that we accepedt the req so we need populate data
        .populate("recipient","name connections username");

        if(!request){
            return res.status(400).json({message:"No request exist"});
        }

        //Chcek if the user is accepting his request only
        if(request.recipient._id.toString()!==req.user._id){ //even if we dont write id in populate we still get it by default
            return res.json(401).json({message:"You are not authorized"});
        }

        if(request.status!=="pending"){
            return res.status(400).json({message:"Request is already processed"})
        }

        request.status="accepted";
        await request.save();

        //Now upate the connection array of sender and recipient


        // im not sure we can do by this or not but check this at the and 
        // request.sender.connections.push(userId);
        // await request.sender.save();
        // request.recipient.connections.push(request.sender._id);
        // await request.recipient.save();

        await User.findByIdAndUpdate(request.recipient._id,{$addToSet:{connections:request.sender._id}});
        await User.findByIdAndUpdate(request.sender._id,{$addToSet:{connections:request.recipient._id}});

        const notification = await Notification.create({
            recipient:request.sender._id,
            type:"connectionAccepted",
            relatedUser:request.recipient._id,
        });

        if(!notification){
            return res.status(400).json({message:"Error in notification"})
        }

        const senderName= request.sender.name;
        const recipientName = request.recipient.name;
        const profileUrl = process.env.CLIENT_URL + '/profile/'+request.recipient.username;
        const senderEmail = request.sender.email;
        try {
            await sendConnectionAcceptedEmail(senderName,recipientName, profileUrl,senderEmail)
        } catch (error) {
           console.log("Error in sending email",error);
        }

        res.status(200).json({message:"Connection request accepted"});
    } catch (error) {
        console.log("Error in acceptConnectionReques",error);
        res.status(500).json({message:"Server Error"});
        
    }
}

const rejectConnectionRequest = async (req,res)=>{

    try {
        const requestId = req.params.id;
        
    } catch (error) {
        
    }
}
module.exports = {
    getUserConnections,
    sendConnectionRequest,
    acceptConnectionRequest,
    rejectConnectionRequest,
}