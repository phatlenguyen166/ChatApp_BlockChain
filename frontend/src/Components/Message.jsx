import React, { useState, useEffect } from 'react'

const Message = () => {
  const [messages, setMessages] = useState([])
  // Thêm state mới cho hình ảnh được zoom
  const [zoomedImage, setZoomedImage] = useState(null)

  useEffect(() => {
    loadMessages()
    window.addEventListener('newMessage', loadMessages)
    return () => {
      window.removeEventListener('newMessage', loadMessages)
    }
  }, [])

  const loadMessages = () => {
    const storedMessages = JSON.parse(localStorage.getItem('messages') || '[]')
    setMessages(storedMessages)
  }

  const renderMediaMessage = (message) => {
    if (message.content.type.startsWith('video/')) {
      return (
        <video controls className='max-w-[300px] max-h-[250px] w-auto h-auto'>
          <source src={message.content.data} type={message.content.type} />
          Your browser does not support the video tag.
        </video>
      )
    } else if (message.content.type.startsWith('audio/')) {
      return (
        <audio controls className='max-w-[200px] w-full'>
          <source src={message.content.data} type={message.content.type} />
          Your browser does not support the audio element.
        </audio>
      )
    } else if (message.content.type.startsWith('image/')) {
      return (
        <img
          src={message.content.data}
          alt='Sent image'
          className='max-w-[200px] max-h-[150px] w-auto h-auto object-contain cursor-pointer'
          onClick={() => setZoomedImage(message.content.data)}
        />
      )
    }
    return null
  }

  return (
    <div className='flex items-center justify-center'>
      <div className='w-full h-full p-4 bg-[#ddddf7] shadow-md'>
        <div className='space-y-4'>
          {messages.map((message, index) => (
            <div key={index} className='flex justify-end items-start'>
              <div className='mr-3 text-right'>
                <div className='bg-[#8da4f1] text-white rounded-lg p-2 inline-block'>
                  {message.type === 'media' ? renderMediaMessage(message) : <p>{message.content}</p>}
                </div>
                <p className='text-xs text-gray-500 mt-1'>{new Date(message.timestamp).toLocaleString()}</p>
              </div>
              <img
                className='w-10 h-10 rounded-full'
                src='https://i.pinimg.com/originals/f9/4e/65/f94e657a802d5a1ecbe644c649748f57.gif'
                alt='Sender Image'
              />
            </div>
          ))}
        </div>
      </div>
      {zoomedImage && (
        <div
          className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'
          onClick={() => setZoomedImage(null)}
        >
          <img src={zoomedImage} alt='Zoomed image' className='w-[60%] h-[60%] object-contain' />
        </div>
      )}
    </div>
  )
}

export default Message
