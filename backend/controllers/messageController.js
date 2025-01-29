const Message = require('../models/messagesModel');
const User = require('../models/userModel');

const getSidebarUsers = async (req,res)=>{

    //We will how all connections here 
    try {
        const user = User.find({_id:{
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

module.exports = {
    getSidebarUsers
}