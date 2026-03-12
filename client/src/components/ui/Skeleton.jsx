import React from 'react'

const Skeleton = ({className = ""}) => {
  return (
    <div className={`animate-pulse bg-[#E8E3DC] rounded-3xl ${className}`}>
    </div>
  )
}

export default Skeleton