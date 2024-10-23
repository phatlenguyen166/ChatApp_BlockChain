import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { addMessage } from '../redux/reducers/messageReducer'

const MAX_FILE_SIZE = 100 * 1024 * 1024

const Input = () => {
  const dispatch = useDispatch()
  const [mediaFile, setMediaFile] = useState(null)
  const [textMessage, setTextMessage] = useState('')
  const [error, setError] = useState('')

  const handleFileChange = (event) => {
    const file = event.target.files[0]
    // console.log(file)

    if (file) {
      if (file.size > MAX_FILE_SIZE) {
        setError(`File size exceeds ${MAX_FILE_SIZE / 1024 / 1024}MB limit.`)
        return
      }

      const reader = new FileReader()
      reader.onloadend = (e) => {
        const base64File = e.target.result
        // console.log(base64File)

        const newMessage = {
          content: {
            name: file.name,
            data: base64File,
            type: file.type.startsWith('video/')
              ? 1
              : file.type.startsWith('image/')
                ? 3
                : file.type.startsWith('audio/')
                  ? 2
                  : 0
          },
          isSender: true,
          timeStamp: new Date().toISOString()
        }
        dispatch(addMessage(newMessage)) // Thêm message mới vào Redux store
        setMediaFile(null) // Reset media file sau khi gửi
      }

      reader.readAsDataURL(file) // Đọc file dưới dạng base64
    }
  }

  const handleSend = () => {
    try {
      if (mediaFile) {
        handleFileChange({ target: { files: [mediaFile] } })
      }
      if (textMessage.trim()) {
        dispatch(
          addMessage({
            content: {
              name: 'Text Message',
              data: textMessage.trim(),
              type: 0 // 0 cho text
            },
            isSender: false,
            timeStamp: new Date().toISOString(),
            data: ''
          })
        )
        setTextMessage('')
      }
      setError('')
      window.dispatchEvent(new Event('newMessage'))
    } catch (e) {
      setError('An error occurred while saving the message.')
      console.error('Error saving message:', e)
    }
  }

  const onKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className='h-[72px] pt-4 flex flex-col justify-between items-center bg-white'>
      <div className='w-full flex justify-between items-center'>
        <input
          className='w-full h-full border-none outline-none pl-2 mr-3'
          placeholder='Type something.......'
          maxLength={50}
          value={textMessage}
          onChange={(e) => setTextMessage(e.target.value)}
          onKeyDown={onKeyDown}
        />
        <div className='flex justify-center gap-2 mr-3'>
          <label htmlFor='fileMedia'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 24 24'
              strokeWidth={1.5}
              stroke='currentColor'
              className='size-8 cursor-pointer hover:bg-slate-200 py-1'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                d='m18.375 12.739-7.693 7.693a4.5 4.5 0 0 1-6.364-6.364l10.94-10.94A3 3 0 1 1 19.5 7.372L8.552 18.32m.009-.01-.01.01m5.699-9.941-7.81 7.81a1.5 1.5 0 0 0 2.112 2.13'
              />
            </svg>

            <input
              type='file'
              className='hidden'
              id='fileMedia'
              accept='audio/*,video/*'
              onChange={handleFileChange}
              onKeyDown={onKeyDown}
            />
          </label>

          <label htmlFor='fileImage'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 24 24'
              strokeWidth={1.5}
              stroke='currentColor'
              className='size-8 cursor-pointer hover:bg-slate-200 py-1'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                d='M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z'
              />
            </svg>
            <input
              type='file'
              className='hidden'
              id='fileImage'
              accept='image/*'
              onChange={handleFileChange}
              onKeyDown={onKeyDown}
            />
          </label>

          <button
            onClick={handleSend}
            className='flex justify-center gap-1 py-1.5 px-6 text-sm bg-indigo-50 text-indigo-500 rounded-lg cursor-pointer font-semibold text-center shadow-xs transition-all duration-500 hover:bg-indigo-200'
          >
            <span>Send</span>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 24 24'
              strokeWidth={1.5}
              stroke='currentColor'
              className='size-5'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                d='M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5'
              />
            </svg>
          </button>
        </div>
      </div>
      {error && <div className='text-red-500 text-sm mt-1'>{error}</div>}
      {mediaFile && <div className='text-green-500 text-sm mt-1'>File selected: {mediaFile.name}</div>}
    </div>
  )
}

export default Input
