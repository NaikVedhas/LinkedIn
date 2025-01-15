const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const protectRoute = async (req,res,next) =>{


    try {
        const token =  req.cookies['jwt-linkedin'];
        if(!token){
            return res.status(401).json({message:"Token is required"});
        }

        const decoded = jwt.verify(token,process.env.SECRET); //This is our decoded token

        if(!decoded){
            return res.status(401).json({message:"Unauthorized - Invalid Token"})
        }

        const user = await User.findById(decoded.userId).select("-password");   //here we found that user and stored in user baas password remove kiya bec it is of no use

        if(!user){
            return res.status(401).json({message:"User not found"});
        }
        req.user = user;    //Attached the user to req 
        next();

    } catch (error) {
        
        console.log("Error in protected route:",error.message);
        return res.status(500).json({message:"Internal Server error,Please try again later"});
        
    }
}


module.exports = protectRoute;