// src/components/OrdersPage.jsx
import Navbar from './Navbar';
import AccountSidebar from './AccountSidebar';
import { useApp, useCart } from '../hooks/useApp';
import OrderTracker from './OrderTracker';

export default function OrdersPage() {
  const cart = useCart();
  const app = useApp();
  const orders = app.orders || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      <AccountSidebar />
      <div className="md:ml-64">
        <Navbar cartCount={cart.items?.length || 0} />
      </div>

      <div className="pt-24 pb-12 md:ml-64">
        <div className="max-w-4xl mx-auto px-6 space-y-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold">My Orders</h1>
            <p className="text-sm text-slate-400">
              Track your recent orders and delivery status.
            </p>
          </div>

          {orders.length === 0 ? (
            <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-8 text-center text-slate-400">
              <div className="text-6xl mb-6">🛒</div>
              <h2 className="text-2xl font-bold text-slate-200 mb-2">No orders yet</h2>
              <p>Your order history will appear here once you place your first order.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {orders
                .slice()
                .reverse()
                .map((order) => (
                  <div
                    key={order.id}
                    className="bg-slate-900 p-6 rounded-3xl border border-slate-800 space-y-4"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-xl">
                          Order #{order.id.slice(-6).toUpperCase()}
                        </h3>
                        <p className="text-sm text-slate-400">
                          {new Date(order.createdAt).toLocaleString()}
                        </p>
                        <p className="text-sm text-slate-300 mt-1">
                          {order.address}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-emerald-400">
                          ₹{order.total.toFixed(0)}
                        </div>
                        <span
                          className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold mt-2
                            ${
                              order.status === 'delivered'
                                ? 'bg-emerald-500/20 text-emerald-400'
                                : order.status === 'out-for-delivery'
                                ? 'bg-yellow-500/20 text-yellow-400'
                                : 'bg-sky-500/20 text-sky-400'
                            }`}
                        >
                          {order.status === 'confirmed' && 'Confirmed'}
                          {order.status === 'out-for-delivery' && 'On The Way'}
                          {order.status === 'delivered' && 'Delivered'}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2 text-sm text-slate-300">
                      {order.items.map((item) => (
                        <div key={item.id} className="flex justify-between">
                          <span>
                            {item.name} × {item.quantity}
                          </span>
                          <span>₹{(item.price * item.quantity).toFixed(0)}</span>
                        </div>
                      ))}
                    </div>

                    <OrderTracker order={order} />
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
