import heroImg from '../assets/herosection-illustration.png'
import logo from '../assets/logo-light.png'
import linkedinLogo from '../assets/linkedin.svg';
import githubLogo from '../assets/github.svg';
import opportunitiesImg from '../assets/opportunities.png';
import eventsImg from '../assets/fests.png';
import opinionsImg from '../assets/opinions.png';
import { useContext, useEffect } from 'react'
import { UserContext } from '../context/UserContext';
import { useNavigate } from 'react-router';
import {API, BASE_URL} from '../api'
const Landing = () => {
    const { userData, setUserData } = useContext(UserContext);
    const navigate = useNavigate();

    const handleLogin = () => {
        window.location.href = `${BASE_URL}/auth/google`;
    }

    useEffect(() => {
    const fetchUserData = async () => {
      try{
        const res = await API.get(`/auth/me`);
        const data = await res.data;

        setUserData(data);

      } catch(err) {
        console.log("User not logged in");
        console.error(err);
      }
    }

    fetchUserData();

  }, []);

  return (
    <div className='bg-[#F5F2ED]'>
        <div className='md:max-w-[1000px] xl:max-w-[1200px] mx-auto'>
            {/* Hero Section */}
            <div className='flex flex-col md:flex-row px-[5rem] md:px-[7rem] py-[5rem] gap-[1rem] mx-auto'>
                {/* left container */}
                <div className='md:w-1/2 flex flex-col gap-[2rem] pt-[2.5rem]'>
                    <div className='text-[2.5rem] md:text-[3rem] xl:text-[4.5rem] text-[#2D4739] font-semibold leading-[0.95] text-[#2D3A30] font-heading tracking-tight'>The digital common space for your campus.</div>
                    <div className='text-[1.1rem] md:text-[1.3rem] xl:text-[2rem] leading-[1.1] text-[#3C2F2F]/60 font-body font-medium opacity-95'>Placements. Internships. Events. Discussions. All in one place.</div>
                </div>

                {/* right container */}
                <div className='md:w-1/2'>
                    <img src={heroImg} alt="heroImage" className='scale-110' loading='lazy'/>
                </div>

            </div>

            {/* Value Section */}
            <div className='px-[3rem] md:px-[5rem] lg:px-[7rem] flex flex-col gap-[4rem] sm:gap-[6rem] xl:gap-[8rem] mt-[4rem]' id='features'>
                {/* Card 1 */}
                <div className='bg-white/70 backdrop-blur-sm rounded-[3rem] border border-white/40 flex flex-col lg:flex-row py-12 xl:py-20 px-8 xl:px-24 gap-12 xl:gap-20 shadow-xl overflow-hidden'>
                    {/* left */}
                    <div className='flex flex-col justify-center space-y-6 lg:w-1/2'>
                        <div className='text-[clamp(2rem,5vw,3.5rem)] font-bold font-heading leading-[1.1]'><span className='text-[#2D4739]'>Opportunities,</span> <br/> <span className='text-[#B75D32]'>All in One Place.</span></div>
                        <div className='text-lg font-body max-w-md text-black/50'>Get updates on internships, drives, shortlists, and prep resources.</div>
                    </div>

                    {/* right */}
                    <div className='lg:w-1/2 flex items-center justify-center relative'>
                        <div className='absolute inset-0 bg-[#B75D32]/10 blur-[100px] rounded-full'>
                        </div>
                        <img className='rounded-3xl shadow-2xl relative z-10' src={opportunitiesImg} alt="opportunities illustration" loading='lazy'/>
                    </div>
                </div>

                {/* Card 2 */}
                <div className='bg-white/70 backdrop-blur-sm rounded-[3rem] border border-white/40 flex flex-col lg:flex-row py-12 xl:py-20 px-8 xl:px-24 gap-12 xl:gap-20 shadow-xl overflow-hidden'>
                    {/* left */}
                    <div className='lg:w-1/2 flex items-center justify-center relative'>
                        <div className='absolute inset-0 bg-[#B75D32]/10 blur-[100px] rounded-full'>
                        </div>
                        <img className='rounded-3xl shadow-2xl relative z-10' src={eventsImg} alt="opportunities illustration" loading='lazy'/>
                    </div>

                    {/* right */}
                    <div className='flex flex-col justify-center space-y-6 lg:w-1/2'>
                        <div className='text-[clamp(2rem,5vw,3.5rem)] font-bold font-heading leading-[1.1]'><span className='text-[#2D4739]'>Campus Buzz,</span> <br/> <span className='text-[#B75D32]'>All Here.</span></div>
                        <div className='text-lg font-body max-w-md text-black/50'>Find fests, events, workshops, auditions, and everything worth showing up for.</div>
                    </div>
                </div>

                {/* Card 3 */}
                <div className='bg-white/70 backdrop-blur-sm rounded-[3rem] border border-white/40 flex flex-col lg:flex-row py-12 xl:py-20 px-8 xl:px-24 gap-12 xl:gap-20 shadow-xl overflow-hidden'>
                    {/* left */}
                    <div className='flex flex-col justify-center space-y-6 lg:w-1/2'>
                        <div className='text-[clamp(2rem,5vw,3.5rem)] font-bold font-heading leading-[1.1]'><span className='text-[#2D4739]'>Got Something to</span> <br/> <span className='text-[#B75D32]'>Say?</span></div>
                        <div className='text-lg font-body max-w-md text-black/50'>Drop your opinions, hot takes, secrets, or confessions.</div>
                    </div>

                    {/* right */}
                    <div className='lg:w-1/2 flex items-center justify-center relative'>
                        <div className='absolute inset-0 bg-[#B75D32]/10 blur-[100px] rounded-full'>
                        </div>
                        <img className='rounded-3xl shadow-2xl relative z-10' src={opinionsImg} alt="opportunities illustration" loading='lazy'/>
                    </div>
                </div>
            </div>

            {/* How it works section */}
            <div className='px-[2rem] md:px-[5rem] md:px-[7rem] flex flex-col mt-[8rem] xl:mt-[12rem]' id='howItWorks'>
                {/* top */}
                <div className='w-full bg-[#e4ded4] p-[1.5rem] md:p-[2.7rem] rounded-[2rem]'>
                    <div className='font-heading font-bold text-[clamp(1.5rem,5vw,3rem)] leading-[1.1]'><span className='text-[#2D4739]'>Get Started in</span> <br /> <span className='text-[#B75D32]'>3 Simple Steps.</span></div>
                    <div className='font-body text-[clamp(0.8rem,2vw,1.2rem)] font-medium text-black/50'>Join your Courtyard and stay in the loop effortlessly.</div>
                </div>

                {/* bottom */}
                <div className='w-full p-[2.7rem] rounded-[2rem] flex flex-col gap-[2rem]'>
                    {/* 1. */}
                    <div className='bg-white/60 backdrop-blur-md rounded-[2.5rem] p-8 flex flex-col min-[520px]:flex-row gap-6 items-start border border-white/40 shadow-xl shadow-[#3C2F2F]/5 transition-all hover:translate-x-2'>
                        <div className='flex-shrink-0 h-16 w-16 bg-[#a88b7e] text-white rounded-2xl font-heading font-bold text-2xl flex justify-center items-center shadow-lg rotate-3 group-hover:rotate-0 transition-transform'>
                            1
                        </div>

                        <div className='space-y-2'>
                            <h3 className='text-[clamp(1.5rem,3vw,2.2rem)] font-heading font-bold text-[#2D4739] leading-tight'>
                                Join your Courtyard
                            </h3>
                            <p className='text-[clamp(0.95rem,2vw,1.1rem)] font-body font-medium text-black/60 leading-relaxed max-w-md'>
                                Sign up with your college email and access your private campus space instantly.
                            </p>
                        </div>
                    </div>

                    {/* 2. */}
                    <div className='bg-white/60 backdrop-blur-md rounded-[2.5rem] p-8 flex flex-col min-[520px]:flex-row gap-6 items-start border border-white/40 shadow-xl shadow-[#3C2F2F]/5 transition-all hover:translate-x-2'>
                        <div className='flex-shrink-0 h-16 w-16 bg-[#a88b7e] text-white rounded-2xl font-heading font-bold text-2xl flex justify-center items-center shadow-lg rotate-3 group-hover:rotate-0 transition-transform'>
                            2
                        </div>

                        <div className='space-y-2'>
                            <h3 className='text-[clamp(1.5rem,3vw,2.2rem)] font-heading font-bold text-[#2D4739] leading-tight'>
                                Explore & Connect
                            </h3>
                            <p className='text-[clamp(0.95rem,2vw,1.1rem)] font-body font-medium text-black/60 leading-relaxed max-w-md'>
                                Discover campus discussions, events, and conversations happening right now.
                            </p>
                        </div>
                    </div>

                    {/* 3. */}
                    <div className='bg-white/60 backdrop-blur-md rounded-[2.5rem] p-8 flex flex-col min-[520px]:flex-row gap-6 items-start border border-white/40 shadow-xl shadow-[#3C2F2F]/5 transition-all hover:translate-x-2'>
                        <div className='flex-shrink-0 h-16 w-16 bg-[#a88b7e] text-white rounded-2xl font-heading font-bold text-2xl flex justify-center items-center shadow-lg rotate-3 group-hover:rotate-0 transition-transform'>
                            3
                        </div>

                        <div className='space-y-2'>
                            <h3 className='text-[clamp(1.5rem,3vw,2.2rem)] font-heading font-bold text-[#2D4739] leading-tight'>
                                Stay Ahead
                            </h3>
                            <p className='text-[clamp(0.95rem,2vw,1.1rem)] font-body font-medium text-black/60 leading-relaxed max-w-md'>
                                Never miss drives, deadlines, or discussions that matter to you.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* CTA section */}
            <div className=' xl:max-w-[1000px] mx-auto mt-[6rem] xl:mt-[8rem] p-[2rem]' id='CTA'>
                <div className='flex flex-col bg-gradient-to-br from-[#2D4739] via-[#2D4739] to-[#1a2b22] p-[3rem] lg:p-[5rem] rounded-[3rem] justify-center shadow-2xl'>
                    <div className='text-white text-[clamp(2.2rem,5vw,4.5rem)] font-bold font-heading leading-[1.1] tracking-tight'><span>Ready to Join</span> <br /> <span className='text-[#B75D32]'>your Courtyard?</span></div>
                    <div className='mt-4 text-[#ffffffd3]/70 text-lg font-body font-medium max-w-md'>Your campus space is waiting.</div>
                    <button className='group hover:-translate-y-1 w-fit mt-[2rem] font-body shadow-xl rounded-xl md:rounded-3xl px-7 md:px-10 py-3 md:py-5 text-lg hover:shadow-[0_0_30px_rgba(183,93,50,0.4)] transition-all duration-300 bg-[#B75D32] text-[#FFFFFF] text-[0.9rem] md:text-[1rem] font-semibold' onClick={userData? ()=>{navigate('/feed')}: handleLogin}>
                        {userData? 
                        <div className='flex items-center'>
                            <div>Go to Courtyard</div>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                            </svg>
                        </div>
                        :
                        "Join Now"}
                    </button>
                </div>
            </div>

        </div>

        {/* Footer */}
        <div className='w-full mt-32 xl:mt-48 bg-white border-t border-black/5'>
            <div className='max-w-[1200px] mx-auto px-8 pt-16 grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-4'>
                
                {/* column 1: Brand */}
                <div className='flex flex-col gap-4'>
                    <a className='flex gap-2 items-center w-fit' href='/'>
                        <img src={logo} className='h-10 w-10' alt='logo'/>
                        <span className='text-3xl font-bold text-[#2D4739] font-heading tracking-tight'>Courtyard</span>
                    </a>
                    <p className='text-sm font-body opacity-50 max-w-[200px] leading-relaxed'>
                        A private, verified space for your campus community to grow together.
                    </p>
                </div>

                {/* column 2: Navigation (Centered) */}
                <div className='md:text-center flex flex-col md:items-center space-y-4'>
                    <div className='font-body text-lg font-bold text-[#3C2F2F]'>Product</div>
                    <ul className='font-body text-base space-y-2 text-[#3C2F2F]/60'>
                        <li className='hover:text-[#B75D32] transition-colors'><a href="#features">Features</a></li>
                        <li className='hover:text-[#B75D32] transition-colors'><a href="#howItWorks">How It Works</a></li>
                        <li className='hover:text-[#B75D32] transition-colors'><a href="#CTA">Join Now</a></li>
                    </ul>
                </div>

                {/* column 3: Connect (Right) */}
                <div className='flex flex-col md:items-end space-y-4'>
                    <div className='font-body text-lg font-bold text-[#3C2F2F]'>Connect</div>
                    <div className='md:text-right'>
                        <p className='text-sm opacity-60 font-body'>Questions or feedback?</p>
                        <a href="mailto:hello@courtyard.app" className='text-base font-semibold text-[#B75D32] hover:underline'>hello@courtyard.app</a>
                    </div>
                    <div className='flex gap-4 items-center'>
                        <a href='https://www.linkedin.com/in/sayan-majumdar31' className='opacity-60 hover:opacity-100 hover:-translate-y-1 transition-all'>
                            <img src={linkedinLogo} alt="linkedin" className='h-6 w-6 grayscale hover:grayscale-0 transition-all'/>
                        </a>
                        <a href='https://github.com/Sayan-Majumdar-06' className='opacity-60 hover:opacity-100 hover:-translate-y-1 transition-all'>
                            <img src={githubLogo} alt="github" className='h-6 w-6 grayscale hover:grayscale-0 transition-all'/>
                        </a>
                    </div>
                </div>
            </div>

            {/* The Massive Footer Slogan */}
            <div className='select-none pointer-events-none font-heading text-[clamp(3rem,10vw,8rem)] text-center font-bold opacity-5 mt-20 md:mt-32 pb-8 tracking-tighter text-[#2D4739]'>
                Your Campus, Connected.
            </div>
        </div>
        
    </div>
  )
}

export default Landing