import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  searchUsers: false
}

const componentReducer = createSlice({
  name: 'components',
  initialState,
  reducers: {
    displaySeacrh: (state, action) => {
      state.searchUsers = true
    },
    hideSearch: (state, action) => {
      state.searchUsers = false
    }
  }
})

export const { displaySeacrh, hideSearch } = componentReducer.actions
export default componentReducer.reducer
