// src/components/OrderTracker.jsx
export default function OrderTracker({ order }) {
  const steps = ['confirmed', 'out-for-delivery', 'delivered'];
  const currentStep = steps.indexOf(order.status);

  return (
    <div className="bg-slate-900 p-8 rounded-3xl border border-slate-800">
      <h3 className="text-xl font-bold mb-6 text-center">Order Tracking</h3>

      <div className="space-y-6">
        {steps.map((step, index) => (
          <div key={step} className="flex items-center gap-4">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold
                ${index <= currentStep
                  ? 'bg-emerald-500 text-black'
                  : 'bg-slate-800 text-slate-400 border-2 border-slate-700'
                }`}
            >
              {index + 1}
            </div>

            <div className="flex-1">
              <div className="font-medium capitalize">
                {step === 'confirmed' && 'Order Confirmed'}
                {step === 'out-for-delivery' && 'On The Way'}
                {step === 'delivered' && 'Delivered'}
              </div>

              {index === currentStep && (
                <div className="text-emerald-400 text-sm">
                  {step === 'confirmed' && 'Restaurant is preparing your order...'}
                  {step === 'out-for-delivery' && 'Rider is on the way to you.'}
                  {step === 'delivered' && 'Order delivered. Enjoy your meal!'}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
