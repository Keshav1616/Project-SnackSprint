// src/components/AccountSidebar.jsx
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useApp } from "../hooks/useApp";
import OrdersPopup from "./OrdersPopup";

export default function AccountSidebar({ isMobileOpen = false, onCloseMobile }) {
  const navigate = useNavigate();
  const location = useLocation();
  const app = useApp();

  const [showFeedback, setShowFeedback] = useState(false);
  const [showAddresses, setShowAddresses] = useState(false);
  const [showContactHelp, setShowContactHelp] = useState(false);
  const [showFavorites, setShowFavorites] = useState(false);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showOrders, setShowOrders] = useState(false);

  const [isLogin, setIsLogin] = useState(true);
  const [authForm, setAuthForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const [addressForm, setAddressForm] = useState({
    id: Date.now(),
    name: "",
    address: "",
    city: "",
    pincode: "",
    phone: "",
    isDefault: false,
  });

  const [feedbackData, setFeedbackData] = useState({
    rating: 0,
    comment: "",
  });

  const [chatMessages, setChatMessages] = useState([
    {
      id: 1,
      text: "Hi! How can we help you today?",
      sender: "bot",
      time: "09:30",
    },
  ]);
  const [chatInput, setChatInput] = useState("");

  const isActive = (path) => location.pathname === path;

  const currentCity =
    app.currentAddress?.city || app.addresses?.[0]?.city || "";
  const currentPin =
    app.currentAddress?.pincode || app.addresses?.[0]?.pincode || "";

  // ------------ AUTH ------------
  const validateAuth = () => {
    const e = {};
    if (!authForm.email || !/\S+@\S+\.\S+/.test(authForm.email)) {
      e.email = "Valid email daalo.";
    }
    if (!authForm.password || authForm.password.length < 6) {
      e.password = "Password min 6 chars.";
    }
    if (!isLogin && (!authForm.name || authForm.name.trim().length < 2)) {
      e.name = "Naam required.";
    }
    if (!authForm.phone || !/^\d{10}$/.test(authForm.phone)) {
      e.phone = "10 digit phone daalo.";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (!validateAuth()) return;
    setLoading(true);
    setTimeout(() => {
      app.login({
        name: authForm.email.split("@")[0],
        email: authForm.email,
        phone: authForm.phone,
      });
      setLoading(false);
      setShowAuthModal(false);
      alert("Login successful!");
    }, 800);
  };

  const handleSignup = (e) => {
    e.preventDefault();
    if (!validateAuth()) return;
    setLoading(true);
    setTimeout(() => {
      app.login({
        name: authForm.name,
        email: authForm.email,
        phone: authForm.phone,
      });
      setLoading(false);
      setShowAuthModal(false);
      alert("Account created & logged in!");
    }, 800);
  };

  const toggleAuthMode = () => {
    setIsLogin((p) => !p);
    setAuthForm({ name: "", email: "", phone: "", password: "" });
    setErrors({});
  };

  useEffect(() => {
    window.showAuthModal = (mode = "login") => {
      setIsLogin(mode === "login");
      setShowAuthModal(true);
    };
  }, []);

  // ------------ ADDRESSES ------------
  const handleSaveAddress = (e) => {
    e.preventDefault();
    const fullAddress = {
      ...addressForm,
      timestamp: new Date().toISOString(),
    };
    app.saveAddress(fullAddress);
    setShowAddressForm(false);
    setAddressForm({
      id: Date.now(),
      name: "",
      address: "",
      city: "",
      pincode: "",
      phone: "",
      isDefault: false,
    });
  };

  const handleSelectAddress = (address) => {
    app.setCurrentAddress(address);
  };

  const handleShowAddressForm = () => {
    setShowAddressForm(true);
  };

  const handleCancelAddressForm = () => {
    setShowAddressForm(false);
  };

  // ------------ FEEDBACK ------------
  const handleFeedbackSubmit = (e) => {
    e.preventDefault();
    alert("Feedback saved! Thanks!");
    setShowFeedback(false);
    setFeedbackData({ rating: 0, comment: "" });
  };

  // ------------ CHAT ------------
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    const userMessage = {
      id: Date.now(),
      text: chatInput.trim(),
      sender: "user",
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
    setChatMessages((prev) => [...prev, userMessage]);
    setChatInput("");
    setTimeout(() => {
      const replies = [
        "Thanks for reaching out! We'll get back to you soon.",
        "Got it! Our team is looking into this.",
        "We're here to help! Anything else?",
      ];
      const reply =
        replies[Math.floor(Math.random() * replies.length)];
      const botMessage = {
        id: Date.now() + 1,
        text: reply,
        sender: "bot",
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setChatMessages((prev) => [...prev, botMessage]);
    }, 1000);
  };

  // ------------ COMMON INNER CONTENT ------------
  const sidebarContent = (
    <div className="flex flex-col h-full bg-gradient-to-b from-slate-950 to-slate-900 border-r border-slate-800">
      {/* USER INFO */}
      <div className="px-5 py-4 border-b border-slate-800 space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-sm font-bold text-black">
            {app.user?.name?.charAt(0)?.toUpperCase() || "G"}
          </div>
          <div className="text-xs">
            <p className="text-slate-400">Logged in as</p>
            <p className="text-sm font-semibold">
              {app.user?.name || "Guest"}
            </p>
            <p className="text-[11px] text-slate-500">
              {app.user?.email || ""}
            </p>
          </div>
        </div>
      </div>

      {/* BRAND + ADDRESS */}
      <div className="p-4 space-y-3">
        <div className="p-4 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-2xl border border-emerald-500/30 flex items-center justify-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg">
            <span className="text-2xl font-bold text-black">🍕</span>
          </div>
          <div className="text-center">
            <p className="text-sm font-bold text-emerald-300 tracking-wide">
              SnackSprint
            </p>
            <p className="text-xs text-emerald-200">Your snack buddy</p>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/30 space-y-2">
          <div className="flex items-center justify-between text-[11px] text-emerald-300">
            <span>Delivering to</span>
            <span className="font-semibold">
              {app.currentAddress?.name || "Set address"}
            </span>
          </div>
          <div className="text-xs text-emerald-200 truncate">
            {currentCity
              ? `${currentCity}${currentPin ? `, ${currentPin}` : ""}`
              : "Please set your delivery address"}
            {app.currentAddress?.address && (
              <>
                <br className="md:hidden" />
                {app.currentAddress.address}
              </>
            )}
          </div>
        </div>
      </div>

      {/* NAVIGATION */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2 text-sm">
        <button
          onClick={() => navigate("/")}
          className={`w-full text-left p-3 rounded-2xl flex items-center gap-2 transition-all ${
            isActive("/")
              ? "bg-emerald-500/20 border border-emerald-500"
              : "bg-slate-800/70 hover:bg-slate-700 border border-transparent"
          }`}
        >
          <span>🏠</span>
          <span>Home</span>
        </button>

        <button
          onClick={() => setShowFavorites(true)}
          className={`w-full flex items-center justify-between p-3 rounded-2xl transition-all ${
            isActive("favorites")
              ? "bg-emerald-500/20 border border-emerald-500"
              : "bg-slate-800/70 hover:bg-slate-700 border border-transparent"
          }`}
        >
          <span className="flex items-center gap-2">
            <span>❤️</span>
            <span>Favorites</span>
          </span>
          <span className="text-xs bg-black/50 px-2 py-0.5 rounded-xl">
            {app.favorites?.length || 0}
          </span>
        </button>

        <button
          onClick={() => setShowAddresses(true)}
          className={`w-full flex items-center justify-between p-3 rounded-2xl transition-all ${
            isActive("addresses")
              ? "bg-emerald-500/20 border border-emerald-500"
              : "bg-slate-800/70 hover:bg-slate-700 border border-transparent"
          }`}
        >
          <span className="flex items-center gap-2">
            <span>📍</span>
            <span>Saved Addresses</span>
          </span>
          <span className="text-xs text-slate-400">
            {app.addresses?.length || 0}
          </span>
        </button>

        <button
          onClick={() => setShowContactHelp(true)}
          className={`w-full flex items-center gap-2 p-3 rounded-2xl transition-all ${
            isActive("support")
              ? "bg-emerald-500/20 border border-emerald-500"
              : "bg-slate-800/70 hover:bg-slate-700 border border-transparent"
          }`}
        >
          <span>💬</span>
          <span>Contact Help</span>
        </button>

        <button
          onClick={() => setShowFeedback(true)}
          className="w-full flex items-center gap-2 p-3 rounded-2xl mt-3 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 hover:from-yellow-500/30 hover:to-orange-500/30 border border-yellow-500/50 transition-all"
        >
          <span>⭐</span>
          <span>Share Feedback</span>
        </button>

        <button
          onClick={() => setShowOrders(true)}
          className="w-full flex items-center justify-between p-3 rounded-2xl transition-all bg-slate-800/70 hover:bg-slate-700 border border-transparent"
        >
          <span className="flex items-center gap-2">
            <span>📦</span>
            <span>My Orders</span>
          </span>
          <span className="text-xs text-slate-400">
            {app.orders?.length || 0}
          </span>
        </button>
      </div>

      {/* FOOTER */}
      <div className="p-4 space-y-3 border-t border-slate-800">
        <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-700 text-[11px] text-slate-400 space-y-2">
          <p className="font-semibold text-slate-100 flex items-center gap-1 text-sm">
            SnackSprint
          </p>
          <p className="font-medium text-slate-200">
            Fast Food Delivery App
          </p>
          <div className="space-y-1 text-[10px]">
            <p>Lightning fast snacks delivery</p>
            <p>Available in your city</p>
            <p>Service 9 AM - 11 PM</p>
          </div>
        </div>

        {app.isLoggedIn ? (
          <button
            onClick={app.logout}
            className="w-full py-3 rounded-2xl bg-red-500/80 hover:bg-red-500 text-black font-semibold text-sm"
          >
            Logout
          </button>
        ) : (
          <button
            onClick={() => setShowAuthModal(true)}
            className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-black font-bold text-sm rounded-2xl shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all"
          >
            Login / Signup
          </button>
        )}
      </div>

      {/* FAVORITES POPUP */}
      {showFavorites && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 rounded-3xl w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col border border-slate-700">
            <div className="p-6 border-b border-slate-800 sticky top-0 bg-slate-900 z-10 flex items-center justify-between">
              <h2 className="text-2xl font-bold">Your Favorites</h2>
              <button
                onClick={() => setShowFavorites(false)}
                className="text-2xl text-slate-400 hover:text-white"
              >
                ×
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {(!app.favorites || app.favorites.length === 0) ? (
                <div className="text-center py-12 text-slate-400 space-y-4">
                  <div className="text-5xl mx-auto mb-4">❤️</div>
                  <h3 className="text-xl font-bold text-slate-200 mb-2">
                    No favorites yet
                  </h3>
                  <p className="text-sm">
                    Tap on restaurants to save them here
                  </p>
                  <button
                    onClick={() => {
                      setShowFavorites(false);
                      navigate("/");
                    }}
                    className="px-8 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-black font-bold rounded-2xl"
                  >
                    Find Restaurants
                  </button>
                </div>
              ) : (
                <>
                  <h3 className="text-lg font-semibold text-slate-200 px-2">
                    Saved Restaurants ({app.favorites.length})
                  </h3>
                  {app.favorites.map((restaurant) => (
                    <div
                      key={restaurant.id}
                      className="p-4 rounded-2xl border-2 border-slate-700/50 bg-slate-900/50 hover:border-red-400/50 hover:shadow-lg transition-all group flex items-start justify-between gap-3"
                    >
                      <div className="flex items-center gap-3 flex-1">
                        <div className="w-12 h-12 rounded-xl overflow-hidden bg-gradient-to-br from-rose-500/20 to-pink-500/20 flex-shrink-0">
                          <img
                            src={restaurant.image}
                            alt={restaurant.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h4 className="font-bold text-lg text-slate-100 truncate">
                            {restaurant.name}
                          </h4>
                          <p className="text-emerald-400 text-sm font-semibold">
                            {restaurant.rating}
                          </p>
                          <p className="text-slate-400 text-xs">
                            {restaurant.time} • {restaurant.distance}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => app.toggleFavorite(restaurant)}
                        className="ml-3 p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl transition-all group-hover:scale-110"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ADDRESSES POPUP */}
      {showAddresses && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 rounded-3xl w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col border border-slate-700">
            <div className="p-6 border-b border-slate-800 sticky top-0 bg-slate-900 z-10 flex items-center justify-between">
              <h2 className="text-2xl font-bold">Saved Addresses</h2>
              <button
                onClick={() => {
                  setShowAddresses(false);
                  setShowAddressForm(false);
                }}
                className="text-2xl text-slate-400 hover:text-white"
              >
                ×
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {!showAddressForm && (
                <button
                  onClick={handleShowAddressForm}
                  className="w-full p-4 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border-2 border-dashed border-emerald-500 text-emerald-300 hover:bg-emerald-500/30 rounded-2xl font-medium transition-all"
                >
                  Add New Address
                </button>
              )}

              {!showAddressForm &&
                app.addresses?.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-slate-200 px-2">
                      Your Addresses
                    </h3>
                    {app.addresses.map((address) => (
                      <div
                        key={address.id}
                        onClick={() => handleSelectAddress(address)}
                        className={`p-4 rounded-2xl border-2 transition-all cursor-pointer hover:shadow-lg ${
                          app.currentAddress?.id === address.id
                            ? "border-emerald-500 bg-emerald-500/10 shadow-emerald-500/25 ring-2 ring-emerald-500/30"
                            : "border-slate-700/50 hover:border-emerald-400/50 bg-slate-900/50"
                        }`}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-bold text-lg">
                            {address.name}
                          </h4>
                          {address.isDefault && (
                            <span className="px-3 py-1 bg-emerald-500 text-black text-xs font-bold rounded-full">
                              DEFAULT
                            </span>
                          )}
                        </div>
                        <p className="text-slate-300 text-sm mb-1">
                          {address.address}
                        </p>
                        <p className="text-slate-400 text-xs">
                          {address.city} - {address.pincode} •{" "}
                          {address.phone}
                        </p>
                      </div>
                    ))}
                  </div>
                )}

              {!showAddressForm &&
                (!app.addresses || app.addresses.length === 0) && (
                  <div className="text-center py-12 text-slate-400 space-y-4">
                    <div className="text-5xl mx-auto mb-4">📍</div>
                    <h3 className="text-xl font-bold text-slate-200 mb-2">
                      No addresses saved
                    </h3>
                    <p className="text-sm">
                      Add your first delivery location
                    </p>
                  </div>
                )}

              {showAddressForm && (
                <div className="p-6 border-t border-slate-800 bg-slate-950/50 flex-shrink-0">
                  <h3 className="text-xl font-bold mb-6 text-slate-100">
                    Add New Address
                  </h3>
                  <form
                    onSubmit={handleSaveAddress}
                    className="space-y-4"
                  >
                    <input
                      type="text"
                      placeholder="Home / Office / Friends"
                      value={addressForm.name}
                      onChange={(e) =>
                        setAddressForm({
                          ...addressForm,
                          name: e.target.value,
                        })
                      }
                      className="w-full p-4 bg-slate-800 rounded-2xl border border-slate-600 focus:border-emerald-400 text-sm outline-none"
                      required
                    />
                    <input
                      type="text"
                      placeholder="House No, Street, Landmark"
                      value={addressForm.address}
                      onChange={(e) =>
                        setAddressForm({
                          ...addressForm,
                          address: e.target.value,
                        })
                      }
                      className="w-full p-4 bg-slate-800 rounded-2xl border border-slate-600 focus:border-emerald-400 text-sm outline-none"
                      required
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <input
                        type="text"
                        placeholder="City"
                        value={addressForm.city}
                        onChange={(e) =>
                          setAddressForm({
                            ...addressForm,
                            city: e.target.value,
                          })
                        }
                        className="w-full p-4 bg-slate-800 rounded-2xl border border-slate-600 focus:border-emerald-400 text-sm outline-none"
                        required
                      />
                      <input
                        type="text"
                        placeholder="Pincode"
                        value={addressForm.pincode}
                        onChange={(e) =>
                          setAddressForm({
                            ...addressForm,
                            pincode: e.target.value,
                          })
                        }
                        className="w-full p-4 bg-slate-800 rounded-2xl border border-slate-600 focus:border-emerald-400 text-sm outline-none"
                        required
                      />
                    </div>
                    <input
                      type="tel"
                      placeholder="Phone Number"
                      value={addressForm.phone}
                      onChange={(e) =>
                        setAddressForm({
                          ...addressForm,
                          phone: e.target.value,
                        })
                      }
                      className="w-full p-4 bg-slate-800 rounded-2xl border border-slate-600 focus:border-emerald-400 text-sm outline-none"
                      required
                    />
                    <div className="flex gap-3 pt-2">
                      <button
                        type="submit"
                        className="flex-1 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-black font-bold rounded-2xl shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all text-sm"
                      >
                        Save Address
                      </button>
                      <button
                        type="button"
                        onClick={handleCancelAddressForm}
                        className="flex-1 py-4 border-2 border-slate-600 rounded-2xl hover:bg-slate-800 transition-all text-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* CONTACT HELP POPUP */}
      {showContactHelp && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 rounded-3xl w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col border border-slate-700">
            <div className="p-6 border-b border-slate-800 sticky top-0 bg-slate-900 z-10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center text-xl">
                  💬
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-100">
                    SnackSprint Support
                  </h2>
                  <p className="text-sm text-slate-400">
                    Online 24/7
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowContactHelp(false)}
                className="text-2xl text-slate-400 hover:text-white"
              >
                ×
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gradient-to-b from-slate-900/50 to-slate-950">
              {chatMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${
                    msg.sender === "user"
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                      msg.sender === "user"
                        ? "bg-emerald-500 text-black"
                        : "bg-slate-800/50 text-slate-200 border border-slate-700/50"
                    }`}
                  >
                    <p className="text-sm">{msg.text}</p>
                    <p
                      className={`text-xs mt-1 ${
                        msg.sender === "user"
                          ? "text-emerald-300/80"
                          : "text-slate-500"
                      }`}
                    >
                      {msg.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-6 border-t border-slate-800 bg-slate-950/50 flex-shrink-0">
              <form
                onSubmit={handleSendMessage}
                className="flex gap-3"
              >
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 p-4 bg-slate-800 rounded-3xl border border-slate-600 focus:border-emerald-400 text-sm outline-none placeholder-slate-500"
                />
                <button
                  type="submit"
                  disabled={!chatInput.trim()}
                  className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-500 text-black rounded-3xl font-bold shadow-xl hover:shadow-2xl hover:scale-105 transition-all disabled:opacity-50 flex items-center justify-center"
                >
                  ➤
                </button>
              </form>
              <p className="text-xs text-slate-500 text-center mt-2">
                Support available 24/7
              </p>
            </div>
          </div>
        </div>
      )}

      {/* FEEDBACK POPUP */}
      {showFeedback && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 p-8 rounded-3xl max-w-md w-full max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Feedback</h2>
              <button
                onClick={() => setShowFeedback(false)}
                className="text-2xl text-slate-400 hover:text-white"
              >
                ×
              </button>
            </div>
            <form
              onSubmit={handleFeedbackSubmit}
              className="space-y-6"
            >
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-3">
                  Rate us
                </label>
                <div className="flex gap-2 justify-center">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() =>
                        setFeedbackData({
                          ...feedbackData,
                          rating: n,
                        })
                      }
                      className={`text-3xl transition-all ${
                        feedbackData.rating >= n
                          ? "text-yellow-400"
                          : "text-slate-600 hover:text-yellow-400"
                      }`}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <textarea
                  value={feedbackData.comment}
                  onChange={(e) =>
                    setFeedbackData({
                      ...feedbackData,
                      comment: e.target.value,
                    })
                  }
                  placeholder="What do you think? Love it? Suggestions?"
                  rows={4}
                  className="w-full p-4 bg-slate-800 rounded-2xl border border-slate-600 focus:border-emerald-400 resize-none text-sm outline-none"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={
                  !feedbackData.rating ||
                  !feedbackData.comment.trim()
                }
                className="w-full py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-black font-bold rounded-2xl shadow-xl disabled:opacity-50 hover:shadow-2xl transition-all"
              >
                Send Feedback
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ORDERS POPUP */}
      {showOrders && (
        <OrdersPopup
          isOpen={showOrders}
          onClose={() => setShowOrders(false)}
        />
      )}

      {/* AUTH MODAL */}
      {showAuthModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 rounded-3xl w-full max-w-md max-h-[85vh] overflow-hidden flex flex-col border border-slate-700">
            <div className="p-6 border-b border-slate-800 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-slate-100">
                {isLogin ? "Login" : "Create Account"}
              </h2>
              <button
                onClick={() => setShowAuthModal(false)}
                className="text-2xl text-slate-400 hover:text-white"
              >
                ×
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              <form
                onSubmit={isLogin ? handleLogin : handleSignup}
                className="space-y-4"
              >
                {!isLogin && (
                  <>
                    <input
                      type="text"
                      placeholder="Full Name"
                      value={authForm.name}
                      onChange={(e) =>
                        setAuthForm({
                          ...authForm,
                          name: e.target.value,
                        })
                      }
                      className={`w-full p-4 bg-slate-800 rounded-2xl border ${
                        errors.name
                          ? "border-red-500"
                          : "border-slate-600 focus:border-emerald-400"
                      } text-sm outline-none`}
                    />
                    {errors.name && (
                      <p className="text-red-400 text-xs">
                        {errors.name}
                      </p>
                    )}
                  </>
                )}

                <input
                  type="email"
                  placeholder="Email"
                  value={authForm.email}
                  onChange={(e) =>
                    setAuthForm({
                      ...authForm,
                      email: e.target.value,
                    })
                  }
                  className={`w-full p-4 bg-slate-800 rounded-2xl border ${
                    errors.email
                      ? "border-red-500"
                      : "border-slate-600 focus:border-emerald-400"
                  } text-sm outline-none`}
                />
                {errors.email && (
                  <p className="text-red-400 text-xs">
                    {errors.email}
                  </p>
                )}

                <input
                  type="tel"
                  placeholder="Phone"
                  value={authForm.phone}
                  onChange={(e) =>
                    setAuthForm({
                      ...authForm,
                      phone: e.target.value,
                    })
                  }
                  className={`w-full p-4 bg-slate-800 rounded-2xl border ${
                    errors.phone
                      ? "border-red-500"
                      : "border-slate-600 focus:border-emerald-400"
                  } text-sm outline-none`}
                />
                {errors.phone && (
                  <p className="text-red-400 text-xs">
                    {errors.phone}
                  </p>
                )}

                <input
                  type="password"
                  placeholder="Password"
                  value={authForm.password}
                  onChange={(e) =>
                    setAuthForm({
                      ...authForm,
                      password: e.target.value,
                    })
                  }
                  className={`w-full p-4 bg-slate-800 rounded-2xl border ${
                    errors.password
                      ? "border-red-500"
                      : "border-slate-600 focus:border-emerald-400"
                  } text-sm outline-none`}
                />
                {errors.password && (
                  <p className="text-red-400 text-xs">
                    {errors.password}
                  </p>
                )}

                <div className="text-center py-1">
                  <button
                    type="button"
                    onClick={toggleAuthMode}
                    className="text-emerald-400 text-sm underline hover:text-emerald-300"
                  >
                    {isLogin
                      ? "Don't have an account? Signup"
                      : "Already have an account? Login"}
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-black font-bold text-lg rounded-3xl shadow-2xl disabled:opacity-50 flex items-center justify-center gap-3"
                >
                  {loading
                    ? isLogin
                      ? "Logging in..."
                      : "Creating..."
                    : isLogin
                    ? "Login"
                    : "Create Account"}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  // ------------ RETURN: DESKTOP + MOBILE DRAWER ------------
  return (
    <>
      {/* Desktop fixed sidebar */}
      <aside className="hidden md:flex fixed left-0 top-0 h-screen w-64 z-30">
        {sidebarContent}
      </aside>

      {/* Mobile drawer */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={onCloseMobile}
          />
          <div className="absolute left-0 top-0 h-full w-64 bg-slate-950 shadow-2xl">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}
