import { useState, useEffect } from 'react'
import Sidebar from '../components/Sidebar'
import PostCard from '../components/PostCard'
import CreatePostModal from '../components/CreatePostModal'
import EmptyCard from '../components/EmptyCard'
import { useSearchParams } from 'react-router';
import { useContext } from 'react'
import { UserContext } from '../context/UserContext';
import {API, BASE_URL} from '../api'
import { NavLink } from 'react-router'
import Bottombar from '../components/Bottombar'
const Feed = () => {
  const { userData } = useContext(UserContext);
  const { setUserData } = useContext(UserContext);
  const [isOpen, setIsOpen] = useState(false);
  const [posts, setPosts] = useState([]);
  const [searchParams] = useSearchParams();
  const type = searchParams.get("type");
  
  useEffect(() => {
    const fetchPosts = async () => {

      const params = new URLSearchParams();
      if (type) params.append('type', type);
      
      try {
        const res = await API.get('/api/posts', {
          params: {type: type}
        });
        
        const data = res.data;
        setPosts(data);
      } catch(err) {
        throw new Error('Network response was not ok');
      }
    }
  
    fetchPosts();
  }, [type]);

  const handleLikeUpdate = (updatedPost) => {
    setPosts(prev =>
        prev.map(p =>
          p._id === updatedPost._id ? updatedPost : p
        )
    );
  }

  const getProfilePic = (pic) => {
      if(!pic) return "/images/default_avatar.png";

      if(pic.startsWith("/images")) {
      return pic;
      }

      return `${BASE_URL}/uploads/profile/${pic}`;
  }

  return (
    <div className='bg-[#ebe6de] relative min-h-screen text-[#2d2a26]'>
      <div className='pb-24 min-[450px]:pb-0 flex md:max-w-[800px] xl:max-w-[1200px] mx-auto justify-between px-4 gap-[0.5rem] min-[450px]:gap-[1rem] sm:gap-[2rem]'>

        {/* Left sidebar */}
        <aside className=' sticky top-0 md:w-64 shrink-0 pt-4 hidden min-[450px]:block min-[450px]:pt-8'>
          <Sidebar setPosts = {setPosts}/>
        </aside>

        {/* Center feed area */}
        <div className='flex-1 xl:max-w-[600px] py-4 min-[450px]:py-8 space-y-6'>
          {/* Header - info and create post */}
          <div className='sticky top-[24] z-10'>
            <div className="block md:hidden mb-4 px-4 bg-white p-2 rounded-xl">
              <h1 className="text-xl font-heading text-[#B75D32] capitalize">
                {!type ? 'Main Feed' : `${type} Courtyard`}
              </h1>
              <p className="text-xs text-gray-500 font-body">
                {!type 
                  ? 'Exploring everything happening right now.' 
                  : `Viewing the latest posts in the ${type} category.`}
              </p>
            </div>

            <div className='backdrop-blur-md bg-white/60 px-4 py-2 rounded-3xl  shadow-sm border border-white/20'>
              <div onClick={()=>setIsOpen(true)} className='border-2 border-[#A88B7E]/40 hover:border-[#A88B7E]/70 flex gap-[1rem] items-center bg-white px-[0.3rem] sm:px-[0.5rem] py-[0.2rem] sm:py-[0.4rem] rounded-full cursor-text'>
                <img src={getProfilePic(userData?.profilePic)} alt="avatar" className='w-[1.5rem] h-[1.5rem] min-[450px]:w-[2rem] min-[450px]:h-[2rem] sm:w-[2.5rem] sm:h-[2.5rem] rounded-full' />
                <div className='font-body font-semibold opacity-40 text-[0.7rem] min-[450px]:text-[0.9rem]'>What's on your mind, {userData?.username?.split(' ')[0]}?</div>
              </div>
            </div>
          </div>
          

          {/* Feed posts */}
          <div className='space-y-4'>
            {
              (posts.length > 0) ? 
              posts.map(post => (
                <PostCard key={post._id} post = {post} onLikeUpdated = {handleLikeUpdate} savedData={userData} setSavedData={setUserData}>
                </PostCard>
              )) : 
                <EmptyCard title='The Courtyard is quiet' subtitle={`No one from ${userData?.college} has posted in this category yet.`}/>
            }
          </div>

          {/* Create Post Modal */}
          {isOpen && <CreatePostModal onClose={()=>setIsOpen(false)} onPostCreated={(newPost) => setPosts(prev => [newPost, ...prev])}/>}
        </div>
          
          {/* Right sidebar */}
        <aside className='hidden xl:block w-80 pt-8 sticky top-0 h-screen'>
          <div className="bg-white/40 backdrop-blur-md rounded-3xl p-6 border border-white/20 shadow-sm">
            <h3 className="font-bold text-[#A88B7E] text-sm uppercase tracking-widest mb-4">
              Courtyard Rules
            </h3>
            <ul className="space-y-4">
              {[
                { title: "Be Respectful", desc: "No hate speech or bullying." },
                { title: "Academic Integrity", desc: "Don't share exam leaks or shortcuts." },
                { title: "Stay Anonymousish", desc: "Respect others' privacy." },
                { title: "Help Others", desc: "Answer questions if you know the way." }
              ].map((rule, i) => (
                <li key={i} className="flex gap-3">
                  <span className="text-[#A88B7E] font-bold text-xs mt-1">{i + 1}.</span>
                  <div>
                    <p className="text-sm font-semibold opacity-80">{rule.title}</p>
                    <p className="text-[11px] opacity-50 leading-tight">{rule.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
      
      <div className='fixed bottom-6 left-0 right-0 z-50 w-full min-[450px]:hidden'>
        <div className='mx-auto mb-4 w-fit border-2 border-white/70 bg-white/80 backdrop-blur-md rounded-2xl shadow-lg'>
          <Bottombar />
        </div>
      </div>
    </div>
    
  )
}

export default Feed