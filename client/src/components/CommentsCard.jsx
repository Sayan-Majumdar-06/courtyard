import { useState } from 'react';
import { useNavigate } from 'react-router';
import { formatDistanceToNow } from "date-fns";
import { useContext } from 'react'
import { UserContext } from '../context/UserContext';
import Linkify from 'linkify-react';
import {API} from "../api";
import { BASE_URL } from '../api';
const CommentsCard = (props) => {

    const [comments, setComments] = useState(props.comments);
    const navigate = useNavigate();
    const { userData } = useContext(UserContext);
    const [newComment, setNewComment] = useState("");

    const handleComment = async () => {
        if(newComment.length === 0) {
            alert("can't post an empty comment !");
            return;
        }

        const res = await API.put(`/api/posts/${props.id}/comment`, {
            user: userData._id,
            text: newComment
        })
        
        setComments(res.data);
        setNewComment("");
    }

    const getProfilePic = (pic) => {
        if(!pic) return "/images/default_avatar.png";

        if(pic.startsWith("/images")) {
        return pic;
        }

        return `${BASE_URL}/uploads/profile/${pic}`;
    }

  return (
    <div className='p-6 md:p-8 space-y-4'>
        {/* add comment bar */}
        <div className='flex gap-4 group items-center'>
            <div className='flex-1 border-2 border-[#A88B7E]/30 focus-within:border-[#A88B7E]/70 flex gap-3 items-center bg-white px-3 py-2 rounded-full transition-all'>
                <img src={getProfilePic(userData?.profilePic)} alt="avatar" className='w-6 h-6 sm:w-8 sm:h-8 rounded-full shrink-0' />
                <input 
                    className='w-full font-body font-semibold text-[0.9rem] sm:text-[1rem] text-[#2d2a26] placeholder:opacity-40 outline-none bg-transparent' 
                    placeholder='Join the conversation...' 
                    value={newComment} 
                    onChange={(e)=>setNewComment(e.target.value)}
                />
            </div>
            <button 
                className='px-6 py-2 rounded-full bg-[#B75D32] text-white font-bold text-sm hidden group-focus-within:block hover:bg-[#8a4220] transition-colors shadow-sm' 
                onClick={handleComment}
            >
                Post
            </button>
        </div>

        {/* comment elements */}
        <div className='space-y-4'>
        {
            comments.length > 0 ?
            comments.map((item) => (
                <div key={item._id} className='group font-body border-l-2 border-[#A88B7E]/20 pl-4 py-1 hover:border-[#A88B7E]/50 transition-colors'>
                    <div className='flex gap-2 items-center mb-1'>
                        <img 
                            src={getProfilePic(item.user?.profilePic)} 
                            alt="avatar" 
                            className='h-5 w-5 rounded-full cursor-pointer' 
                            onClick={()=>navigate(`/profile/${item.user.username}`)} 
                        />
                        <div className='text-[0.8rem] font-bold text-[#A88B7E] cursor-pointer hover:underline' onClick={()=>navigate(`/profile/${item.user.username}`)}>
                            {item.user?.username || "Deleted User"}
                        </div>
                        <span className='opacity-40 text-[0.7rem] font-medium italic'>
                            {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}
                        </span>
                    </div>

                    <Linkify options={{target: "_blank", className: "text-[#B75D32] hover:underline"}}>
                        <div className='text-[0.9rem] leading-relaxed text-[#2d2a26]/80'>{item.text}</div>
                    </Linkify>
                </div>
            ))
            :
            <div className='text-center py-8 opacity-40 font-body italic'>No thoughts here yet...</div>
        }
        </div>
    </div>
  )
}

export default CommentsCard