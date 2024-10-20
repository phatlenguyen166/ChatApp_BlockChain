import { createSlice } from '@reduxjs/toolkit'
import { data } from 'autoprefixer'

const initialState = {
  messages: [{ content: 'URL.createObjectURL()', isSender: true, timeStamp: new Date().toTimeString, type: 0 }]
}

const messageReducer = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    addMessage: (state, action) => {
      state.messages.push(action.payload)
    },
    setMessages: (state, action) => {
      return action.payload
    }
  }
})

export const { addMessage, setMessages } = messageReducer.actions
export default messageReducer.reducer
