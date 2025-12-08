// src/store/ordersSlice.js
import { createSlice, nanoid } from '@reduxjs/toolkit';

const initialState = {
  orders: [],
};

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    addOrder: {
      reducer(state, action) {
        state.orders.push(action.payload);
      },
      prepare({ items, total, address, paymentMethod }) {
        const id = nanoid();
        const createdAt = new Date().toISOString();
        return {
          payload: {
            id,
            items,
            total,
            address,
            paymentMethod,
            status: 'confirmed',
            createdAt,
          },
        };
      },
    },
    updateOrderStatus(state, action) {
      const { id, status } = action.payload;
      const order = state.orders.find((o) => o.id === id);
      if (order) order.status = status;
    },
  },
});

export const { addOrder, updateOrderStatus } = ordersSlice.actions;
export default ordersSlice.reducer;
