import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { addItem } from '../store/cartSlice'
import Navbar from '../components/Navbar'

export default function MenuPage() {
  const { restaurantId } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const restaurants = useSelector(state => state.restaurants.data || [])
  const cart = useSelector(state => state.cart)

  const restaurant = restaurants.find(r => r._id === restaurantId)
  const [selectedCategory, setSelectedCategory] = useState('popular')

  // Mock menu items for this restaurant
  const menuItems = [
    { id: 'pizza1', name: `${restaurant?.name} Margherita Pizza`, price: 299, image: restaurant?.image, category: 'popular' },
    { id: 'pizza2', name: `${restaurant?.name} Pepperoni`, price: 349, image: restaurant?.image, category: 'popular' },
    { id: 'bread1', name: 'Garlic Bread', price: 149, image: restaurant?.image, category: 'sides' },
    { id: 'drink1', name: 'Cold Drink', price: 59, image: restaurant?.image, category: 'drinks' },
    { id: 'dessert1', name: 'Ice Cream', price: 99, image: restaurant?.image, category: 'desserts' }
  ]

  const filteredItems = menuItems.filter(item => 
    selectedCategory === 'all' || item.category === selectedCategory
  )

  if (!restaurant) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Restaurant not found</h1>
          <button onClick={() => navigate('/')} className="px-6 py-3 bg-emerald-500 text-black font-bold rounded-2xl">
            ← Back to Home
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Navbar cartCount={cart.items?.length || 0} />
      
      {/* Restaurant Header */}
      <div className="bg-gradient-to-r from-emerald-900/50 to-slate-900/50 border-b border-slate-800 p-8">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-8 items-center lg:items-start">
          <img src={restaurant.image} className="w-64 h-64 rounded-3xl object-cover shadow-2xl flex-shrink-0" alt={restaurant.name} />
          <div className="flex-1">
            <h1 className="text-4xl font-bold mb-4">{restaurant.name}</h1>
            <div className="flex flex-wrap gap-4 mb-6 text-lg">
              <div className="bg-emerald-500/20 px-4 py-2 rounded-xl">⭐ {restaurant.rating}</div>
              <div className="bg-slate-800/50 px-4 py-2 rounded-xl">🕒 30 min</div>
              <div className="bg-orange-500/20 px-4 py-2 rounded-xl text-orange-400">₹{restaurant.cost_for_two} for two</div>
            </div>
            <p className="text-slate-400 text-lg">{restaurant.cuisines?.join(', ')}</p>
          </div>
        </div>
      </div>

      {/* Menu Categories */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="flex flex-wrap gap-3 mb-8 pb-6 border-b border-slate-800">
          {['all', 'popular', 'sides', 'drinks', 'desserts'].map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-6 py-3 rounded-2xl font-medium transition-all ${
                selectedCategory === cat
                  ? 'bg-emerald-500 text-black shadow-lg'
                  : 'bg-slate-800/50 hover:bg-slate-700 text-slate-300'
              }`}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>

        {/* Menu Items */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredItems.map(item => (
            <div
              key={item.id}
              className="group bg-slate-900/50 p-6 rounded-3xl border border-slate-800 hover:border-emerald-400/50 hover:shadow-2xl transition-all cursor-pointer"
              onClick={() => dispatch(addItem({ ...item, restaurant: restaurant.name }))}
            >
              <img src={item.image} className="w-full h-48 rounded-2xl object-cover group-hover:scale-105 transition-transform mb-4" alt={item.name} />
              <h4 className="font-bold text-xl mb-2 line-clamp-1">{item.name}</h4>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-emerald-400">₹{item.price}</span>
                <button className="px-6 py-2 bg-emerald-500 text-black font-bold rounded-xl hover:bg-emerald-600 transition-all">
                  Add 🛒
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
