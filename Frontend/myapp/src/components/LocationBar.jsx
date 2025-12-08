import { useState, useEffect } from 'react'

export default function LocationBar() {
  const [location, setLocation] = useState('Detecting...')
  const [showLocations, setShowLocations] = useState(false)

  useEffect(() => {
    // Simulate geolocation
    const locations = ['Sector 62, Noida', 'Sector 18, Noida', 'Greater Noida', 'Delhi']
    setTimeout(() => setLocation(locations[Math.floor(Math.random() * locations.length)]), 1200)
  }, [])

  const popularLocations = [
    'Sector 62, Noida', 'Sector 18, Noida', 'Greater Noida', 
    'Delhi', 'Gurgaon', 'Ghaziabad', 'Faridabad'
  ]

  return (
    <div className="bg-gradient-to-r from-emerald-600 to-teal-500 px-6 py-3 border-b border-white/20">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
          <span className="font-semibold text-sm">{location}</span>
          <button 
            onClick={() => setShowLocations(!showLocations)}
            className="text-white/90 hover:text-white text-xs font-medium underline"
          >
            Change Location
          </button>
        </div>
        
        {showLocations && (
          <div className="absolute top-full left-6 bg-white/10 backdrop-blur-xl rounded-2xl p-4 border border-white/20 mt-2 max-w-sm shadow-2xl">
            {popularLocations.map(loc => (
              <button
                key={loc}
                onClick={() => {
                  setLocation(loc)
                  setShowLocations(false)
                }}
                className="block w-full text-left p-3 hover:bg-white/20 rounded-xl text-sm transition-all"
              >
                {loc}
              </button>
            ))}
          </div>
        )}
        
        <div className="text-xs text-white/80 hidden sm:block">
          Min order ₹49 | Free delivery over ₹199
        </div>
      </div>
    </div>
  )
}
