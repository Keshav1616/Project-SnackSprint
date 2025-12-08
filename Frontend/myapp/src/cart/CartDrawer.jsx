

import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useCart, useApp } from '../hooks/useApp'
import { updateQuantity, removeItem, applyPromo, clearCart } from '../store/cartSlice'
import CheckoutModal from './CheckoutModal'

export default function CartDrawer({ isOpen, onClose }) {
  const dispatch = useDispatch()
  const cart = useCart()
  const app = useApp()
  const [promoCode, setPromoCode] = useState('')
  const [showCheckout, setShowCheckout] = useState(false)

  if (!isOpen) return null

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose}>
        <div
          className="fixed right-0 top-0 h-full w-96 bg-slate-950 border-l border-emerald-500 z-50 p-6 overflow-y-auto shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="sticky top-0 bg-slate-950 p-4 border-b border-slate-800 flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-slate-100">Your Cart</h2>
            <button
              onClick={onClose}
              className="text-2xl text-slate-400 hover:text-white p-2 rounded-xl hover:bg-slate-800"
            >
              ×
            </button>
          </div>

          {/* Items */}
          <div className="space-y-4 mb-8 max-h-[60vh] overflow-y-auto">
            {cart.items?.length === 0 ? (
              <div className="text-center py-12 text-slate-400">
                <div className="text-4xl mb-4">🛒</div>
                <p>Your cart is empty</p>
              </div>
            ) : (
              cart.items.map((item) => (
                <div
                  key={item.id}
                  className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800"
                >
                  <div className="flex gap-4">
                    <img
                      src={item.image || 'https://via.placeholder.com/80'}
                      className="w-20 h-20 rounded-xl object-cover flex-shrink-0"
                      alt={item.name}
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-lg truncate">{item.name}</h4>
                      <p className="text-sm text-slate-400 mb-4 line-clamp-2">
                        {item.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold text-emerald-400">
                          ₹{(item.price * item.quantity).toFixed(0)}
                        </span>
                        <div className="flex items-center gap-3 bg-slate-800 p-2 rounded-xl">
                          <button
                            onClick={() =>
                              dispatch(
                                updateQuantity({
                                  id: item.id,
                                  quantity: item.quantity - 1
                                })
                              )
                            }
                            className="w-10 h-10 bg-slate-700 rounded-lg flex items-center justify-center hover:bg-slate-600 font-bold text-lg"
                            disabled={item.quantity <= 1}
                          >
                            -
                          </button>
                          <span className="w-12 text-center font-bold text-xl px-4">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              dispatch(
                                updateQuantity({
                                  id: item.id,
                                  quantity: item.quantity + 1
                                })
                              )
                            }
                            className="w-10 h-10 bg-emerald-500 rounded-lg flex items-center justify-center hover:bg-emerald-600 text-black font-bold text-lg"
                          >
                            +
                          </button>
                        </div>
                      </div>
                      <button
                        onClick={() => dispatch(removeItem(item.id))}
                        className="p-2 text-red-400 hover:bg-red-500/20 rounded-xl ml-2"
                      >
                        Remove item
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Summary */}
          <div className="sticky bottom-0 bg-slate-950 p-6 border-t border-slate-800 space-y-4 pt-8">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between font-medium">
                <span>Subtotal</span>
                <span>₹{cart.subtotal?.toFixed(0)}</span>
              </div>
              {cart.promoDiscount > 0 && (
                <div className="flex justify-between text-emerald-400">
                  <span>Promo {cart.promoCode}</span>
                  <span>-₹{cart.promoDiscount.toFixed(0)}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-400">
                <span>Delivery</span>
                <span>₹29</span>
              </div>
              <hr className="border-slate-700 my-2" />
              <div className="text-2xl font-bold text-slate-100 flex justify-between">
                <span>Total</span>
                <span>₹{cart.total?.toFixed(0)}</span>
              </div>
            </div>

            {/* Promo */}
            <div className="space-y-2">
              <input
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                placeholder="Enter promo code (FIRST50, SNACK10)"
                className="w-full p-4 bg-slate-900 border border-slate-700 rounded-2xl text-slate-100 placeholder-slate-500 focus:border-emerald-400"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    dispatch(applyPromo(promoCode))
                    setPromoCode('')
                  }
                }}
              />
              <div className="text-xs text-slate-500 text-center">
                Try{' '}
                <button
                  onClick={() => {
                    dispatch(applyPromo('FIRST50'))
                    setPromoCode('FIRST50')
                  }}
                  className="text-emerald-400 font-medium"
                >
                  FIRST50
                </button>{' '}
                or{' '}
                <button
                  onClick={() => {
                    dispatch(applyPromo('SNACK10'))
                    setPromoCode('SNACK10')
                  }}
                  className="text-orange-400 font-medium"
                >
                  SNACK10
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <button
                onClick={() => dispatch(clearCart())}
                className="w-full p-4 border-2 border-slate-700 rounded-2xl hover:bg-slate-900/50 transition-all font-medium text-slate-300"
                disabled={cart.items?.length === 0}
              >
                Clear Cart
              </button>
              <button
                onClick={() => setShowCheckout(true)}
                className="w-full py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 text-black font-bold text-lg rounded-2xl shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all"
                disabled={cart.items?.length === 0}
              >
                Checkout ₹{cart.total?.toFixed(0)}
              </button>
            </div>
          </div>
        </div>
      </div>

      {showCheckout && (
        <CheckoutModal onClose={() => setShowCheckout(false)} />
      )}
    </>
  )
}
