import React from 'react'
import SideBar from '../Components/SideBar'
import Chat from '../Components/Chat'

const Home = () => {
  return (
    <div className=' bg-[#a7bcff] h-[100vh] flex items-center justify-center'>
      <div className='w-[60%] h-[80%] border-2 border-solid border-white rounded-xl flex overflow-hidden'>
        <SideBar />
        <Chat />
      </div>
    </div>
  )
}

export default Home
