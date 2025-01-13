const User = require("../models/userModel")
const cloudinary = require('../lib/cloudinary');


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

        const isSelfProfile = req.user.username.toString()===req.params.username.toString();
        const user = await User.findOneAndUpdate(
            {username:req.params.username},
            isSelfProfile?{}:
            {$push:
                {
                    profileViewers: {
                    user: req.user._id,
                    createdAt: new Date(),
                    },
                }
            },
            {new:true})
            .select("-password");

        if(!user){
            return res.status(404).json({message:"User not found"});
        }
        //add the profile in profileViewers too 
        
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

    //Uploading images

    if(req.body.profilePicture){
        const result = await cloudinary.uploader.upload(req.body.profilePicture);
        updatedData.profilePicture = result.secure_url;     //we are storing the url
    }

    if(req.body.bannerImg){
        const result = await cloudinary.uploader.upload(req.body.bannerImg);
        updatedData.bannerImg = result.secure_url;     //we are storing the url
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


const getProfileViewers = async (req,res) =>{

    try {
        const profileViewers = await User.findById(req.user._id).select("profileViewers")
        .populate("profileViewers.user","name username profilePicture headline");
        
        if(!profileViewers){
            return res.status(404).json({message:"Not found"});
        }

        
        res.status(200).json(profileViewers);

    } catch (error) {
        console.log("Error in getprofileViewers",error.message);
        res.status(500).json({message:"Server Error"});
    }
}

//This contains the ppl whom user have viewed 
const getMyActivityProfileViewers = async (req,res) =>{

    try {
        const myProfileViewers = await User.find({profileViewers:{$elemMatch:{user:req.user._id}}})
        .select("name username headline profilePicture");

        if(!myProfileViewers){
            return res.status(404).json({message:"No myProfileViewers"});
        }

        res.status(200).json(myProfileViewers);
    } catch (error) {
        console.log("Error in myProfileViewers",error);
        res.status(500).json({message:"Server Error"});
    }
}


const getSearchedUsers = async (req,res) =>{

    try {
        
        const {name} = req.body;
        
        if(!name){
            return res.status(404).json({message:"name is required"});
        }

        const result =await User.find({name:{$regex:name,$options:'i'}});//Search: case senstive - i and pattern matching  - regex

        if(!result){
            return res.status(404).json({message:"No user found"});
        }
        res.status(200).json(result);

    } catch (error) {
        console.log("Error ini getSearchedUsers",error);
        res.status(500).json({message:"Server Error"});
    }

}

module.exports = {
    getSuggestedConnections,
    getPublicProfile,
    updateProfile,
    getProfileViewers,
    getMyActivityProfileViewers,
    getSearchedUsers
}