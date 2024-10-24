import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { hideSearch } from '../redux/reducers/componentReducer'
import { searchUsers, addFriend, searchFriends } from '../redux/reducers/accountReducer'
import PropTypes from 'prop-types'

const UserList = ({ manager }) => {
  const dispatch = useDispatch()
  const filteredUsers = useSelector((state) => state.users.filteredUsers)

  const handleSearchUser = (e) => {
    dispatch(searchUsers(e.target.value))
  }

  return (
    <>
      <div className='w-screen h-screen bg-[rgba(0,0,0,0.75)] fixed top-0 left-0 flex items-center justify-center'>
        <div className='w-[32%] h-[80%] bg-white rounded-lg border border-4 border-[#8682d3]'>
          <div className='flex justify-between w-[100%] items-center'>
            <p className='font-bold mx-3'>Search User</p>
            <button
              className='border text-blue-500 hover:bg-red-500 hover:text-white font-bold m-2 w-[25px] h-[25px] rounded'
              onClick={() => {
                dispatch(hideSearch()), dispatch(searchUsers(''))
              }}
            >
              X
            </button>
          </div>
          <div className='flex justify-between mx-2'>
            <input
              onChange={handleSearchUser}
              type='text'
              placeholder='Username'
              className='w-[100%] border border-gray-300 rounded px-2 py-1'
            />
          </div>
          <div className='m-2 flex flex-col items-center gap-3'>
            <div className='border-b border-black w-[100%] py-2'>
              <p className='text-black-600 text-sm font-bold'>Result</p>
            </div>
            <div className='flex flex-col w-[100%] space-y-2'>
              {filteredUsers.map((user) => (
                <UserItem info={user} key={user.address} manager={manager} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

const UserItem = React.memo(({ info, manager }) => {
  const [isFriend, setIsFriend] = useState(false)
  const [isSelf, setIsSelf] = useState(false)
  const dispatch = useDispatch()

  useEffect(() => {
    const checkFriendStatus = async () => {
      const result = await manager.isFriend(info.address)
      setIsFriend(result)
      if (manager.account.address === info.address) {
        setIsSelf(true)
      }
    }
    checkFriendStatus()
  })

  const handleAddfriend = async () => {
    await manager.addFriend(info.address)
    setIsFriend(true)
    dispatch(
      addFriend({
        username: info.username,
        address: info.address
      })
    )
    dispatch(searchFriends(''))
  }
  return (
    <div className='flex justify-between items-center p-2 border border-gray-250 rounded'>
      <div className='flex items-center'>
        <img src='https://picsum.photos/id/222/200/300' alt='' className='w-[35px] h-[35px] rounded-full mr-2' />
        <div>
          <p className='font-bold'>{info.username}</p>
          <p className='text-[13px]'>{info.address}</p>
        </div>
      </div>
      {isFriend ? (
        <p className='text-[15px]'>Friend</p>
      ) : isSelf ? (
        <p className='text-[15px]'>Yourself</p>
      ) : (
        <button
          onClick={handleAddfriend}
          className='text-black border border-blue-500 text-[15px] py-1 px-2 rounded hover:text-white hover:bg-blue-500'
        >
          Add friend
        </button>
      )}
    </div>
  )
})

UserItem.displayName = 'UserItem'
UserItem.propTypes = {
  info: PropTypes.shape({
    username: PropTypes.string.isRequired,
    address: PropTypes.string.isRequired
  }).isRequired,
  manager: PropTypes.object.isRequired
}

UserList.propTypes = {
  manager: PropTypes.object.isRequired
}

export default React.memo(UserList)
