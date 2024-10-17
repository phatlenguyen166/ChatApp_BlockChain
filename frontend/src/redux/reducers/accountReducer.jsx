import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  accounts: [
    { userName: '1', privateKey1: '2', privateKey2: '3', address: '4' },
    { userName: '2', privateKey1: '3', privateKey2: '5', address: '7' }
  ],
  users: [
    {
      userName: 'Negav',
      lastMessage: 'Hãy bỏ học',
      img: 'https://i.pinimg.com/enabled_lo/564x/63/ce/2d/63ce2df1ad5555e9b902a08cfee73183.jpg'
    },
    {
      userName: 'Hiếu Thứ 2',
      lastMessage: 'Giờ thì ai cười',
      img: 'https://i.pinimg.com/736x/f0/46/e6/f046e6afc59ecdaeb1b7edbd3f248185.jpg'
    },
    {
      userName: 'Trấn Thành',
      lastMessage: 'Im crying',
      img: 'https://i.pinimg.com/564x/19/a8/6d/19a86d772bdcd72dabe62402dbc361bd.jpg'
    },
    {
      userName: 'Bray',
      lastMessage: 'Cười cái cc',
      img: 'https://i.pinimg.com/564x/86/f8/dc/86f8dc57c0a4147041151d7cd904f7ea.jpg'
    },
    {
      userName: 'Binz',
      lastMessage: 'Amazing! Goob job',
      img: 'https://i.pinimg.com/564x/95/74/d5/9574d5327fd15e9f454a80ba73fec377.jpg'
    },
    {
      userName: 'Diệu Lâm',
      lastMessage: 'Con điên',
      img: 'https://i.pinimg.com/736x/76/c6/0d/76c60d2518022f5138339f8739403fc5.jpg'
    }
  ],
  filteredUsers: []
}

const accountReducer = createSlice({
  name: 'AppChat',
  initialState,
  reducers: {
    addAccountAction: (state, action) => {
      state.accounts.push(action.payload)
    },
    searchUser: (state, action) => {
      const searchTerm = action.payload.toLowerCase()
      if (action.payload !== '') {
        state.filteredUsers = state.users.filter((user) => user.userName.toLowerCase().includes(searchTerm))
      } else {
        state.filteredUsers = []
      }
    }
  }
})

export const { addAccountAction, searchUser } = accountReducer.actions
export default accountReducer.reducer
