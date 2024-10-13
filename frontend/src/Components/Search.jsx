import React from 'react'

const Search = () => {
  return (
    <div className='py-3'>
      <div className='border-b-2 border-gray-500'>
        <input
          type='text'
          placeholder='Find an user'
          className='bg-transparent text-white border-none outline-none pl-3'
        />
      </div>
    </div>
  )
}

export default Search
