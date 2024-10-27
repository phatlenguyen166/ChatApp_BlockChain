import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { NavLink } from 'react-router-dom'
import { getUser } from '../excecutors/UserManager'
import { setFriendList, searchFriends } from '../redux/reducers/accountReducer'
import { NotificationManager } from 'react-notifications'

const Navbar = () => {
  const currentUser = useSelector((state) => state.users.currentUser)
  const friendList = useSelector((state) => state.users.friendList)

  const dispatch = useDispatch()

  useEffect(() => {
    const manager = getUser()
    manager.handleFriendAddedEvent(async (e) => {
      if (e.returnValues.userAddress === currentUser.address || e.returnValues.friendAddress === currentUser.address) {
        const friendList = await manager.getFriendList()
        const friends = friendList.map((friend) => {
          return {
            username: friend.username,
            address: friend.userAddress
          }
        })
        dispatch(setFriendList(friends))
        dispatch(searchFriends(''))
        if (e.returnValues.friendAddress === currentUser.address) {
          NotificationManager.info('New friend added: ' + friends[friends.length - 1].username)
        }
      }
      console.log('RERENDER ROOFI')
    })
    return () => {
      manager.offEvent('FriendAdded')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [friendList])

  return (
    <div className='flex items-center justify-between bg-[#2e1065] h-[48px] px-2'>
      <span className='text-white font-bold'>Chat App</span>
      <div className='flex items-center gap-2'>
        <img
          className='w-8 h-8 rounded-full object-cover'
          src='https://i.pinimg.com/originals/1f/a2/2b/1fa22befc10e3cbacd58c5b407a97997.gif'
          alt='gif'
        />
        <span className='text-white text-sm'>{currentUser.username}</span>
        <button
          // onClick={handleChange}
          className='bg-white text-xs text-black px-2 py-1 rounded-md border-none cursor-pointer font-bold'
        >
          <NavLink to='/'>Logout</NavLink>
        </button>
      </div>
    </div>
  )
}

export default React.memo(Navbar)
