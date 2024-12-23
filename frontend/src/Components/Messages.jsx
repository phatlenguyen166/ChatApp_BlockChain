import React, { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getUser } from '../utils/UserManager'
import Message from './Message'


const Messages = () => {
  const messages = useSelector((state) => state.messages.messages)

  const manager = getUser()

  const dispatch = useDispatch()

  const messagesEndRef = useRef(null)

  useEffect(() => {
    // Cuộn xuống phần tử cuối cùng mỗi khi danh sách messages thay đổi
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages])

  return (
    <div
      className='bg-[#ddddf7] border-b-4 h-[calc(100%-100px)] flex flex-col p-4 overflow-y-auto
      [&::-webkit-scrollbar]:w-2
      [&::-webkit-scrollbar-track]:rounded-full
      [&::-webkit-scrollbar-track]:bg-gray-100
      [&::-webkit-scrollbar-thumb]:rounded-full
      [&::-webkit-scrollbar-thumb]:bg-gray-300
      dark:[&::-webkit-scrollbar-track]:bg-neutral-700
      dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500'
    >
      <div className='flex flex-col space-y-2'>
        {messages.map((msg, index) => (
          <Message key={index} message={msg} />
        ))}
        {/* Thêm một div trống ở cuối để làm anchor cho scroll */}
        <div ref={messagesEndRef} />
      </div>
    </div>
  )
}

export default Messages
