import React, { useEffect } from 'react'
import Navbar from './Navbar'
import Search from './Search'
import Chats from './Chats'

import { useSelector } from 'react-redux'
const SideBar = () => {
  const filteredUsers = useSelector((state) => state.users.filteredUsers)
  // console.log(filteredUsers.length)

  return (
    <div className='flex-1 bg-[#3e3c61]'>
      <Navbar />
      <Search />
      {/* <Chats /> */}
    </div>
  )
}

export default SideBar
