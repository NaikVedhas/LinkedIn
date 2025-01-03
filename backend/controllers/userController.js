const User = require("../models/userModel")



const getSuggestedConnections = async (req,res) =>{

    try {
        
        const currentUser = await User.findById(req.user._id).select("connections");

        //Finf users who are not connections and also dont find ourself

        const suggestedUser = await User.find({
            _id:{
                $ne:req.user._id, $nin:currentUser.connections //here $ne means not equal to and $nin means not in
            }
        }).select("name username profilePicture headline").limit(5);    //and select only these fields of 5 ppl

        res.status(200).json(suggestedUser); 


    } catch (error) {
        console.log("Error in getSuggestedConnections ",error);
        res.status(500).json({message:"Server Error"})
    }

}


const getPublicProfile = async (req,res) => {

    try {
        
        const user = await User.findOne({username:req.params.username}).select("-password");

        if(!user){
            return res.json(404).json({message:"User not found"});
        }

        res.status(200).json(user)


    } catch (error) {
        console.log("Error in getPublicProfile",error);
        res.status(500).json({message:"Server Error"});
        
    }
}
module.exports = {
    getSuggestedConnections,
    getPublicProfile
}