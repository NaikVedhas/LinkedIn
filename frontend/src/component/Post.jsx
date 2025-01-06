import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useState } from "react";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

const Post = ({p}) => {
    
    console.log(p);
    
    const {data:authUser} = useQuery({queryKey:["authUser"]});

    const [showComments,setShowComments] = useState(false);
    const [newComment,setNewComment] = useState('');
    const [comments,setComments]= useState(p.comments ||[]);
    const isOwner = authUser._id===p.author._id;
    const isLiked = p.likes.includes(authUser._id);

    const queryClient = useQueryClient();
    //delete post

    const {mutate:deletePost,isPending:isDeletingPost} = useMutation({
        mutationFn:async () =>{
            const res = await axiosInstance.delete(`/posts/delete/${p._id}`);
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
            const res = await axiosInstance.post(`/posts/${p._id}/comment`,newComment);
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
            const res = await axiosInstance.post(`/posts/${p._id}/like`);
            return res.data;
        },
        onSuccess:()=>{
            toast.success("Post liked");
            queryClient.invalidateQueries({queryKey:["posts"]});
        },
        onError:(err)=>{
            toast.error(err.response.data.message||"Failed to like");
        }
    })
    
    return (
    <div>
        
    </div>
    )
}
export default Post