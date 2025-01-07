import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useState } from "react";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { Link } from "react-router";

const Post = ({post}) => {
    
    console.log(post);
    
    const {data:authUser} = useQuery({queryKey:["authUser"]});

    const [showComments,setShowComments] = useState(false);
    const [newComment,setNewComment] = useState('');
    const [comments,setComments]= useState(post.comments ||[]);
    const isOwner = authUser._id===post.author._id;
    const isLiked = post.likes.includes(authUser._id);

    const queryClient = useQueryClient();
    //delete post

    const {mutate:deletePost,isPending:isDeletingPost} = useMutation({
        mutationFn:async () =>{
            const res = await axiosInstance.delete(`/posts/delete/${post._id}`);
            return res.data;
        },
        onSuccess:()=>{
            toast.success("Post deleted successfully");
            queryClient.invalidateQueries({queryKey:["posts"]});
        },
        onError:(err)=>{
            toast.error(err.response.data.message || "Failed to delete Post");
        }
    });

    const {mutate:createComment,isPending:isCreatingComment}= useMutation({
        mutationFn:async (newComment)=>{
            const res = await axiosInstance.post(`/posts/${post._id}/comment`,newComment);
            return res.data;
        },
        onSuccess:()=>{
            toast.success("Comment Added");
            queryClient.invalidateQueries({queryKey:["posts"]});
        },
        onError:(err)=>{
            toast.error(err.response.data.message || "Failed to add comment");
        }
    })

    const {mutate:likePost,isPending:isLikingPost}= useMutation({
        mutationFn:async () => {
            const res = await axiosInstance.post(`/posts/${post._id}/like`);
            return res.data;
        },
        onSuccess:()=>{
            queryClient.invalidateQueries({queryKey:["posts"]});
        },
        onError:(err)=>{
            toast.error(err.response.data.message||"Failed to like");
        }
    })
    

    const handleDeletePost = () => {
		if (!window.confirm("Are you sure you want to delete this post?")) return;
		deletePost();
	};

	const handleLikePost = async () => {
		if (isLikingPost) return; //if liking in process then dont call another time
		likePost();
	};

    return (
	<div></div>
	);

}
export default Post