const Message = require('../models/messagesModel');
const User = require('../models/userModel');
const cloudinary = require('../lib/cloudinary');

const getSidebarUsers = async (req,res)=>{

    //We will show all connections here 
    try {
        const user = await User.find({_id:{
            $ne:req.user._id,$in:req.user.connections
        }}).select("-password");

        if(!user){
            return res.status(404).json({message:"No users found"});
        }

        res.status(200).json(user);
    } catch (error) {
        console.log("Error in getSidebarUsers",error);
        res.status(500).json({message:"Server Error"});
    }
}

const getAllMessages = async (req,res) => {
    //We are taking the conversation between 2 ppl

    
    try {
       const {id} = req.params;   //id of the next person
        
       const messages = await Message.find({
        $or:[
            {receiverId:id,senderId:req.user._id},//either this and the comma inside the {} means the and opertion
            {receiverId:req.user._id,senderId:id}          //or this
        ]}
       )
       .populate("senderId","-password")
       .populate("receiverId","-password")
       .sort({createdAt:-1});

       if(!messages){
        return res.status(404).json({message:"No messages found"});
       }

       res.status(200).json(messages);

   } catch (error) {
        console.log("Error in getAllMessages",error);
        res.status(500).json({message:"Server Error"});
   }

}

const sendMessages = async (req,res) =>{
    
    try {
        const {id} = req.params;  //we will send message to this person
        const {text,image} = req.body;

        console.log("receiverId",id);
        console.log("sender",req.user._id);
        
        let imageURL;

        if(image){
            //Upload to cloundinary 
            const result = await cloudinary.uploader.upload(image);
            imageURL=result.secure_url;
        }
        
        const message = await Message.create({senderId:req.user._id,receiverId:id,text:text,image:imageURL},{new:true}); 
        //if there is image then it will store ulr or else it will store undefined
        
        if(!message){
            return res.status(400).json({message:"Error storing message"});
        }

        //todo add realtime functionality with socketio here 
        res.status(200).json(message);

    } catch (error) {
        console.log("Error in sendMessage",error);
        res.status(500).json({message:"Server Error"});
    }
}

module.exports = {
    getSidebarUsers,
    getAllMessages,
    sendMessages
}