import Navbar from './Navbar'
import AccountSidebar from './AccountSidebar'
import AddressManager from './AddressManager'
import { useCart } from '../hooks/useApp'

export default function AddressPage() {
  const cart = useCart()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      <AccountSidebar />

      <div className="md:ml-64">
        <Navbar cartCount={cart.items?.length || 0} />
      </div>

      <div className="pt-24 pb-12 md:ml-64">
        <div className="max-w-4xl mx-auto px-6 space-y-6">
          <h1 className="text-3xl font-bold">Saved Addresses</h1>
          <AddressManager />
        </div>
      </div>
    </div>
  )
}
