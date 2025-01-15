const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    name:{
        type:String,
        required:true,
    },
    username:{
        type:String,
        required:true,
        unique:true
    },
    profilePicture:{
        type:String,
        default:""
    },
    bannerImg:{
        type:String,
        default:""
    },
    headline:{
        type:String,
        required:true,
        default:"LinkedIn User"
    },
    location:{
        type:String,
        default:"Earth"
    },
    about:{
        type:String,
        default:""
    },
    skills:[String],
    experience:[   //it is an array if objects and each object will also get an id
        {
            title:String,
            company:String,
            startDate :Date,
            endDate :Date,
            description:String
        }
    ],
    education:[ 
        {
            school:String,
            feildOfStudy:String,
            startYear:Number,
            endYear:Number        //these are numbers not data like 2022
        }
    ],
    connections:[{     //we willstore the id of the connections
        type:mongoose.Schema.Types.ObjectId, ref:"User"
    }],
    following:[{
        type:mongoose.Schema.Types.ObjectId, ref:"User"
    }],
    followers:[{
        type:mongoose.Schema.Types.ObjectId, ref:"User"
    }],
    profileViewers :[
        {
            user:{type:mongoose.Schema.Types.ObjectId, ref:"User"},
            createdAt:{type:Date,default:Date.now}
    }]

},{timestamps:true});


const User = mongoose.model("User",userSchema);

module.exports = User;