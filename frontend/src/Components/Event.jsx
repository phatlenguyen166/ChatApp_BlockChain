import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getUser } from '../utils/UserManager'
import { setFriendList, searchFriends } from '../redux/reducers/accountReducer'
import { NotificationManager } from 'react-notifications'
import { addMessage } from '../redux/reducers/messageReducer'
import { updateLastedMessages } from '../redux/reducers/messageReducer'
import { saveMessage } from '../utils/useIndexedDB'

const Event = () => {
  const lastedMessages = useSelector((state) => state.messages.lastedMessages)
  const currentUser = useSelector((state) => state.users.currentUser)
  const friendList = useSelector((state) => state.users.friendList)
  const chatWith = useSelector((state) => state.messages.chatWith)

  const dispatch = useDispatch()

  const manager = getUser()

  useEffect(() => {
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

    if (!manager.event) {
      manager.offEvent('MessageSent')
      manager.handleMessageSentEvent(handleMessageSent)
      manager.event = true
    }

    return () => {
      manager.offEvent('MessageSent')
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const updateMessage = async () => {
      const decryptMessage = await manager.readMessage(lastedMessages)
      if (lastedMessages.sender === chatWith.address) {
        dispatch(addMessage(decryptMessage))
      }
      await saveMessage(lastedMessages.sender, decryptMessage)
    }
    updateMessage()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chatWith.address, lastedMessages])

  return null // Hoặc có thể trả về một component khác nếu cần
}

export default React.memo(Event, () => true)
