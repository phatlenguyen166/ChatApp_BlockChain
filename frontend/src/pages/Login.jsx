import { NotificationManager } from 'react-notifications'
import React, { useEffect } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { getUser, setUser } from '../utils/UserManager'
import { useSelector, useDispatch } from 'react-redux'
import { changeCurrentUser, searchFriends, setFriendList, setUserList } from '../redux/reducers/accountReducer'
import { deleteDatabase } from '../utils/useIndexedDB'

function convertNum(username) {
  let total = 0
  for (let i = 0; i < username.length; i++) {
    total += username.charCodeAt(i) // Thêm mã ASCII của ký tự vào tổng
  }
  return (total % 500) + 100
}

const Login = () => {
  deleteDatabase()
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm()

  const dispatch = useDispatch()
  const chatWith = useSelector((state) => state.messages.chatWith)

  const onSubmit = async (data) => {
    if (localStorage.getItem(data.username) === null) {
      NotificationManager.error('Provided username is not saved on this device', 'No username`s saved')
      return
    }
    try {
      const manager = setUser(data.username, data.password)
      const userData = await manager.getUserInformation()
      const usersData = await manager.getUserList()
      const friendsData = await manager.getFriendList()
      const userInfo = {
        username: userData.username,
        password: data.password,
        address: userData.userAddress,
        url: `https://picsum.photos/id/${convertNum(userData.username)}/200/300`
      }
      dispatch(changeCurrentUser(userInfo))
      const users = usersData.map((user) => {
        return {
          username: user.username,
          address: user.userAddress,
          url: `https://picsum.photos/id/${convertNum(user.username)}/200/300`
        }
      })
      const friends = friendsData.map((user) => {
        return {
          username: user.username,
          address: user.userAddress,
          url: `https://picsum.photos/id/${convertNum(user.username)}/200/300`
        }
      })
      dispatch(setUserList(users))
      dispatch(setFriendList(friends))
      dispatch(searchFriends(''))
      NotificationManager.success(`Welcome ${data.username}`, 'Login Successful')
      navigate('/home')
    } catch (e) {
      NotificationManager.error('Incorrect password', 'Login Failed')
    }
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
