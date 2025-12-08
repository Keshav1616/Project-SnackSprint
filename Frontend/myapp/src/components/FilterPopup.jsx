import { useState } from 'react'

export default function FilterPopup({ isOpen, filters, onClose, onApply }) {
  const [localFilters, setLocalFilters] = useState(filters)

  if (!isOpen) return null

  const cuisines = ['North Indian', 'Chinese', 'Italian', 'South Indian', 'Fast Food', 'Pizza', 'Biryani']
  const costRanges = [
    { id: 'all', label: 'All Prices' },
    { id: 'low', label: 'Under ₹200' },
    { id: 'mid', label: '₹200 - ₹400' },
    { id: 'high', label: '₹400+' }
  ]

  return (
    <>
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50" onClick={onClose} />
      <div className="fixed inset-0 flex items-center justify-end z-50 p-4">
        <div 
          className="bg-gradient-to-b from-slate-900/95 to-slate-950/90 backdrop-blur-xl w-full max-w-md h-full rounded-3xl border border-emerald-500/30 shadow-2xl transform transition-all"
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="sticky top-0 p-6 border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <span>🔧</span> Filters
              </h2>
              <button onClick={onClose} className="text-xl hover:text-emerald-400">✕</button>
            </div>
            <p className="text-sm text-slate-400 mt-1">
              {Object.values(localFilters).filter(Boolean).length} filters active
            </p>
          </div>

          {/* Filters */}
          <div className="p-6 overflow-y-auto flex-1 space-y-6">
            
            {/* Cuisines */}
            <div>
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-slate-200">🍽️ Cuisines</h3>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {cuisines.map(cuisine => (
                  <label key={cuisine} className="flex items-center gap-3 p-3 hover:bg-slate-800/50 rounded-xl cursor-pointer transition-all">
                    <input 
                      type="checkbox"
                      checked={localFilters.cuisines.includes(cuisine)}
                      onChange={e => {
                        const newCuisines = e.target.checked
                          ? [...localFilters.cuisines, cuisine]
                          : localFilters.cuisines.filter(c => c !== cuisine)
                        setLocalFilters({...localFilters, cuisines: newCuisines})
                      }}
                      className="w-5 h-5 text-emerald-500 rounded focus:ring-emerald-500"
                    />
                    <span className="text-sm">{cuisine}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Cost */}
            <div>
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-slate-200">💰 Cost for Two</h3>
              <div className="grid grid-cols-2 gap-2">
                {costRanges.map(range => (
                  <label key={range.id} className="flex items-center gap-3 p-3 hover:bg-slate-800/50 rounded-xl cursor-pointer">
                    <input 
                      type="radio"
                      name="cost"
                      checked={localFilters.costRange === range.id}
                      onChange={() => setLocalFilters({...localFilters, costRange: range.id})}
                      className="w-5 h-5 text-emerald-500 rounded"
                    />
                    <span className="text-sm">{range.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Rating */}
            <div>
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-slate-200">⭐ Minimum Rating</h3>
              <select 
                value={localFilters.rating}
                onChange={e => setLocalFilters({...localFilters, rating: parseFloat(e.target.value)})}
                className="w-full p-3 bg-slate-800/50 border border-slate-700 rounded-xl text-sm focus:border-emerald-400"
              >
                <option value={0}>All Ratings</option>
                <option value={3}>3.0+</option>
                <option value={4}>4.0+</option>
                <option value={4.2}>4.2+</option>
                <option value={4.5}>4.5+</option>
              </select>
            </div>

            {/* Delivery Time */}
            <div>
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-slate-200">🚚 Max Delivery Time</h3>
              <select 
                value={localFilters.deliveryTime}
                onChange={e => setLocalFilters({...localFilters, deliveryTime: parseInt(e.target.value)})}
                className="w-full p-3 bg-slate-800/50 border border-slate-700 rounded-xl text-sm focus:border-emerald-400"
              >
                <option value={60}>60 mins</option>
                <option value={45}>45 mins</option>
                <option value={30}>30 mins</option>
                <option value={20}>20 mins</option>
              </select>
            </div>

            {/* Pure Veg */}
            <div>
              <label className="flex items-center gap-3 p-4 bg-slate-800/50 rounded-2xl cursor-pointer hover:bg-slate-800 transition-all">
                <input 
                  type="checkbox"
                  checked={localFilters.vegOnly}
                  onChange={e => setLocalFilters({...localFilters, vegOnly: e.target.checked})}
                  className="w-5 h-5 text-emerald-500 rounded"
                />
                <span className="flex items-center gap-2 text-sm">
                  <span className="text-lg">🌱</span>
                  Pure Vegetarian Only
                </span>
              </label>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="sticky bottom-0 p-6 bg-slate-900/50 backdrop-blur-sm border-t border-slate-800 space-y-3 pt-8">
            <button
              onClick={() => {
                onApply(localFilters)
                onClose()
              }}
              className="w-full py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-black font-bold text-lg rounded-2xl shadow-xl hover:shadow-2xl transition-all"
            >
              ✅ Apply Filters
            </button>
            <button
              onClick={() => {
                setLocalFilters({ cuisines: [], costRange: 'all', rating: 0, deliveryTime: 60, vegOnly: false })
                onApply({ cuisines: [], costRange: 'all', rating: 0, deliveryTime: 60, vegOnly: false })
                onClose()
              }}
              className="w-full py-4 border-2 border-slate-600 rounded-2xl hover:bg-slate-800/50 transition-all text-slate-300"
            >
              Clear All
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
