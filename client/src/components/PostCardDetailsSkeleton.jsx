import Skeleton from './ui/Skeleton'
const PostCardDetailsSkeleton = () => {
  return (
    <div>
        <div className='bg-[#F5F2ED] p-[2rem] min-h-screen space-y-[1rem]'>
            <Skeleton className='ml-[5rem] w-[60%] h-[13rem]'>
            </Skeleton>

            <Skeleton className='w-[60%] ml-[5rem] h-[25rem]'>
            </Skeleton>
        </div>
    </div>
  )
}

export default PostCardDetailsSkeleton