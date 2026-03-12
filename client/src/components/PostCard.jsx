import { useState } from 'react'
import { useNavigate } from "react-router"
import Linkify from 'linkify-react'
import like from '../assets/like.svg'
import unlike from '../assets/unlike.svg'
import { formatDistanceToNow } from "date-fns";
import { useContext } from 'react'
import { UserContext } from '../context/UserContext';
import {API, BASE_URL} from '../api'
const PostCard = (props) => {
    const navigate = useNavigate();
    const { userData, setUserData } = useContext(UserContext);

    const isLiked = Array.isArray(props.post?.likes) && props.post?.likes.includes(userData?._id);
    const isSaved = userData?.saved?.some(savedPost => {
        const savedId = savedPost?._id ? savedPost._id.toString() : savedPost.toString();
        return savedId === props.post?._id?.toString();
    });

    const [showMore, setShowMore] = useState(false);

    const handleLike = async () => {
        const res = await API.put(`/api/posts/${props.post._id}/like`,
            {userId : userData._id}
        );

        const updatedPost = res.data;
        props.onLikeUpdated(updatedPost);
    };

    const handleSave = async () => {
        const res = await API.put(`/api/posts/${props.post._id}/save`, {
            userId: userData._id
        });

        const updatedUser = res.data;
        
        setUserData(updatedUser); 
    };

    const getProfilePic = (pic) => {
        if(!pic) return "/images/default_avatar.png";

        if(pic.startsWith("/images")) {
        return pic;
        }

        return `${BASE_URL}/uploads/profile/${pic}`;
    }

    const handleShare = async () => {
        const link = `${window.location.origin}/post/${props.post._id}`;

        await navigator.clipboard.writeText(link);

        alert("Post link copied!");
    };

    const handleReport = async () => {
        const reason = window.prompt("Why are you reporting this post? (e.g., Spam, Harassment, Inappropriate)");
        
        if (!reason) return;

        try {
            const res = await API.put(`/api/posts/${props.post._id}/report`, {
                userId: userData._id, 
                reason: reason
            });

            alert("Thank you. The moderators will review this post.");
            setShowMore(false);

        } catch (err) {
            const errorMessage = err.response?.data?.message || "Something went wrong.";
            alert(errorMessage);
            console.error("Report error:", err);
        }
    };

  return (
    <div className='flex-1'>
        <div className='border border-[#A88B7E]/20 shadow-xs md:max-w-[700px] bg-white/70 hover:bg-white backdrop-blur-sm rounded-3xl px-[1.5rem] sm:px-[2rem] py-[1.2rem] sm:py-[1.5rem] flex flex-col justify-between gap-[1rem] min-[450px]:gap-[1.5rem]' onClick={()=>navigate(`/post/${props.post._id}`)}>
            
            {/* header */}
            <div className='flex justify-between'>
                <div className='flex gap-2 items-center flex-wrap'>
                    <span className='flex gap-[0.5rem] items-center w-fit' onClick={(e)=>e.stopPropagation()}>
                        <img src={!props.post.anonymous?getProfilePic(props.post.userId?.profilePic):getProfilePic(undefined)} alt="avatar-img" className='h-[1.2rem] w-[1.2rem] md:h-[2rem] md:w-[2rem] rounded-full cursor-pointer' onClick={()=>navigate(`/profile/${props.post.userId?.username}`)} />
                        <div className='text-[0.7rem] min-[450px]:text-[0.9rem] md:text-[1rem] opacity-85 font-semibold cursor-pointer' onClick={()=>navigate(`/profile/${props.post.userId?.username}`)}>{props.post.anonymous ? "Anonymous" : props.post.userId?.username || 'Deleted User'}</div>
                    </span>

                    <span className='opacity-60 text-[0.55rem] min-[450px]:text-[0.7rem] md:text-[0.9rem]'>
                        &bull; {formatDistanceToNow(new Date(props.post.createdAt?.toString()), { addSuffix: true })}
                    </span>

                    <span className='px-1 md:px-2 py-0.5 md:py-1 rounded-full text-[0.55rem] min-[450px]:text-[0.8rem] md:text-[0.9rem] text-white font-body  bg-[#b75c32e0]'>
                        {props.post.type}
                    </span>
                </div>

                <div onClick={(e)=>e.stopPropagation()} className='cursor-pointer'>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6 relative" onClick={()=>setShowMore(true)}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM18.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"/>
                    </svg>

                    <div className={`bg-white p-[1rem] absolute -top-[0.6rem] -right-[3rem] rounded-xl cursor-pointer ${showMore ? "block" : "hidden"}`} onMouseLeave={()=>setShowMore(false)} onClick={handleReport}>
                        Report
                    </div>
                </div>

            </div>

            {/* Post content */}
            <div className='space-y-1 min-[450px]:space-y-2'>
                <div className='font-body font-semibold text-[0.8rem] min-[450px]:text-[1.1rem] md:text-[1.2rem]'>{props.post.title}</div>
                {
                    props.post.image && 
                    <img src={`${BASE_URL}${props.post.image}`} alt='post' className='h-[200px] md:h-[350px] rounded-xl' loading='lazy'/>
                }
                <Linkify options={{target: "_blank", className: "text-[#B75D32] underline hover:text-[#8a3e1f]"}}>
                    <div className='font-body ml-[1rem] text-[0.7rem] min-[450px]:text-[0.9rem] md:text-[1rem] mt-1 min-[450px]:mt-3 md:mt-5'>{props.post.content}</div>
                </Linkify>
            </div>
            
            {/* Post action tray */}
            <div className='flex justify-between items-center'>
                <div className='flex gap-[2rem] items-center cursor-pointer' onClick={(e)=>e.stopPropagation()}>
                    {/* upvote */}
                    <div className='flex gap-2 items-center' onClick={handleLike}>
                        <img src={isLiked?like:unlike} alt="like" className='h-4 w-4 min-[450px]:h-6 min-[450px]:w-6 md:h-8 md:w-8 cursor-pointer transition-transform duration-150 hover:scale-105' />
                        <div className='text-[0.7rem] min-[450px]:text-[0.8rem] md:text-[0.9rem] font-body font-bold'>{props.post.likes.length}</div>
                    </div>
                </div>

                <div className='flex gap-[0.7rem] min-[450px]:gap-[2rem] items-center'>
                    {/* comment */}
                    <div className='flex gap-1 cursor-pointer' onClick={()=>navigate(`/post/${props.post._id}`)}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-5 md:size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 9.75a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375m-13.5 3.01c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.184-4.183a1.14 1.14 0 0 1 .778-.332 48.294 48.294 0 0 0 5.83-.498c1.585-.233 2.708-1.626 2.708-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
                        </svg>
                        <div className='text-[0.7rem] min-[450px]:text-[0.8rem] md:text-[0.9rem] font-body font-bold'>{props.post.comments.length}</div>
                    </div>

                    {/* share */}
                    <div onClick={(e)=>e.stopPropagation()}>
                        <div className='cursor-pointer' onClick={handleShare}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-4 min-[450px]:size-5 md:size-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z" />
                            </svg>
                        </div>
                    </div>

                    {/* save */}
                    <div onClick={(e)=>e.stopPropagation()}>
                        <div className='cursor-pointer' onClick={handleSave}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill={isSaved?"black":"none"} viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-4 min-[450px]:size-5 md:size-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z" />
                            </svg>

                        </div>
                    </div>
                </div>
            </div>
            
        </div>
    </div>
  )
}

export default PostCard