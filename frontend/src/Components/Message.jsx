/* eslint-disable react/prop-types */
import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { addMessage } from '../redux/reducers/messageReducer'
import { AudioPlayer } from 'react-audio-player-component'

const Message = ({ message }) => {
  const [zoomedImage, setZoomedImage] = useState(null)

  const handleImageClick = (src) => {
    setZoomedImage(src) // Cập nhật trạng thái với hình ảnh được phóng to
  }

  const renderMediaMessage = (message) => {
    if (message.content.type === 1) {
      // Video
      return (
        <video controls className='max-w-[300px] max-h-[250px] w-auto h-auto'>
          <source src={message.content.data} />
          Your browser does not support the video tag.
        </video>
      )
    } else if (message.content.type === 2) {
      // Audio
      return (
        <AudioPlayer
          src={message.content.data}
          minimal={true}
          width={300}
          trackHeight={75}
          barWidth={1}
          gap={1}
          visualise={true}
          backgroundColor='#FFF8DE'
          barColor='#C1D0B5'
          barPlayedColor='#99A98F'
          skipDuration={2}
          showLoopOption={true}
          showVolumeControl={true}
          controls
          className='max-w-[200px] w-full'
        >
          {/* <source src={message.content.data} />/ */}
          Your browser does not support the audio element.
        </AudioPlayer>
      )
    } else if (message.content.type === 3) {
      // Image
      return (
        <img
          src={message.content.data}
          alt={message.content.name}
          className='max-w-[300px] max-h-[250px] w-auto h-auto'
          onClick={() => handleImageClick(message.content.data)}
        />
      )
    } else {
      return <p>{message.content.data}</p>
    }
  }

  return (
    <>
      {zoomedImage && ( // Hiển thị hình ảnh phóng to nếu có
        <div
          className='fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center'
          onClick={() => setZoomedImage(null)}
        >
          <img src={zoomedImage} alt='Zoomed' className='max-w-full max-h-full' />
        </div>
      )}
      {message.isSender ? (
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
      )}
    </>
  )
}

export default Message
