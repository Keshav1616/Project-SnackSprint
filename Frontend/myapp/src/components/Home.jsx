import { useState, useEffect, useCallback, useMemo, useTransition } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { fetchRestaurants } from '../store/restaurantsSlice'
import { useCart, useApp } from '../hooks/useApp'
import { useViewToggle } from '../hooks/useViewToggle.jsx'
import Navbar from './Navbar'
import RestaurantCard from './RestaurantCard'
import FilterDrawer from './FilterDrawer'
import CartDrawer from '../cart/CartDrawer'
import AccountSidebar from './AccountSidebar'
import OrdersDrawer from './OrdersDrawer'
import FeedbackDrawer from './FeedbackDrawer'
import ChatBot from './chat/ChatBot'

// CLICK STATE HOOK
function useClickAnimation() {
  const [clickPos, setClickPos] = useState(null)
  return {
    clickPos,
    triggerClick: (e) => {
      const rect = e.currentTarget.getBoundingClientRect()
      setClickPos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      })
      setTimeout(() => setClickPos(null), 300)
    }
  }
}

export default function Home() {
  const clickAnim = useClickAnimation()
  const [isSidebarMobileOpen, setIsSidebarMobileOpen] = useState(false)
  const [showLogin, setShowLogin] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState({
    cuisines: [],
    costRange: 'all',
    minRating: 0,
    maxDelivery: 60,
    pureVeg: false
  })
  const [sortBy, setSortBy] = useState('rating')
  const [showFilterDrawer, setShowFilterDrawer] = useState(false)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isOrdersOpen, setIsOrdersOpen] = useState(false)
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false)
  const [isPending, startTransition] = useTransition()

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const restaurantsState = useSelector(state => state.restaurants)
  const cart = useCart()
  const app = useApp()
  const { viewMode, ViewToggleButton } = useViewToggle()

  useEffect(() => {
    dispatch(fetchRestaurants())
  }, [dispatch])

  const filteredRestaurants = useCallback(() => {
    let result = [...(restaurantsState.data || [])]

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      result = result.filter(
        r =>
          r.name?.toLowerCase().includes(q) ||
          r.cuisines?.some(c => c.toLowerCase().includes(q))
      )
    }

    if (filters.cuisines?.length > 0) {
      result = result.filter(r =>
        filters.cuisines.some(cuisine => r.cuisines?.includes(cuisine))
      )
    }

    let sorted = [...result]
    switch (sortBy) {
      case 'rating':
        sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0))
        break
      case 'price':
        sorted.sort((a, b) => (a.cost_for_two || 0) - (b.cost_for_two || 0))
        break
      case 'delivery':
        sorted.sort((a, b) => (a.delivery_time?.value || 60) - (b.delivery_time?.value || 60))
        break
    }
    return sorted
  }, [restaurantsState.data, searchQuery, filters, sortBy])

  const results = useMemo(() => filteredRestaurants(), [filteredRestaurants])

  const activeFiltersCount = useMemo(() => [
    filters.cuisines?.length || 0,
    filters.costRange !== 'all' ? 1 : 0,
    filters.minRating > 0 ? 1 : 0,
    filters.maxDelivery < 60 ? 1 : 0,
    filters.pureVeg ? 1 : 0
  ].reduce((a, b) => a + b, 0), [filters])

  const handleRestaurantClick = useCallback((restaurant) => {
    if (!app.isLoggedIn) {
      setShowLogin(true)
      return
    }
    navigate(`/restaurant/${restaurant._id || restaurant.id}`)
  }, [app.isLoggedIn, navigate])

  const handleDemoLogin = useCallback(() => {
    app.login({
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+91 9876543210'
    })
    setShowLogin(false)
  }, [app.login])


  return (
    <div className="min-h-screen bg-[#020617] text-white relative overflow-hidden animate-page">

      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="aurora -top-40 -left-40"></div>
        <div className="aurora -bottom-40 right-0"></div>

        {Array.from({ length: 25 }).map((_, i) => (
          <div
            key={i}
            className="particle"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 4}s`,
              animationDuration: `${4 + Math.random() * 6}s`
            }}
          ></div>
        ))}
      </div>

      {/* Sidebar */}
      <AccountSidebar isMobileOpen={isSidebarMobileOpen} onCloseMobile={() => setIsSidebarMobileOpen(false)} />

      {/* Status bar */}
      <div className="fixed top-4 left-72 bg-black/40 backdrop-blur-xl p-4 rounded-2xl text-xs z-40 shadow-xl border border-slate-700/50 animate-float-soft">
        {restaurantsState.data?.length ? `${results.length} restaurants` : 'Loading...'}
        {isPending && <span className="ml-2 animate-pulse">🔄</span>}
      </div>

      {/* Navbar */}
      <Navbar
        cartCount={cart.items?.length || 0}
        onCartClick={() => setIsCartOpen(true)}
        onOrdersClick={() => setIsOrdersOpen(true)}
        onAccountClick={() => window.showAuthModal?.("login")}
        onMenuClick={() => setIsSidebarMobileOpen(true)}
      />

      {/* Main Content */}
      <div className="pt-24 pb-12 md:ml-64 max-w-6xl mx-auto px-6 space-y-8">

        {/* Title */}
        <div className="text-center fade-up">
          <h1 className="text-7xl font-black bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-500 bg-clip-text text-transparent leading-tight drop-shadow-[0_0_15px_rgba(16,185,129,0.35)]">
            SnackSprint
          </h1>
          <p className="text-xl text-slate-400">
            {results.length} restaurants
            {app.isLoggedIn && app.currentAddress && (
              <> • 📍 {app.currentAddress.city}</>
            )}
          </p>
        </div>

        {/* Search + Filters */}
        <div className="flex gap-4 items-end fade-up">
          <div className="flex-1 relative group">
            <input
              value={searchQuery}
              onChange={(e) => startTransition(() => setSearchQuery(e.target.value))}
              placeholder="Search restaurants, cuisines..."
              className="w-full p-5 text-xl bg-slate-800/50 backdrop-blur-md border border-slate-700 rounded-3xl focus:border-emerald-400 focus:ring-4 focus:ring-emerald-400/20 transition-all duration-300 placeholder-slate-400 shadow-lg"
            />
            <span className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500 text-xl">🔍</span>
          </div>

          <div className="flex gap-2">
            <ViewToggleButton />

            <button
              onClick={() => setShowFilterDrawer(true)}
              className="px-10 py-5 bg-gradient-to-r from-emerald-500 to-teal-500 text-black font-bold text-lg rounded-3xl shadow-xl hover:scale-105 transition-all flex items-center gap-2"
            >
              Filters
              {activeFiltersCount > 0 && (
                <span className="bg-black/40 px-3 py-1 rounded-2xl text-sm font-bold shadow-md">
                  {activeFiltersCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Sort Buttons */}
        <div className="flex gap-3 max-w-lg mx-auto fade-up">
          {[
            { value: 'rating', label: 'Top Rated', icon: '⭐' },
            { value: 'price', label: 'Low Price', icon: '💰' },
            { value: 'delivery', label: 'Fast Delivery', icon: '⚡' }
          ].map(option => (
            <button
              key={option.value}
              onClick={() => setSortBy(option.value)}
              className={`flex-1 py-4 px-6 rounded-2xl font-semibold transition-all duration-300 shadow-lg border-2 border-slate-700 ${
                sortBy === option.value
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-black scale-105 shadow-emerald-500/40'
                  : 'bg-slate-800/50 text-slate-200 hover:bg-slate-700'
              }`}
            >
              {option.icon} {option.label}
            </button>
          ))}
        </div>

        {/* Restaurant Container */}
        <div className="min-h-[650px] relative bg-slate-900/40 rounded-3xl p-6 lg:p-8 border border-slate-800 backdrop-blur-xl shadow-2xl fade-up">

          {isPending && (
            <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-xl flex items-center justify-center rounded-3xl z-20">
              <div className="space-y-6 text-center">
                <div className="w-20 h-20 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin mx-auto"></div>
                <p className="text-xl">Updating view...</p>
              </div>
            </div>
          )}

          {viewMode === 'table' ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-[950px]">
                <thead className="bg-slate-900/80 backdrop-blur-md sticky top-0 z-10 border-b border-slate-700">
                  <tr>
                    <th className="p-5 text-left text-lg">Restaurant</th>
                    <th className="p-5 text-center hidden md:table-cell">⭐ Rating</th>
                    <th className="p-5 text-center hidden lg:table-cell">Delivery</th>
                    <th className="p-5 text-center hidden xl:table-cell">Cost for 2</th>
                    <th className="p-5 text-right">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {results.map((restaurant, index) => (
                    <tr key={index} className="table-row-anim border-t border-slate-800 hover:bg-slate-800/50 transition-all">
                      <td className="p-5">
                        <div className="flex items-center gap-4">
                          <img
                            src={restaurant.image || "https://via.placeholder.com/80"}
                            className="w-14 h-14 rounded-xl object-cover shadow-lg hover:scale-110 transition-all"
                          />
                          <div>
                            <h4 className="font-black text-xl">{restaurant.name}</h4>
                            <p className="text-emerald-400 text-xs">{restaurant.cuisines?.join(', ')}</p>
                          </div>
                        </div>
                      </td>

                      <td className="text-center hidden md:table-cell text-emerald-400 text-xl font-black">{restaurant.rating}</td>
                      <td className="text-center hidden lg:table-cell">{restaurant.delivery_time?.text}</td>
                      <td className="text-center hidden xl:table-cell text-emerald-400 font-bold">₹{restaurant.costfortwo}</td>
                      <td className="p-5 text-right">
                        <button
                          onClick={() => handleRestaurantClick(restaurant)}
                          className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-black rounded-xl hover:scale-105 shadow-lg transition-all"
                        >
                          View Menu →
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 fade-up">
              {results.map((restaurant, index) => (
                <RestaurantCard
                  key={index}
                  restaurant={restaurant}
                  onClick={() => handleRestaurantClick(restaurant)}
                  className="card-anim"
                />
              ))}
            </div>
          )}

        </div>
      </div>
      {/* EMPTY STATE - ANIMATED */}
{results.length === 0 && !isPending && (
  <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-12 bg-gradient-to-b from-slate-900/50 to-slate-950/70 backdrop-blur-xl rounded-3xl animate-pulse-glow">
    
    {/* Animated Pizza Slice */}
    <div className="relative mb-8">
      <div className="w-32 h-32 bg-gradient-to-br from-orange-400 to-red-500 rounded-full shadow-2xl animate-spin-slow hover:animate-spin-normal group">
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/30 to-orange-400/30 rounded-full animate-pulse blur-sm"></div>
        <div className="absolute -top-2 -right-2 w-8 h-8 bg-white/80 rounded-full shadow-lg animate-bounce delay-100">🍕</div>
        <div className="absolute -bottom-2 -left-2 w-6 h-6 bg-emerald-400 rounded-full shadow-lg animate-bounce delay-300">🌿</div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 border-4 border-white/20 border-t-white rounded-full animate-spin-fast"></div>
      </div>
      
      {/* Floating particles */}
      <div className="absolute -top-4 -right-4 w-4 h-4 bg-yellow-300 rounded-full animate-float delay-500"></div>
      <div className="absolute -bottom-4 left-4 w-3 h-3 bg-orange-400 rounded-full animate-float delay-700"></div>
      <div className="absolute top-4 left-4 w-2 h-2 bg-red-300 rounded-full animate-float delay-900"></div>
    </div>

    {/* Title with gradient text */}
    <h3 className="text-4xl md:text-5xl font-black mb-6 bg-gradient-to-r from-slate-300 via-emerald-400 to-teal-500 bg-clip-text text-transparent drop-shadow-2xl animate-fade-in-up">
      No restaurants found
    </h3>

    {/* Subtitle */}
    <p className="text-xl md:text-2xl text-slate-400 mb-10 max-w-lg mx-auto leading-relaxed animate-fade-in-up delay-200">
      Don't worry! Try adjusting your search or filters. 
      <span className="text-emerald-400 font-semibold block animate-pulse">Delicious food is waiting nearby ✨</span>
    </p>

    {/* Animated search illustration */}
    <div className="relative w-48 h-24 mx-auto mb-12 overflow-hidden rounded-3xl bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 shadow-2xl group">
      <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 animate-shimmer"></div>
      <div className="absolute left-6 top-1/2 -translate-y-1/2 text-2xl animate-pulse">🔍</div>
      <div className="absolute right-8 top-1/2 -translate-y-1/2 w-20 h-6 bg-slate-700 rounded-full animate-slide-in-left delay-400"></div>
      <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-24 h-4 bg-gradient-to-r from-orange-400 to-red-500 rounded-full shadow-lg animate-bounce delay-600"></div>
    </div>

    {/* Action buttons with stagger animation */}
    <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto pt-8">
      <button
        onClick={() => {
          setSearchQuery('')
          startTransition(() => setFilters({
            cuisines: [],
            costRange: 'all',
            minRating: 0,
            maxDelivery: 60,
            pureVeg: false
          }))
        }}
        className="flex-1 py-5 px-8 bg-gradient-to-r from-slate-700/50 to-slate-600/50 backdrop-blur-xl border-2 border-slate-600 rounded-3xl text-slate-200 font-bold shadow-xl hover:shadow-2xl hover:scale-105 hover:border-emerald-400 hover:from-emerald-500/20 hover:to-teal-500/20 transition-all duration-300 animate-slide-up delay-800 group"
      >
        <span className="flex items-center gap-3">
          🧹 Clear All
          <span className="ml-auto w-6 h-6 bg-white/20 rounded-xl group-hover:bg-emerald-400/50 transition-all animate-ping"></span>
        </span>
      </button>

      <button
        onClick={() => setShowFilterDrawer(true)}
        className="flex-1 py-5 px-8 bg-gradient-to-r from-emerald-500 to-teal-500 text-black font-black text-lg rounded-3xl shadow-2xl hover:shadow-3xl hover:scale-105 transition-all duration-300 ring-2 ring-emerald-400/50 animate-slide-up delay-1000"
      >
        🎛️ Adjust Filters
      </button>
    </div>

    {/* Subtle hint */}
    <p className="text-sm text-slate-500 mt-12 animate-fade-in delay-1200">
      Pro tip: Try "pizza", "biryani" or "pure veg" in search
    </p>
  </div>
)}

       {/* ANIMATED EMPTY STATE - YAHAN ADD KARO */}
{results.length === 0 && !isPending && (
  <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-12 bg-gradient-to-b from-slate-900/50 to-slate-950/70 backdrop-blur-xl rounded-3xl animate-pulse-glow">
    
    {/* Animated Pizza */}
    <div className="relative mb-8">
      <div className="w-32 h-32 bg-gradient-to-br from-orange-400 to-red-500 rounded-full shadow-2xl animate-spin-slow hover:animate-spin-normal group">
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/30 to-orange-400/30 rounded-full animate-pulse blur-sm"></div>
        <div className="absolute -top-2 -right-2 w-8 h-8 bg-white/80 rounded-full shadow-lg animate-bounce delay-100">🍕</div>
        <div className="absolute -bottom-2 -left-2 w-6 h-6 bg-emerald-400 rounded-full shadow-lg animate-bounce delay-300">🌿</div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 border-4 border-white/20 border-t-white rounded-full animate-spin-fast"></div>
      </div>
    </div>

    <h3 className="text-4xl font-black mb-6 bg-gradient-to-r from-slate-300 via-emerald-400 to-teal-500 bg-clip-text text-transparent drop-shadow-2xl animate-fade-in-up">
      No restaurants found
    </h3>

    <p className="text-xl text-slate-400 mb-10 max-w-lg mx-auto animate-fade-in-up delay-200">
      Try adjusting your search or filters. 
      <span className="text-emerald-400 font-semibold block animate-pulse">Delicious food is waiting nearby ✨</span>
    </p>

    <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto pt-8">
      <button
        onClick={() => {
          setSearchQuery('')
          startTransition(() => setFilters({
            cuisines: [],
            costRange: 'all',
            minRating: 0,
            maxDelivery: 60,
            pureVeg: false
          }))
        }}
        className="flex-1 py-5 px-8 bg-gradient-to-r from-slate-700/50 to-slate-600/50 backdrop-blur-xl border-2 border-slate-600 rounded-3xl text-slate-200 font-bold shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 animate-slide-up delay-800"
      >
        🧹 Clear All
      </button>

      <button
        onClick={() => setShowFilterDrawer(true)}
        className="flex-1 py-5 px-8 bg-gradient-to-r from-emerald-500 to-teal-500 text-black font-black text-lg rounded-3xl shadow-2xl hover:shadow-3xl hover:scale-105 transition-all duration-300 animate-slide-up delay-1000"
      >
        🎛️ Adjust Filters
      </button>
    </div>
  </div>
)}

      {/* Drawers */}
      <FilterDrawer isOpen={showFilterDrawer} filters={filters} onFiltersChange={setFilters} onClose={() => setShowFilterDrawer(false)} />
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      <OrdersDrawer isOpen={isOrdersOpen} onClose={() => setIsOrdersOpen(false)} />
      <FeedbackDrawer isOpen={isFeedbackOpen} onClose={() => setIsFeedbackOpen(false)} />

      {/* Login Popup */}
      {showLogin && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-xl flex items-center justify-center z-50 fade-in">
          <div className="bg-slate-900/80 p-8 rounded-3xl shadow-2xl border border-slate-700 w-full max-w-sm space-y-6 pop-anim">

            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center text-3xl mx-auto shadow-xl">
                👤
              </div>
              <h2 className="text-2xl font-black text-emerald-400 mt-4">
                Login Required
              </h2>
            </div>

            <button
              onClick={handleDemoLogin}
              className="w-full py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-black font-bold rounded-2xl hover:scale-105 transition-all shadow-xl"
            >
              🚀 Quick Demo Login
            </button>

            <button
              onClick={() => setShowLogin(false)}
              className="w-full py-3 border border-slate-600 rounded-xl hover:bg-slate-800 transition-all"
            >
              Cancel
            </button>

          </div>
        </div>
      )}

      <ChatBot />
    </div>
  )
}
