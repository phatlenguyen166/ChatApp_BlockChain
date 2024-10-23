import { configureStore } from '@reduxjs/toolkit'
import accountReducer from './reducers/accountReducer'
import messageReducer from './reducers/messageReducer'
import componentReducer from './reducers/componentReducer'

export const store = configureStore({
  reducer: {
    users: accountReducer,
    messages: messageReducer,
    components: componentReducer
  }
})
