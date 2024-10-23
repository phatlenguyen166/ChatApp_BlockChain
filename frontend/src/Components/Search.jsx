import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { searchUsers } from '../redux/reducers/accountReducer' // Nhập action searchUser
import Chats from './Chats'

const Search = () => {
  const [userName, setUserName] = useState('')
  const dispatch = useDispatch()
  const filteredUsers = useSelector((state) => state.users.filteredUsers)

  const handleSearch = (event) => {
    const value = event.target.value
    setUserName(value)
    dispatch(searchUsers(value.trim() === '' ? '' : value))
  }

  return (
    <div className='py-3'>
      <div className='border-b-2 border-gray-500'>
        <input
          type='text'
          placeholder='Find a user'
          className='bg-transparent text-white border-none outline-none pl-3'
          value={userName}
          onChange={handleSearch}
        />
      </div>
      <div>
        {userName.trim() === '' ? (
          <Chats />
        ) : (
          filteredUsers &&
          filteredUsers.map((user, index) => (
            <div
              key={index}
              className='flex items-center gap-2 text-white cursor-pointer hover:bg-[#2e1065] transition-all duration-300 ease-in-out p-2 rounded-md'
            >
              <img className='w-12 h-12 rounded-full object-cover' src={user.img} alt={user.userName} />
              <div>
                <span className='text-base font-semibold'>{user.userName}</span>
                <p className='text-sm text-gray-300'>{user.lastMessage}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default Search
