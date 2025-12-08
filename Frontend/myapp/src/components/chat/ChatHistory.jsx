// src/components/chat/ChatHistory.jsx
import { useSelector } from 'react-redux'

export default function ChatHistory({ isTyping }) {
  const messages = useSelector(state => state.chat.messages)

  if (!messages.length && !isTyping) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-[11px] text-slate-400 text-center px-4">
        <div className="text-3xl mb-2">👋</div>
        <p>Hi! I am your SnackSprint assistant.</p>
        <p className="mt-1 text-emerald-300">
          Ask about <span className="font-semibold">cart total, cart items, favourites, saved address</span>
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-2 text-[11px]">
      {messages.map((m, index) => (
        <div key={index} className="space-y-1 animate-[bubbleIn_0.18s_ease-out]">
          <div className="flex justify-end">
            <div className="max-w-[80%] bg-emerald-600 text-white px-3 py-2 rounded-2xl rounded-br-sm">
              {m.question}
            </div>
          </div>
          <div className="flex justify-start">
            <div className="max-w-[80%] bg-slate-800 text-slate-100 px-3 py-2 rounded-2xl rounded-bl-sm flex gap-1">
              <span>🤖</span>
              <span>{m.answer}</span>
            </div>
          </div>
        </div>
      ))}

      {/* typing indicator */}
      {isTyping && (
        <div className="flex justify-start mt-1">
          <div className="inline-flex items-center gap-1 bg-slate-800/80 text-slate-300 px-3 py-2 rounded-2xl rounded-bl-sm">
            <span className="text-xs mr-1">🤖</span>
            <div className="flex gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-300 typing-dot"></span>
              <span className="w-1.5 h-1.5 rounded-full bg-slate-300 typing-dot"></span>
              <span className="w-1.5 h-1.5 rounded-full bg-slate-300 typing-dot"></span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
