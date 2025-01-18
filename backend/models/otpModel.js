const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
    otp:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    createdAt: {       //this createdAt is TTL (Time-to-Live) indexes.A TTL index in MongoDB is used to automatically expire documents after a certain period of time. when we put "expires" kisi chheez main dalenge toh mongo understands ait and automatically mark it as a TTL index 
        type:Date,
        default: Date.now,
        expires: 60*2, //this document will automactically get deleted from db in 2 min
    }
},{timestamps:true});

const OTP = mongoose.model('Otp',otpSchema);
module.exports = OTP;