import { NotificationContainer, NotificationManager } from 'react-notifications'
import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useSelector, useDispatch } from 'react-redux'
import { createAccount, UserManager } from '../utils/_index'
import { getUser } from '../utils/UserManager'
import { addUser, changeCurrentUser } from '../redux/reducers/accountReducer'

function randomNumber(start, end) {
  return Math.floor(Math.random() * (end - start + 1)) + start
}

const Register = () => {
  const navigate = useNavigate()

  const currentUser = useSelector((state) => state.users.currentUser)
  const dispatch = useDispatch()

  const {
    register,
    watch,
    handleSubmit,
    formState: { errors }
  } = useForm()

  const password = watch('password')

  const onSubmit = async (data) => {
    // Kiểm tra xem mật khẩu và xác nhận mật khẩu có khớp nhau không
    if (data.password !== data.confirmPassword) {
      alert('Passwords do not match!')
      return
    }
    if (!(await getUser().isUniqueUsername(data.username))) {
      NotificationManager.error(`"${data.username}" already exists`, 'Invalid username')
      return
    }

    const account = await createAccount()
    const manager = new UserManager(account.privateKey)
    await manager.registerDApp(data.username, data.password)
    // Xử lý đăng ký tài khoản ở đây
    NotificationManager.success(`Sign-in again to use DApp`, 'Sign-up Successful')
    navigate('/')
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
