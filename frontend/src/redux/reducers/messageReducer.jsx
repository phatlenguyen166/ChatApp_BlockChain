import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  messages: [
    { content: 'Hi', type: 1, isSender: true, timeStamp: new Date() },
    { content: 'My name is Phong', type: 1, isSender: false, timeStamp: new Date() },
    { content: 'Nice to meet u', type: 1, isSender: true, timeStamp: new Date() },
    { content: 'How are u', type: 1, isSender: true, timeStamp: new Date() }
  ]
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
