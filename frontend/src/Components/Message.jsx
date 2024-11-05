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
    const isSender = message.isSender

    if (message.type === 2) {
      // Video
      return (
        <video controls className='max-w-[300px] max-h-[250px] w-auto h-auto'>
          <source src={message.content} />
          Your browser does not support the video tag.
        </video>
      )
    } else if (message.type === 3) {
      // Audio
      return (
        <div className={`px-5 ${isSender ? 'bg-[#8596cc]' : 'bg-[#fff]'} rounded-full`}>
          <AudioPlayer
            src={message.content}
            minimal={true}
            width={300}
            trackHeight={40}
            barWidth={2}
            gap={1}
            visualise={true}
            backgroundColor={isSender ? '#8596cc' : '#fff'}
            barColor={isSender ? '#fff' : '#e5e7eb'}
            barPlayedColor={isSender ? '#ddddf7' : '#9a9b9e'}
            seekBarColor={isSender ? '#fff' : '#000'}
            skipDuration={2}
            showLoopOption={true}
            showVolumeControl={true}
            controls
          >
            {/* <source src={message.content.data} />/ */}
            Your browser does not support the audio element.
          </AudioPlayer>
        </div>
      )
    } else if (message.type === 1) {
      // Image
      return (
        <div className={`border border-[4px] ${isSender ? 'border-[#8596cc]' : 'border-white'} rounded-[20px]`}>
          <img
            src={message.content}
            className='max-w-[300px] max-h-[250px] w-auto h-auto rounded-[16px]'
            onClick={() => handleImageClick(message.content)}
          />
        </div>
      )
    } else {
      return (
        <p className={`${isSender ? 'bg-[#8596cc] text-white' : 'bg-[#fff] text-black'} px-3 py-1 rounded-full`}>
          {message.content}
        </p>
      )
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
          <div className='w-full h-full bg-[#ddddf7]'>
            <div className='space-y-2'>
              <div className='flex justify-end items-start'>
                <div className='mr-3 text-right'>
                  <div className='text-white rounded-full inline-block'>{renderMediaMessage(message)}</div>
                  {/* <p className='text-xs text-gray-500 mt-1'>{message.timestamp}</p> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className='flex items-center justify-center'>
          <div className='w-full h-full bg-[#ddddf7]'>
            <div className='space-y-2'>
              <div className='flex justify-start items-start'>
                <div className='mr-3 text-left'>
                  <div className='text-white rounded-full inline-block'>{renderMediaMessage(message)}</div>
                  {/* <p className='text-xs text-gray-500 mt-1'>{message.timestamp}</p> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default Message
