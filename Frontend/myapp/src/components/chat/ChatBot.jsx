// src/components/chat/ChatBot.jsx
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addMessage } from '../../store/chatSlice';
import { clearCart } from '../../store/cartSlice';
import { handleChatQuestion } from './ChatLogic';
import ChatHistory from './ChatHistory';
import { useApp } from '../../hooks/useApp';

export default function ChatBot() {
  const [input, setInput] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart);
  const app = useApp();
  const restaurants = useSelector((state) => state.restaurants.data);

  // jab first time open ho, ek welcome auto reply
  useEffect(() => {
    if (!isOpen) return;

    setIsTyping(true);
    const t = setTimeout(() => {
      dispatch(
        addMessage({
          question: '—', // system msg
          answer:
            'Hi! Main SnackSprint bot hoon. Cart total, items, favourites, saved address, orders sab bata sakta hoon.',
        })
      );
      setIsTyping(false);
    }, 600);

    return () => clearTimeout(t);
  }, [isOpen, dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const question = input.trim();
    if (!question) return;

    setInput('');
    setIsTyping(true);

    // thoda delay de response ke liye
    setTimeout(() => {
      const { answer, action } = handleChatQuestion(
        question,
        cart,
        app,
        restaurants
      );

      // yahan side-effects / Redux actions handle karo
      if (action) {
        switch (action.type) {
          case 'CLEAR_CART':
            dispatch(clearCart());
            break;
          // future ke liye:
          // case 'REMOVE_ITEM':
          //   dispatch(removeItem(action.payload.id));
          //   break;
          // case 'ADD_ITEM':
          //   dispatch(addItem(action.payload.item));
          //   break;
          default:
            break;
        }
      }

      dispatch(addMessage({ question, answer }));
      setIsTyping(false);
    }, 600);
  };

  return (
    <>
      {/* Floating button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 shadow-2xl flex items-center justify-center text-2xl hover:scale-110 transition-transform"
        >
          💬
        </button>
      )}

      {/* Chat window */}
      {isOpen && (
        <div
          className="fixed bottom-6 right-6 w-96 max-w-[90vw] bg-slate-900/95 text-white rounded-3xl shadow-2xl border border-emerald-500/40 z-40 overflow-hidden backdrop-blur-xl"
          style={{ animation: 'chatFadeInUp 0.25s ease-out' }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-emerald-500/90 to-teal-500/90">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-black/20 flex items-center justify-center text-lg">
                🤖
              </div>
              <div>
                <div className="text-sm font-bold">SnackSprint Assistant</div>
                <div className="text-[10px] text-black/80 font-semibold">
                  Live cart, favourites &amp; orders helper
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="w-7 h-7 rounded-full bg-black/20 flex items-center justify-center text-sm hover:bg-black/30"
            >
              ✕
            </button>
          </div>

          {/* History */}
          <div className="h-72 max-h-[60vh] overflow-y-auto bg-slate-950/70 px-3 py-2 space-y-2 custom-scrollbar">
            <ChatHistory isTyping={isTyping} />
          </div>

          {/* Input */}
          <form
            onSubmit={handleSubmit}
            className="p-3 border-t border-slate-800 bg-slate-900/90"
          >
            <div className="flex items-center gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1 bg-slate-800 rounded-2xl px-3 py-2 text-xs outline-none border border-slate-700 focus:border-emerald-500"
                placeholder="Type your question here..."
              />
              <button
                type="submit"
                className="px-3 py-2 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-black text-xs font-semibold hover:scale-105 transition-transform"
                disabled={!input.trim() || isTyping}
              >
                ➤
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
