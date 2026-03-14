import { useState, useRef, useEffect } from 'react';
import notifIcon from '../assets/notif-icon.svg'
import {API} from '../api'
import { useNavigate } from 'react-router';
const NotificationDropdown = ({ notifications, unreadCount }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleToggle = async () => {
    const nextState = !isOpen;
    setIsOpen(nextState);

    if (nextState && unreadCount > 0) {
        try {
        await API.put(`/api/profile/mark-notifications-read`, {}, { 
            withCredentials: true 
        });

        } catch (err) {
        console.error("Failed to mark notifications as read", err);
        }
    }
    };

  return (
    <div className="relative" ref={dropdownRef}>
      <div 
        onClick={handleToggle}
        className="relative cursor-pointer p-1 md:p-2 hover:bg-gray-100 rounded-full transition-all"
      >
        <img src={notifIcon} alt="notif" className=' h-4 w-4 md:h-6 md:w-6' />
          {unreadCount > 0 && (
            <div className="w-6 h-6 text-gray-700">
              <span className="absolute flex h-5 w-5 items-center justify-center rounded-full bg-[#B75D32] text-[10px] font-bold text-white ring-2 ring-white">
                {unreadCount}
              </span>
            </div>
          )}
        
      </div>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-xl z-50 overflow-hidden">
          <div className="p-3 border-b border-gray-100 font-bold text-gray-700">
            Notifications
          </div>
          <div className="max-h-96 overflow-y-auto">
            {notifications?.length > 0 ? (
              notifications.map((notif, index) => (
                <div 
                  key={index} 
                  className={`p-3 border-b border-gray-50 hover:bg-blue-50 cursor-pointer transition-colors ${!notif.read ? 'bg-blue-50/30' : ''}`}
                  onClick={notif.type !== 'followed' && notif.postId ? ()=>navigate(`/post/${notif.postId}`) : ()=>{}}
                >
                  <p className="text-sm text-gray-800">
                    <span className="font-bold">{notif.senderName}</span> {notif.type} {notif.type==='followed'?'you':notif.type==='commented'?'on your post': 'your post'}.
                  </p>
                  <span className="text-[10px] text-gray-400">
                    {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ))
            ) : (
              <div className="p-4 text-center text-sm text-gray-500">
                No notifications yet.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown