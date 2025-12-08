// src/components/Checkout.jsx

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../hooks/useApp'

export default function Checkout() {
  const navigate = useNavigate()
  const app = useApp()
  
  const [loading, setLoading] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState('cash')

  // Cart data from Redux
  const cartItems = app.cart || []
  const totalAmount = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const currentRestaurant = app.currentRestaurant || {}

  const placeOrder = () => {
    setLoading(true)
    
    // Simulate API call
    setTimeout(() => {
      const orderData = {
        id: Date.now(),
        restaurant: currentRestaurant.name || 'SnackSprint',
        items: cartItems, // array of {name, quantity, price}
        total: totalAmount,
        status: 'confirmed',
        date: new Date().toLocaleDateString(),
        address: app.currentAddress,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
      
      // REDUX ME SAVE KARO
      app.saveOrder(orderData) //  Redux me order save
      
      // Clear cart
      app.clearCart()
      
      setLoading(false)
      
      // Success message
      alert(`✅ Order placed successfully!\nOrder ID: #${orderData.id}\nTotal: ₹${totalAmount}\nDelivering to: ${app.currentAddress?.name || 'Your address'}`)
      
      // Go to home
      navigate('/')
    }, 1500)
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-4">
        <div className="text-center max-w-md mx-auto space-y-6">
          <div className="text-7xl mx-auto mb-8">🛒</div>
          <h1 className="text-3xl font-bold text-slate-100 mb-4">Your cart is empty</h1>
          <p className="text-slate-400 text-lg mb-8">Add some delicious snacks to get started</p>
          <button 
            onClick={() => navigate('/')}
            className="px-12 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-black font-bold text-lg rounded-3xl shadow-2xl hover:shadow-3xl hover:scale-[1.02] transition-all"
          >
            🏠 Continue Shopping
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4 pb-20">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* HEADER */}
        <div className="pt-4">
          <button 
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-slate-400 hover:text-white mb-4"
          >
            ← Back to Home
          </button>
          <h1 className="text-3xl font-bold text-slate-100">🛒 Checkout</h1>
          <p className="text-slate-400">Review your order</p>
        </div>

        {/* RESTAURANT INFO */}
        {currentRestaurant.name && (
          <div className="p-6 bg-slate-900/50 rounded-3xl border border-slate-700/50">
            <h2 className="text-xl font-bold text-slate-100 mb-2">{currentRestaurant.name}</h2>
            <p className="text-slate-400 text-sm">⭐ 4.8 (1.2k) • 15-25 min</p>
          </div>
        )}

        {/* ADDRESS */}
        <div className="p-6 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 rounded-3xl border-2 border-emerald-500/30">
          <h3 className="text-lg font-bold text-emerald-400 mb-3 flex items-center gap-2">
            📍 Delivery Address
          </h3>
          {app.currentAddress ? (
            <div className="space-y-1">
              <p className="font-semibold text-slate-200">{app.currentAddress.name}</p>
              <p className="text-slate-300">{app.currentAddress.address}</p>
              <p className="text-slate-400 text-sm">
                {app.currentAddress.city} - {app.currentAddress.pincode} • {app.currentAddress.phone}
              </p>
            </div>
          ) : (
            <p className="text-slate-400 text-sm">Please set delivery address first</p>
          )}
        </div>

        {/* ORDER ITEMS */}
        <div className="space-y-3">
          <h3 className="text-xl font-bold text-slate-100 flex items-center gap-2">Your Order</h3>
          {cartItems.map((item, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-slate-900/50 rounded-2xl border border-slate-700">
              <div>
                <h4 className="font-semibold text-slate-200">{item.name}</h4>
                <p className="text-slate-400 text-sm">₹{item.price} × {item.quantity}</p>
              </div>
              <p className="text-2xl font-bold text-emerald-400">₹{(item.price * item.quantity).toFixed(0)}</p>
            </div>
          ))}
        </div>

        {/* PAYMENT METHOD */}
        <div className="p-6 bg-slate-900/50 rounded-3xl border border-slate-700">
          <h3 className="text-lg font-bold text-slate-100 mb-4">Payment Method</h3>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setPaymentMethod('cash')}
              className={`p-4 rounded-2xl border-2 transition-all ${
                paymentMethod === 'cash'
                  ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400'
                  : 'border-slate-600 hover:border-slate-400'
              }`}
            >
              💰 Cash on Delivery
            </button>
            <button
              onClick={() => setPaymentMethod('online')}
              className={`p-4 rounded-2xl border-2 transition-all ${
                paymentMethod === 'online'
                  ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400'
                  : 'border-slate-600 hover:border-slate-400'
              }`}
            >
              💳 Online Payment
            </button>
          </div>
        </div>

        {/* TOTAL & PLACE ORDER */}
        <div className="p-6 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-3xl border-2 border-emerald-500/30 space-y-4">
          <div className="flex justify-between text-xl">
            <span className="text-slate-300 font-semibold">Total:</span>
            <span className="text-2xl font-bold text-emerald-400">₹{totalAmount.toFixed(0)}</span>
          </div>
          
          {app.currentAddress ? (
            <button
              onClick={placeOrder}
              disabled={loading}
              className="w-full py-5 bg-gradient-to-r from-emerald-500 to-teal-500 text-black font-bold text-xl rounded-3xl shadow-2xl hover:shadow-3xl hover:scale-[1.02] transition-all disabled:opacity-50 flex items-center justify-center gap-3"
            >
              {loading ? (
                <>
                  <div className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                  Placing Order...
                </>
              ) : (
                '🚀 Place Order'
              )}
            </button>
          ) : (
            <button
              onClick={() => alert('Please set delivery address first!')}
              className="w-full py-5 bg-slate-700/50 text-slate-400 font-bold text-xl rounded-3xl border-2 border-slate-600 cursor-not-allowed"
              disabled
            >
              ⚠️ Set Delivery Address First
            </button>
          )}
        </div>

        {/* ORDER SUMMARY */}
        <div className="p-6 bg-slate-900/30 rounded-2xl border border-slate-700/50 text-sm text-slate-400 space-y-2">
          <h4 className="font-semibold text-slate-300 mb-3">Order Summary</h4>
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <p>🛵 Delivery</p>
              <p>📦 Packing</p>
              <p>💳 Taxes</p>
            </div>
            <div className="text-right">
              <p>FREE</p>
              <p>FREE</p>
              <p>Included</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
