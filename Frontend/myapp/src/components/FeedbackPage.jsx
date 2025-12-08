// src/components/FeedbackPage.jsx

import { useState } from 'react'
import Navbar from './Navbar'
import AccountSidebar from './AccountSidebar'
import { useApp, useCart } from '../hooks/useApp'

export default function FeedbackPage() {
  const [rating, setRating] = useState(0)
  const [feedback, setFeedback] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const cart = useCart()
  const app = useApp()

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Feedback:', { rating, feedback, user: app.user })
    setSubmitted(true)
  }

  const stars = [1, 2, 3, 4, 5]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      <AccountSidebar />

      <div className="md:ml-64">
        <Navbar cartCount={cart.items?.length || 0} />
      </div>

      <div className="pt-24 pb-12 md:ml-64">
        <div className="max-w-2xl mx-auto px-6 space-y-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold">Feedback & Suggestions</h1>
            <p className="text-sm text-slate-400">
              Help us improve SnackSprint! Your feedback matters.
            </p>
          </div>

          {submitted ? (
            <div className="bg-emerald-500/20 border border-emerald-500/50 rounded-3xl p-8 text-center">
              <div className="text-5xl mb-4">✅</div>
              <h2 className="text-2xl font-bold mb-2">Thank you!</h2>
              <p className="text-slate-300 mb-6">Your feedback has been submitted.</p>
              <button
                onClick={() => window.history.back()}
                className="px-8 py-3 bg-emerald-500 text-black font-bold rounded-2xl hover:shadow-xl"
              >
                Back to Home
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6 bg-slate-900/60 border border-slate-800 rounded-3xl p-8">
              {/* Rating Stars */}
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-3">
                  How would you rate SnackSprint? ⭐
                </label>
                <div className="flex gap-1">
                  {stars.map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className={`text-2xl transition-all ${
                        rating >= star
                          ? 'text-yellow-400'
                          : 'text-slate-600 hover:text-yellow-400'
                      }`}
                    >
                      ★
                    </button>
                  ))}
                </div>
                <p className={`text-sm mt-1 ${rating ? 'text-emerald-400' : 'text-slate-500'}`}>
                  {rating ? `Rating: ${rating}/5` : 'Select your rating'}
                </p>
              </div>

              {/* Feedback textarea */}
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-3">
                  What do you think?
                </label>
                <textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="What went well? What can we improve? Any suggestions..."
                  rows={5}
                  className="w-full p-4 bg-slate-800 rounded-2xl border border-slate-700 focus:border-emerald-400 resize-vertical outline-none text-slate-100"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={!rating || !feedback.trim()}
                className="w-full py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-black font-bold text-lg rounded-3xl shadow-xl disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-2xl transition-all"
              >
                Send Feedback
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
