import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  messages: [{ content: '', type: 1, isSender: false, timeStamp: new Date() }]
  // inComingMessages: ['hi guys', 'Tôi là Phong dz nè'],
}

const messageSlice = createSlice({
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

export const { addMessage, setMessages } = messageSlice.actions
export default messageSlice.reducer
