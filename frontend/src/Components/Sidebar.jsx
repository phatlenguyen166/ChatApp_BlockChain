import React, { useEffect } from 'react'
import Navbar from './Navbar'
import Search from './Search'
import Chats from './Chats'
// import { useSelector } from 'react-redux'

const SideBar = React.memo(() => {
  // const filteredUsers = useSelector((state) => state.users.filteredUsers)
  // console.log(filteredUsers.length)

  return (
    <div className='flex flex-col bg-[#3e3c61] w-[400px] border-r-2'>
      <Navbar />
      <Search />
      {/* <Chats /> */}
    </div>
  )
})

SideBar.displayName = 'SideBar'

export default SideBar
