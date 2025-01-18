const  ConnectionRequest  = require("../models/connectionModel");
const User = require("../models/userModel")
const Notification = require('../models/notificationModel')
require('dotenv').config();
const {sendConnectionAcceptedEmail} = require('../emails/emailHandlers');

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
        const requestId = req.params.requestId;  //this is the id of connection document in connectionrequest model.
        
        const request = await ConnectionRequest.findById(requestId)
        .populate("sender","name username connections email")    //we will send a email to sender that we accepedt the req so we need populate data
        .populate("recipient","name connections username");
        
        if(!request){
            return res.status(400).json({message:"No request exist"});
        }
        
        //Chcek if the user is accepting his request only
        if(request.recipient._id.toString()!==req.user._id.toString()){ //even if we dont write id in populate we still get it by default
            return res.status(401).json({message:"You are not authorized"});
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
        const requestId = req.params.requestId;
        
        const request = await ConnectionRequest.findById(requestId);
        if(!request){
            return res.status(404).json({message:"No request found"});
        }
        
        if(request.recipient.toString()!==req.user._id.toString()){
            return res.status(401).json({message:"Not authorized to reject this"});
        }
        
        if(request.status!=="pending"){
            return res.status(400).json({message:"Request already resolved"});
        }
        
        request.status = "rejected",
        await request.save();
        
        res.status(200).json({message:"Request rejected successfully"});
        
        
    } catch (error) {
        console.log("Error in rejectConnectionRequest",error);
        res.status(500).json({message:"Server error"});
        
    }
}


const getConnectionRequest = async (req,res) =>{ //this will give all request which are pending
    
    try {
        const request = await ConnectionRequest.find({recipient:req.user._id,status:"pending"})
        .populate("sender","name username profilePicture headline connections")
        .sort({createdAt:-1})
        
        if(!request){
            return res.status(404).json({mesage:"No request found"});
        }
        
        res.status(200).json(request);
    } catch (error) {
        console.log("Error in getConnectionRequest",error);
        res.status(500).json({message:"Server Error"})
    }
    
}

const getUserConnections = async (req,res)=>{ //get all connections of user

    try {
        
        const user = await User.findById(req.user._id)
        .populate("connections","name username profilePicture headline connections");

        if(!user){
            return res.status(404).json({message:"No connections found"});
        }

        res.status(200).json(user.connections);
    } catch (error) {
        console.log("Error in getUSerConnections",error);
        res.status(500).json({message:"Server error"});
    }

}

const removeConnection = async (req,res) =>{

    try {
        const otherId = req.params.id; // we are removing this other person

        await User.findByIdAndUpdate(otherId,{$pull:{connections:req.user._id}});
        await User.findByIdAndUpdate(req.user._id,{$pull:{connections:otherId}});

        res.status(200).json({message:"Successfully removed connection"});

    } catch (error) {
        console.log("Error in removeConnection",error);
        res.status(500).json({message:"Server Error"});
    }
}


const getConnectionStatus = async (req,res) =>{
    
    try {
        const targetUserId = req.params.id;
        const currentUserId = req.user._id;

        const currentUser = req.user;

        if(currentUser.connections.includes(targetUserId)){
            return res.json({status:"connected"});
        }

        const pendingRequest = await ConnectionRequest.findOne({
            $or:[
                {sender:currentUserId,recipient:targetUserId},
                {sender:targetUserId,recipient:currentUserId},
            ],
            status:"pending",
        });

        if(pendingRequest){
            if(pendingRequest.sender.toString()===currentUserId.toString()){
                return res.json({status:"pending"});
            }else{
                return res.json({status:"received",requestId:pendingRequest._id});
            }
        }

        res.json({status:"not_connected"});
    } catch (error) {
        console.error("Error in getConnectionStatus",error);
        res.status(500).json({message:"Server Error"});
        
    }
}


const followUser = async (req,res) =>{

    try {
        const {id} = req.params;           //we have to follow this user

        if(id.toString()===req.user._id.toString()){
            return res.status(400).json({message:"Cant send follow request to yourself"});
        }

        const user = await User.findByIdAndUpdate(id,{$push:{followers:req.user._id}},{new:true});
        const me = await User.findByIdAndUpdate(req.user._id,{$push:{following:id}},{new:true});

        if(!user || !me){
            return res.status(404).json({message:"No user found"});
        }
        
        res.status(200).json({message:`You started following ${user?.name}` })
    } catch (error) {
        console.log("Error in followUser",error);
        res.status(500).json({message:"Server Error, Please try again later"});
    }

}


const unFollowUser = async (req,res)=>{

    try {
        const {id} = req.params;  

        if(id.toString()===req.user._id.toString()){
            return res.status(400).json({message:"Cant unfollow yourself"});
        }

        const user = await User.findByIdAndUpdate(id,{$pull:{followers:req.user._id}},{new:true});
        const me = await User.findByIdAndUpdate(req.user._id,{$pull:{following:id}},{new:true});

        if(!user || !me){
            return res.status(404).json({message:"No user found"});
        }

        res.status(200).json({message:`You unfollowed ${user.name}` })
    } catch (error) {
        console.log("Error in unfollowUser",error);
        res.status(500).json({message:"Server Error, Please try again later"});
    }
}
module.exports = {
    getUserConnections,
    sendConnectionRequest,
    acceptConnectionRequest,
    rejectConnectionRequest,
    getConnectionRequest,
    removeConnection,
    getConnectionStatus,
    followUser,
    unFollowUser
}