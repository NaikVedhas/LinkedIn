const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({

    //The combination is type: mongoose.Schema.Types.ObjectId  and ref is like a foreign key of sql dbs.Also ref can only be used when type ie this ha  
    author:{
        type:mongoose.Schema.Types.ObjectId, // Use ObjectId for referencing another document.
        required:true,
        ref:"User"    // Referencing the User model
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
            content:{ 
                type:String,
                required:true
            },
            user:{type:mongoose.Schema.Types.ObjectId,ref:"User"},
            createdAt:{type:Date,default:Date.now}
        }
    ]
  
},{timestamps:true});

const Post = mongoose.model('Post',postSchema);

module.exports = Post;
