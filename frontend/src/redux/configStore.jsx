import { configureStore } from '@reduxjs/toolkit'
import accountReducer from './reducers/accountReducer'
import messageReducer from './reducers/messageReducer'

export const store = configureStore({
  reducer: {
    accountReducer,
    messageReducer
  }
})
