import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  currentUser: {
    username: 'user',
    address: 'address',
  },
  users: [
    {
      username: 'user111',
      address: '',
    },
    {
      username: 'user222',
      address: '',
    },
  ],
  friends: [],
  filteredUsers: [],
  filteredFriends: [],
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
        address: action.payload.address,
      }
      state.users.push(newUser)
    },
    changeCurrentUser: (state, action) => {
      const currrentUser = {
        username: action.payload.username,
        address: action.payload.address,
      }
      state.currentUser = currrentUser
    },
    addFriend: (state, action) => {
      state.friends.push(action.payload)
    },
    setUserList: (state, action) => {
      state.users = action.payload
    },
    setFriendList: (state, action) => {
      const friendsAddress = action.payload
      state.friends = friendsAddress.map(address => state.users.find(user => user.address === address))
    },
    searchUsers: (state, action) => {
      const searchTerm = action.payload.toLowerCase()
      if (action.payload!== '') {
        state.filteredUsers = state.users.filter((friend) => friend.username.toLowerCase().includes(searchTerm))
      } else {
        state.filteredUsers = state.users
      }
    },
    searchFriends: (state, action) => {
      const searchTerm = action.payload.toLowerCase()
      if (action.payload!== '') {
        state.filteredFriends = state.friends.filter((friend) => friend.username.toLowerCase().includes(searchTerm))
      } else {
        state.filteredFriends = state.friends
      }
    }
  }
})

export const { 
  addUser,
  changeCurrentUser,
  addFriend,
  setUserList,
  setFriendList,
  searchUsers,
 } = accountReducer.actions
export default accountReducer.reducer
