import React from 'react'
import { useState, useEffect } from 'react'
import PostCard from '../components/PostCard'
import EmptyCard from '../components/EmptyCard'
import { useNavigate, useParams } from 'react-router';
import { useContext } from 'react'
import { UserContext } from '../context/UserContext';
import axios from 'axios'
import {API, BASE_URL} from '../api'
const Profile = () => {
    
    const {id} = useParams();
    const { userData, setUserData } = useContext(UserContext);
    const current_user = userData?.username;
    const navigate = useNavigate();

    const [thisUserData, setThisUserData] = useState({});
    const [postsData, setPostsData] = useState({});
    const [savedData, setSavedData] = useState({});

    const tabs = [
        "Posts",
        "Saved"
    ]
    const [isActive, setIsActive] = useState("Posts");

    useEffect(() => {
        const fetchUser = async () => {
          let url = `${BASE_URL}/api/profile/${id}`;

          try {
            const res = await API.get(url);
            const data = await res.data;

            setThisUserData(data.user);
            setPostsData(data.posts);
            setSavedData(data.user.saved);

          } catch(err) {
            console.log(`User Not Found : ${err}`);
          }
        }
      
        fetchUser();
      }, [id]);

      const isFollowing = thisUserData?.Followers?.includes(current_user);

      const handleFollow = async () => {
        const res = await API.put(`/api/profile/${id}/follow`, 
            { current_user }
        );

        const data = await res.data;

        setThisUserData(prev => ({
            ...prev,
            Followers: data.Followers
        }));
      };

      const handleLogout = async () => {
        await API.get(`/auth/logout`);

        setUserData(null);
        navigate('/');
      }

    const getProfilePic = (pic) => {
        if(!pic) return "/images/default_avatar.png";

        if(pic.startsWith("/images")) {
        return pic;
        }

        return `${BASE_URL}/uploads/profile/${pic}`;
    }

  return (
    <div className='bg-[#F5F2ED] p-[2rem]'>
        <div className='w-full sm:max-w-[600px] lg:max-w-[800px] mx-auto'>
            {/* Header */}
            <div className='mx-auto rounded-3xl flex justify-center items-center gap-[1rem] min-[480px]:gap-[2rem] lg:gap-[5rem] py-[3rem] px-[1rem] bg-white'>
                {/* left */}
                <div className='flex flex-col gap-[2rem] items-center'>
                    <img className='h-[5rem] w-[5rem] min-[480px]:h-[7rem] min-[480px]:w-[7rem] sm:h-[9rem] sm:w-[9rem] rounded-full' src={getProfilePic(thisUserData?.profilePic)} alt="avatar-icon" />
                    <div className='flex flex-col min-[480px]:flex-row min-[480px]:gap-[1rem] sm:gap-[2rem] font-body text-[0.6rem] min-[480px]:text-[0.8rem] sm:text-[1rem]'>
                        <div className='space-x-1'><span className='font-bold'>{thisUserData?.Followers?.length||0}</span><span className='font-body'>Followers</span></div>
                        <div className='space-x-1'><span className='font-bold'>{thisUserData?.Following?.length||0}</span><span className='font-body'>Following</span></div>
                    </div>
                </div>

                {/* right */}
                <div className='space-y-2'>
                    <div className='font-heading font-medium text-[1.2rem] min-[480px]:text-[1.5rem] sm:text-[2rem]'>{thisUserData?.Name || "Deleted User"}</div>
                    <div className='font-body font-medium text-[0.6rem] min-[480px]:text-[0.8rem] sm:text-[1rem] opacity-60 -mt-3 mb-4'>{'@'+thisUserData?.username || "Deleted User"}</div>
                    <div className='flex gap-2 sm:gap-4'>
                        {/* Branch Badge */}
                        <span className='inline-flex items-center gap-1.5 bg-[#B75D32]/10 backdrop-blur-md border border-[#B75D32]/20 rounded-full py-1 sm:py-2 px-3 sm:px-4 text-[0.5rem] sm:text-[0.85rem] font-bold text-[#B75D32] transition-all hover:bg-[#B75D32]/20'>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3 sm:w-4 sm:h-4 opacity-70">
                                <path fillRule="evenodd" d="M10 2a6 6 0 00-6 6c0 1.887.454 3.665 1.257 5.234a.75.75 0 00.515.427 5.074 5.074 0 013.728 3.728.75.75 0 00.427.515A6.001 6.001 0 0010 18a6 6 0 006-6c0-1.887-.454-3.665-1.257-5.234a.75.75 0 00-.515-.427 5.074 5.074 0 01-3.728-3.728.75.75 0 00-.427-.515A6.001 6.001 0 0010 2zm0 1.5a4.5 4.5 0 014.5 4.5c0 1.41-.34 2.74-.943 3.913a6.574 6.574 0 00-2.97-2.97A4.5 4.5 0 0110 3.5z" clipRule="evenodd" />
                            </svg>
                            {thisUserData?.branch}
                        </span>

                        {/* College Badge */}
                        <span className='group relative inline-flex items-center gap-1.5 bg-[#2D4739]/10 backdrop-blur-md border border-[#2D4739]/20 rounded-full py-1 sm:py-2 px-3 sm:px-4 text-[0.5rem] sm:text-[0.85rem] font-bold text-[#2D4739] transition-all hover:bg-[#2D4739]/20'>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3 sm:w-4 sm:h-4 text-[#2D4739]">
                                <path fillRule="evenodd" d="M12.516 2.17a.75.75 0 0 0-1.032 0 11.209 11.209 0 0 1-7.877 3.08.75.75 0 0 0-.722.515A12.74 12.74 0 0 0 2.25 9.75c0 5.942 4.064 10.933 9.563 12.348a.749.749 0 0 0 .374 0c5.499-1.415 9.563-6.406 9.563-12.348 0-1.09-.13-2.15-.375-3.165a.75.75 0 0 0-.722-.515 11.209 11.209 0 0 1-7.877-3.08Zm3.11 8.58a.75.75 0 0 0-1.252-.828l-3.21 4.853-1.43-1.43a.75.75 0 0 0-1.06 1.06l1.97 1.97a.75.75 0 0 0 1.134-.118l3.848-5.815Z" clipRule="evenodd" />
                            </svg>
                            
                            {thisUserData?.college}
                        </span>
                    </div>

                    <div className='font-body text-[0.7rem] text-black/60 min-[480px]:text-[0.8rem] sm:text-[1rem] mt-[1.5rem] sm:mt-[2rem]'>
                        {thisUserData?.bio}
                    </div>

                    {
                        thisUserData ?
                        <div className='mt-[1rem] min-[480px]:mt-[2rem] sm:mt-[3rem]'>
                            {
                                (id === current_user) ? 

                                <div className='flex gap-[1rem] sm:gap-[2rem] flex-wrap'>
                                    <button className='text-[0.6rem] min-[480px]:text-[0.7rem] sm:text-[0.9rem] bg-[#B75D32] text-white py-1 min-[480px]:py-2 px-2 min-[480px]:px-3 sm:px-5 rounded-lg min-[480px]:rounded-xl text-[#2D4739] font-body font-bold hover:-translate-y-0.5 transition-all duration-100' onClick={()=>navigate(`/profile/${current_user}/edit`)}>Edit Profile</button>
                                    <button className='text-[0.6rem] min-[480px]:text-[0.7rem] sm:text-[0.9rem] border-2 text-red-400 font-bold border-red-50 py-1 min-[480px]:py-2 px-2 min-[480px]:px-3 sm:px-5 rounded-lg min-[480px]:rounded-xl font-body hover:-translate-y-0.5 transition-all duration-100' onClick={handleLogout}>Logout</button>
                                </div>
                                :
                                <button className='text-[0.6rem] min-[480px]:text-[0.7rem] sm:text-[0.9rem] bg-[#B75D32] text-white py-1 min-[480px]:py-2 px-2 min-[480px]:px-3 sm:px-5 rounded-lg min-[480px]:rounded-xl text-[#2D4739] font-body font-bold hover:-translate-y-0.5 transition-all duration-100' onClick={handleFollow}>{isFollowing? "Unfollow": "Follow"}</button>
                            }
                            
                        </div> :
                        <div></div>
                    }

                </div>
            </div>

           {/* Tabs */}
        <div className='mt-8 lg:mt-12 w-full max-w-[500px] mx-auto px-4'>
            <ul className='flex p-1 bg-white/50 backdrop-blur-sm rounded-full border border-black/5 shadow-sm'>
                {tabs.map((item) => (
                    <li 
                        key={item} 
                        onClick={() => setIsActive(item)} 
                        className={`
                            flex-1 py-2 lg:py-3 rounded-full flex justify-center items-center cursor-pointer 
                            transition-all duration-300 font-heading text-sm lg:text-base capitalize
                            ${isActive === item 
                                ? "bg-[#B75D32] text-white shadow-md" 
                                : "text-[#2D4739]/60 hover:text-[#2D4739]"}
                        `}
                    >
                        {item}
                    </li>
                ))}
            </ul>
        </div>

            {/* Content */}
            <div className=' mx-auto rounded-3xl py-[2rem] space-y-[1rem] lg:space-y-[2rem]'>

                {/* status info */}
                <div>
                    <div className='w-fit bg-white py-[0.8rem] px-[1.3rem] rounded-3xl  font-semibold border-[#B75D32] font-body text-[0.7rem] sm:text-[0.95rem] space-x-1'>
                        <span className='italic opacity-50'>{isActive==="Posts"? "Posts by" : "Saved by"}</span><span className='opacity-50'>@{thisUserData?.username}</span>
                    </div>
                </div>
                
                {/* Card */}
                <div className='space-y-4 mx-auto'>
                    { isActive==="Posts" ?
                        ((postsData?.length > 0) ? 
                            postsData.map(post => (
                                <PostCard key={post._id} post = {post} savedPosts = {savedData}>
                                </PostCard>
                            )) : 
                            <EmptyCard title="No posts yet" subtitle="Your voice matters! Share your first thought with your campus." icon={<span className="text-5xl">✍️</span>}/>
                        )
                        :
                        isActive==="Saved" ?
                            ((savedData?.length > 0) ? 
                                savedData.map(post => (
                                    <PostCard key={post._id} post = {post} savedPosts = {savedData}>
                                    </PostCard>)
                            ): 
                                <EmptyCard title="No saved posts" subtitle="This is where your favorite campus moments live." icon={<span className="text-5xl">🎈</span>}/>
                        ) : 
                        <EmptyCard/>
                    }
                </div>
            </div>

        </div>
    </div>
  )
}

export default Profile