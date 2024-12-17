import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getUser } from '../utils/UserManager'
import { addFriend, addUser, searchFriends, searchUsers } from '../redux/reducers/accountReducer'
import { NotificationManager } from 'react-notifications'
import { addMessage } from '../redux/reducers/messageReducer'
import { updateLastedMessages } from '../redux/reducers/messageReducer'
import { saveMessage, checkConversationExists } from '../utils/useIndexedDB'

function convertNum(username) {
  let total = 0
  for (let i = 0; i < username.length; i++) {
    total += username.charCodeAt(i) // Thêm mã ASCII của ký tự vào tổng
  }
  return (total % 500) + 100
}

const Event = () => {
  const lastedMessages = useSelector((state) => state.messages.lastedMessages)
  const currentUser = useSelector((state) => state.users.currentUser)
  const chatWith = useSelector((state) => state.messages.chatWith)
  const searchUsers = useSelector((state) => state.components.searchUsers)

  const dispatch = useDispatch()

  const manager = getUser()

  useEffect(() => {
    // Handle when a Message is Sent
    const handleMessageSent = async (e) => {
      try {
        dispatch(
          updateLastedMessages({
            sender: e.returnValues.sender,
            receiver: e.returnValues.receiver,
            hashForSender: e.returnValues.hashForSender,
            hashForReceiver: e.returnValues.hashForReceiver,
            msgType: Number(e.returnValues.msgType),
            timestamp: new Date(Number(e.returnValues.timestamp * 1000n)).toISOString()
          })
        )
      } catch (error) {
        console.error('Error update last message:', error)
      }
    }

    const handleFriendAdded = async (e) => {
      try {
        const friend = {
          address: e.returnValues.userAddress,
          username: e.returnValues.username,
          url: `https://picsum.photos/id/${convertNum(e.returnValues.username)}/200/300`
        }
        dispatch(addFriend(friend))
        dispatch(searchFriends(''))
        NotificationManager.info(`You and "${friend.username} just become friend"`, 'New friend added')
      } catch (error) {
        console.error('Error add new friend:', error)
      }
    }

    const handleUserAdded = async (e) => {
      try {
        const user = {
          username: e.returnValues.username,
          address: e.returnValues.userAddress,
          url: `https://picsum.photos/id/${convertNum(e.returnValues.username)}/200/300`
        }
        dispatch(addUser(user))
      } catch (error) {
        console.error('Error add new user:', error)
      }
    }

    if (!manager.event) {
      manager.offEvent('MessageSent')
      manager.offEvent('FriendAdded')
      manager.offEvent('UserAdded')
      manager.handleMessageSentEvent(handleMessageSent)
      manager.handleFriendAddedEvent(handleFriendAdded)
      manager.handleUserAddedEvent(handleUserAdded)
      manager.event = true
    }

    return () => {
      manager.offEvent('MessageSent')
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const updateMessage = async () => {
      if (lastedMessages === '' || !(await checkConversationExists(lastedMessages.sender))) {
        return
      }
      const decryptMessage = await manager.readMessage(lastedMessages)
      if (lastedMessages.sender === chatWith.address) {
        dispatch(addMessage(decryptMessage))
      }
      await saveMessage(lastedMessages.sender, decryptMessage)
    }
    updateMessage()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lastedMessages])

  return null // Hoặc có thể trả về một component khác nếu cần
}

export default React.memo(Event, () => true)
