import React, { useEffect } from 'react'
import SideBar from '../Components/SideBar'
import Chat from '../Components/Chat'
import UserList from '../Components/UserList'
import { useSelector } from 'react-redux'
import Event from '../Components/Event'

const Home = () => {
  const searchUsers = useSelector((state) => state.components.searchUsers)

  return (
    <div className=' bg-[#a7bcff] h-[100vh] flex items-center justify-center '>
      <div className='w-[85%] h-[90%] border-2 border-solid border-white rounded-xl flex overflow-hidden'>
        <SideBar />
        <Chat />
      </div>
      {searchUsers && <UserList />}
      <Event />
    </div>
  )
}

export default React.memo(Home)
