/* eslint-disable react/prop-types */
import React from 'react'
import { useState, useEffect } from 'react'

const Message = ({ message }) => {
  // const [messages, setMessages] = useState([])
  const [zoomedImage, setZoomedImage] = useState(null)

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

  return message.isSender ? (
    <div className='flex items-center justify-center'>
      <div className='w-full h-full p-4 bg-[#ddddf7]'>
        <div className='space-y-4'>
          <div className='flex justify-end items-start'>
            <div className='mr-3 text-right'>
              <div className='bg-[#8da4f1] text-white rounded-lg p-2 inline-block'>
                {message.type === 'media' ? renderMediaMessage(message) : <p>{message.content}</p>}
              </div>
              <p className='text-xs text-gray-500 mt-1'>{new Date(message.timestamp).toLocaleString()}</p>
            </div>
          </div>
        </div>
        {/* <span>{message.timestamp}</span> */}
      </div>
      {zoomedImage && (
        <div
          className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'
          onClick={() => setZoomedImage(null)}
        >
          <img src={zoomedImage} alt='Zoomed image' className='w-[60%] h-[60%] object-contain' />
        </div>
      )}
      {/* <span>{new Date(message.timestamp).toLocaleTimeString()}</span> */}
    </div>
  ) : (
    <div className='flex items-start mb-2'>
      <img
        src='https://i.pinimg.com/originals/4c/11/f7/4c11f751f8d87ba74ba90f3588d67022.gif'
        alt='Avatar'
        className='w-10 h-10 rounded-full mr-2'
      />
      <div className=''>
        <p className='bg-white p-2 rounded-lg shadow-md max-w-xs text-gray-800'>{message.content}</p>
        {/* <span className='text-xs text-gray-500 mt-1 ml-3'>{new Date(message.timestamp).toLocaleTimeString()}</span> */}
      </div>
    </div>
  )
}

export default Message
