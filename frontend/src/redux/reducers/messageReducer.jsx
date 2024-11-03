import { createSlice } from '@reduxjs/toolkit'
import { data } from 'autoprefixer'

const initialState = {
  messages: [],
  lastedMessages: '',
  chatWith: {
    username: '',
    address: ''
  }
}

const messageReducer = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    setMessages: (state, action) => {
      state.messages = action.payload
    },
    addMessage: (state, action) => {
      state.messages.push(action.payload)
    },
    changeChat: (state, action) => {
      state.chatWith = action.payload
    },
    updateLastedMessages: (state, action) => {
      state.lastedMessages = action.payload
    }
  }
})

export const { setMessages, addMessage, changeChat, updateLastedMessages } = messageReducer.actions
export default messageReducer.reducer
