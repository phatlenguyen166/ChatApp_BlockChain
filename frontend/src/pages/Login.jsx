import React, { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { UserManager } from '../excecutors/_index'

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm()

  const [userManager, setUserManager] = useState()

  const onSubmit = (data) => {
    console.log(data)
    setUserManager(new UserManager(data.username, data.password))
    console.log(userManager)

  }
  return (
    <div className='formContainer bg-[#a7bcff] h-[100vh] flex items-center justify-center'>
      <div className='formWrapper bg-white p-10 rounded-xl flex flex-col gap-3 items-center'>
        <span className='logo text-2xl font-bold text-[#5d5b8d] '>Chat DApp</span>
        <span className='title text-sm font-bold text-[#5d5b8d] '>Login</span>
        <form className='flex flex-col gap-4' onSubmit={handleSubmit(onSubmit)}>
          <input
            {...register('username', { required: 'Username is required! ' })}
            className='input-style'
            type='text'
            placeholder='username'
          />
          <input
            {...register('password', { required: 'Password is required! ' })}
            className='input-style'
            type='password'
            placeholder='password'
          />

          <button className='button-style'>Sign in</button>
        </form>
        <p className='text-[#5b5d8d] mt-4 text-sm'>
          You dont have an account? <NavLink to='/register'>Sign up</NavLink>
        </p>
      </div>
    </div>
  )
}

export default Login
