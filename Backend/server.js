const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const app = express()
const port = process.env.PORT || 8080;


app.use(express.json())
app.use(cors());


const url = 'mongodb+srv://keshavshagun2222:keshavmoney1916@cluster0.66pic1y.mongodb.net/snacksprint'



// const url ="mongodb://localhost:27017/snacksprint"

mongoose.connect(url)
  .then(() => console.log('Database connected'))
  .catch((error) => console.log(' Database error', error))

const restaurantSchema = new mongoose.Schema({
  _id: String,
  name: String,
  cuisines: [String],
  rating: Number,
  rating_count: Number,
  cost_for_two: Number,
  delivery_time: {
    value: Number,
    text: String
  },
  is_veg: Boolean,
  is_pure_veg: Boolean,
  address: String,
  city: String,
  area: String,
  image: String,
  banner_image: String,
  delivery_fee: Number,
  min_order_value: Number,
  staticData: {
    likesCount: Number,
    totalOrders: Number
  },
  userActions: [{
    type: String,
    userId: String,
    userName: String,
    timestamp: String,
    data: {
      rating: Number,
      comment: String
    }
  }],
  menu: [{
    _id: String,
    name: String,
    image: String,
    price: Number,
    isVeg: Boolean,
    category: String,
    description: String,
    ingredients: [String]
  }]
})


const Restaurant = mongoose.model('newdata', restaurantSchema, 'newdata')

app.get('/restaurants', async (req, res) => {
  const docs = await Restaurant.find()
  console.log(docs)
  res.status(200).json(docs)
})

app.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`)
})
