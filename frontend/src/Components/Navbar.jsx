import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { NavLink } from 'react-router-dom'
import { getUser } from '../utils/UserManager'
import { setFriendList, searchFriends } from '../redux/reducers/accountReducer'
import { NotificationManager } from 'react-notifications'

const Navbar = () => {
  const currentUser = useSelector((state) => state.users.currentUser)
  const friendList = useSelector((state) => state.users.friendList)

  // const dispatch = useDispatch()
  const handleLogout = (e) => {
    window.location.href = '/'
  }

  return (
    <div className='flex items-center justify-between bg-[#2e1065] h-[48px] px-2'>
      <span className='text-white font-bold'>Chat App</span>
      <div className='flex items-center gap-2'>
        <img className='w-8 h-8 rounded-full object-cover' src={currentUser.url} />
        <span className='text-white text-sm'>{currentUser.username}</span>
        <button
          // onClick={handleChange}
          className='bg-white text-xs text-black px-2 py-1 rounded-md border-none cursor-pointer font-bold'
          onClick={handleLogout}
        >
          {/* <NavLink to='/'>Logout</NavLink> */}
          Logout
        </button>
      </div>
    </div>
  )
}

export default React.memo(Navbar)
