import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  currentUser: null,
  users: [],
  friends: [],
  filteredUsers: [],
  filteredFriends: []
}

const accountReducer = createSlice({
  name: 'users',
  initialState,
  reducers: {
    addUser: (state, action) => {
      state.users.push(action.payload)
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
