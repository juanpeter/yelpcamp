const {ObjectId} = require('mongodb')
const mongoose = require('mongoose');
const Campground = require('../models/campgrounds')

const cities = require('./cities')
const {descriptors, places} = require('./seedHelpers')

mongoose.connect('mongodb://localhost:27017/yelp-camp', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})

const db = mongoose.connection
db.on('error', console.error.bind(console, 'Connection Error:'))
db.once('open', () => {
  console.log("Database connected")
})

const seedDb = async () => {
  await Campground.deleteMany({})

  for(let i = 0; i < 50; i++) {
    const title = `${descriptors[Math.floor(Math.random() * descriptors.length)]} ${places[Math.floor(Math.random() * places.length)]}`

    const price = Math.floor(Math.random() * 100).toFixed(2)

    const image = `https://picsum.photos/id/${Math.floor(Math.random() * 500)}/480/320`
    
    //Keep same number in order to not have mismatching city/state
    const citiesArrLength = Math.floor(Math.random() * cities.length)

    const location = `${cities[citiesArrLength].city}, ${cities[citiesArrLength].state}`

    const author = "64388c04d166a41f0bdd8fab"

    const newCamp = new Campground({
      author,
      title,
      price,
      location,
      image,
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus interdum neque felis, ac tincidunt mi rutrum in. Cras ac dolor maximus, consectetur sapien ut, fermentum est. Cras sit amet lacus felis.',
    })

    await newCamp.save()
  }
}

seedDb();