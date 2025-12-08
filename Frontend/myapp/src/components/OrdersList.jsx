import { useApp } from '../hooks/useApp'

export default function OrdersList() {
  const app = useApp()
  
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold">Your Orders ({app.orders.length})</h2>
      {app.orders.map(order => (
        <div key={order.id} className="bg-slate-900 p-6 rounded-3xl border border-slate-800">
          <div className="flex justify-between items-start mb-4">
            <h3 className="font-bold text-xl">Order #{order.id.slice(-6)}</h3>
            <span className={`px-3 py-1 rounded-full text-sm ${order.status === 'confirmed' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
              {order.status}
            </span>
          </div>
          <div>Total: ₹{order.total.toFixed(0)}</div>
          <div className="text-sm text-slate-400 mt-2">{order.address}</div>
        </div>
      ))}
    </div>
  )
}
