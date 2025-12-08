import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Provider, useSelector } from 'react-redux'
import { store } from './store'
import Home from './components/Home'
import Favorites from './components/Favorites'
import Checkout from './components/Checkout'
import Support from './components/Support'
import AccountSidebar from './components/AccountSidebar'

//  AUTHGUARD COMPONENT
function AuthGuard({ children }) {
  const isLoggedIn = useSelector(state => state.app.isLoggedIn)
  
  return isLoggedIn ? children : <LoginFirstScreen />
}

//  LOGIN SCREEN
function LoginFirstScreen() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-8">
      <div className="max-w-md w-full space-y-8 text-center">
        <div className="w-28 h-28 mx-auto bg-gradient-to-br from-emerald-500 to-teal-500 rounded-3xl flex items-center justify-center shadow-2xl">
          <span className="text-5xl font-bold text-black">🍟</span>
        </div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-400 to-teal-500 bg-clip-text text-transparent">
          Welcome to SnackSprint
        </h1>
        <p className="text-xl text-slate-300">Login to enjoy fastest snack delivery</p>
        <button className="w-full py-5 bg-gradient-to-r from-emerald-500 to-teal-500 text-black font-bold text-xl rounded-3xl shadow-2xl hover:shadow-3xl">
          👤 Login / Signup
        </button>
      </div>
    </div>
  )
}

// ✅ MAINC CONTENT - YAHAN AUTHGUARD WRAP HOGA
function AppContent() {
  return (
    <div className="app font-sans">
      <AuthGuard>
        <AccountSidebar />
        <main className="md:ml-64 p-4 min-h-screen">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/support" element={<Support />} />
          </Routes>
        </main>
      </AuthGuard>
    </div>
  )
}

function App() {
  return (
    <Provider store={store}>
      <Router>
        <AppContent />
      </Router>
      <ChatBot />
    </Provider>
  )
}

export default App
