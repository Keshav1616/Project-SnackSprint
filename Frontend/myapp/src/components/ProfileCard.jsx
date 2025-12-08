import { useApp } from '../hooks/useApp'

export default function ProfileCard({ user, points }) {
  return (
    <div className="max-w-md mx-auto bg-gradient-to-br from-slate-900 to-slate-800 p-8 rounded-3xl border border-slate-700 text-center">
      <div className="w-24 h-24 bg-emerald-500 rounded-full mx-auto mb-6 flex items-center justify-center">
        <span className="text-3xl font-bold">👤</span>
      </div>
      <h2 className="text-3xl font-bold mb-2">{user?.name || 'Guest'}</h2>
      <p className="text-slate-400 mb-6">{user?.email || 'Sign in to continue'}</p>
      <div className="space-y-4 mb-8">
        <div className="flex justify-between p-4 bg-slate-800 rounded-2xl">
          <span>Loyalty Points</span>
          <span className="font-bold text-emerald-400">{points}</span>
        </div>
        <div className="flex justify-between p-4 bg-slate-800 rounded-2xl">
          <span>Total Orders</span>
          <span>0</span>
        </div>
      </div>
      <button className="w-full py-4 bg-emerald-500 text-black font-bold rounded-2xl shadow-xl">Edit Profile</button>
    </div>
  )
}
