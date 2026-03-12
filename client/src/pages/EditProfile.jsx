import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import { useContext } from 'react'
import { UserContext } from '../context/UserContext';
import editButton from '../assets/edit-button.svg'
import {API, BASE_URL} from '../api'
const EditProfile = () => {
    const navigate = useNavigate();

    const { userData, setUserData } = useContext(UserContext);

    const [username, setUsername] = useState("");
    const [bio, setBio] = useState("");

    const [isUnique, setIsUnique] = useState(true);
    const [checking, setChecking] = useState(false);
    const [error, setError] = useState("");

    const [preview, setPreview] = useState("");
    const [branch, setBranch] = useState(userData?.branch || "");

    useEffect(() => {
      if(username === userData?.username) {
        setIsUnique(true);
        setError("");
        return;
      }
      
      const regex = /^[a-zA-Z0-9_]+$/;
      if (username.length > 0 && !regex.test(username)) {
        setError("Only letters, numbers, and underscores allowed");
        setIsUnique(false);
        return;
      }
      const timer = setTimeout(async () => {
        if(username.length >= 3) {
            setError("");
            setChecking(true);

            try {
                const res = await API.get(`/api/profile/check-username/${username}`);
                setIsUnique(res.data.isAvailable);
                if(!res.data.isAvailable) setError("Username already taken!")
            } catch(err) {
                console.error("Check failed: ", err);
            } finally {
                setChecking(false);
            }
        } else if(username.length > 0) {
            setError("Must be at least 3 characters.")
        }
      }, 500);

      return () => clearTimeout(timer);
    }, [username])
    
    useEffect(() => {

        if(userData) {
            setUsername(userData.username);
            setBio(userData.bio);
        }

    }, [userData]);
    
    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("username", username);
        formData.append("bio", bio||"");
        formData.append("branch", branch);

        const fileInput = document.getElementById("profilePicUpload");
        if (fileInput.files[0]) {
            formData.append("profilePic", fileInput.files[0]);
        }

        const res = await API.put(`/api/profile/${userData._id}`, formData, {
            headers: { "Content-Type": "multipart/form-data" }
        });

        setUserData(res.data);
        navigate(`/profile/${username}`);
    }

    const handleImageChange = (e) => {
        const file = e.target.files[0];

        if(!file) return;

        setPreview(URL.createObjectURL(file));
    }

    const handleDelete = async () => {
        const confirmed = window.confirm(
            "Are you sure you want to delete your account?"
        );

        if (!confirmed) return;

        try {
            const res = await API.delete(`/api/profile/${userData?._id}/delete-account`);
            
            setUserData(null);
            const data = await res.json();
            alert(data.message);


            await API.get(`/auth/logout`);

            sessionStorage.clear();
            window.location.href = "/";

        } catch (err) {
            console.error("Delete account error:", err);
            alert("An error occurred. Please try again later.");
        }
    };
  return (
    <form onSubmit={handleSubmit} className='bg-white/70 backdrop-blur-md rounded-3xl max-w-[1000px] mx-auto flex flex-col md:flex-row gap-8 items-start font-body p-8 lg:p-12 shadow-2xl shadow-black/5'>
    
        {/* Left: Profile Pic Container */}
        <div className='w-full md:w-[35%] flex flex-col items-center gap-4'>
            <div className='group relative h-[18rem] w-[18rem] rounded-full overflow-hidden shadow-inner bg-gray-100 border-4 border-white'>
                <img src={preview || `${BASE_URL}/uploads/profile/${userData?.profilePic}`} className='h-full w-full object-cover' alt="profile" />
                <label htmlFor='profilePicUpload' className='absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-center items-center cursor-pointer text-white text-xs font-bold gap-2'>
                    <img className='h-8 w-8' src={editButton} alt="edit" />
                    CHANGE PHOTO
                </label>
            </div>
            <p className='text-[0.7rem] font-bold opacity-30 uppercase tracking-widest'>Profile Picture</p>
            <input type="file" accept='image/*' id='profilePicUpload' onChange={handleImageChange} className='hidden'/>
        </div>

        {/* Right: Data Input Container */}
        <div className='flex flex-col gap-6 w-full md:w-[65%]'>
            <div className='space-y-1 relative'>
                <label className='ml-4 text-[0.7rem] font-bold opacity-40 uppercase'>Username</label>
                <input value={username} className=' w-full bg-[#3C2F2F]/10 rounded-2xl font-semibold px-5 py-4 text-[0.95rem] outline-none focus:bg-white transition-all' placeholder='Username' onChange={(e) => setUsername(e.target.value)}/>
                <div className='mt-2 h-4'> 
                    {error && <p className='text-red-500 text-[0.7rem] font-bold ml-4'>{error}</p>}
                    {isUnique && username !== userData?.username && !checking && !error && (
                        <p className='text-green-600 text-[0.7rem] font-bold ml-4 text-center'>That's a great username!</p>
                    )}
                </div>
            </div>

            <div className='space-y-1'>
                <label className='ml-4 text-[0.7rem] font-bold opacity-40 uppercase'>Bio</label>
                <textarea className='w-full bg-[#3C2F2F]/10 min-h-[140px] focus:bg-white focus:ring-2 focus:ring-[#B75D32]/20 resize-none rounded-2xl outline-none px-5 py-4' placeholder='Tell us about yourself...' value={bio} onChange={(e)=>setBio(e.target.value)}/>
            </div>

            <div className='flex flex-wrap gap-6'>
                <div className='flex flex-col gap-2'>
                    <label className='ml-2 text-[0.7rem] font-bold opacity-40 uppercase'>Branch</label>
                    <select className='bg-[#3C2F2F]/10 rounded-xl px-4 py-2 font-bold outline-none cursor-pointer' value={branch} onChange={(e) => setBranch(e.target.value)}>
                        {/* Common Engineering Branches */}
                        <option value="CSE">Computer Science (CSE)</option>
                        <option value="ECE">Electronics & Comm. (ECE)</option>
                        <option value="EE">Electrical (EE)</option>
                        <option value="ME">Mechanical (ME)</option>
                        <option value="CE">Civil (CE)</option>
                        <option value="MME">Metallurgy & Materials (MME)</option>
                        <option value="CHE">Chemical (CHE)</option>
                        <option value="IT">Information Technology (IT)</option>
                        
                        {/* specialized/Science Branches */}
                        <option value="BT">Biotechnology (BT)</option>
                        <option value="AI/ML">AI & Machine Learning</option>
                        <option value="EIE">Electronics & Instrumentation (EIE)</option>
                        <option value="MnC">Maths & Computing (MnC)</option>
                        <option value="EP">Engineering Physics (EP)</option>
                        <option value="ARCH">Architecture (B.Arch)</option>
                        <option value="PROD">Production/Industrial</option>
                        <option value="MIN">Mining Engineering</option>
                        
                        {/* Others */}
                        <option value="OTHER">Other / Dual Degree</option>
                    </select>
                </div>
            </div>

            <div className='flex gap-4 pt-4'>
                <button type='submit' className='flex-1 bg-[#B75D32] text-white py-4 rounded-2xl font-bold shadow-lg shadow-[#B75D32]/20 hover:scale-[1.02] active:scale-95 transition-all' onClick={handleSubmit}>Save Changes</button>
                <button type="button" onClick={handleDelete} className='flex-1 border-2 border-red-100 text-red-400 py-4 rounded-2xl font-bold hover:bg-red-50 hover:text-red-500 transition-all'>Delete Account</button>
            </div>
        </div>
    </form>
  )
}

export default EditProfile