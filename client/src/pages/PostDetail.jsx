import { useEffect } from 'react'
import CommentsCard from '../components/CommentsCard'
import { useNavigate } from 'react-router'
import { useState } from 'react'
import PostCardDetailsSkeleton from '../components/PostCardDetailsSkeleton'
import { useParams } from 'react-router'
import PostCard from '../components/PostCard'
import {API, BASE_URL} from '../api'
const PostDetail = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    useEffect(() => {    
      setTimeout(() => {
        setLoading(false);
      }, 2000);
    }, []);

    const {id} = useParams();
    const [post, setPost] = useState(null);

    useEffect(() => {
      const fetchPost = async() => {
        try {
            const res = await API.get(`/api/posts/${id}`);
            const data = await res.data;
            setPost(data);
        } catch(err) {
            console.error(err);
        }
      };
    
      fetchPost();

    }, [id])

    const handleLikeUpdate = (updatedPost) => {
        setPost(prev =>
            prev._id === updatedPost._id ? updatedPost : prev
        );
    }

  return (
    <div className='bg-[#F5F2ED] min-h-screen relative'>
        {!loading ? (
            <div className='max-w-[800px] mx-auto pt-8 px-4 relative'>
                
                {/* Back Button: Moved to the left "gutter" */}
                <button 
                    onClick={() => navigate(-1)} 
                    className='hidden lg:flex items-center justify-center p-3 bg-white rounded-2xl shadow-sm hover:shadow-md transition-all absolute -left-20 top-8'
                    title="Go Back"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="#A88B7E" className="size-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                    </svg>
                </button>

                {/* Content Area */}
                <div className='space-y-6'>
                    {/* Mobile Back Button (shown only when the gutter one is hidden) */}
                    <button onClick={() => navigate(-1)} className='lg:hidden flex gap-2 items-center text-[#A88B7E] font-bold text-sm mb-4'>
                        ← Back
                    </button>

                    <PostCard post={post} onLikeUpdated={handleLikeUpdate} />

                    {/* Comments Section */}
                    <div className='bg-white/60 backdrop-blur-sm rounded-[2.5rem] p-2 shadow-sm'>
                        <CommentsCard comments={post.comments} id={id} />
                    </div>
                </div>
            </div>
        ) : (
            <PostCardDetailsSkeleton />
        )}
    </div>
  )
}

export default PostDetail