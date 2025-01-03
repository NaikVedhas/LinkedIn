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


const updateProfile = async (req,res) =>{

    try {
        //Jo feild user batayenga woh update karna padega so we use this method 
        const allowedFields = [
        "name",
        "about",
        "username",       
        "location",
        "profilePicture",
        "bannerImg",
        "headline",
        "education",
        "experience",
        "skills"
        ];

    const updatedData = {};

    for(const field of allowedFields){  //so this will iterate and find req mein konse konose updates reqyuired hai and then just fill up the updatedData array
        if(req.body[field]){
            updatedData[field] = req.body[field];
        }
    }

    const user = await User.findByIdAndUpdate(req.user._id,{$set:updatedData},{new:true,runValidators: true}).select("-password"); // here humne us data ko update kiya also new:true matlab updated user store hoga in user not the old one(if we dont add this then old vala response ayega) and the runValidators true means while updating the info it will chcek the model contraints like uniqueness  etc with more power

    res.status(200).json(user);


} catch (error) {
     
    if (error.code === 11000) { //this code mongodb gives for dupliacte key (for unique objects) ie joh joh unqie fileds hai unpe agar update ke time same hue kisi aur user ke sath toh yeh error ata hai 
        // Check which field caused the duplicate error
        if (error.keyPattern.username) {
          return res.status(400).json({ message: "Username already taken" });
        }
        if (error.keyPattern.email) {
          return res.status(400).json({ message: "Email already registered" });
        }
      }

    console.log("Error in updateProfile:",error);
    res.status(500).json({message:"Server Error"});
};

}
module.exports = {
    getSuggestedConnections,
    getPublicProfile,
    updateProfile
}