import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { Provider } from 'react-redux'
import { store } from './redux/configStore.jsx'
import { NotificationContainer } from 'react-notifications'

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    {/* <React.StrictMode> */}
    <App />
    <NotificationContainer />
    {/* </React.StrictMode> */}
  </Provider>
)
