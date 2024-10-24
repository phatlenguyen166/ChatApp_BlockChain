import 'react-notifications/lib/notifications.css'
import { NotificationContainer, NotificationManager } from 'react-notifications'
import React, { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { UserManager } from '../excecutors/_index'
import { useSelector, useDispatch } from 'react-redux'
import { changeCurrentUser, searchFriends, setFriendList, setUserList } from '../redux/reducers/accountReducer'

const Login = () => {
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm()

  const dispatch = useDispatch()
  const stst = useSelector((state) => state.users.friends)

  const onSubmit = async (data) => {
    const manager = new UserManager(data.username, data.password)
    const userData = await manager.getUserInformation()
    const usersData = await manager.getUserList()
    const friendsData = await manager.getFriendList()
    const userInfo = {
      username: userData.username,
      password: data.password,
      address: userData.userAddress,
      publicKey: userData.publicKey,
      timestamp: new Date(Number(userData.timestamp) * 1000)
    }
    dispatch(changeCurrentUser(userInfo))
    const users = usersData.map((user) => {
      return {
        username: user.username,
        address: user.userAddress,
      }
    })
    const friends = friendsData.map((user) => {
      return {
        username: user.username,
        address: user.userAddress,
      }
    })
    console.log(friends)
    dispatch(setUserList(users))
    dispatch(setFriendList(friends))
    dispatch(searchFriends(''))
    NotificationManager.success(`Welcome ${data.username}`, 'Login Successful')
    setTimeout(() => navigate('/home'), 1000)
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
      <NotificationContainer />
    </div>
  )
}

export default Login
