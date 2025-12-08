import { useState } from 'react'
import { useApp } from '../hooks/useApp'

export default function AddressManager() {
  const [showForm, setShowForm] = useState(false)
  const [addressForm, setAddressForm] = useState({
    id: Date.now(),
    name: '',
    address: '',
    city: '',
    pincode: '',
    phone: '',
    isDefault: false
  })
  const { addresses, currentAddress, saveAddress, setCurrentAddress } = useApp()

  const handleSave = (e) => {
    e.preventDefault()
    const fullAddress = {
      ...addressForm,
      timestamp: new Date().toISOString()
    }
    saveAddress(fullAddress)
    setShowForm(false)
    setAddressForm({
      id: Date.now(),
      name: '',
      address: '',
      city: '',
      pincode: '',
      phone: '',
      isDefault: false
    })
  }

  return (
    <div className="space-y-6">
      {/* Add New Address Button */}
      <button
        onClick={() => setShowForm(true)}
        className="w-full p-6 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border-2 border-dashed border-emerald-500 text-emerald-300 hover:bg-emerald-500/30 rounded-3xl font-medium transition-all"
      >
        ➕ Add New Address
      </button>

      {/* Saved Addresses */}
      {addresses.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-slate-200">Saved Addresses</h3>
          {addresses.map((address) => (
            <div
              key={address.id}
              className={`p-6 rounded-3xl border-2 transition-all cursor-pointer hover:shadow-2xl ${
                currentAddress?.id === address.id
                  ? 'border-emerald-500 bg-emerald-500/10 shadow-emerald-500/25'
                  : 'border-slate-700/50 hover:border-emerald-400/50 bg-slate-900/50'
              }`}
              onClick={() => setCurrentAddress(address)}
            >
              <div className="flex items-start justify-between mb-3">
                <h4 className="font-bold text-lg">{address.name}</h4>
                {address.isDefault && (
                  <span className="px-3 py-1 bg-emerald-500 text-black text-xs font-bold rounded-full">
                    DEFAULT
                  </span>
                )}
              </div>
              <p className="text-slate-300 mb-2">{address.address}</p>
              <p className="text-slate-400 text-sm">
                {address.city} - {address.pincode}
              </p>
              <p className="text-slate-400 text-sm mt-1">
                📞 {address.phone}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Add Address Form */}
      {showForm && (
        <div className="p-8 bg-slate-900/50 backdrop-blur-sm rounded-3xl border border-slate-700">
          <h3 className="text-2xl font-bold mb-6">Add New Address</h3>
          <form onSubmit={handleSave} className="space-y-4">
            <input
              type="text"
              placeholder="Home/Office"
              value={addressForm.name}
              onChange={(e) =>
                setAddressForm({ ...addressForm, name: e.target.value })
              }
              className="w-full p-4 bg-slate-800 rounded-2xl border border-slate-600 focus:border-emerald-400"
              required
            />
            <input
              type="text"
              placeholder="House No, Street, Landmark"
              value={addressForm.address}
              onChange={(e) =>
                setAddressForm({ ...addressForm, address: e.target.value })
              }
              className="w-full p-4 bg-slate-800 rounded-2xl border border-slate-600 focus:border-emerald-400"
              required
            />
            <div className="grid md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="City"
                value={addressForm.city}
                onChange={(e) =>
                  setAddressForm({ ...addressForm, city: e.target.value })
                }
                className="w-full p-4 bg-slate-800 rounded-2xl border border-slate-600 focus:border-emerald-400"
                required
              />
              <input
                type="text"
                placeholder="Pincode"
                value={addressForm.pincode}
                onChange={(e) =>
                  setAddressForm({ ...addressForm, pincode: e.target.value })
                }
                className="w-full p-4 bg-slate-800 rounded-2xl border border-slate-600 focus:border-emerald-400"
                required
              />
            </div>
            <input
              type="tel"
              placeholder="Phone Number"
              value={addressForm.phone}
              onChange={(e) =>
                setAddressForm({ ...addressForm, phone: e.target.value })
              }
              className="w-full p-4 bg-slate-800 rounded-2xl border border-slate-600 focus:border-emerald-400"
              required
            />
            <button
              type="submit"
              className="w-full py-5 bg-gradient-to-r from-emerald-500 to-teal-500 text-black font-bold text-xl rounded-3xl shadow-2xl hover:shadow-3xl hover:scale-[1.02] transition-all"
            >
              💾 Save Address
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="w-full py-4 border-2 border-slate-600 rounded-2xl hover:bg-slate-800 transition-all"
            >
              Cancel
            </button>
          </form>
        </div>
      )}
    </div>
  )
}
