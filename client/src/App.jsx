import './App.css'
import { createBrowserRouter, RouterProvider } from 'react-router'
import Navbar from './components/Navbar'
import Landing from './pages/Landing'
import Profile from './pages/Profile'
import Feed from './pages/Feed'
import CreatePostModal from './components/CreatePostModal'
import PostDetail from './pages/PostDetail'
import EditProfile from './pages/EditProfile'
import { UserContext } from './context/UserContext'
import { useContext } from 'react'
import NotFound from './pages/NotFound'
import {motion} from 'framer-motion';

function App() {
  const { userData } = useContext(UserContext);
  const router = createBrowserRouter(
    [
      {
        path: '/',
        element: 
          <motion.div initial={{opacity: 0}} animate={{opacity: 1}} exit={{opacity: 0}} transition={{duration: 0.2}}>
            <Navbar key={userData?._id}/>
            <Landing/>
          </motion.div>
      },
      {
        path: '/profile/:id',
        element: 
          <motion.div initial={{opacity: 0}} animate={{opacity: 1}} exit={{opacity: 0}} transition={{duration: 0.2}}>
            <Navbar key={userData?._id}/>
            <Profile/>
          </motion.div>
      },
      {
        path: '/profile/:id/edit',
        element: 
          <motion.div initial={{opacity: 0}} animate={{opacity: 1}} exit={{opacity: 0}} transition={{duration: 0.2}}>
            <Navbar key={userData?._id}/>
            <EditProfile/>
          </motion.div>
      },
      {
        path: '/create',
        element: 
          <motion.div initial={{opacity: 0}} animate={{opacity: 1}} exit={{opacity: 0}} transition={{duration: 0.2}}>
            <Navbar key={userData?._id}/>
            <CreatePostModal/>
          </motion.div>
      },
      {
        path: '/feed',
        element: 
          <motion.div initial={{opacity: 0}} animate={{opacity: 1}} exit={{opacity: 0}} transition={{duration: 0.2}}>
            <Navbar key={userData?._id}/>
            <Feed/>
          </motion.div>
      },
      {
        path: '/post/:id',
        element: 
          <motion.div initial={{opacity: 0}} animate={{opacity: 1}} exit={{opacity: 0}} transition={{duration: 0.2}}>
            <Navbar key={userData?._id}/>
            <PostDetail/>
          </motion.div>
      },
      {
        path: '*',
        element: 
          <motion.div initial={{opacity: 0}} animate={{opacity: 1}} exit={{opacity: 0}} transition={{duration: 0.2}}>
            <NotFound/>
          </motion.div>
      }
    ]
  )

  return (
    <RouterProvider router = {router} />
  )
}

export default App
