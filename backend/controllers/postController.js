const Post = require('../models/postModel');
const Notification = require('../models/notificationModel')
const cloudinary = require('../lib/cloudinary');
const User = require('../models/userModel');
const {sendCommentNotificationEmail} = require('../emails/emailHandlers');
require('dotenv').config();


const getFeedPosts = async (req,res)=>{

    try {
        //we are in post model only storing id of author so we need to go in ref model and find the other details that is done using populate method. Same for comments mein user pe (id)
        //only connections,self and main jisko follw karta hu unke post dikhaenge

        const posts = await Post.find({author:{$in: [...req.user.connections, req.user._id,...req.user.following]}})
        .populate('author',"name username profilePicture headline")
        .populate('comments.user',"name profilePicture")
        .sort({createdAt:-1});
        
        res.status(200).json(posts)
    } catch (error) {
        console.log("Error in getFeedPosts",error);
        res.status(500).json({message:"Server Error"});
        
    }

}

const createPost = async (req,res)=>{

    try {
        const {content,image} = req.body;

        let post;
        if(image){
            const result = await cloudinary.uploader.upload(image);
            post = await  Post.create({author:req.user._id,content,image:result.secure_url})  
        }else{
            post = await Post.create({author:req.user._id,content});
        }

        res.status(200).json(post);
    } catch (error) {
        console.log("Error in createPost",error);
        res.status(500).json({message:"Server Error"});
    }

}

const deletePost = async (req,res) =>{

    try {
        const postId = req.params.id;
        const userId = req.user._id;

        const post = await Post.findById(postId);
        
        if(!post){
            return res.status(404).json({message:"No post found"})
        }

        if(post.author.toString()!==userId.toString()){
            return res.status(403).json({message:"You dont have access to delete this post"});
        }

        if(post.image){ //delet from cloudinary too
            await cloudinary.uploader.destroy(post.image.split('/').pop().split('.')[0]);
 //the post.image is eg - "https://res.cloudinary.com/dvhrffmdi/image/upload/v172542586/fgm5mkjztbwummahizv.png" in which fgm5mkjztbwummahizv is our id of post that we need to pass in destroy function

        }

        await Post.findByIdAndDelete(postId);

        res.status(200).json({message:"Post deleted successfully"});
    } catch (error) {   
        console.log("Error in deletePost",error);
        res.status(500).json({message:"Server error"});

    }

}


const getPostById = async (req,res) =>{
  
    try {
        const postId = req.params.id;

        const post = await Post.findById(postId)
        .populate("author","name username profilePicture headline")
        .populate("comments.user","name username profilePicture headline")
        if(!post){
            return res.status(400).json({message:"No post found"});
        }

        res.status(200).json(post);
    } catch (error) {
        console.log("Error in getPostById",error);
        res.status(500).json({message:"Server Error"});
        
    }
} 

const createComment = async (req,res)=>{

    try {
        const postId = req.params.id;
        const {content}= req.body;
        const post = await Post.findByIdAndUpdate(postId,{
            $push:{comments:{user:req.user._id,content}}      //pushing into array
        },{new:true})
        .populate("author","name email "); //we are populating bec we want these for sending email

        if(!post){
            return res.status(404).json({message:"No post found"});
        }
        //create a notification if the commenter is not the owner of post

        if(post.author._id.toString()!==req.user._id.toString()){
            const newNotification =  await Notification.create({
                recipient:post.author,
                type:"comment",
                relatedUser:req.user._id,
                realtedPost:postId
            });

            if(!newNotification){
                return res.status(400).json({message:"Error in sending Notification"});
            }
            //send email

            try {
                const postUrl = process.env.CLIENT_URL + "/post/"+postId; 
                await sendCommentNotificationEmail(post.author.email,post.author.name,req.user.name,postUrl,content)
            } catch (error) {
                
                console.log("Error in sending email",error);
                
            }

        }

        res.status(200).json(post)

    } catch (error) {
        
    }

}

const likePost = async (req,res)=>{

    try {

        //We have 2 cases liking and unliking post

        const postId = req.params.id;
        const post = await Post.findById(postId);

        if(!post){
            return res.status(404).json({message:"No post found"});
        }

        if(post.likes.includes(req.user._id)){
            //disliking
            post.likes = post.likes.filter((id)=> id.toString()!==req.user._id.toString());
        }else{
            
            post.likes.push(req.user._id);

            if(post.author.toString()!== req.user._id.toString()){
                
                //Send notifiction
                
                const newNotification = await  Notification.create({
                    recipient:post.author,
                    type:"like",
                    relatedUser:req.user._id,
                    realtedPost:postId
                });
                
                if(!newNotification){
                    return res.status(400).json({message:"Error in newNotifiaction"});
                }
            }

        }
        
        await post.save();

        res.status(200).json(post);

    } catch (error) {
        console.log("Error in likePost",error);
        res.status(500).json({message:"Server Error"});
    }
}


const getMyActivityLike = async (req,res) =>{

    try {
        
        const likes = await Post.find({likes:req.user._id})
        .populate("author","headline name profilePicture username");

        if(!likes){
            return res.status(404).json({message:"Likes not found"});
        }

        res.status(200).json(likes);

    } catch (error) {
        console.log("Error in getActivityLikes",error);
        res.status(500).json({message:"Server Error"});
    }
};

const getMyActivityComment = async (req,res)=>{

    try {
        const comments = await Post.find({comments:{ $elemMatch: { user: req.user._id } }})
        .select("content image comments")
        .populate("author","headline name profilePicture username");  //here we ahve to match a element in comments so we used this elematch
        
        if(!comments){
            return res.status(404).json({message:"No comment found"});
        }

        res.status(200).json(comments);

    } catch (error) {
        console.log("Error in getActivityComments",error);
        res.status(500).json({message:"Server error"});         
        
    }
}
module.exports = {
    getFeedPosts,
    createPost,
    deletePost,
    getPostById,
    createComment,
    likePost,
    getMyActivityLike,
    getMyActivityComment
}