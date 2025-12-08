import { useDispatchStore, useCart } from '../hooks/useApp'
import { applyPromo } from '../../store/cartSlice'

export default function PromoPanel() {
  const dispatch = useDispatchStore()
  const cart = useCart()

  return (
    <div className="bg-slate-900/50 p-6 rounded-3xl border border-slate-800">
      <h3 className="font-bold text-xl mb-4">Promo Codes</h3>
      <div className="grid grid-cols-2 gap-3">
        <button onClick={() => dispatch(applyPromo('FIRST50'))} className="p-4 bg-emerald-500/20 rounded-2xl hover:bg-emerald-500/40">FIRST50 (-₹50)</button>
        <button onClick={() => dispatch(applyPromo('SNACK10'))} className="p-4 bg-orange-500/20 rounded-2xl hover:bg-orange-500/40">SNACK10 (10% OFF)</button>
      </div>
      <p className="text-sm text-slate-400 mt-3">Current: {cart.promoCode || 'None'}</p>
    </div>
  )
}
