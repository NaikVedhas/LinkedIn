
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { useState } from "react";
import {Image,Loader} from "lucide-react"


const PostCreation = ({user}) => {

    const [content,setContent]= useState('');
    const [image,setImage] = useState(null);
    const [imagePreview,setImagePreview] = useState(null);

    const queryClient = useQueryClient();

    const {mutate:createPostMutation,isPending} = useMutation({ //ispending is isloading in usemutation
        mutationFn: async (data) =>{
            const res = await axiosInstance.post("/posts/create",data,{
                headers:{"Content-Type":"application/json"},
            });
            return res.data;
        },
        onSuccess:() => {
            toast.success("Post created successfully");
            //Reset the form now
            setContent('');
            setImage(null);
            setImagePreview(null);

            queryClient.invalidateQueries({queryKey:["posts"]});    //so that we re fetch it
        },
        onError:(err)=>{
            toast.error(err?.response?.data?.message || "Failed to create Post");
        }

    })

    const handlePostCreation = async () =>{

        try {
            const data = {content};
            if(image) data.image = await readFileAsDataURL(image);
            createPostMutation(data);
        } catch (error) {
            console.log("Error in handlesubmit:",error);
        }
    }

    const handleImageChange = (e) => {
		const file = e.target.files[0];
		setImage(file);
		if (file) {
			readFileAsDataURL(file).then(setImagePreview);
		} else {
			setImagePreview(null);
		}
	};

    const readFileAsDataURL = (file) => {
		return new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.onloadend = () => resolve(reader.result);
			reader.onerror = reject;
			reader.readAsDataURL(file);
		});
	};

    {/* Image Upload */}
    {/* Even though the input is hidden as it is in label field so when we click on the Image icon so the label gets hits and input is triggered and we can upload a file  */}

    return (
		<div className='bg-secondary rounded-lg shadow mb-4 p-4'>
			<div className='flex space-x-3'>
				<img src={user?.profilePicture || "/avatar.png"} alt={user?.name} className='size-12 rounded-full object-cover' />
				<textarea
					placeholder="What's on your mind?"
					className='w-full p-3 rounded-lg bg-base-100 hover:bg-base-200 focus:bg-base-200 focus:outline-none resize-none transition-colors duration-200 min-h-[100px]'
					value={content}
					onChange={(e) => setContent(e.target.value)}
				/>
			</div>

			{imagePreview && (
				<div className='mt-4'>
					<img src={imagePreview} alt='Selected' className='w-full h-auto rounded-lg' />
				</div>
			)}

			<div className='flex justify-between items-center mt-4'>
				<div className='flex space-x-4'>
					<label className='flex items-center text-info hover:text-info-dark transition-colors duration-200 cursor-pointer'>
						<Image size={20} className='mr-2' />
						<span>Photo</span>
						<input type='file' accept='image/*' className='hidden' onChange={handleImageChange} />
					</label>
				</div>

				<button
					className='bg-primary text-white rounded-lg px-4 py-2 hover:bg-primary-dark transition-colors duration-200'
					onClick={handlePostCreation}
					disabled={isPending}
				>
					{isPending ? <Loader className='size-5 animate-spin' /> : "Share"}
				</button>
			</div>
		</div>
	);
        
}
export default PostCreation