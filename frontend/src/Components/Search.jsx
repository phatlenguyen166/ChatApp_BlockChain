import React from 'react'

const Search = () => {
  return (
    <div className='border-b-2 border-gray-500 py-3'>
      <div className='border-b-2 border-gray-500'>
        <input type='text' placeholder='Find an user' className='bg-transparent text-white border-none outline-none pl-3' />
      </div>
      <div className='mt-3'>
        {/* <span>User</span> */}
        <div className='flex items-center gap-2 text-white cursor-pointer hover:bg-[#2e1065] transition-all duration-300 ease-in-out p-2 rounded-md'>
          <img
            className='w-12 h-12 rounded-full object-cover'
            src='https://i.pinimg.com/originals/5b/79/c8/5b79c81933edbf2f1ee45ce16abb5ea1.gif'
            alt='gif'
          />
          <span>Phong Tran</span>
        </div>
      </div>
    </div>
  )
}

export default Search
