import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { searchFriends } from '../redux/reducers/accountReducer'
import Chats from './Chats'

const Search = () => {
  const [userName, setUserName] = useState('')
  const dispatch = useDispatch()

  const handleSearch = (event) => {
    const value = event.target.value
    setUserName(value)
    dispatch(searchFriends(value))
  }

  return (
    <div className='py-3'>
      <div className='border-b-2 border-gray-500'>
        <input
          type='text'
          placeholder='Find a friend'
          className='bg-transparent text-white border-none outline-none pl-3'
          value={userName}
          onChange={handleSearch}
        />
      </div>
      <div>
        <Chats />
      </div>
    </div>
  )
}

export default Search
