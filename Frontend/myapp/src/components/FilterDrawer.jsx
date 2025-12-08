// export default function FilterDrawer({ isOpen, onClose }) {
//   if (!isOpen) return null

//   return (
//     <>
//       <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50" onClick={onClose} />
//       <div className="fixed right-0 top-0 h-full w-80 bg-gradient-to-b from-slate-900 to-slate-950 border-l-2 border-emerald-500 shadow-2xl z-50 transform transition-transform">
//         <div className="p-8">
//           <div className="flex items-center justify-between mb-8">
//             <h2 className="text-3xl font-black text-white">Filters</h2>
//             <button onClick={onClose} className="text-2xl text-slate-400 hover:text-white">×</button>
//           </div>

//           {/* Filter Categories */}
//           <div className="space-y-6">
//             <div>
//               <h3 className="font-bold text-lg mb-4 flex items-center gap-2">🍽️ Cuisines</h3>
//               {['North Indian', 'Chinese', 'Italian', 'South Indian', 'Fast Food'].map(cuisine => (
//                 <label key={cuisine} className="flex items-center gap-3 p-3 hover:bg-white/10 rounded-xl cursor-pointer">
//                   <input type="checkbox" className="w-5 h-5 text-emerald-500 rounded" />
//                   <span>{cuisine}</span>
//                 </label>
//               ))}
//             </div>

//             <div>
//               <h3 className="font-bold text-lg mb-4 flex items-center gap-2">💰 Cost for Two</h3>
//               <div className="space-y-2">
//                 <label className="flex items-center gap-3 p-3 hover:bg-white/10 rounded-xl">
//                   <input type="radio" name="cost" className="w-5 h-5 text-emerald-500" />
//                   <span>Under ₹200</span>
//                 </label>
//                 <label className="flex items-center gap-3 p-3 hover:bg-white/10 rounded-xl">
//                   <input type="radio" name="cost" className="w-5 h-5 text-emerald-500" />
//                   <span>₹200 - ₹400</span>
//                 </label>
//               </div>
//             </div>
//           </div>

//           <button className="w-full mt-12 bg-gradient-to-r from-emerald-500 to-teal-500 text-black font-black py-4 px-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all">
//             Apply Filters
//           </button>
//         </div>
//       </div>
//     </>
//   )
// }
import { useState, useEffect } from 'react'

const CUISINES = ['North Indian', 'Chinese', 'South Indian', 'Italian', 'Pizza', 'Biryani', 'Fast Food']

export default function FilterDrawer({ isOpen, filters, onFiltersChange, onClose }) {
  const [localFilters, setLocalFilters] = useState(filters)

  useEffect(() => {
    if (isOpen) setLocalFilters(filters)
  }, [isOpen, filters])

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40" 
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div className="fixed inset-y-0 right-0 w-80 bg-gradient-to-b from-slate-900/95 to-slate-950/90 backdrop-blur-xl border-l-4 border-emerald-500/50 z-50 transform transition-transform duration-300 ease-out translate-x-0">
        
        {/* Header */}
        <div className="p-8 border-b border-white/10 sticky top-0 bg-slate-900/50 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-3xl font-black bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
              Filters
            </h2>
            <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-xl text-2xl transition-all">
              ✕
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="p-8 space-y-8 overflow-y-auto max-h-[calc(100vh-200px)]">
          
          {/* Cuisines */}
          <div>
            <h3 className="text-xl font-bold mb-6 text-white flex items-center gap-3">🍽️ Cuisines</h3>
            <div className="space-y-3">
              {CUISINES.map(cuisine => (
                <label key={cuisine} className="flex items-center p-4 rounded-2xl hover:bg-white/10 cursor-pointer transition-all">
                  <input 
                    type="checkbox" 
                    checked={localFilters.cuisines?.includes(cuisine)}
                    onChange={e => {
                      const newCuisines = e.target.checked
                        ? [...(localFilters.cuisines || []), cuisine]
                        : (localFilters.cuisines || []).filter(c => c !== cuisine)
                      setLocalFilters(prev => ({...prev, cuisines: newCuisines}))
                    }}
                    className="w-5 h-5 text-emerald-500 rounded border-white/20 focus:ring-emerald-500 mr-3"
                  />
                  <span className="text-lg">{cuisine}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Cost */}
          <div>
            <h3 className="text-xl font-bold mb-6 text-white flex items-center gap-3">💰 Cost for Two</h3>
            <div className="space-y-3">
              {['all', 'low', 'mid', 'high'].map(range => (
                <label key={range} className="flex items-center p-4 rounded-2xl hover:bg-white/10 cursor-pointer transition-all">
                  <input 
                    type="radio" 
                    name="cost"
                    checked={localFilters.costRange === range}
                    onChange={() => setLocalFilters(prev => ({...prev, costRange: range}))}
                    className="w-5 h-5 text-emerald-500 rounded border-white/20 focus:ring-emerald-500 mr-3"
                  />
                  <span className="text-lg">
                    {range === 'all' ? 'All Prices' : 
                     range === 'low' ? 'Under ₹200' : 
                     range === 'mid' ? '₹200-₹400' : '₹400+'}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Rating */}
          <div>
            <h3 className="text-xl font-bold mb-6 text-white flex items-center gap-3">⭐ Min Rating</h3>
            <select 
              value={localFilters.minRating}
              onChange={e => setLocalFilters(prev => ({...prev, minRating: parseFloat(e.target.value)}))}
              className="w-full p-4 bg-white/10 border border-white/20 rounded-2xl text-lg focus:border-emerald-400"
            >
              <option value={0}>All Ratings</option>
              <option value={3}>3.0+</option>
              <option value={4}>4.0+</option>
              <option value={4.5}>4.5+</option>
            </select>
          </div>

          {/* Delivery */}
          <div>
            <h3 className="text-xl font-bold mb-6 text-white flex items-center gap-3">🚚 Max Delivery</h3>
            <select 
              value={localFilters.maxDelivery}
              onChange={e => setLocalFilters(prev => ({...prev, maxDelivery: parseInt(e.target.value)}))}
              className="w-full p-4 bg-white/10 border border-white/20 rounded-2xl text-lg focus:border-emerald-400"
            >
              <option value={60}>60 mins</option>
              <option value={45}>45 mins</option>
              <option value={30}>30 mins</option>
            </select>
          </div>

          {/* Pure Veg */}
          <div>
            <label className="flex items-center p-6 rounded-2xl bg-white/5 border border-white/20 cursor-pointer hover:bg-white/10 transition-all">
              <input 
                type="checkbox"
                checked={localFilters.pureVeg}
                onChange={e => setLocalFilters(prev => ({...prev, pureVeg: e.target.checked}))}
                className="w-6 h-6 text-emerald-500 rounded-xl border-white/20 focus:ring-emerald-500 mr-4"
              />
              <span className="text-xl font-semibold flex items-center gap-3">
                🌱 Pure Veg Only
              </span>
            </label>
          </div>
        </div>

        {/* Buttons */}
        <div className="p-8 border-t border-white/10 bg-slate-900/50 sticky bottom-0">
          <div className="space-y-3">
            <button
              onClick={() => {
                onFiltersChange(localFilters)
                onClose()
              }}
              className="w-full py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-black font-bold text-xl rounded-2xl hover:scale-105 transition-all shadow-xl"
            >
              ✅ Apply Filters
            </button>
            <button
              onClick={() => {
                const reset = {
                  cuisines: [],
                  costRange: 'all',
                  minRating: 0,
                  maxDelivery: 60,
                  pureVeg: false,
                  sortBy: 'rating'
                }
                setLocalFilters(reset)
                onFiltersChange(reset)
                onClose()
              }}
              className="w-full py-4 border border-white/20 bg-transparent text-white font-semibold rounded-2xl hover:bg-white/10 transition-all"
            >
              Clear All
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
