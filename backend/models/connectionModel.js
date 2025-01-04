const mongoose = require('mongoose');

const connectionSchema = mongoose.Schema({

    sender:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    recipient:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    status:{
        type:String,
        enum:["pending","accepted","rejected"],
        default:"pending",
    }
},{timestamps:true});


const ConnectionRequest = mongoose.model('Connection',connectionSchema);


module.exports= ConnectionRequest;