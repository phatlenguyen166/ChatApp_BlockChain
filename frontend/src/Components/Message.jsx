/* eslint-disable react/prop-types */
import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { addMessage } from '../redux/reducers/messageReducer'

const Message = ({ message }) => {
  const [zoomedImage, setZoomedImage] = useState(null)

  const renderMediaMessage = (message) => {
    if (message.content.type === 1) {
      // Video
      return (
        <video controls className='max-w-[300px] max-h-[250px] w-auto h-auto'>
          <source src={message.content.data} />
          Your browser does not support the video tag.
        </video>
      )
    } else if (message.type === 2) {
      // Audio
      return (
        <audio controls className='max-w-[200px] w-full'>
          <source src={message.content.data} />
          Your browser does not support the audio element.
        </audio>
      )
    } else if (message.content.type === 3) {
      // Image
      return (
        <img
          src={message.content.data}
          alt={message.content.name}
          className='max-w-[300px] max-h-[250px] w-auto h-auto'
        />
      )
    } else {
      return <p>{message.content.data}</p>
    }
  }

  return message.isSender ? (
    <div className='flex items-center justify-center'>
      <div className='w-full h-full p-4 bg-[#ddddf7]'>
        <div className='space-y-4'>
          <div className='flex justify-end items-start'>
            <div className='mr-3 text-right'>
              <div className='bg-[#8da4f1] text-white rounded-lg p-2 inline-block'>
                {renderMediaMessage(message)} {/* Render media message */}
              </div>
              <p className='text-xs text-gray-500 mt-1'>{new Date().toISOString()}</p>
            </div>
          </div>
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
  ) : (
    <div className='flex items-start mb-2'>
      <img
        src='https://i.pinimg.com/originals/4c/11/f7/4c11f751f8d87ba74ba90f3588d67022.gif'
        alt='Avatar'
        className='w-10 h-10 rounded-full mr-2'
      />
      <div className=''>
        <div className='p-2 bg-white div-2 rounded-lg shadow-md max-w-xs text-gray-800'>
          {renderMediaMessage(message)}
        </div>
        <p className='text-xs text-gray-500 mt-1'>{new Date().toISOString()}</p>
      </div>
    </div>
  )
}

export default Message
