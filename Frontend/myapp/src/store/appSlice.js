// src/store/appSlice.js
import { createSlice } from '@reduxjs/toolkit'

const appSlice = createSlice({
  name: 'app',
  initialState: {
    user: null,
    isLoggedIn: false,
    favorites: [],
    addresses: [],
    currentAddress: null,
    viewMode: 'card'  

  },
  reducers: 
  {
    login: (state, action) => {
      state.user = action.payload
      state.isLoggedIn = true
    },
    logout: (state) => {
      state.user = null
      state.isLoggedIn = false
    },

   

    //  favorites
    toggleFavorite: (state, action) => {
      const r = action.payload
      const id = r._id || r.id
      const exists = state.favorites.find(f => (f._id || f.id) === id)
      if (exists) {
        state.favorites = state.favorites.filter(f => (f._id || f.id) !== id)
      } else {
        state.favorites.push(r)
      }
    },

setViewMode: (state, action) => {
      state.viewMode = action.payload
    },

    //  addresses
    saveAddress: (state, action) => {
      const addr = action.payload
      const existing = state.addresses.find(a => a.id === addr.id)
      if (existing) {
        Object.assign(existing, addr)
      } else {
        state.addresses.push(addr)
      }
      if (addr.isDefault || !state.currentAddress) {
        state.currentAddress = addr
      }
    },
    setCurrentAddress: (state, action) => {
      state.currentAddress = action.payload
    }
  }
})

export const {
  login,
  logout,
  toggleFavorite,
  saveAddress,
  setCurrentAddress,
  setViewMode 
} = appSlice.actions

export const appReducer = appSlice.reducer
export default appSlice.reducer
