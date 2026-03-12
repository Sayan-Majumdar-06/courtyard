import { useNavigate } from "react-router";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#F3F0E9] flex flex-col items-center justify-center p-6 text-center">
      <div className="relative mb-8">
        <h1 className="text-[12rem] font-bold text-[#2D4739] opacity-5 select-none">404</h1>
        <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-6xl">🍃</span>
        </div>
      </div>

      <h2 className="text-3xl font-bold text-[#3C2F2F] mb-4">Lost in the Courtyard?</h2>
      <p className="text-[#3C2F2F]/60 max-w-md mb-8 leading-relaxed">
        The page you're looking for has moved, graduated, or never existed in this campus. 
        Let's get you back to the main square.
      </p>

      <button 
        onClick={() => navigate('/feed')}
        className="px-8 py-3 bg-[#2D4739] text-white rounded-full font-bold shadow-lg shadow-[#2D4739]/20 hover:scale-105 transition-all active:scale-95"
      >
        Back to Feed
      </button>
    </div>
  );
};

export default NotFound;