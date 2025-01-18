const mongoose = require('mongoose');

const tempUser = new  mongoose.Schema({

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
    createdAt:{
        type:Date,
        default:Date.now,
        expires:60*30                
    }
},{timestamps:true});

const TempUser = mongoose.model('TempUser',tempUser);

module.exports = TempUser;