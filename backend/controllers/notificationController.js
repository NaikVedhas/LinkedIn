const Notification = require("../models/notificationModel")

const getUserNotifications = async (req,res)=>{

    try {
        const notification = await Notification.find({recipient:req.user._id})
        .sort({createdAt:-1})
        .populate("relatedUser","name username profilePicture ")
        .populate("realtedPost","content image")

        if(!notification){
            return res.status(404).json({message:"No notifications found for this user"});
        }

        res.status(200).json(notification);

    } catch (error) {
        console.log("Error in getUserNotifications",error);
        res.status(500).json({message:"Server Error"});
    }

}

const markNotifiactionAsRead = async (req,res) =>{

    try {
        const notificationId= req.params.id;
        //receipeint hum hi chachiye na owner of notification i mean
        const notification = await Notification.findOneAndUpdate({_id:notificationId,recipient:req.user._id},{read:true},{new:true});

        if(!notification){
            return res.status(404).json({message:"No notification found"});
        }
        res.status(200).json(notification);

    } catch (error) {
        console.log("Error in markNotifiactionAsRead",error);
        res.status(500).json({message:"Server error"});
        
    }
}

const deleteNotification = async (req,res)=>{

    try {
        const notificationId = req.params.id;

        const notification = await Notification.findOneAndDelete({_id:notificationId,recipient:req.user._id});

        if(!notification){
            return res.status(404).json({message:"No notification found"});
        }

        res.status(200).json({message:"Deleted Successfully"});
    } catch (error) {
        console.log("Error in deleteNotification",error);
        res.status(500).json({message:"Server Error"})
        
    }
}

module.exports ={
    getUserNotifications,
    markNotifiactionAsRead,
    deleteNotification
}