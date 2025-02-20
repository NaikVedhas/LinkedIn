import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useState } from "react";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { Link } from "react-router";
import { formatDistanceToNow } from "date-fns";
import { Loader, MessageCircle, Send, Share2, ThumbsUp, Trash2 } from "lucide-react";
import PostAction from "./PostAction";

const Post = ({post}) => {
    
    
    const {data:authUser} = useQuery({queryKey:["authUser"]});

    const [showComments,setShowComments] = useState(false);
    const [newComment,setNewComment] = useState('');
    const [comments,setComments]= useState(post?.comments ||[]);
    const isOwner = authUser?._id===post.author?._id;
    const isLiked = post?.likes?.includes(authUser._id);

    const queryClient = useQueryClient();
    

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

    const {mutate:createComment,isPending:isAddingComment}= useMutation({

        mutationFn:async (newComment)=>{
            const res = await axiosInstance.post(`/posts/${post._id}/comment`, { content: newComment });
            return res.data;
        },
        onSuccess:()=>{
            toast.success("Comment Added");
            queryClient.invalidateQueries({queryKey:["posts"]});
        },
        onError:(err)=>{
            toast.error(err?.response?.data?.message || "Failed to add comment");
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
            toast.error(err?.response?.data?.message||"Failed to like");
        }
    })
    

    const handleDeletePost = () => {
        toast((t) => (
          <div className="p-4 flex flex-col gap-4 items-center">
            <p className="text-gray-800 text-sm">Are you sure you want to delete this post?</p>
            <div className="flex gap-4">
              <button
                onClick={() => {
                  deletePost(); // Your delete logic
                  toast.dismiss(t.id); // Dismiss the toast
                }}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Yes, Delete
              </button>
              <button
                onClick={() => toast.dismiss(t.id)}
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300"
              >
                No 
              </button>
            </div>
          </div>
        ), {
          duration: Infinity,
        });
      };

	const handleLikePost = async () => {
		if (isLikingPost) return; //if liking in process then dont call another time
		likePost();
	};

  const handleAddComment = async (e) => {
		e.preventDefault();
		if (newComment.trim()) {
			createComment(newComment);
			setNewComment("");
			setComments([
				...comments,
				{
					content: newComment,
					user: {
						_id: authUser?._id,
						name: authUser?.name,
						profilePicture: authUser?.profilePicture,
					},
					createdAt: new Date(),
				},
			]);
		}
	};
    
    return (
		<div className='bg-secondary rounded-lg shadow mb-4'>
			<div className='p-4'>
				<div className='flex items-center justify-between mb-4'>
					<div className='flex items-center'>
						<Link to={`/profile/${post?.author?.username}`}>
							<img
								src={post?.author?.profilePicture || "/avatar.png"}
								alt={post?.author?.name}
								className='size-10 rounded-full mr-3 object-cover'
							/>
						</Link>

						<div>
							<Link to={`/profile/${post?.author?.username}`}>
								<h3 className='font-semibold'>{post?.author?.name}</h3>
							</Link>
							<p className='text-xs text-info'>{post?.author?.headline}</p>
							<p className='text-xs text-info'>
								{formatDistanceToNow(new Date(post?.createdAt), { addSuffix: true })}
							</p>
						</div>
					</div>
					{isOwner && (
						<button onClick={handleDeletePost} className='text-red-500 hover:text-red-700'>
							{isDeletingPost ? <Loader size={18} className='animate-spin' /> : <Trash2 size={18} />}
						</button>
					)}
				</div>
				<Link to={`/posts/${post?._id}`} >
				<p className='mb-4'>{post?.content}</p>
				{post?.image && <img src={post?.image} alt='Post content' className='rounded-lg w-full mb-4' />}
				</Link>

				<div className='flex justify-between text-info'>
					<PostAction
						icon={<ThumbsUp size={18} className={isLiked ? "text-blue-500  fill-blue-300" : ""} />}
						text={`Like (${post?.likes?.length})`}
						onClick={handleLikePost}
					/>

					<PostAction
						icon={<MessageCircle size={18} />}
						text={`Comment (${comments?.length})`}
						onClick={() => setShowComments(!showComments)}
					/>
					<PostAction icon={<Share2 size={18} />} text='Share' />
				</div>
			</div>

			{showComments && (
				<div className='px-4 pb-4'>
					<div className='mb-4 max-h-60 overflow-y-auto'>
						{comments?.map((comment) => (
							<div key={comment._id} className='mb-2 bg-base-100 p-2 rounded flex items-start'>
								<img
									src={comment?.user?.profilePicture || "/avatar.png"}
									alt={comment?.user?.name}
									className='w-8 h-8 rounded-full mr-2 flex-shrink-0'
								/>
								<div className='flex-grow'>
									<div className='flex items-center mb-1'>
										<span className='font-semibold mr-2'>{comment?.user?.name}</span>
										<span className='text-xs text-info'>
											{formatDistanceToNow(new Date(comment?.createdAt))}
										</span>
									</div>
									<p>{comment?.content}</p>
								</div>
							</div>
						))}
					</div>

					<form onSubmit={handleAddComment} className='flex items-center'>
						<input
							type='text'
							value={newComment}
							onChange={(e) => setNewComment(e.target.value)}
							placeholder='   Add a comment...'
							className='flex-grow p-2 rounded-l-full bg-base-100 focus:outline-none focus:ring-2 focus:ring-primary'
						/>

						<button
							type='submit'
							className='bg-primary text-white p-2 rounded-r-full hover:bg-primary-dark transition duration-300'
							disabled={isAddingComment}
						>
							{isAddingComment ? <Loader size={18} className='animate-spin' /> : <Send size={18} />}
						</button>
					</form>
				</div>
			)}
		</div>
	);

}
export default Post