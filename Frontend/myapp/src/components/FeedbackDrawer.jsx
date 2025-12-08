// src/components/FeedbackDrawer.jsx

import { useState } from 'react'
import { useApp } from '../hooks/useApp'

export default function FeedbackDrawer({ isOpen, onClose }) {
  const [rating, setRating] = useState(0)
  const [feedback, setFeedback] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const app = useApp()

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Feedback submitted:', { rating, feedback, user: app.user })
    setSubmitted(true)
    setTimeout(() => {
      setSubmitted(false)
      setRating(0)
      setFeedback('')
      onClose()
    }, 2000)
  }

  const stars = [1, 2, 3, 4, 5]

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="w-full max-w-md h-screen bg-gradient-to-b from-slate-950 to-slate-900 border-l border-slate-800 translate-x-full transition-transform duration-300 flex flex-col">
        <div className="p-6 border-b border-slate-800">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">💬 Feedback</h2>
            <button onClick={onClose} className="text-2xl text-slate-400 hover:text-white">
              ×
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {submitted ? (
            <div className="text-center py-12 space-y-4">
              <div className="text-5xl mb-4 text-emerald-400">✅</div>
              <h3 className="text-xl font-bold text-emerald-300">Thank you!</h3>
              <p className="text-slate-400">Your feedback has been received.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Stars */}
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">
                  Rate SnackSprint ⭐
                </label>
                <div className="flex gap-1">
                  {stars.map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className={`text-2xl transition-all ${
                        rating >= star ? 'text-yellow-400' : 'text-slate-600 hover:text-yellow-400'
                      }`}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>

              {/* Textarea */}
              <div>
                <textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="What do you love? What can we improve? Any suggestions..."
                  rows={6}
                  className="w-full p-4 bg-slate-900 rounded-2xl border border-slate-700 focus:border-emerald-400 resize-vertical outline-none text-slate-100"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={!rating || !feedback.trim()}
                className="w-full py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-black font-bold rounded-2xl shadow-xl disabled:opacity-50 hover:shadow-2xl transition-all"
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
