// src/components/ResaurantCard.jsx
import { useNavigate } from "react-router-dom";
import { useApp } from "../hooks/useApp";

export default function RestaurantCard({ restaurant, onClick }) {
  const navigate = useNavigate();
  const app = useApp();

  const id = restaurant.id || restaurant._id || restaurant.restaurantId;

  const isFavorite = app.favorites?.some((f) => f.id === id);

  const handleCardClick = () => {
    // YAHAN LOGIN CHECK
    if (!app.isLoggedIn) {
      // AccountSidebar ka auth modal open karao
      if (window.showAuthModal) {
        window.showAuthModal("login"); // optional mode
      } else {
        alert("Please login / signup first!");
      }
      return;
    }

    if (onClick) {
      onClick();
    } else {
      navigate(`/restaurant/${id}`);
    }
  };

  const handleToggleFavorite = (e) => {
    e.stopPropagation();
    e.preventDefault();
    app.toggleFavorite({
      ...restaurant,
      id, // ensure id set
    });
  };

  const rating = restaurant.rating || 4.2;
  const costForTwo = restaurant.costfortwo || 299;
  const deliveryText =
    restaurant.deliverytime?.text ||
    restaurant.deliverytime ||
    "30-40 mins";

  return (
    <div
      onClick={handleCardClick}
      className="group bg-slate-900 rounded-3xl border border-slate-800 overflow-hidden hover:border-emerald-500 hover:shadow-emerald-500/40 hover:shadow-xl transition-all cursor-pointer"
    >
      {/* Image section */}
      <div className="relative h-40 w-full overflow-hidden">
        <img
          src={restaurant.bannerimage || restaurant.image}
          alt={restaurant.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            e.target.src =
              "https://via.placeholder.com/400x200/020617/475569?text=Restaurant";
          }}
        />

        {/* Favourite heart */}
        <button
          onClick={handleToggleFavorite}
          className="absolute top-3 right-3 w-9 h-9 rounded-full bg-black/70 flex items-center justify-center text-sm shadow-lg hover:bg-black/90"
        >
          <span className={isFavorite ? "text-red-400" : "text-slate-300"}>
            {isFavorite ? "❤" : "♡"}
          </span>
        </button>
      </div>

      {/* Content */}
      <div className="p-4 space-y-2">
        <h3 className="font-bold text-lg text-slate-100 line-clamp-1">
          {restaurant.name}
        </h3>

        <div className="flex items-center gap-2 text-xs">
          <span className="px-2 py-0.5 rounded-md bg-emerald-500 text-black font-semibold flex items-center gap-1">
            ⭐ {rating}
          </span>
          <span className="text-slate-400">
            {deliveryText}
          </span>
        </div>

        <div className="flex items-center justify-between text-xs text-slate-400">
          <span>₹{costForTwo?.toLocaleString?.("en-IN") || costForTwo} for two</span>
          {restaurant.city && (
            <span>{restaurant.area || restaurant.city}</span>
          )}
        </div>

        <div className="text-[11px] text-slate-500 line-clamp-1">
          {Array.isArray(restaurant.cuisines)
            ? restaurant.cuisines.join(", ")
            : restaurant.cuisines}
        </div>

        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 text-xs text-emerald-400 mt-1">
          <span>Order Now</span>
          <span className="w-2 h-2 bg-emerald-400 rounded-full animate-ping" />
        </div>
      </div>
    </div>
  );
}
