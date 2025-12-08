// src/hooks/useApp.js
import { useDispatch, useSelector } from 'react-redux';
import {
  login,
  logout,
  toggleFavorite,
  saveAddress,
  setCurrentAddress,
} from '../store/appSlice';
import { addOrder, updateOrderStatus } from '../store/OrdersSlice';

export function useApp() {
  const app = useSelector((state) => state.app);
  const ordersState = useSelector((state) => state.orders);
  const dispatch = useDispatch();

  return {
    ...app,
    orders: ordersState.orders, // orders slice ka data

    // appSlice actions
    login: (user) => dispatch(login(user)),
    logout: () => dispatch(logout()),
    toggleFavorite: (restaurant) => dispatch(toggleFavorite(restaurant)),
    saveAddress: (address) => dispatch(saveAddress(address)),
    setCurrentAddress: (address) => dispatch(setCurrentAddress(address)),

    // ordersSlice actions
    placeOrder: ({ items, total, address, paymentMethod }) =>
      dispatch(addOrder({ items, total, address, paymentMethod })),

    updateOrderStatus: (id, status) =>
      dispatch(updateOrderStatus({ id, status })),
  };
}

// cart ko direct useSelector se lane ke liye
export function useCart() {
  return useSelector((state) => state.cart);
}

// generic dispatch hook
export function useDispatchStore() {
  return useDispatch();
}
