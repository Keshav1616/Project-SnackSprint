// src/components/Navbar.jsx
import { useNavigate } from "react-router-dom";
import { useApp, useCart } from "../hooks/useApp";

export default function Navbar({
  cartCount = 0,
  onCartClick,
  onOrdersClick,
  onAccountClick,      // mobile & desktop account open
  onMenuClick,         // NEW: mobile sidebar hamburger
}) {
  const navigate = useNavigate();
  const app = useApp();
  const cart = useCart();

  return (
    <nav className="fixed top-0 inset-x-0 z-40 bg-slate-950/80 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {/* HAMBURGER - sirf mobile */} 
          <button
            className="md:hidden w-9 h-9 mr-1 flex items-center justify-center rounded-full bg-slate-800 text-slate-200"
            onClick={onMenuClick}
          >
            ☰
          </button>

          {/* Logo */}
          <button
            onClick={() => navigate("/")}
            className="text-2xl font-black bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent"
          >
            SnackSprint
          </button>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-3">
          {/* Mobile account quick button */}
          <button
            className="md:hidden w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center text-slate-200"
            onClick={onAccountClick}
          >
            {app.user?.name?.charAt(0)?.toUpperCase() || "G"}
          </button>

          {/* Desktop account */}
          <button
            onClick={onAccountClick}
            className="hidden md:flex px-4 py-2 rounded-2xl bg-slate-800 hover:bg-slate-700 text-sm items-center gap-2"
          >
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-xs font-bold text-black">
              {app.user?.name?.charAt(0)?.toUpperCase() || "G"}
            </div>
            <span>{app.user?.name || "Account"}</span>
          </button>

          {/* Orders (desktop) */}
            

          {/* Cart */}
          <button
            onClick={onCartClick}
            className="relative px-3 sm:px-4 py-2 rounded-2xl bg-emerald-500 text-black font-semibold flex items-center gap-2"
          >
            <span>🛒</span>
            <span className="hidden sm:inline">Cart</span>
            <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] rounded-full bg-black text-[10px] flex items-center justify-center text-emerald-400 font-bold">
              {cartCount || cart.items?.length || 0}
            </span>
          </button>
        </div>
      </div>
    </nav>
  );
}
