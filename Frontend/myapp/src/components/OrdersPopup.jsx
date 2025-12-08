// src/components/OrdersPopup.jsx
import { useMemo } from 'react';
import { useApp } from '../hooks/useApp';
import OrderTracker from './OrderTracker';

const MOCK_DELIVERY_PARTNERS = ['Rahul Sharma', 'Priya Singh', 'Aman Verma', 'Kunal S.', 'Neha T.'];

function getEtaMinutes(order) {
  // Simple fake ETA: 20 min base, agar out-for-delivery hai to 5–10, agar delivered 0
  if (order.status === 'delivered') return 0;
  if (order.status === 'out-for-delivery') return 5;
  return 20;
}

export default function OrdersPopup({ isOpen, onClose }) {
  const app = useApp();
  const orders = app.orders || [];

  const latest = useMemo(
    () => (orders.length ? orders[orders.length - 1] : null),
    [orders]
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 rounded-3xl w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col border border-slate-700">
        {/* Header */}
        <div className="p-6 border-b border-slate-800 sticky top-0 bg-slate-900 z-10 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">My Orders</h2>
            <p className="text-xs text-slate-400">
              Live status, ETA aur delivery partner details.
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-2xl text-slate-400 hover:text-white"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {!orders.length && (
            <div className="text-center text-slate-400 space-y-3">
              <div className="text-6xl mb-4">🛒</div>
              <h3 className="text-xl font-bold text-slate-200">No orders yet</h3>
              <p className="text-sm">
                Jaise hi tum pehla order place karoge, uska status yahan dikhega.
              </p>
            </div>
          )}

          {latest && (
            <div className="space-y-4">
              {/* Top summary */}
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs text-slate-500">Latest order</p>
                  <h3 className="font-bold text-lg">
                    Order #{latest.id.slice(-6).toUpperCase()}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    {new Date(latest.createdAt).toLocaleString()}
                  </p>
                  <p className="text-xs text-slate-300 mt-2">
                    Delivering to: {latest.address}
                  </p>
                </div>

                <div className="text-right">
                  <div className="text-xl font-bold text-emerald-400">
                    ₹{latest.total.toFixed(0)}
                  </div>
                  <span
                    className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold mt-2
                      ${
                        latest.status === 'delivered'
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : latest.status === 'out-for-delivery'
                          ? 'bg-yellow-500/20 text-yellow-400'
                          : 'bg-sky-500/20 text-sky-400'
                      }`}
                  >
                    {latest.status === 'confirmed' && 'Confirmed'}
                    {latest.status === 'out-for-delivery' && 'On The Way'}
                    {latest.status === 'delivered' && 'Delivered'}
                  </span>
                </div>
              </div>

              {/* Delivery partner + ETA */}
              <div className="bg-slate-800/70 rounded-2xl p-4 flex items-center gap-4 border border-slate-700">
                <div className="w-10 h-10 rounded-full bg-emerald-500 text-black flex items-center justify-center font-bold">
                  DP
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold">
                    Delivery partner:{' '}
                    {
                      MOCK_DELIVERY_PARTNERS[
                        latest.id.charCodeAt(latest.id.length - 1) %
                          MOCK_DELIVERY_PARTNERS.length
                      ]
                    }
                  </p>
                  <p className="text-xs text-slate-400">
                    ETA approx. {getEtaMinutes(latest)} minutes
                  </p>
                </div>
              </div>

              {/* Items */}
              <div className="space-y-2 text-sm text-slate-300">
                <p className="font-semibold text-slate-200">Items</p>
                {latest.items.map((item) => (
                  <div key={item.id} className="flex justify-between">
                    <span>
                      {item.name} × {item.quantity}
                    </span>
                    <span>₹{(item.price * item.quantity).toFixed(0)}</span>
                  </div>
                ))}
              </div>

              {/* Tracker */}
              <OrderTracker order={latest} />
            </div>
          )}

          {/* Previous orders short list */}
          {orders.length > 1 && (
            <div className="space-y-3 pt-4 border-t border-slate-800">
              <p className="text-xs text-slate-500 font-semibold">
                Previous orders
              </p>
              {orders
                .slice(0, orders.length - 1)
                .slice(-3)
                .reverse()
                .map((order) => (
                  <div
                    key={order.id}
                    className="flex justify-between text-xs bg-slate-900/70 rounded-2xl border border-slate-800 px-3 py-2"
                  >
                    <div>
                      <p className="font-semibold">
                        #{order.id.slice(-4).toUpperCase()}
                      </p>
                      <p className="text-[11px] text-slate-400">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-emerald-400">
                        ₹{order.total.toFixed(0)}
                      </p>
                      <p className="text-[11px] text-slate-400 capitalize">
                        {order.status}
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
