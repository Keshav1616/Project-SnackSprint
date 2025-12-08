import { createSlice } from '@reduxjs/toolkit'

const chatSlice = createSlice({
  name: 'chat',
  initialState: {
    // har message: { question: string, answer: string }
    messages: []
  },
  reducers: {
    addMessage(state, action) {
      // action.payload = { question, answer }
      state.messages.push(action.payload)
    },
    clearMessages(state) {
      state.messages = []
    }
  }
})

export const { addMessage, clearMessages } = chatSlice.actions
export default chatSlice.reducer
