

import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { setViewMode } from '../store/appSlice'

export function useViewToggle() {
  const viewMode = useSelector(state => state.app.viewMode || 'card')
  const dispatch = useDispatch()  

  const toggleViewMode = () => {
    const newMode = viewMode === 'card' ? 'table' : 'card'
    dispatch(setViewMode(newMode))
  }

  return {
    viewMode,
    toggleViewMode,
    ViewToggleButton: () => (
      <button
        onClick={toggleViewMode}
        className="p-3 rounded-2xl bg-slate-800/50 hover:bg-slate-700 border border-slate-700 hover:border-emerald-500 text-slate-300 hover:text-emerald-400 transition-all flex items-center gap-2 text-sm font-medium shadow-md hover:shadow-lg"
      >
        {viewMode === 'card' ? (
          <>
             <span>Table View</span>
          </>
        ) : (
          <>
             <span>Card View</span>
          </>
        )}
      </button>
    )
  }
}
