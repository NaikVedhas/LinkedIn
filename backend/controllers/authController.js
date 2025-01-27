const User = require('../models/userModel')
const OTP = require('../models/otpModel')
const TempUser = require('../models/temporaryUserModel')
const validator =  require('validator');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const {sendWelcomeEmail,sendOTP} = require('../emails/emailHandlers')
const otpGenerator = require('otp-generator');

//we will use this signup if there was no otp verification

// const signup =async (req,res)=>{
    
//     try {
//         const {name,username,email,password} = req.body;
        
//         if(!email||!username||!name||!password){
//             return res.status(400).json({message:"All fields are required"});
//         }
    
//         const existEmail = await User.findOne({email});
//         if(existEmail){
//             return res.status(400).json({message:"User already exists"});
//         }
//         const existusername = await User.findOne({username});
//         if(existusername){
//             return res.status(400).json({message:"User already exists"});
//         }
        
//         if(!validator.isStrongPassword(password)){
//             return res.status(400).json({message:"Password not strong enough"})
//         }
//         if(!validator.isEmail(email)){
//             return res.status(400).json({message:"Invalid Email"})
//         }


//         const salt = await bcrypt.genSalt(10);
//         const hashedPassoword = await bcrypt.hash(password,salt);

//         const user = await User.create({email,name,username,password:hashedPassoword});

//         const token = jwt.sign({userId: user._id},process.env.SECRET,{expiresIn:'3d'});

//         res.cookie('jwt-linkedin',token,{
//             httpOnly:true, //prevent XSS attack
//             maxAge:3*24*60*1000,      //3 days basically in mili sec
//             sameSite:"strict",  //prevent CSRF attacks 
//             secure:process.env.NODE_ENV==="production", //prevents man-in-middle attacks
//         })

//         //Sending welcome email

//         const profileUrl = process.env.CLIENT_URL+"/profile/"+user.username; //by clicking on this url in the email, he will go on his profile 

//         //We are adding this in another try and catch and not in main block of try and catch bec if there is some error in sending email then we dont wanna send the res of 501 and internal server error bec user will be registered na this si something extra that we are doing

//         try {
//             await sendWelcomeEmail(user.email,user.name,profileUrl);
//         } catch (emailError) {
//             console.error("Error sending welcome email",emailError);
//         }

//         res.status(201).json({message:"User successfully registered"});

// } catch (error) {
    
//     console.log("Error in signup:",error.message);
//     res.status(501).json({message:"Internal Server Error"});

// }
    
// };


const signup1 = async (req,res)=>{

    try {
        const {name,username,email,password} = req.body;
        
        if(!email||!username||!name||!password){
            return res.status(400).json({message:"All fields are required"});
        }
    
        const existEmail = await User.findOne({email});
        if(existEmail){
            return res.status(400).json({message:"User already exists"});
        }
        const existusername = await User.findOne({username});
        if(existusername){
            return res.status(400).json({message:"User already exists"});
        }
        
        if(!validator.isStrongPassword(password)){
            return res.status(400).json({message:"Password not strong enough"})
        }
        if(!validator.isEmail(email)){
            return res.status(400).json({message:"Invalid Email"})
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassoword = await bcrypt.hash(password,salt);

        const tempUser = await TempUser.create({email,name,username,password:hashedPassoword});

        
        //Generating OTP - We will use Otpgenerator package 
        
        const otp = otpGenerator.generate(6, {
            upperCaseAlphabets: true,  
            lowerCaseAlphabets: true,
            specialChars: false,
        });

        // Send otp in model encrpt it first
        const saltOTP = await bcrypt.genSalt(10);
        const hashedOTP = await bcrypt.hash(otp,saltOTP);
        
        await OTP.create({
            otp:hashedOTP,
            email:email,
        });
        
        //Send otp on email
        const verificationUrl = process.env.CLIENT_URL + '/signup'
        await sendOTP(email,name,otp,verificationUrl);

        //So we have associated email and otp together 

        res.status(200).json(tempUser._id);   //dont send the tempuser send only id and then in signup2 retrive that tempuser using id 

    } catch (error) {
        console.log("Error in Signup1 function",error);
        res.status(500).json({message:"Internal Server Error please try again later"});
        
    }
};

const signup2 = async (req,res)=>{

    //Verify the otp first

    const {otp,id}= req.body;

    //Retrieve that user from tempUser db 

    const tempUser =  await TempUser.findById(id);

    if(!tempUser){      //means tempUser expired so navigate him to signup again and create a new tempUser
        return res.status(404).json({message:"Validation timed out. Please signup again"})
    }

    const otpUser = await OTP.findOne({email:tempUser.email});

    if(!otpUser){
        return res.status(400).json({message:"OTP expired"});
    }

   
    const isOTPValid = await bcrypt.compare(otp, otpUser.otp);
    if(!isOTPValid){
        return res.status(401).json({message:"Incorrect OTP"});
    }

    //Now user is verified so create a account 

    const user = await User.create({email:tempUser.email,name:tempUser.name,username:tempUser.username,password:tempUser.password});

    const token = jwt.sign({userId: user._id},process.env.SECRET,{expiresIn:'3d'});

    res.cookie('jwt-linkedin',token,{
            httpOnly:true, //prevent XSS attack
            maxAge:3*24*60*1000,      //3 days basically in mili sec
            sameSite:"strict",  //prevent CSRF attacks 
            secure:process.env.NODE_ENV==="production", //prevents man-in-middle attacks
    })

    //Sending welcome email

    const profileUrl = process.env.CLIENT_URL+"/profile/"+user.username; //by clicking on this url in the email, he will go on his profile 

    //We are adding this in another try and catch and not in main block of try and catch bec if there is some error in sending email then we dont wanna send the res of 501 and internal server error bec user will be registered na this si something extra that we are doing

        try {
            await sendWelcomeEmail(user.email,user.name,profileUrl);
        } catch (emailError) {
            console.error("Error sending welcome email",emailError);
        }

    res.status(201).json({message:"User successfully registered"});
}

const reSendOtp = async (req,res) =>{
    try {
        const {id}= req.body;

        const tempUser = await TempUser.findById(id);

        if(!tempUser){
            return res.status(404).json({message:"Validation timed out. Please signup again"});
        }

        const otp = otpGenerator.generate(6, {
            upperCaseAlphabets: true,  
            lowerCaseAlphabets: true,
            specialChars: false,
        });

        // Send otp in model encrpt it first
        const saltOTP = await bcrypt.genSalt(10);
        const hashedOTP = await bcrypt.hash(otp,saltOTP);
        
        await OTP.create({
            otp:hashedOTP,
            email:tempUser.email,
        });
        
        //Send otp on email
        const verificationUrl = process.env.CLIENT_URL + '/signup'
        await sendOTP(tempUser.email,tempUser.name,otp,verificationUrl);

        res.status(200).json({message:"OTP send successfully"});

    } catch (error) {
        console.log("Error in resend otp function",error);
        res.status(500).json({message:"Server Error please try again later"})
        
    }
}


const login = async (req,res)=>{
   

    try {
        
        const {username,password} = req.body;

        if(!username ||!password){
            return res.status(400).json({message:"All fields are required"});
        }

        const existUser = await User.findOne({username});

        if(!existUser){
            return res.status(400).json({message:"Incorrect credentials"})
        }

        const match = await bcrypt.compare(password,existUser.password);

        if(!match){
            return res.status(400).json({message:"Incorrect credentials"})
        }

        const token = jwt.sign({userId: existUser._id},process.env.SECRET,{expiresIn:'3d'});

        res.cookie('jwt-linkedin',token,{
            httpOnly:true, //prevent XSS attack
            maxAge:3*24*60*1000,      //3 days basically in mili sec
            sameSite:"strict",  //prevent CSRF attacks 
            secure:process.env.NODE_ENV==="production", //prevents man-in-middle attacks
        })

        res.status(200).json({message:"Logged in Successfully"})

    } catch (error) {
        console.log("Error in login controller",error);
        res.status(500).json({message:"Server Error"})
    }
};

const logout = async (req,res)=>{
    res.clearCookie('jwt-linkedin');
    res.json({message:"Logged out successfully"});
};

const getCurrentUser = async (req,res)=>{

    try {
        res.json(req.user);
    } catch (error) {
        console.log("Errro in getting getCurrentUser",error.message);
        res.status(500).json({message:"Server error"});
    }
}


module.exports = {
    signup1,
    signup2,
    login,
    logout,
    getCurrentUser,
    reSendOtp
}