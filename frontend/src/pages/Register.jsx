import React, { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { useForm } from 'react-hook-form'
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
        <span className='logo text-2xl font-bold text-[#5d5b8d] '>Chat App</span>
        <span className='title text-sm font-bold text-[#5d5b8d] '>Register</span>
        <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-4'>
          <div>
            <input
              {...register('name', { required: 'Display name is required! ' })}
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
          <div>
            <input
              {...register('confirmPassword', {
                required: 'Confirm password is required! ',
                validate: (value) => value === password || 'Password do not match!'
              })}
              className='input-style'
              type='password'
              placeholder='Confirm password'
            />
            {errors.confirmPassword && <p className='text-red-600 text-sm ml-3'>{errors.confirmPassword.message}</p>}
          </div>

          <button
            onClick={() => {
              let account = { username, privateKey1: '', privateKey2: '', address: '' }
              const action = addAccountAction(account)
              dispatch(action)
              // console.log(accounts)
            }}
            className='button-style'
          >
            Sign Up
          </button>
        </form>
        <p className='text-[#5b5d8d] mt-4 text-sm'>
          Already have an account? <NavLink to='/'>Sign in</NavLink>
        </p>
      </div>
    </div>
  )
}

export default Register
