// src/routes/ProtectedRoutes.jsx
import { Routes, Route } from 'react-router-dom';
import Home from '../components/Home';
import FavoritesList from '../components/Favorites';
import AddressPage from '../components/AddressPage';
import OrdersPage from '../components/OrdersPage'; // ⬅️ add

export default function ProtectedRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/favorites" element={<FavoritesList />} />
      <Route path="/addresses" element={<AddressPage />} />
      
    </Routes>
  );
}
