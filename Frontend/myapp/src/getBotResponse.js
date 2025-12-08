// src/getBotResponse.js
export default function getBotResponse(question, restaurants, cart, favorites, app) {
  const q = (question || "").toLowerCase().trim()

  if (q.includes("how many") && q.includes("restaurant")) {
    return `There are ${restaurants.length} restaurants available right now!`
  }

  if (q.includes("cart") && (q.includes("how many") || q.includes("count"))) {
    return `You have ${cart.length} item(s) in your cart.`
  }

  if (q.includes("favorite") || q.includes("favourite")) {
    return `You have ${favorites.length} restaurants in favorites.`
  }

  if (q.includes("address")) {
    const addrCount = app.addresses?.length || 0
    return addrCount
      ? `You have ${addrCount} saved address(es).`
      : "You don't have any saved addresses yet."
  }

  if (q.includes("top") || q.includes("best")) {
    const topRated = restaurants
      .filter(r => (r.rating || 0) >= 4.5)
      .sort((a, b) => (b.rating || 0) - (a.rating || 0))
      .slice(0, 3)
    if (topRated.length) {
      const names = topRated.map(r => r.name).join(", ")
      return `Top rated restaurants: ${names}.`
    }
    return "No highly rated restaurants found."
  }

  if (q.includes("total") && q.includes("cart")) {
    const total = cart.reduce((sum, item) => sum + (item.price || 0), 0)
    return `Your cart total is ₹${total.toLocaleString()}.`
  }

  return "Try asking: 'how many restaurants', 'cart total', 'my favorites', 'saved addresses', 'top restaurants'."
}
