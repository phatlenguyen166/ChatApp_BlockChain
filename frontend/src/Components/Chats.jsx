import React from 'react'
import { useSelector } from 'react-redux'

const Chats = () => {
  const users = useSelector((state) => state.users.users)

  const getRandomNumber = (min, max) => {
    return Math.floor(Math.random() * (max - min)) + min
  }

  const renderUser = () => {
    return users.map((user, index) => {
      return (
        <div
          key={index}
          className='flex items-center gap-2 text-white cursor-pointer hover:bg-[#2e1065] transition-all duration-300 ease-in-out p-2 rounded-md'
        >
          <img
            className='w-12 h-12 rounded-full object-cover'
            src={`https://picsum.photos/id/${getRandomNumber(100, 999)}/200/300`}
          />
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
