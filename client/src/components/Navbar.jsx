import logo from '../assets/logo-light.png'
import { useState, useEffect } from 'react';
import { NavLink } from 'react-router';
import { useContext } from 'react'
import { UserContext } from '../context/UserContext';
import NotificationDropdown from './NotificationDropdown';
import {API, BASE_URL} from '../api'
const Navbar = () => {
  const { userData, setUserData, loading } = useContext(UserContext);
  const [peek, setPeek] = useState(false);

  const [scrolled, setScrolled] = useState(false);

  const unreadCount = userData?.notifications?.filter(n => !n.read).length;
  const unreadNotifs = userData?.notifications?.filter(n => !n.read) || [];

  useEffect(() => {
    const handleScroll = () => {
      if(window.scrollY > 100) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
  
    window.addEventListener("scroll", handleScroll);
  }, [])
  
  const handleLogin = () => {
    window.location.href = `${BASE_URL}/auth/google`;
  }

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const errorType = params.get("error");

    if (errorType === "invalid_email") {
      alert("❌ Access Denied: Please use a supported college email ID.");

      window.history.replaceState({}, document.title, "/");
    }
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      try{
        const res = await API.get(`/auth/me`);
        const data = res.data;
        setUserData(data);
      } catch(err) {
        console.error(err);
      }
    }

    fetchUserData();

  }, []);

  const getProfilePic = (pic) => {
    if(!pic) return "/images/default_avatar.png";

    if(pic.startsWith("/images")) {
      return pic;
    }

    return `${BASE_URL}/uploads/profile/${pic}`;
  }
 
  return (
    <div className={`w-full sticky top-0 z-10 transition-all duration-300 ${scrolled ? "bg-transparent p-2" : "bg-white p-2 sm:p-4 lg:p-[0.7rem]"}`}>
      
      <div className={`mx-auto transition-all duration-300 flex justify-between items-center 
        ${scrolled ? "w-[95%] md:w-[90%]" : "w-[95%] lg:w-[73%]"}`}>
        
        <a className={`flex items-center gap-1 sm:gap-2 cursor-pointer transition-all duration-300 ease-in-out ${scrolled ? "bg-white/80 p-2 rounded-2xl shadow-sm" : ""}`} href='/'>
          <img src={logo} className='h-[1.8rem] w-[1.8rem] sm:h-[2.5rem] sm:w-[2.5rem] md:h-[3rem] md:w-[3rem]' alt='logo'/>
          <div className='sm:text-[1.8rem] lg:text-[2.3rem] font-bold text-[#2D4739] font-heading'>
            Courtyard
          </div>
        </a>

        {loading ? (
            <div className="h-10 w-10 rounded-full bg-gray-200 animate-pulse" /> 
          ) : (
            userData ? (
              <div className='flex items-center gap-4'>
                <div className='relative'>
                  <NavLink to={`/profile/${userData?.username}`}>
                    <img 
                      src={getProfilePic(userData?.profilePic)} 
                      alt={userData?.Name} 
                      className='h-[1.8rem] w-[1.8rem] sm:h-[2.5rem] sm:w-[2.5rem] md:h-[3rem] md:w-[3rem] rounded-full cursor-pointer ring-2 ring-transparent hover:ring-[#B75D32]/30 transition-all'
                      onMouseEnter={() => setPeek(true)} 
                      onMouseLeave={() => setPeek(false)}
                      referrerPolicy="no-referrer" // Add this for Google Images!
                    />
                    
                    <div className={`bg-white shadow-xl border border-gray-100 p-3 absolute right-0 top-12 rounded-xl z-50 min-w-[120px] ${peek ? "hidden md:block" : "hidden"}`}>
                      <h2 className='font-heading text-[1rem] whitespace-nowrap'>{userData.Name}</h2>
                      <p className='font-body text-[0.7rem] opacity-60'>@{userData.username}</p>
                    </div>
                  </NavLink>

                  <div className='absolute -top-2 -right-3 md:-top-3 md:-right-5 scale-90 md:scale-100'>
                    <NotificationDropdown 
                      notifications={unreadNotifs} 
                      unreadCount={unreadCount} 
                    />
                  </div>
                </div>
              </div>
            ) : (
              <button className='text-[1rem] md:text-[1.2rem] py-2 px-4 md:px-5 rounded-xl bg-[#B75D32] text-white font-body font-semibold hover:bg-[#a04e28] transition-all' onClick={handleLogin}>
                Join
              </button>
            )
          )}
      </div>
    </div>
  )
}

export default Navbar