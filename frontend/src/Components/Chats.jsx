import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { changeChat, setMessages } from '../redux/reducers/messageReducer'
import { getUser } from '../utils/UserManager'
import { checkConversationExists, initializeMessagesById, getMessagesByUser } from '../utils/useIndexedDB'

const Chats = () => {
  const filteredFriends = useSelector((state) => state.users.filteredFriends)
  const chatWith = useSelector((state) => state.messages.chatWith)
  const dispatch = useDispatch()

  const handleChangeChat = async (user) => {
    dispatch(
      changeChat({
        username: user.username,
        address: user.address
      })
    )
    const isConservationExist = await checkConversationExists(user.address)
    if (!isConservationExist) {
      const manager = getUser()
      const messages = await manager.getMessage(user.address)
      await initializeMessagesById(user.address, messages)
    }
    const chatMessages = await getMessagesByUser(user.address)
    dispatch(setMessages(chatMessages.map((message) => message.message)))
  }

  const renderUser = () => {
    return filteredFriends.map((user) => {
      return (
        <div
          key={user.address}
          className={`flex items-center gap-2 text-white cursor-pointer 
            ${chatWith.address === user.address ? 'bg-[#160731]' : ''} 
            hover:bg-[#2e1065] transition-all duration-300 ease-in-out p-2 rounded-md`}
          onClick={(e) => handleChangeChat(user)}
        >
          <img className='w-12 h-12 rounded-full object-cover' src={user.url} />
          <div>
            <span className='text-base font-semibold'>{user.username}</span>
            <p className='text-sm text-gray-300'>{user.address}</p>
            {/* <span className='text-base font-semibold'></span>
            <p className='text-sm text-gray-300'></p> */}
          </div>
        </div>
      )
    })
  }

  return <div className='scrollbar-hidden'>{renderUser()}</div>
}

export default Chats
