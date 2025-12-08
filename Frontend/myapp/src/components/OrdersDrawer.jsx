// src/components/OrdersDrawer.jsx

import { useApp } from '../hooks/useApp'

export default function OrdersDrawer({ isOpen, onClose }) {
  const app = useApp()

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="w-full max-w-md h-screen bg-gradient-to-b from-slate-950 to-slate-900 border-l border-slate-800 translate-x-full transition-transform duration-300 flex flex-col">
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <h2 className="text-2xl font-bold">📦 My Orders</h2>
          <button onClick={onClose} className="text-2xl text-slate-400 hover:text-white">
            ×
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="text-center py-12 text-slate-400 space-y-4">
            <div className="text-6xl mb-6">📦</div>
            <h3 className="text-2xl font-bold text-slate-200 mb-2">No orders yet</h3>
            <p className="text-lg">Your order history will appear here once you place your first order.</p>
            <p className="text-sm mt-4">Total orders: {app.orderCount || 0}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
