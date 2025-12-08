// import { useDispatch } from 'react-redux'
// import { useApp } from '../hooks/useApp'
// import RestaurantCard from './RestaurantCard'
// import { addItem } from '../store/cartSlice'

// export default function FavoritesList() {
//   const app = useApp()
//   const dispatch = useDispatch()

//   const handleQuickAdd = restaurant => {
//     const dishId = `${restaurant._id}-fav-${Date.now()}`
//     const dish = {
//       id: dishId,
//       _id: dishId,
//       restaurantId: restaurant._id,
//       restaurant: restaurant.name,
//       name: `${restaurant.name} Favorite Meal`,
//       price: (restaurant.cost_for_two || 300) / 2,
//       image: restaurant.image || restaurant.banner_image,
//       description: 'Popular dish from your favorite restaurant'
//     }
//     dispatch(addItem(dish))
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white pt-24 pb-12">
//       <div className="max-w-6xl mx-auto px-6 space-y-6">
//         <h2 className="text-3xl font-bold">
//           Favorites ({app.favorites?.length || 0})
//         </h2>

//         {(!app.favorites || app.favorites.length === 0) ? (
//           <div className="text-center py-20 text-slate-400">
//             No favorites yet. Tap the heart on any restaurant to add it here.
//           </div>
//         ) : (
//           <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
//             {app.favorites.map(r => (
//               <div key={r._id} className="space-y-3">
//                 <RestaurantCard restaurant={r} />
//                 <button
//                   onClick={() => handleQuickAdd(r)}
//                   className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-black font-semibold rounded-2xl shadow-lg hover:shadow-2xl hover:scale-[1.02] transition-all"
//                 >
//                   ➕ Add Popular Dish
//                 </button>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   )
// }
// src/components/FavoritesList.jsx

import Navbar from './Navbar'
import AccountSidebar from './AccountSidebar'
import { useApp, useCart } from '../hooks/useApp'
import RestaurantCard from './RestaurantCard'

export default function FavoritesList() {
  const app = useApp()
  const cart = useCart()

  const count = app.favorites?.length || 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      <AccountSidebar />

      <div className="md:ml-64">
        <Navbar cartCount={cart.items?.length || 0} />
      </div>

      <div className="pt-24 pb-12 md:ml-64">
        <div className="max-w-6xl mx-auto px-6 space-y-6">
          <h2 className="text-3xl font-bold">
            Favorites ({count})
          </h2>

          {count === 0 ? (
            <div className="text-center py-20 text-slate-400">
              No favorites yet. Tap the heart on any restaurant to add it here.
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {app.favorites.map(r => (
                <RestaurantCard key={r._id || r.id} restaurant={r} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}


