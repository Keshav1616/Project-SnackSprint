import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

export const fetchRestaurants = createAsyncThunk(
  'restaurants/fetchRestaurants',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('https://snacksprint-1.onrender.com') //  PORT 8080
 
            // const response = await fetch('http://localhost:8080/restaurants') 

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }
      const data = await response.json()
      return data 
    } catch (error) {
      console.error(' API Error:', error)
      return rejectWithValue(error.message)
    }
  }
)

const restaurantsSlice = createSlice({
  name: 'restaurants',
  initialState: {
    data: [],
    loading: false,
    error: null
  },
  reducers: {
    clearError: (state) => {
      state.error = null
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRestaurants.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchRestaurants.fulfilled, (state, action) => {
        state.loading = false
        state.data = action.payload
        state.error = null
        console.log('✅ Restaurants loaded:', action.payload.length)
      })
      .addCase(fetchRestaurants.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
        console.error('❌ Load failed:', action.payload)
      })
  }
})

export const { clearError } = restaurantsSlice.actions
export default restaurantsSlice.reducer
