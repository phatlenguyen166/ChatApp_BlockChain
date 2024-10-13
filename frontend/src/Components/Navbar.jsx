import React, { useState } from 'react'
import { NavLink } from 'react-router-dom'

const Navbar = () => {
  const [isLogin, setLogin] = useState(true)
  const handleChange = () => {
    setLogin(!isLogin)
  }
  return (
    <div className='flex items-center justify-between bg-[#2e1065] h-[50px] px-2'>
      <span className='text-white font-bold'>Chat App</span>
      {isLogin ? (
        <div className='flex items-center gap-2'>
          <img
            className='w-8 h-8 rounded-full object-cover'
            src='https://i.pinimg.com/originals/1f/a2/2b/1fa22befc10e3cbacd58c5b407a97997.gif'
            alt='gif'
          />
          <span className='text-white text-sm'>Phong Tran</span>
          <button
            // onClick={handleChange}
            className='bg-white text-xs text-black px-2 py-1 rounded-md border-none cursor-pointer font-bold'
          >
            <NavLink to='/'>Logout</NavLink>
          </button>
        </div>
      ) : (
        <button className='bg-white text-xs text-black px-2 py-1 rounded-md border-none cursor-pointer font-bold'>
          <NavLink to='/login'>Login</NavLink>
        </button>
      )}
    </div>
  )
}

export default Navbar
