import React, { useEffect } from 'react'
import Messages from './Messages'
import Input from './Input'
import { useDispatch, useSelector } from 'react-redux'
import { displaySeacrh } from '../redux/reducers/componentReducer'
import { searchUsers } from '../redux/reducers/accountReducer'
import { getUser } from '../excecutors/UserManager'

const Chat = React.memo(() => {
  const dispatch = useDispatch()
  const currentUser = useSelector((state) => state.users.currentUser)
  const chatWith = useSelector((state) => state.messages.chatWith)
  const manager = getUser()

  useEffect(() => {
    document.title = `Chat: ${chatWith.username}`
  }, [chatWith.username])

  return (
    <div className='flex-[2]'>
      <div className='flex items-center justify-between bg-[#5d5b8d] text-gray-300] p-3'>
        <span className='text-white'>{chatWith.username}</span>

        <div className='flex items-center gap-3'>
          <button
            onClick={() => {
              dispatch(searchUsers('')), dispatch(displaySeacrh())
            }}
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 24 24'
              strokeWidth={1.5}
              stroke='currentColor'
              className='size-6 cursor-pointer text-white'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                d='M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 9.374 21c-2.331 0-4.512-.645-6.374-1.766Z'
              />
            </svg>
          </button>
        </div>
      </div>
      <Messages />
      <Input />
    </div>
  )
})

Chat.displayName = 'Chat'

export default Chat
