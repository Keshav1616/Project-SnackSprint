import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useApp } from '../hooks/useApp'
import { login } from '../store/appSlice'

export default function Login({ onClose }) {
  const [form, setForm] = useState({ email: '', password: '' })
  const dispatch = useDispatch()
  const app = useApp()

  const handleSubmit = (e) => {
    e.preventDefault()
    dispatch(login({
      name: form.email.split('@')[0],
      email: form.email
    }))
    onClose?.()
  }

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-6">
      <div className="bg-slate-900 p-8 rounded-3xl max-w-md w-full">
        <form onSubmit={handleSubmit} className="space-y-4">
          <h2 className="text-3xl font-bold text-center mb-8 bg-gradient-to-red from-emerald-400 to-teal-400 bg-clip-text text-transparent">
            Login
          </h2>
          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full p-4 bg-slate-800 rounded-2xl border border-slate-600 focus:border-emerald-400"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="w-full p-4 bg-slate-800 rounded-2xl border border-slate-600 focus:border-emerald-400"
            required
          />
          <button
            type="submit"
            className="w-full py-4 bg-gradient-to-red from-emerald-500 to-teal-500 text-black font-bold text-lg rounded-2xl shadow-xl"
          >
            🚀 Login
          </button>
        </form>
        <p className="text-center mt-6 text-sm text-slate-400">Demo: test@example.com</p>
      </div>
    </div>
  )
}
