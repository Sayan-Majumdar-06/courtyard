import { useState } from 'react';
import { NavLink } from 'react-router';
import { useContext } from 'react'
import { UserContext } from '../context/UserContext';
import messagecircle from '../assets/icons/message-circle.svg'
import hash from '../assets/icons/hash.svg'
import ghost from '../assets/icons/ghost.svg'
import user from '../assets/icons/user.svg'
import briefcase from '../assets/icons/briefcase.svg'
import calendar from '../assets/icons/calendar.svg'
import booksearch from '../assets/icons/book-search.svg'
const Sidebar = () => {
  const { userData } = useContext(UserContext);
  const currentUser = userData?.username;

  const options = [
  { name: 'all', icon: booksearch },
  { name: 'discussion', icon: messagecircle },
  { name: 'placement', icon: briefcase },
  { name: 'event', icon: calendar },
  { name: 'confession', icon: ghost },
  { name: 'general', icon: hash },
  { name: 'profile', icon: user },
];

  const [selectedOption, setSelectedOption] = useState("all");

  return (
    <div className='sticky top-24 bg-[#EFE8E0] rounded-3xl'>
        <div className='flex flex-col max-[450px]:items-center font-body text-[1.2rem] p-[0.3rem] min-[450px]:p-[0.6rem] md:p-[1.2rem] gap-[1rem] w-fit'>
            {options.map((item) => (
                <NavLink to={(item.name === "all")? "/feed" : (item.name === "profile")? `/profile/${currentUser}` : `/feed?type=${item.name}`} key={item.name} onClick={() => setSelectedOption(item.name)} className={`w-fit group font-medium hover:text-[#2D4739] cursor-pointer ${selectedOption === item.name ? "bg-[#2d4a3e]/10 px-2 md:px-4 py-2 rounded-full font-bold":"text-[#A88B7E]"}`}>
                    <div className='flex space-x-2'>
                      <img src={item.icon} className={`h-[1.2rem] w-[1.2rem] min-[450px]:h-[1.5rem] min-[450px]:w-[1.5rem] group-hover:opacity-60 ${selectedOption === item.name ? "opacity-60":"opacity-40"}`} alt="" />
                      <div className='hidden md:block'>{item.name}</div>
                    </div>
                </NavLink>
            ))}
        </div>
    </div>
  )
}

export default Sidebar