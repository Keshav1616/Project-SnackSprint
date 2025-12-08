// src/components/chat/ChatLogic.jsx

export function handleChatQuestion(question, cart, app, restaurants) {
  if (!question) {
    return {
      answer: 'Question empty aa rahi hai, dobara type karo.',
      action: null,
    };
  }

  const q = question.toLowerCase().trim();


      // ---------- TRACK ORDER ----------
  if (
    q.includes("track order") ||
    q.includes("where is my order") ||
    q.includes("order kaha") ||
    q.includes("track karo")
  ) {
    return {
      answer:
        "Your order can be tracked from the 'My Orders' section. Real-time updates like preparing, out for delivery, and arrival time will show up there.",
      action: { type: "OPEN_ORDERS" },
    };
  }

  // ---------- DELIVERY BOY CONTACT ----------
  if (
    q.includes("delivery boy") ||
    q.includes("driver number") ||
    q.includes("rider contact")
  ) {
    return {
      answer:
        "Once your order is out for delivery, the rider’s contact number becomes visible in the order details. Check the ‘My Orders’ page.",
      action: null,
    };
  }

  // ---------- PAYMENT METHODS ----------
  if (
    q.includes("payment") ||
    q.includes("pay kaise") ||
    q.includes("methods") ||
    q.includes("options")
  ) {
    return {
      answer:
        "We support UPI, Wallets, Credit/Debit cards, and Cash on Delivery. You can choose your method during checkout.",
      action: null,
    };
  }

  // ---------- COD AVAILABLE? ----------
  if (q.includes("cod") || q.includes("cash on delivery")) {
    return {
      answer:
        "Yes, Cash on Delivery is available for most areas. If COD isn’t shown, it means the restaurant or zone doesn’t support it.",
      action: null,
    };
  }

  // ---------- REFUNDS TIMING ----------
  if (q.includes("refund") || q.includes("money back")) {
    return {
      answer:
        "Refunds usually take 2–5 business days depending on your bank. We notify you as soon as it's processed.",
      action: null,
    };
  }

  // ---------- CANCEL ORDER ----------
  if (q.includes("cancel") && q.includes("order")) {
    return {
      answer:
        "If your order hasn’t been accepted by the restaurant yet, you can cancel it from the 'My Orders' page instantly.",
      action: { type: "OPEN_ORDERS" },
    };
  }

  // ---------- EDIT ORDER ----------
  if (q.includes("edit") && q.includes("order")) {
    return {
      answer:
        "Order editing isn't supported once placed, but you can cancel it before confirmation and reorder with changes.",
      action: null,
    };
  }

  // ---------- RESTAURANT OPEN/CLOSE ----------
  if (q.includes("open") && q.includes("restaurant")) {
    return {
      answer:
        "Restaurant timings vary. Each restaurant card shows its current status — open, closing soon, or temporarily unavailable.",
      action: null,
    };
  }

  // ---------- SPICY FOOD ----------
  if (q.includes("spicy") || q.includes("spice level")) {
    return {
      answer:
        "Most restaurants mention spice levels in their descriptions. If not, medium spice is the default for most dishes.",
      action: null,
    };
  }

  // ---------- ORDER ETA REAL ----------
  if (q.includes("eta") || q.includes("exact time")) {
    return {
      answer:
        "Delivery ETA updates dynamically depending on restaurant load and traffic. The most accurate ETA is visible on the live order tracking screen.",
      action: null,
    };
  }

  // ---------- RECOMMEND FAST DELIVERY ----------
  if (q.includes("fastest") || q.includes("quick delivery")) {
    return {
      answer:
        "Fastest delivery depends on distance + kitchen load. Look for restaurants tagged with 'Fast Delivery' for the quickest experience.",
      action: null,
    };
  }

  // ---------- CHEAP RESTAURANTS ----------
  if (q.includes("cheap") || q.includes("budget") || q.includes("low price")) {
    return {
      answer:
        "For budget-friendly meals, filter restaurants by price range. Many offer combo deals that give maximum value.",
      action: null,
    };
  }

  // ---------- HIGH PROTEIN FOOD ----------
  if (q.includes("protein") || q.includes("healthy") || q.includes("gym food")) {
    return {
      answer:
        "High-protein meals are usually marked as ‘Healthy’ or ‘Fitness Meals’. Try looking under health-focused restaurants or filter veg/non-veg options.",
      action: null,
    };
  }

  // ---------- CONTACT SUPPORT ----------
  if (
    q.includes("contact support") ||
    q.includes("help karo") ||
    q.includes("support number")
  ) {
    return {
      answer:
        "Our support team is available 24/7 inside the app. Open the Help section for chat or quick issue reporting.",
      action: { type: "OPEN_SUPPORT" },
    };
  }

  // ---------- GST / TAX ----------
  if (q.includes("gst") || q.includes("tax") || q.includes("charges")) {
    return {
      answer:
        "GST and restaurant charges are shown transparently on the checkout page before payment. You can review them anytime.",
      action: null,
    };
  }

  // ---------- WHY DELIVERY FEE HIGH ----------
  if (q.includes("delivery fee") || q.includes("why charge")) {
    return {
      answer:
        "Delivery fee depends on demand, distance, and time of day. It adjusts automatically to keep delivery fast and available.",
      action: null,
    };
  }

  // ---------- VEGAN FOOD ----------
  if (q.includes("vegan")) {
    return {
      answer:
        "Some restaurants offer vegan options, usually listed clearly in their menus. You can search 'vegan' in the app to see available dishes.",
      action: null,
    };
  }

  // ---------- ADVANCED ORDER STATUS (WITH ETA + RIDER) ----------
  if (
    q.includes("order status") ||
    q.includes("status of order") ||
    q.includes("mera order") ||
    q.includes("order kaha") ||
    q.includes("track order") ||
    q.includes("order update") ||
    q.includes("is it delivered") ||
    q.includes("delivered hua") ||
    (q.includes("track") && q.includes("order")) ||
    q.includes("rider") ||
    q.includes("eta") ||
    q.includes("kab tak") ||
    q.includes("when will it arrive")
  ) {
    const orders = app.orders || [];

    if (!orders.length) {
      return {
        answer: "You haven't placed any orders yet, so there's nothing to track.",
        action: null,
      };
    }

    const last = orders[orders.length - 1];

    // Get ETA same way as OrdersPopup
    function getEtaMinutes(order) {
      if (order.status === "delivered") return 0;
      if (order.status === "out-for-delivery") return 5;
      return 20;
    }

    // Same DP logic as OrdersPopup
    const MOCK_DELIVERY_PARTNERS = [
      "Rahul Sharma",
      "Priya Singh",
      "Aman Verma",
      "Kunal S.",
      "Neha T."
    ];

    const dp =
      MOCK_DELIVERY_PARTNERS[
        last.id.charCodeAt(last.id.length - 1) %
        MOCK_DELIVERY_PARTNERS.length
      ];

    const eta = getEtaMinutes(last); // minutes

    // ------- SMART AI-LIKE RESPONSES BASED ON STATUS -------
    if (last.status === "delivered") {
      return {
        answer: `Your last order has already been delivered. Hope you enjoyed your meal!`,
        action: { type: "OPEN_ORDERS" },
      };
    }

    if (last.status === "confirmed") {
      return {
        answer: `Your order is confirmed and the restaurant is preparing it.\nEstimated arrival: ~${eta} minutes.`,
        action: { type: "OPEN_ORDERS" },
      };
    }

    if (last.status === "out-for-delivery") {
      return {
        answer: `Your order is out for delivery.\nRider: ${dp}\nETA: approx. ${eta} minutes.`,
        action: { type: "OPEN_ORDERS" },
      };
    }

    // Fallback if custom statuses come
    return {
      answer: `Your order status is: ${last.status}.`,
      action: { type: "OPEN_ORDERS" },
    };
  }
  // ---------- SUPER ADVANCED ORDER STATUS (AI MODE) ----------
  if (
    q.includes("order status") ||
    q.includes("status") ||
    q.includes("where is my order") ||
    q.includes("rider") ||
    q.includes("track") ||
    q.includes("update") ||
    q.includes("kaha") ||
    q.includes("kab") ||
    q.includes("kitna time") ||
    q.includes("progress") ||
    q.includes("latest") ||
    q.includes("live") ||
    q.includes("abhi ka") ||
    q.includes("bacha") ||
    q.includes("how long") ||
    q.includes("eta")
  ) {
    const orders = app.orders || [];
    if (!orders.length) {
      return {
        answer: "You haven’t placed any orders yet — nothing to track at the moment.",
        action: null,
      };
    }

    const last = orders[orders.length - 1];

    // Same ETA logic as your components
    function getEtaMinutes(order) {
      if (order.status === "delivered") return 0;
      if (order.status === "out-for-delivery") return 5;
      return 20;
    }

    const eta = getEtaMinutes(last);

    // Rider logic
    const DPs = ["Rahul Sharma", "Priya Singh", "Aman Verma", "Kunal S.", "Neha T."];
    const dp = DPs[last.id.charCodeAt(last.id.length - 1) % DPs.length];

    // Status-to-progress mapping
    const progressMap = {
      confirmed: 25,
      preparing: 40,
      ready: 60,
      "out-for-delivery": 80,
      delivered: 100,
    };

    const progress = progressMap[last.status] || 20;

    // Random AI tone messages
    const aiLines = {
      confirmed: [
        "Your order is being queued up in the kitchen.",
        "The restaurant has locked in your order — cooking soon.",
        "Your food prep is about to begin.🔥",
      ],
      "out-for-delivery": [
        "Rider is on the road heading your way 🛵💨",
        "Your food is literally moving closer every minute.",
        "Delivery partner picked it up and is rushing towards you.",
      ],
      delivered: [
        "Your food has reached home. Enjoy your meal! 🍽️",
        "Delivered successfully — hope it tasted amazing!",
      ],
      preparing: [
        "The kitchen is seasoning things up for you 🌶️",
        "Your food is currently being cooked with care.",
      ],
    };

    const randomLine = (list) => list[Math.floor(Math.random() * list.length)];

    // Timeline UI text
    const timeline = `
Order Timeline:
${last.status === "delivered" ? "✔ Delivered" : "○ Delivered"}
${last.status === "out-for-delivery" ? "➡ Out for Delivery" : last.status === "delivered" ? "✔ Out for Delivery" : "○ Out for Delivery"}
${last.status === "confirmed" || last.status === "preparing" ? "✔ Confirmed" : "○ Confirmed"}
`;

    // ---------------- FINAL SMART RESPONSE BASED ON STATUS ----------------
    let answer = "";

    if (last.status === "delivered") {
      answer = `Your order has already been delivered. 🎉  
Progress: 100%  
${randomLine(aiLines.delivered)}  
${timeline}`;
    }

    else if (last.status === "out-for-delivery") {
      answer = `Your order is out for delivery!  
Rider: ${dp}  
ETA: approx. ${eta} minutes  
Progress: ${progress}%  
${randomLine(aiLines["out-for-delivery"])}  
${timeline}`;
    }

    else if (last.status === "confirmed") {
      answer = `Your order is confirmed and the restaurant is preparing it.  
ETA: ~${eta} minutes  
Progress: ${progress}%  
${randomLine(aiLines.confirmed)}  
${timeline}`;
    }

    else {
      answer = `Your order status: **${last.status}**  
ETA: ~${eta} minutes  
Progress: ${progress}%  
${timeline}`;
    }

    return { answer, action: { type: "OPEN_ORDERS" } };
  }

  
  // ---------- HALAL FOOD ----------
  if (q.includes("halal")) {
    return {
      answer:
        "Halal-certified restaurants mention their certification in the details. Always verify on the restaurant page for accuracy.",
      action: null,
    };
  }

  // ---------- BEST BIRYANI ----------
  if (q.includes("biryani") && q.includes("best")) {
    return {
      answer:
        "Top-rated biryani spots near you usually show up first in the list. Look for places above 4.3⭐ for authentic taste.",
      action: null,
    };
  }

  // ---------- FOOD SAFETY ----------
  if (
    q.includes("safe") ||
    q.includes("hygiene") ||
    q.includes("clean") ||
    q.includes("quality")
  ) {
    return {
      answer:
        "Most restaurants follow strict hygiene guidelines. You can check ratings, reviews, and hygiene badges on restaurant pages.",
      action: null,
    };
  }


  // ---------- CLEAR CART ----------
  if (
    q.includes('clear cart') ||
    q.includes('empty cart') ||
    q.includes('saara hata') ||
    q.includes('sab hata')
  ) {
    if (!cart.items.length) {
      return { answer: 'Cart already empty hai.', action: null };
    }
    return {
      answer: 'Theek hai, tumhara cart clear kar diya.',
      action: { type: 'CLEAR_CART' },
    };
  }

  // ---------- COMMON HELP / GREETING ----------
  if (
    ['hi', 'hello', 'hey'].some(
      (w) => q === w || q.startsWith(w + ' ')
    ) ||
    q.includes('who are you') ||
    q.includes('what can you do') ||
    q.includes('help')
  ) {
    return {
      answer:
        'Hi! Main SnackSprint bot hoon. Cart total, items, promo codes, favourites, saved addresses, orders, delivery time, veg / non‑veg, restaurant rating sab batata hoon.',
      action: null,
    };
  }

  // ---------- CART TOTAL ----------
  if (
    q.includes('cart') &&
    (q.includes('total') ||
      q.includes('amount') ||
      q.includes('bill') ||
      q.includes('price'))
  ) {
    const answer = cart.items.length
      ? `Abhi tumhare cart ka total ₹${cart.total.toFixed(
          0
        )} hai, jisme delivery fee ₹${cart.deliveryFee} include hai.`
      : 'Tumhara cart abhi khali hai, kuch items add karo phir total bataunga.';
    return { answer, action: null };
  }

  // ---------- CART SUBTOTAL ONLY (without delivery) ----------
  if (
    (q.includes('subtotal') ||
      q.includes('only items') ||
      q.includes('items total')) &&
    q.includes('cart')
  ) {
    const answer = cart.items.length
      ? `Sirf items ka subtotal ₹${cart.subtotal.toFixed(
          0
        )} hai, delivery fee alag se ₹${cart.deliveryFee} lagegi.`
      : 'Cart khali hai, isliye subtotal 0 hai.';
    return { answer, action: null };
  }

  // ---------- CART ITEMS COUNT ----------
  if (
    q.includes('cart') &&
    (q.includes('items') ||
      q.includes('item') ||
      q.includes('kitne') ||
      q.includes('how many'))
  ) {
    const count = cart.items.reduce(
      (sum, item) => sum + item.quantity,
      0
    );
    const answer = count
      ? `Tumhare cart me total ${count} items hain (${cart.items.length} different dishes).`
      : 'Cart me abhi koi item nahi hai.';
    return { answer, action: null };
  }

  // ---------- LIST CART ITEMS ----------
  if (
    q.includes('cart') &&
    (q.includes('show') ||
      q.includes('list') ||
      q.includes('kya hai'))
  ) {
    if (!cart.items.length)
      return { answer: 'Cart abhi empty hai.', action: null };
    const names = cart.items
      .map((i) => `${i.name} x${i.quantity}`)
      .join(', ');
    return { answer: `Cart me ye items hain: ${names}.`, action: null };
  }

  // ---------- PROMO CODES / DISCOUNT ----------
  if (
    q.includes('promo') ||
    q.includes('coupon') ||
    q.includes('discount')
  ) {
    if (cart.promoCode) {
      return {
        answer: `Abhi tumne ${cart.promoCode} apply kiya hai aur discount ₹${cart.promoDiscount.toFixed(
          0
        )} mil raha hai. Try: FIRST50 ya SNACK10.`,
        action: null,
      };
    }
    return {
      answer:
        'Abhi koi promo code apply nahi hai. Tum FIRST50 (₹50 off) ya SNACK10 (10% off upto ₹100) use kar sakte ho.',
      action: null,
    };
  }

  // ---------- FAVOURITES ----------
  if (
    q.includes('favourite') ||
    q.includes('favorite') ||
    q.includes('fav')
  ) {
    const favs = app.favorites || [];
    if (!favs.length)
      return {
        answer: 'Tumhare favourites list abhi empty hai.',
        action: null,
      };
    const names = favs
      .slice(0, 5)
      .map((r) => r.name)
      .join(', ');
    return {
      answer: `Tumhare favourites me ${favs.length} restaurants hain. Top: ${names}.`,
      action: null,
    };
  }

  // ---------- SAVED ADDRESSES ----------
  if (q.includes('address') || q.includes('addresses')) {
    const addrs = app.addresses || [];
    if (q.includes('add') || q.includes('save')) {
      return {
        answer:
          'Naya address add karne ke liye Address / Profile section me jao, wahan “Add Address” button use karo.',
        action: null,
      };
    }
    if (!addrs.length)
      return {
        answer: 'Abhi tumne koi address save nahi kiya hai.',
        action: null,
      };
    if (
      q.includes('default') ||
      q.includes('primary') ||
      q.includes('main')
    ) {
      return {
        answer: `Tumhara default address: ${
          addrs[0].label || addrs[0].fullAddress
        }.`,
        action: null,
      };
    }
    return {
      answer: `Tumne ${addrs.length} addresses save kiye hain. Pehla: ${
        addrs[0].label || addrs[0].fullAddress
      }.`,
      action: null,
    };
  }

  // ---------- ORDERS / ORDER HISTORY ----------
  if (
    q.includes('order history') ||
    q.includes('orders') ||
    q.includes('previous orders') ||
    q.includes('last order') ||
    q.includes('pichla order')
  ) {
    const orders = app.orders || [];
    if (!orders.length)
      return {
        answer: 'Abhi tumne koi order place nahi kiya hai.',
        action: null,
      };

    if (
      q.includes('last') ||
      q.includes('recent') ||
      q.includes('pichla')
    ) {
      const last = orders[orders.length - 1];
      const addressText =
        typeof last.address === 'string'
          ? last.address
          : last.address?.address || 'saved address';
      return {
        answer: `Tumhara last order ₹${last.total
          .toFixed(0)
          .toString()} ka tha, jisme ${
          last.items.length
        } items the aur address "${addressText}" tha.`,
        action: null,
      };
    }

    return {
      answer: `Tumne ab tak ${orders.length} orders place kiye hain. Sabhi details “My Orders” section me dekh sakte ho.`,
      action: null,
    };
  }

  // ---------- DELIVERY TIME / ETA ----------
  if (
    q.includes('delivery') &&
    (q.includes('time') ||
      q.includes('kitna') ||
      q.includes('kab tak') ||
      q.includes('when'))
  ) {
    if (!restaurants?.length)
      return {
        answer:
          'Restaurants ka data load ho raha hai, thodi der baad try karo.',
        action: null,
      };
    const times = restaurants
      .map((r) =>
        parseInt(
          (r.delivery_time || '40')
            .toString()
            .match(/\d+/)?.[0] || '40',
          10
        )
      )
      .filter(Boolean);
    if (!times.length)
      return {
        answer: 'Exact delivery time abhi available nahi hai.',
        action: null,
      };
    const min = Math.min(...times);
    const max = Math.max(...times);
    return {
      answer: `Most restaurants ${min}–${max} minutes ke andar deliver karte hain. Exact time restaurant card par dikh raha hoga.`,
      action: null,
    };
  }

  // ---------- VEG / NON‑VEG FILTER FEEL ----------
  if (q.includes('veg') || q.includes('vegetarian')) {
    return {
      answer:
        'Agar tumhe sirf Pure Veg chahiye to filters me “Pure Veg Only” option on kar sakte ho. Restaurant list automatically filter ho jayegi.',
      action: null,
    };
  }

  // ---------- BEST / TOP RATED RESTAURANTS ----------
  if (
    q.includes('best') ||
    q.includes('top rated') ||
    q.includes('rating') ||
    q.includes('suggest') ||
    q.includes('recommend')
  ) {
    if (!restaurants?.length)
      return {
        answer:
          'Restaurants load ho rahe hain, thoda wait karo phir main best options bataunga.',
        action: null,
      };
    const sorted = [...restaurants].sort(
      (a, b) => (b.rating || 0) - (a.rating || 0)
    );
    const top3 = sorted
      .slice(0, 3)
      .map((r) => `${r.name} (${r.rating}⭐)`)
      .join(', ');
    return {
      answer: `Top rated nearby options: ${top3}. Tum filters se aur refine kar sakte ho.`,
      action: null,
    };
  }

  // ---------- LOGIN / ACCOUNT ----------
  if (
    q.includes('login') ||
    q.includes('account') ||
    q.includes('profile')
  ) {
    if (app.user?.name) {
      return {
        answer: `Tum ${app.user.name} naam se logged‑in ho. Profile / Account section se details update kar sakte ho.`,
        action: null,
      };
    }
    return {
      answer:
        'Abhi tum logged‑in nahi ho. Navbar me “Login” button se sign in ya sign up karo.',
      action: null,
    };
  }

  // ---------- GENERIC CART EMPTY / HELP ----------
  if (q.includes('cart')) {
    if (!cart.items.length)
      return {
        answer:
          'Cart abhi empty hai. Menu me se koi bhi dish pe “Add to Cart” click karo, phir main totals bata dunga.',
        action: null,
      };
    return {
      answer: `Cart me ${cart.items.length} different items hain. Tum total, items list, promo code ya clear cart jaise sawal puch sakte ho.`,
      action: null,
    };
  }

  // ---------- DEFAULT FALLBACK ----------
  return {
    answer:
      'Ye question directly samajh nahi aaya. Cart total, items, promo, favourites, saved address, orders, delivery time ya best restaurants jaisa kuch puch ke dekho.',
    action: null,
  };
}
