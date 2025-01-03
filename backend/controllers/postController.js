const Post = require('../models/postModel');
const cloudinary = require('../lib/cloudinary');
const User = require('../models/userModel');

const getFeedPosts = async (req,res)=>{

    try {
        //we are in post moeel only storing id of author so we need to go in ref model and find the other details that is done using populate method. Same for comments mein user pe (id)
        //only connections ke post dikhaenge

        const posts = await Post.find({author:{$in:req.user.connections}})
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
module.exports = {
    getFeedPosts,
    createPost,
    deletePost

}