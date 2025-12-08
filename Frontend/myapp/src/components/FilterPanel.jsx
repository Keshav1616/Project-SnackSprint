export default function FilterPanel({ filters, setFilters }) {
  return (
    <div className="bg-slate-900/50 p-6 rounded-3xl border border-slate-800 space-y-4">
      <h3 className="font-bold text-xl">Filters</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Pure Veg', key: 'vegOnly' },
          { label: 'Under ₹200', key: 'maxPrice', value: 200 },
          { label: 'Fast Delivery', key: 'fastDelivery' },
          { label: 'Top Rated', key: 'topRated' }
        ].map(filter => (
          <button
            key={filter.key}
            onClick={() => setFilters(prev => ({ ...prev, [filter.key]: !prev[filter.key] }))}
            className={`p-4 rounded-2xl font-medium ${filters[filter.key] ? 'bg-emerald-500 text-black' : 'bg-slate-800 hover:bg-slate-700'}`}
          >
            {filter.label}
          </button>
        ))}
      </div>
    </div>
  )
}
