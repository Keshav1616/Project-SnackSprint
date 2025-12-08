import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { addItem } from '../store/cartSlice'
import { fetchRestaurants } from '../store/restaurantsSlice'
import Navbar from './Navbar'

export default function MenuPage() {
  const { restaurantId } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  
  const [activeCategory, setActiveCategory] = useState('recommended')
  
  const cart = useSelector(state => state.cart)
  const restaurantsState = useSelector(state => state.restaurants)
  const restaurants = restaurantsState.data || []
 
  const restaurant = restaurants.find(r => r._id === restaurantId || r.id === restaurantId)

  //  MENU CATEGORIES
  const menuCategories = {
    recommended: [
      {
        _id: `${restaurantId}-pizza-1-${Date.now()}`,
        name: `${restaurant?.name || 'Special'} Signature Pizza`,
        price: 299,
        image: 'https://via.placeholder.com/300x200/FF6B6B/FFFFFF?text=🍕PIZZA',
        description: 'Fresh dough, double cheese, signature sauce'
      },
      {
        _id: `${restaurantId}-combo-1-${Date.now()}`,
        name: 'Mega Combo Deal',
        price: 499,
        image: 'https://via.placeholder.com/300x200/4ECDC4/FFFFFF?text=🍗COMBO',
        description: 'Pizza + Burger + Fries + Drink'
      }
    ],
    starters: [
      {
        _id: `${restaurantId}-fries-1-${Date.now()}`,
        name: 'Crispy Fries',
        price: 149,
        image: 'https://via.placeholder.com/300x200/FECA57/FFFFFF?text=🍟FRIES',
        description: 'Golden fries with peri peri seasoning'
      }
    ],
    main_course: [
      {
        _id: `${restaurantId}-biryani-1-${Date.now()}`,
        name: 'Chicken Biryani',
        price: 249,
        image: 'https://via.placeholder.com/300x200/45B7D1/FFFFFF?text=🍛BIRYANI',
        description: 'Hyderabadi style aromatic biryani'
      }
    ],
    desserts: [
      {
        _id: `${restaurantId}-brownie-1-${Date.now()}`,
        name: 'Chocolate Brownie',
        price: 129,
        image: 'https://via.placeholder.com/300x200/FF6B6B/FFFFFF?text=🍫BROWNIE',
        description: 'Warm brownie with vanilla ice cream'
      }
    ],
    drinks: [
      {
        _id: `${restaurantId}-cola-1-${Date.now()}`,
        name: 'Chilled Coke',
        price: 49,
        image: 'https://via.placeholder.com/300x200/4ECDC4/FFFFFF?text=🥤COKE',
        description: '300ml chilled Coca Cola'
      }
    ]
  }

  // 🔥 FIXED useEffect - FETCH DATA + CHECK RESTAURANT
  useEffect(() => {
    // Fetch restaurants if not loaded
    if (restaurantsState.data?.length === 0 && !restaurantsState.loading) {
      dispatch(fetchRestaurants())
    }
  }, [dispatch, restaurantsState.loading, restaurantsState.data])

  // 
  useEffect(() => {
    if (restaurantId && !restaurant && !restaurantsState.loading) {
  
      const timeout = setTimeout(() => {
        if (!restaurant) {
          navigate('/')
        }
      }, 2000)
      return () => clearTimeout(timeout)
    }
  }, [restaurant, restaurantId, restaurantsState.loading, navigate])

  const handleAddItem = (item) => {
    dispatch(addItem({
      ...item,
      restaurantId: restaurantId,
      restaurantName: restaurant?.name || 'Restaurant'
    }))
    console.log('✅ Added to cart:', item.name)
  }


  const isLoading = restaurantsState.loading || !restaurantId
  const noRestaurant = !isLoading && !restaurant

  if (noRestaurant) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 to-slate-900 text-white flex items-center justify-center p-8">
        <Navbar cartCount={cart.items?.length || 0} />
        <div className="text-center max-w-md">
          <div className="text-8xl mb-8 opacity-50">🍽️</div>
          <h2 className="text-4xl font-bold mb-6 text-slate-400">Restaurant not found</h2>
          <p className="text-xl text-slate-500 mb-8">This restaurant may have closed or moved</p>
          <button
            onClick={() => navigate('/')}
            className="px-12 py-5 bg-gradient-to-r from-emerald-500 to-teal-500 text-black font-black text-xl rounded-3xl shadow-2xl hover:shadow-3xl hover:scale-[1.02] transition-all"
          >
            🏠 Back to Home
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 to-slate-900 text-white">
      <Navbar cartCount={cart.items?.length || 0} />

     
      <div className="relative">
        <div className="h-64 bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-emerald-500/10"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent"></div>
        <div className="relative max-w-6xl mx-auto px-6 pt-20 pb-12">
          <div className="flex items-start gap-8">
            <img 
              src={restaurant?.image || `https://via.placeholder.com/144x144/4ECDC4/FFFFFF?text=R`} 
              alt={restaurant?.name || 'Restaurant'}
              className="w-36 h-36 rounded-3xl object-cover border-4 border-white/20 shadow-2xl flex-shrink-0"
            />
            <div className="flex-1 min-w-0 pt-4">
              <h1 className="text-5xl font-black mb-4 bg-gradient-to-r from-white to-slate-200 bg-clip-text text-transparent truncate">
                {restaurant?.name || 'Loading Restaurant...'}
              </h1>
              <p className="text-xl text-slate-300 mb-6">{restaurant?.cuisines?.join(' • ') || 'Multiple Cuisines'}</p>
              <div className="grid grid-cols-3 gap-4 text-sm max-w-md">
                <div className="flex items-center gap-2 bg-emerald-500/20 backdrop-blur-sm px-6 py-3 rounded-2xl border border-emerald-500/30">
                  <span className="text-2xl">⭐</span>
                  <span className="font-black text-lg">{(restaurant?.rating || 4.2).toFixed(1)}</span>
                </div>
                <div className="flex items-center gap-2 bg-slate-700/50 px-6 py-3 rounded-2xl backdrop-blur-sm">
                  <span className="font-bold text-lg">₹{restaurant?.cost_for_two || 299}</span>
                  <span className="text-slate-400">for two</span>
                </div>
                <div className="flex items-center gap-2 text-slate-300 px-6 py-3 rounded-2xl bg-slate-800/50 backdrop-blur-sm">
                  <span className="text-lg">🚚</span>
                  <span>{restaurant?.delivery_time?.text || '30 mins'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="max-w-6xl mx-auto px-6 mb-12">
        <div className="flex flex-nowrap gap-3 overflow-x-auto pb-4 bg-slate-900/50 backdrop-blur-sm px-6 py-4 rounded-3xl border border-slate-800/50">
          {Object.keys(menuCategories).map(category => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-8 py-4 whitespace-nowrap rounded-2xl font-bold text-sm transition-all flex-shrink-0 ${
                activeCategory === category
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-black shadow-2xl scale-105'
                  : 'bg-slate-800/50 hover:bg-slate-700/70 text-slate-300 hover:scale-[1.05]'
              }`}
            >
              {category.charAt(0).toUpperCase() + category.slice(1).replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Menu Items */}
      <div className="max-w-6xl mx-auto px-6 pb-32">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {menuCategories[activeCategory]?.map(item => (
            <div 
              key={item._id} 
              className="group bg-gradient-to-b from-slate-900/80 to-slate-950/80 backdrop-blur-sm rounded-3xl p-8 hover:bg-slate-800/90 border border-slate-800/40 hover:border-emerald-500/50 transition-all duration-300 hover:scale-[1.02] cursor-pointer"
            >
              <div className="w-full h-56 rounded-2xl overflow-hidden mb-6 relative group-hover:scale-110 transition-transform">
                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
              </div>
              <div>
                <h3 className="text-2xl font-black mb-3 text-white">{item.name}</h3>
                <p className="text-slate-400 mb-6 text-sm">{item.description}</p>
                <div className="flex items-center justify-between mb-8">
                  <div className="text-3xl font-black text-emerald-500">₹{item.price}</div>
                </div>
                <button
                  onClick={() => handleAddItem(item)}
                  className="w-full py-5 bg-gradient-to-r from-emerald-500 to-teal-500 text-black font-black text-xl rounded-3xl shadow-2xl hover:shadow-3xl hover:scale-[1.02] transition-all"
                >
                  🛒 Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Cart Summary */}
      {cart.items?.length > 0 && (
        <div className="fixed bottom-6 left-6 right-6 max-w-4xl mx-auto z-40">
          <div className="bg-gradient-to-r from-slate-900/95 to-slate-950/95 backdrop-blur-xl rounded-3xl p-6 border border-emerald-500/30 shadow-2xl">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-lg font-bold">{cart.items.length} items</div>
                <div className="text-2xl font-black text-emerald-400">₹{Math.round(cart.total || 0)}</div>
              </div>
              <button className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-black font-black text-xl rounded-3xl shadow-2xl hover:shadow-3xl">
                🛒 View Cart
              </button>
            </div>
          </div>
        </div>
      )}

      {/* LOADING OVERLAY */}
      {isLoading && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="text-center">
            <div className="w-20 h-20 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin mx-auto mb-8"></div>
            <p className="text-2xl text-slate-400">Loading menu...</p>
          </div>
        </div>
      )}
    </div>
  )
}
