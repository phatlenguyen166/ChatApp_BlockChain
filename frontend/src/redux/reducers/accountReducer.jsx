import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  currentUser: {
    username: 'user',
    address: 'address'
  },
  users: [
    {
      username: 'YBXGmvSf67',
      address: '111'
    },
    {
      username: 'xw0Hwp8J9O',
      address: '222'
    },
    {
      username: 'kd5zflw4',
      address: '333'
    },
    {
      username: 'Fq67I',
      address: '444'
    },
    {
      username: 'bs4Ei0lxiNwd',
      address: '555'
    }
  ],
  friends: [],
  filteredUsers: [],
  filteredFriends: []
}

const accountReducer = createSlice({
  name: 'users',
  initialState,
  reducers: {
    // addAccountAction: (state, action) => {
    //   state.accounts.push(action.payload)
    // },
    // searchUser: (state, action) => {
    //   const searchTerm = action.payload.toLowerCase()
    //   if (action.payload !== '') {
    //     state.filteredUsers = state.users.filter((user) => user.username.toLowerCase().includes(searchTerm))
    //   } else {
    //     state.filteredUsers = []
    //   }
    // }
    addUser: (state, action) => {
      const newUser = {
        username: action.payload.username,
        address: action.payload.address
      }
      state.users.push(newUser)
    },
    changeCurrentUser: (state, action) => {
      state.currentUser = action.payload
    },
    addFriend: (state, action) => {
      state.friends.push(action.payload)
    },
    setUserList: (state, action) => {
      state.users = action.payload
    },
    setFriendList: (state, action) => {
      state.friends = action.payload
    },
    searchUsers: (state, action) => {
      const searchTerm = action.payload.trim().toLowerCase()
      if (action.payload !== '') {
        state.filteredUsers = state.users.filter((user) => user.username.toLowerCase().includes(searchTerm))
      } else {
        state.filteredUsers = state.users
      }
    },
    searchFriends: (state, action) => {
      const searchTerm = action.payload.toLowerCase()
      if (action.payload !== '') {
        state.filteredFriends = state.friends.filter((friend) => friend.username.toLowerCase().includes(searchTerm))
      } else {
        state.filteredFriends = state.friends
      }
    }
  }
})

export const { addUser, changeCurrentUser, addFriend, setUserList, setFriendList, searchUsers, searchFriends } =
  accountReducer.actions
export default accountReducer.reducer
