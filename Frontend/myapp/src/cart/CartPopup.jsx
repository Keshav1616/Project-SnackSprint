// src/components/CartPopup.jsx
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateQuantity, removeItem, applyPromo, clearCart } from '../store/cartSlice';
import { useApp } from '../hooks/useApp';

export default function CartPopup({ isOpen, onClose }) {
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart);
  const app = useApp();
  const [promoCode, setPromoCode] = useState('');

  if (!isOpen) return null;

  const totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0);

  const handleCheckout = () => {
    if (!cart.items.length) return;

    const address =
      app.currentAddress?.address ||
      app.currentAddress?.name ||
      'Current Location';

    // 1) Redux me order save karo
    const action = app.placeOrder({
      items: cart.items,
      total: cart.total,
      address,
      paymentMethod: 'cod',
    });

    const newOrderId = action.payload.id;

    // 2) Status timers
    setTimeout(() => {
      app.updateOrderStatus(newOrderId, 'out-for-delivery');
    }, 5000); // 5 sec

    setTimeout(() => {
      app.updateOrderStatus(newOrderId, 'delivered');
    }, 12000); // 12 sec

    // 3) Cart clear + popup close
    dispatch(clearCart());
    alert(`Order Placed! Total ₹${cart.total.toFixed(0)}`);
    onClose?.();
  };

  const handleApplyPromo = () => {
    if (!promoCode.trim()) return;
    dispatch(applyPromo(promoCode.trim().toUpperCase()));
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
      onClick={onClose}
    >
      <div
        className="fixed top-24 right-6 w-[400px] bg-gradient-to-b from-slate-900 to-slate-950/90 border-2 border-emerald-500/50 rounded-3xl shadow-2xl z-50 max-height-[85vh] max-h-[85vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-emerald-600/90 to-emerald-500/90 backdrop-blur-xl p-6 border-b-2 border-emerald-400/30 flex justify-between items-center">
          <div className="space-y-1">
            <h2 className="text-3xl font-black bg-gradient-to-r from-white to-slate-200 bg-clip-text text-transparent">
              Your Cart
            </h2>
            <p className="text-emerald-300 font-semibold text-lg">
              {totalItems} items
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-3 bg-white/10 backdrop-blur-sm rounded-2xl hover:bg-white/20 text-2xl transition-all shadow-lg"
          >
            ×
          </button>
        </div>

        {/* Items */}
        <div className="p-6 overflow-y-auto max-h-60">
          {cart.items.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-7xl mb-6">🛒</div>
              <h3 className="text-2xl font-bold text-slate-400 mb-2">
                Your cart is empty
              </h3>
              <p className="text-slate-500">
                Add delicious items from menus!
              </p>
            </div>
          ) : (
            cart.items.map((item) => (
              <div
                key={item.id}
                className="group bg-white/5 backdrop-blur-sm p-6 rounded-3xl border border-white/10 hover:border-emerald-400/50 hover:bg-white/10 transition-all shadow-lg mb-4 last:mb-0"
              >
                <div className="flex gap-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 rounded-2xl object-cover shadow-lg flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-black text-xl text-white line-clamp-1 pr-4">
                        {item.name}
                      </h4>
                      <button
                        onClick={() => dispatch(removeItem(item.id))}
                        className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl transition-all group-hover:scale-110"
                      >
                        ✕
                      </button>
                    </div>
                    <p className="text-slate-400 text-sm mb-4 line-clamp-2">
                      {item.restaurant}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-black text-emerald-400 bg-emerald-500/20 px-3 py-1 rounded-xl">
                        ₹{(item.price * item.quantity).toFixed(0)}
                      </span>
                      <div className="flex items-center bg-slate-900/50 p-2 rounded-2xl">
                        <button
                          onClick={() =>
                            dispatch(
                              updateQuantity({
                                id: item.id,
                                quantity: item.quantity - 1,
                              })
                            )
                          }
                          disabled={item.quantity === 1}
                          className="w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center hover:bg-slate-700 font-bold text-2xl transition-all disabled:opacity-50"
                        >
                          −
                        </button>
                        <span className="w-16 text-center text-2xl font-black mx-4">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            dispatch(
                              updateQuantity({
                                id: item.id,
                                quantity: item.quantity + 1,
                              })
                            )
                          }
                          className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center hover:bg-emerald-600 text-black font-bold text-2xl transition-all shadow-lg"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer: Summary + Promo + Place Order */}
        <div className="p-6 bg-gradient-to-t from-slate-900/50 to-transparent sticky bottom-0 border-t border-white/10 space-y-4">
          {/* Summary */}
          <div className="space-y-3 bg-white/5 p-4 rounded-2xl backdrop-blur-sm">
            <div className="flex justify-between text-lg font-semibold">
              <span>Subtotal</span>
              <span className="text-emerald-400">
                ₹{cart.subtotal?.toFixed(0) || 0}
              </span>
            </div>
            {cart.promoDiscount > 0 && (
              <div className="flex justify-between text-emerald-300 text-sm">
                <span>Promo {cart.promoCode}</span>
                <span>-₹{cart.promoDiscount.toFixed(0)}</span>
              </div>
            )}
            <div className="flex justify-between text-slate-400 text-sm">
              <span>Delivery Fee</span>
              <span>₹29</span>
            </div>
            <div className="border-t border-white/20 pt-3 mt-2 flex justify-between text-2xl font-black">
              <span>Total</span>
              <span className="text-emerald-400 bg-emerald-500/20 px-4 py-2 rounded-xl">
                ₹{cart.total?.toFixed(0) || 0}
              </span>
            </div>
          </div>

          {/* Promo code */}
          <div className="space-y-2">
            <div className="relative">
              <input
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                placeholder="Enter promo FIRST50, SNACK10"
                className="w-full p-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl text-lg placeholder-slate-400 focus:border-emerald-400 focus:ring-4 focus:ring-emerald-500/30 outline-none"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleApplyPromo();
                }}
              />
              <button
                onClick={handleApplyPromo}
                className="absolute right-3 top-1/2 -translate-y-1/2 px-3 py-1 bg-emerald-500 text-black text-sm font-bold rounded-xl hover:bg-emerald-600"
              >
                Apply
              </button>
            </div>
            <div className="flex gap-2 text-xs">
              <button
                onClick={() => {
                  setPromoCode('FIRST50');
                  dispatch(applyPromo('FIRST50'));
                }}
                className="px-3 py-1 bg-emerald-500/20 text-emerald-300 rounded-xl hover:bg-emerald-500/40"
              >
                FIRST50 - 50%
              </button>
              <button
                onClick={() => {
                  setPromoCode('SNACK10');
                  dispatch(applyPromo('SNACK10'));
                }}
                className="px-3 py-1 bg-orange-500/20 text-orange-300 rounded-xl hover:bg-orange-500/40"
              >
                SNACK10 - 10% OFF
              </button>
            </div>
          </div>

          {/* Buttons */}
          <div className="space-y-3">
            <button
              onClick={() => dispatch(clearCart())}
              disabled={!cart.items.length}
              className="w-full py-4 border-2 border-slate-600/50 bg-slate-800/50 backdrop-blur-sm rounded-2xl font-semibold hover:border-slate-400 hover:bg-slate-700/50 transition-all text-slate-300 disabled:opacity-50"
            >
              Clear Cart
            </button>
            <button
              onClick={handleCheckout}
              disabled={!cart.items.length}
              className="w-full py-5 bg-gradient-to-r from-emerald-500 via-emerald-600 to-teal-600 text-black font-black text-xl rounded-2xl shadow-2xl hover:shadow-3xl hover:scale-[1.02] transform transition-all duration-300 disabled:opacity-50 disabled:!cursor-not-allowed"
            >
              PLACE ORDER ₹{cart.total?.toFixed(0) || 0}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
