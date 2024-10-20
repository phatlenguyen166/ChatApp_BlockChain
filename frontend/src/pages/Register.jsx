import React, { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useSelector, useDispatch } from 'react-redux'
import { createAccount, UserManager } from '../excecutors/_index'
import { addUser } from '../redux/reducers/accountReducer'

const Register = () => {
  // const [username, setUsername] = useState('')
  // const [account, setAccount] = useState(null)
  // const [privateKey, setPrivateKey] = useState('')
  const [userManager, setUserManager] = useState(null)
  const [account, setAccount] = useState(null)

  const { accounts } = useSelector((state) => state.accountReducer)

  const dispatch = useDispatch()
  const {
    register,
    watch,
    handleSubmit,
    formState: { errors }
  } = useForm()

  const password = watch('password')
  const confirmPassword = watch('confirmPassword')

  const onSubmit = async (data) => {
    // Kiểm tra xem mật khẩu và xác nhận mật khẩu có khớp nhau không
    if (data.password !== data.confirmPassword) {
      alert('Passwords do not match!')
      return
    }

    setAccount(await createAccount())
    const manager = new UserManager(account.privateKey)
    setUserManager(manager)
    console.log(userManager)
    await userManager.registerDApp(data.username, data.password)
    // Xử lý đăng ký tài khoản ở đây
    console.log(data)

    // dispatch(addUser({ username, privateKey })) // Ví dụ nếu bạn muốn thêm người dùng vào Redux
  }

  return (
    <div className='formContainer bg-[#a7bcff] h-[100vh] flex items-center justify-center'>
      <div className='formWrapper bg-white p-10 rounded-xl flex flex-col gap-3 items-center'>
        <span className='logo text-2xl font-bold text-[#5d5b8d] '>Chat DApp</span>
        <span className='title text-sm font-bold text-[#5d5b8d] '>Register</span>
        <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-4'>
          <div>
            <input
              {...register('username', { required: 'Username is required! ' })}
              className='input-style'
              type='text'
              placeholder='Username'
              // onChange={(e) => {
              //   setUsername(e.target.value)
              // }}
            />
            {errors.username && <p className='text-red-600 text-sm ml-3'>{errors.username.message}</p>}
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
                required: 'Confirm Password is required! ',
                validate: (value) => value === password || 'Passwords do not match!'
              })}
              className='input-style'
              type='password'
              placeholder='Confirm Password'
            />
            {errors.confirmPassword && <p className='text-red-600 text-sm ml-3'>{errors.confirmPassword.message}</p>}
          </div>

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
