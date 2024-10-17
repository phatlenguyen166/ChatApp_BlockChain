import React from 'react'

const IncomingMessage = ({ message }) => {
  return (
    <div className='flex items-start mb-2'>
      <img
        src='https://i.pinimg.com/originals/4c/11/f7/4c11f751f8d87ba74ba90f3588d67022.gif'
        alt='Avatar'
        className='w-10 h-10 rounded-full mr-2'
      />
      <div className='bg-white p-2 rounded-lg shadow-md max-w-xs'>
        <p className='text-gray-800'>{message}</p>
        {/* <p className='text-xs text-gray-500 mt-1'>{new Date(message.timestamp).toLocaleString()}</p> */}
      </div>
    </div>
  )
}

export default IncomingMessage
