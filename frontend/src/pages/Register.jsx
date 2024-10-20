import React, { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { useForm } from 'react-hook-form'
// import Web3 from 'web3'
// import CrytoJs from 'crypto-js'
import { useSelector, useDispatch } from 'react-redux'
import { addAccountAction } from '../redux/reducers/accountReducer'

const Register = () => {
  const [username, setUsername] = useState('')
  const [account, setAccount] = useState(null)
  const [privateKey, setPrivateKey] = useState('')

  const { accounts } = useSelector((state) => state.accountReducer)

  const dispatch = useDispatch()
  const {
    register,
    watch,
    handleSubmit,
    formState: { errors }
  } = useForm()

  const password = watch('password')
  const onSubmit = (data) => {
    // console.log(data)
    // console.log(accounts)
  }

  return (
    <div className='formContainer bg-[#a7bcff] h-[100vh] flex items-center justify-center'>
      <div className='formWrapper bg-white p-10 rounded-xl flex flex-col gap-3 items-center'>
        <span className='logo text-2xl font-bold text-[#5d5b8d] '>Chat DApp</span>
        <span className='title text-sm font-bold text-[#5d5b8d] '>Register</span>
        <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-4'>
          <div>
            <input
              {...register('name', { required: 'Username is required! ' })}
              className='input-style'
              type='text'
              placeholder='Display Name'
              onChange={(e) => {
                setUsername(e.target.value)
              }}
            />
            {errors.name && <p className='text-red-600 text-sm ml-3'>{errors.name.message}</p>}
          </div>
          <div>
            <input
              {...register('email', {
                required: 'Email is required!!',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                  message: 'Invalid email address, example: abc@gmail.com'
                }
              })}
              className='input-style'
              type='text'
              placeholder='Email'
            />
            {errors.email && <p className='text-red-600 text-sm ml-3'>{errors.email.message}</p>}
          </div>
          <div>
            <input
              {...register('password', {
                required: 'Password is required! ',
                minLength: {
                  value: 8,
                  message: 'Password must be at least 8 characters.'
                }
              })}
              className='input-style'
              type='password'
              placeholder='Password'
            />
            {errors.password && <p className='text-red-600 text-sm ml-3'>{errors.password.message}</p>}
          </div>
          <input className='input-style hidden' id='file' type='file' />
          <label htmlFor='file' className='flex flex-row gap-3 ml-2 items-center text-[#8da4f1] cursor-pointer'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 24 24'
              strokeWidth='1.5'
              stroke='currentColor'
              className='size-8'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                d='M12 10.5v6m3-3H9m4.06-7.19-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44Z'
              />
            </svg>
            <span className='ml-1 text-sm'>Add an avatar</span>
          </label>

          <button className='button-style'>Sign Up</button>
        </form>
        <p className='text-[#5b5d8d] mt-4 text-sm'>
          Already have an account? <NavLink to='/'>Sign in</NavLink>
        </p>
      </div>
    </div>
  )
}

export default Register
