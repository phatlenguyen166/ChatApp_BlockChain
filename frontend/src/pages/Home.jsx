import React, { useEffect } from 'react'
import SideBar from '../Components/SideBar'
import Chat from '../Components/Chat'
import UserList from '../Components/UserList'
import { useSelector } from 'react-redux'
import UserManager from '../excecutors/UserManager'


const Home = () => {
  const searchUsers = useSelector((state) => state.components.searchUsers)
  const currentUser = useSelector((state) => state.users.currentUser)
  const userManager = new UserManager(currentUser.username, currentUser.password)

  return (
    <div className=' bg-[#a7bcff] h-[100vh] flex items-center justify-center '>
      <div className='w-[85%] h-[90%] border-2 border-solid border-white rounded-xl flex overflow-hidden'>
        <SideBar />
        <Chat />
      </div>
      {searchUsers && <UserList />}
    </div>
  )
}

export default Home
