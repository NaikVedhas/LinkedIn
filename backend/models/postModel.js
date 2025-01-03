const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({

    author:{
        type:String,
        required:true,
        ref:"User"
    },
    content:{
        type:String
    },
    image:{
        type:String
    },
    likes:[{   //this is an array of ids only
        type:mongoose.Schema.Types.ObjectId, 
        ref:"User"
    }],
    comments:[
        {      //but this is an array of object and we define the object then
            content:{type:String},
            user:{type:mongoose.Schema.Types.ObjectId,ref:"User"},
            createdAt:{type:Date,default:Date.now}
        }
    ]

},{timestamps:true});

const Post = mongoose.model('Post',postSchema);

module.exports = Post;
