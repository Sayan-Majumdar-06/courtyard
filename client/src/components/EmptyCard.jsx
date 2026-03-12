import React from 'react'
const EmptyCard = ({title = "Nothing here yet", 
  subtitle = "Check back later or be the first to post.", 
  icon, 
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-6 bg-white/40 rounded-[3rem] border border-[#2D4739]/5 transition-all">
      
      {/* Dynamic Icon Container */}
      <div className="mb-6 opacity-20">
        {icon ? icon : (
           <svg className="w-16 h-16 text-[#2D4739]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
           </svg>
        )}
      </div>

      <h3 className="text-xl font-bold text-[#3C2F2F] opacity-80 mb-2">{title}</h3>
      <p className="text-sm text-[#3C2F2F]/50 text-center max-w-[280px] leading-relaxed">
        {subtitle}
      </p>
    </div>
  )
}

export default EmptyCard