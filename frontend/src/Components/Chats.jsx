import React from 'react'
import { useSelector } from 'react-redux'

const Chats = () => {
  const filteredFriends = useSelector((state) => state.users.filteredFriends)

  const renderUser = () => {
    return filteredFriends.map((user, index) => {
      return (
        <div
          key={index}
          className='flex items-center gap-2 text-white cursor-pointer hover:bg-[#2e1065] transition-all duration-300 ease-in-out p-2 rounded-md'
        >
          <img className='w-12 h-12 rounded-full object-cover' src='https://thispersondoesnotexist.com/' />
          <div>
            <span className='text-base font-semibold'>{user.username}</span>
            <p className='text-sm text-gray-300'>{user.address}</p>
          </div>
        </div>
      )
    })
  }

  return <div className='scrollbar-hidden'>{renderUser()}</div>
}

export default Chats
