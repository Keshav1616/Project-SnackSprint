import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useApp } from '../hooks/useApp'
import { login } from '../store/appSlice'

export default function Signup({ onClose }) {
  const [form, setForm] = useState({ name: '', email: '', phone: '' })
  const dispatch = useDispatch()
  const app = useApp()

  const handleSubmit = (e) => {
    e.preventDefault()
    dispatch(login({
      name: form.name,
      email: form.email,
      phone: form.phone
    }))
    onClose?.()
  }

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-6">
      <div className="bg-slate-900 p-8 rounded-3xl max-w-md w-full space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
            Create Account
          </h2>
          <button onClick={onClose} className="text-2xl">×</button>
        </div>
        <form onSubmit={handleSubmit}>
          <input type="text" placeholder="Full Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full p-4 bg-slate-800 rounded-2xl border border-slate-600 focus:border-emerald-400" required />
          <input type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full p-4 bg-slate-800 rounded-2xl border border-slate-600 focus:border-emerald-400" required />
          <input type="tel" placeholder="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full p-4 bg-slate-800 rounded-2xl border border-slate-600 focus:border-emerald-400" required />
          <button type="submit" className="w-full py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-black font-bold text-lg rounded-2xl shadow-xl">
            Sign Up
          </button>
        </form>
      </div>
    </div>
  )
}
