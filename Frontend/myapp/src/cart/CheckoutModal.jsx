// src/components/CheckoutModal.jsx
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useCart, useApp } from '../hooks/useApp';
import { clearCart } from '../store/cartSlice';
import AddressManager from '../components/AddressManager';

export default function CheckoutModal({ onClose }) {
  const dispatch = useDispatch();
  const cart = useCart();
  const app = useApp();

  const [manualAddress, setManualAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cod');

  const handlePlaceOrder = () => {
    const finalAddress =
      app.currentAddress?.address || manualAddress.trim();

    if (!finalAddress) {
      alert('Please add/select an address!');
      return;
    }

    if (!cart.items.length) {
      alert('Cart is empty!');
      return;
    }

    // 1) Redux orders slice me order save karo
    const action = app.placeOrder({
      items: cart.items,
      total: cart.total,
      address: finalAddress,
      paymentMethod,
    });

    const newOrderId = action.payload.id;

    // 2) Status timers – confirmed -> out-for-delivery -> delivered
    setTimeout(() => {
      app.updateOrderStatus(newOrderId, 'out-for-delivery');
    }, 5000);

    setTimeout(() => {
      app.updateOrderStatus(newOrderId, 'delivered');
    }, 12000);

    // 3) Cart clear + modal close
    dispatch(clearCart());
    alert(`✅ Order placed! Payment: ${paymentMethod.toUpperCase()}`);
    onClose?.();
  };

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-6">
      <div className="bg-slate-900 rounded-3xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-700">
          <h2 className="text-2xl font-bold">Checkout</h2>
          <button onClick={onClose} className="text-2xl">
            ×
          </button>
        </div>

        <div className="flex-1 grid md:grid-cols-[1.5fr,1.2fr] gap-0 overflow-hidden">
          {/* LEFT: Address + Payment + Summary */}
          <div className="p-6 space-y-6 overflow-y-auto border-r border-slate-800">
            {/* Delivery Address */}
            <div>
              <h3 className="text-lg font-bold mb-3">📍 Delivery Address</h3>

              {app.currentAddress ? (
                <div className="p-4 bg-emerald-500/10 border border-emerald-500 rounded-2xl mb-3">
                  <p className="font-semibold">{app.currentAddress.name}</p>
                  <p className="text-sm text-slate-300">
                    {app.currentAddress.address}
                  </p>
                  <p className="text-xs text-slate-400">
                    {app.currentAddress.city} - {app.currentAddress.pincode}
                  </p>
                </div>
              ) : (
                <input
                  value={manualAddress}
                  onChange={(e) => setManualAddress(e.target.value)}
                  placeholder="Enter full delivery address"
                  className="w-full p-4 bg-slate-800 rounded-2xl border border-slate-600 focus:border-emerald-400"
                />
              )}

              <p className="text-xs text-slate-500 mt-2">
                Tip: Use the sidebar to save & select an address for future orders.
              </p>
            </div>

            {/* Payment methods */}
            <div>
              <h3 className="text-lg font-bold mb-3">💳 Payment Method</h3>
              <div className="grid md:grid-cols-2 gap-3">
                {[
                  { id: 'cod', label: 'Cash on Delivery' },
                  { id: 'upi', label: 'UPI' },
                  { id: 'card', label: 'Credit / Debit Card' },
                  { id: 'netbanking', label: 'Net Banking' },
                ].map((method) => (
                  <button
                    key={method.id}
                    onClick={() => setPaymentMethod(method.id)}
                    className={`p-4 rounded-2xl border text-left text-sm font-medium transition-all ${
                      paymentMethod === method.id
                        ? 'border-emerald-500 bg-emerald-500/10'
                        : 'border-slate-700 bg-slate-900 hover:border-emerald-400'
                    }`}
                  >
                    {method.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Order summary */}
            <div className="p-4 bg-slate-800 rounded-2xl space-y-2">
              <div className="flex justify-between text-sm">
                <span>Items</span>
                <span>₹{cart.subtotal?.toFixed(0)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Delivery Fee</span>
                <span>₹29</span>
              </div>
              <div className="border-t border-slate-700 my-2" />
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>₹{cart.total?.toFixed(0)}</span>
              </div>
            </div>

            <button
              onClick={handlePlaceOrder}
              className="w-full py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-black font-bold rounded-2xl shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all disabled:opacity-50"
              disabled={
                cart.items.length === 0 ||
                (!app.currentAddress && !manualAddress.trim())
              }
            >
              🚀 Place Order ({paymentMethod.toUpperCase()})
            </button>
          </div>

          {/* RIGHT: Address sidebar */}
          <div className="bg-slate-950/80 p-6 overflow-y-auto">
            <h3 className="text-lg font-bold mb-4">🏠 Manage Addresses</h3>
            <AddressManager />
          </div>
        </div>
      </div>
    </div>
  );
}
