const Message = require('../models/messagesModel');
const User = require('../models/userModel');

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



module.exports = {
    getSidebarUsers,
    getAllMessages
}