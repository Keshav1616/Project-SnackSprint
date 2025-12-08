// import { createSlice } from '@reduxjs/toolkit'

// const cartSlice = createSlice({
//   name: 'cart',
//   initialState: { 
//     items: [], 
//     subtotal: 0, 
//     total: 0, 
//     deliveryFee: 29,
//     promoCode: '',
//     promoDiscount: 0
//   },
//   reducers: {
//     addItem: (state, action) => {
//       const item = state.items.find(i => i._id === action.payload._id)
//       if (item) {
//         item.quantity += 1
//       } else {
//         state.items.push({ ...action.payload, quantity: 1 })
//       }
//       state.subtotal = state.items.reduce((sum, i) => sum + (i.price * i.quantity), 0)
//       state.total = state.subtotal + state.deliveryFee - state.promoDiscount
//     },
//     updateQuantity: (state, action) => {
//       const item = state.items.find(i => i._id === action.payload._id)
//       if (item) {
//         item.quantity = Math.max(1, action.payload.quantity)
//       }
//       state.subtotal = state.items.reduce((sum, i) => sum + (i.price * i.quantity), 0)
//       state.total = state.subtotal + state.deliveryFee - state.promoDiscount
//     },
//     removeItem: (state, action) => {
//       state.items = state.items.filter(i => i._id !== action.payload)
//       state.subtotal = state.items.reduce((sum, i) => sum + (i.price * i.quantity), 0)
//       state.total = state.subtotal + state.deliveryFee - state.promoDiscount
//     },
//     applyPromo: (state, action) => {
//       state.promoCode = action.payload
//       if (action.payload === 'FIRST50') state.promoDiscount = 50
//       else if (action.payload === 'SNACK10') state.promoDiscount = Math.min(state.subtotal * 0.1, 100)
//       else state.promoDiscount = 0
//       state.total = state.subtotal + state.deliveryFee - state.promoDiscount
//     },
//     clearCart: (state) => {
//       state.items = []
//       state.subtotal = 0
//       state.total = 0
//       state.promoCode = ''
//       state.promoDiscount = 0
//     }
//   }
// })

// export const { addItem, updateQuantity, removeItem, applyPromo, clearCart } = cartSlice.actions
// export default cartSlice.reducer
import { createSlice } from '@reduxjs/toolkit'

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [],
    subtotal: 0,
    total: 0,
    deliveryFee: 29,
    promoCode: '',
    promoDiscount: 0
  },
  reducers: {
  
    addItem: (state, action) => {
      const item = action.payload
      console.log('🛒 Adding item:', item.name, item._id || item.id)
   
      const itemId = item._id || item.id
      const existingItem = state.items.find(cartItem => 
        cartItem._id === itemId || cartItem.id === itemId
      )
      
      if (existingItem) {
       
        existingItem.quantity += 1
        console.log(' Quantity increased:', existingItem.name)
      } else {
      
        state.items.push({
          ...item,
          quantity: 1,
          id: itemId 
        })
        console.log(' New item added:', item.name)
      }
      
      // Recalculate totals
      state.subtotal = state.items.reduce((sum, i) => sum + (i.price * i.quantity), 0)
      state.total = state.subtotal + state.deliveryFee - state.promoDiscount
    },

    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload
      const item = state.items.find(i => i._id === id || i.id === id)
      if (item) {
        item.quantity = Math.max(1, quantity)
        state.subtotal = state.items.reduce((sum, i) => sum + (i.price * i.quantity), 0)
        state.total = state.subtotal + state.deliveryFee - state.promoDiscount
      }
    },

    removeItem: (state, action) => {
      const id = action.payload
      state.items = state.items.filter(i => i._id !== id && i.id !== id)
      state.subtotal = state.items.reduce((sum, i) => sum + (i.price * i.quantity), 0)
      state.total = state.subtotal + state.deliveryFee - state.promoDiscount
    },

    applyPromo: (state, action) => {
      state.promoCode = action.payload
      if (action.payload === 'FIRST50') {
        state.promoDiscount = 50
      } else if (action.payload === 'SNACK10') {
        state.promoDiscount = Math.min(state.subtotal * 0.1, 100)
      } else {
        state.promoDiscount = 0
      }
      state.total = state.subtotal + state.deliveryFee - state.promoDiscount
    },

    clearCart: (state) => {
      state.items = []
      state.subtotal = 0
      state.total = 0
      state.promoCode = ''
      state.promoDiscount = 0
    }
  }
})

export const { addItem, updateQuantity, removeItem, applyPromo, clearCart } = cartSlice.actions
export default cartSlice.reducer
