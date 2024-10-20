import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  messages: [{ content: '', type: 1, isSender: false, timeStamp: new Date() }],
  lastedMessages: {
    username: '',
    content: ''
  }
  // inComingMessages: ['hi guys', 'Tôi là Phong dz nè'],
}

const messageReducer = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    // addMessage: (state, action) => {
    //   state.messages.push(action.payload)
    // },
    // setMessages: (state, action) => {
    //   return action.payload
    // }
    setMessages: (state, action) => {
      state.messages = action.payload
    },
    addMessage: (state, action) => {
      state.messages.push(action.payload)
    }
  }
})

export const { setMessages, addMessage } = messageReducer.actions
export default messageReducer.reducer
