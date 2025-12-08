// src/components/SupportPage.jsx

import Navbar from './Navbar'
import AccountSidebar from './AccountSidebar'
import { useCart } from '../hooks/useApp'

export default function SupportPage() {
  const cart = useCart()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white relative overflow-hidden">
      {/* Soft glowing blobs background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="w-72 h-72 bg-emerald-600/20 blur-3xl rounded-full absolute -top-10 -left-10 animate-pulse"></div>
        <div className="w-72 h-72 bg-blue-500/20 blur-3xl rounded-full absolute bottom-0 right-0 animate-pulse delay-300"></div>
      </div>

      {/* Sidebar */}
      <AccountSidebar />

      <div className="md:ml-64 relative z-10">
        <Navbar cartCount={cart.items?.length || 0} />
      </div>

      <div className="pt-24 pb-16 md:ml-64 relative z-10">
        <div className="max-w-3xl mx-auto px-6 space-y-10">

          {/* Heading */}
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-extrabold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent drop-shadow-lg">
              Contact & Help
            </h1>
            <p className="text-slate-400 text-sm">
              We’re here to help — anytime, anywhere.
            </p>
          </div>

          {/* Contact Support Card */}
          <div className="
            p-8 rounded-3xl
            bg-slate-900/60 
            backdrop-blur-xl
            border border-emerald-500/20 
            shadow-xl 
            hover:shadow-emerald-500/20 
            transition-all 
            hover:scale-[1.01]
            animate-fade-up
          ">
            <h2 className="text-xl font-bold text-emerald-300 flex items-center gap-2">
              <span className="text-2xl">📬</span>
              Contact Support
            </h2>

            <p className="text-sm text-slate-400 mt-2">
              If you run into any issue, drop us a message:
            </p>

            <a
              href="mailto:support@snacksprint.demo"
              className="
                inline-block mt-4 px-5 py-3 
                rounded-2xl 
                bg-gradient-to-r from-emerald-500 to-teal-500 
                text-black font-semibold text-sm
                shadow-lg hover:shadow-emerald-500/40 
                transition-all hover:scale-[1.03]
              "
            >
              support@snacksprint.demo
            </a>
          </div>

          {/* Quick Help Card */}
          <div className="
            p-8 rounded-3xl 
            bg-slate-900/60 
            backdrop-blur-xl 
            border border-slate-700/50 
            shadow-xl 
            hover:shadow-slate-500/10 
            transition-all hover:scale-[1.01]
            animate-fade-up delay-200
          ">
            <h2 className="text-xl font-bold text-sky-300 flex items-center gap-2">
              <span className="text-2xl">⚡</span>
              Quick Help
            </h2>

            <ul className="list-disc list-inside text-sm text-slate-300 space-y-2 mt-3 leading-relaxed">
              <li>
                Tap ❤️ on any restaurant card to add it to your favourites.
              </li>
              <li>
                Manage your delivery locations under <strong>Saved Addresses</strong>.
              </li>
              <li>
                Go to <strong>Checkout</strong>, pick an address, and choose your payment method.
              </li>
            </ul>
          </div>

        </div>
      </div>
    </div>
  )
}
