import { useState, useEffect } from 'react'

export default function LocationSelector() {
  const [location, setLocation] = useState('Detecting location...')
  const [showDropdown, setShowDropdown] = useState(false)

  useEffect(() => {
    // Mock geolocation
    setTimeout(() => setLocation('Sector 62, Noida'), 1500)
  }, [])

  const locations = [
    'Sector 62, Noida',
    'Sector 18, Noida',
    'Greater Noida',
    'Delhi',
    'Gurgaon'
  ]

  return (
    <div className="bg-gradient-to-r from-emerald-500 to-teal-500/90 backdrop-blur-xl border-b border-white/20">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
            <span className="text-lg font-semibold text-white">{location}</span>
            <button 
              onClick={() => setShowDropdown(!showDropdown)}
              className="text-white/80 hover:text-white text-sm font-medium"
            >
              Change Location
            </button>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-sm text-white/80">
              <span>Min. ₹49</span> | <span>30 min</span>
            </div>
          </div>
        </div>

        {showDropdown && (
          <div className="mt-4 bg-white/10 backdrop-blur-xl rounded-2xl p-4 border border-white/20 max-w-sm">
            {locations.map(loc => (
              <button
                key={loc}
                onClick={() => {
                  setLocation(loc)
                  setShowDropdown(false)
                }}
                className="w-full text-left p-3 hover:bg-white/20 rounded-xl transition-all"
              >
                {loc}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
