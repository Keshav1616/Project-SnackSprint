import { useParams } from 'react-router-dom'
export default function useRestaurantParams() {
  const params = useParams()
  return { restaurantId: params.restaurantId, orderId: params.orderId }
}
