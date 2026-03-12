import React, { useState, useContext, useRef } from 'react'
import { UserContext } from '../context/UserContext';
import {API, BASE_URL} from '../api'
const CreatePostModal = (props) => {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [type, setType] = useState("general"); 
    const [anonymous, setAnonymous] = useState(false);
    const [imageFile, setImageFile] = useState(null);
    const [showInfo, setShowInfo] = useState(false);
    const [loading, setLoading] = useState(false); 

    const fileInputRef = useRef(null); 
    const { userData } = useContext(UserContext);

    const postTypes = ["discussion", "placement", "event", "confession", "general"]

    const handleSubmit = async () => {
        if (!content.trim() || !type) return;
        setLoading(true);

        const newPost = new FormData();
        newPost.append("userId", userData._id);
        newPost.append("type", type);
        newPost.append("title", title);
        newPost.append("content", content);
        newPost.append("anonymous", anonymous);
        newPost.append("college", userData.college);
        if(imageFile) newPost.append("image", imageFile);

        try {
            const res = await API.post(`/api/posts`, newPost);
            
            const savedPost = res.data;
            props.onPostCreated(savedPost);
            props.onClose();
        } catch(err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='fixed inset-0 bg-[#3C2F2F]/50 backdrop-blur-sm flex items-center justify-center z-50 p-4'>
            <div className='w-full max-w-[550px] bg-white/80 backdrop-blur-md p-8 rounded-[2.5rem] shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto no-scrollbar'>
                
                {/* Header */}
                <div className='flex justify-between items-center'>
                    <div className='text-2xl font-bold text-[#3C2F2F]'>Create Post</div>
                    <button onClick={props.onClose} className='hover:bg-black/5 p-2 rounded-full transition-colors'>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Post Types */}
                <div className='flex gap-2 flex-wrap'>
                    {postTypes.map((item) => (
                        <button key={item} onClick={() => setType(item)} 
                                className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${type === item ? "bg-[#B75D32] text-white shadow-lg scale-105":"bg-gray-100 text-gray-500 hover:bg-gray-200"}`}>
                            {item}
                        </button>
                    ))}
                </div>

                <input type="text" value={title} className='w-full bg-white/50 border border-black/5 rounded-2xl px-4 py-3 outline-none focus:bg-white transition-all' placeholder="Title (optional)" onChange={(e) => setTitle(e.target.value)}/>

                <textarea value={content} className='w-full bg-white/50 border border-black/5 min-h-[140px] rounded-2xl outline-none px-4 py-3 focus:bg-white focus:ring-2 focus:ring-[#B75D32]/20 resize-none' placeholder="What's on your mind?" onChange={(e) => setContent(e.target.value)}></textarea>
                
                {/* Image Preview & Custom Upload */}
                <div className='flex items-center gap-4'>
                    <button type="button" onClick={() => fileInputRef.current.click()} className='px-4 py-2 bg-[#3C2F2F]/10 hover:bg-[#3C2F2F]/20 rounded-xl text-xs font-bold transition-all'>
                        {imageFile ? "Change Image" : "📷 Add Image"}
                    </button>
                    <input type="file" ref={fileInputRef} hidden accept='image/*' onChange={(e) => setImageFile(e.target.files[0])} />
                    {imageFile && <button onClick={() => setImageFile(null)} className='text-red-500 text-xs font-bold'>Remove</button>}
                </div>

                {imageFile && <img src={URL.createObjectURL(imageFile)} alt='preview' className='w-full h-48 object-cover rounded-2xl border border-black/5'/>}

                {/* Footer Logic */}
                <div className='flex justify-between items-center pt-4 border-t border-black/5'>
                    <div className='flex gap-2'>
                        <button onClick={handleSubmit} disabled={loading || !content.trim()} 
                                className={`py-2 px-8 rounded-xl text-white font-bold transition-all ${loading || !content.trim() ? "bg-gray-300 cursor-not-allowed" : "bg-[#B75D32] hover:scale-105 shadow-md"}`}>
                            {loading ? "Posting..." : "Post"}
                        </button>
                    </div>

                    <div className='relative flex items-center gap-2' onMouseEnter={()=>setShowInfo(true)} onMouseLeave={()=>setShowInfo(false)}>
                        <input type="checkbox" id="anon" checked={anonymous} className='accent-[#B75D32] h-4 w-4' onChange={(e)=>setAnonymous(e.target.checked)}/>
                        <label htmlFor="anon" className='text-sm font-semibold opacity-60 cursor-pointer'>Post Anonymously</label>
                        {showInfo && (
                            <div className='absolute bottom-full right-0 mb-2 w-48 bg-gray-800 text-white text-[10px] p-2 rounded-lg shadow-xl animate-in fade-in slide-in-from-bottom-1'>
                                Your identity will not be shown publicly in the feed.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CreatePostModal;