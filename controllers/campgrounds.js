const Campground = require('../models/campgrounds')

const {cloudinary} = require('../cloudinary')

// Maybe use this later for map usage
const mapboxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding')
const mapboxToken = process.env.MAPBOX_TOKEN
const geocoder = mapboxGeocoding({accessToken: mapboxToken})

module.exports.index = async (req,res) => {
  const campgrounds = await Campground.find({})
  res.render('campgrounds/index', { campgrounds })
}

module.exports.new = (req,res) => {
  res.render("campgrounds/new")
}

module.exports.show = async (req,res) => {
  const campground = await Campground.findById(req.params.id)
    .populate({
      path: 'reviews',
      populate: {
        path: 'author'
      }
    })
    .populate('author')
  if(!campground) {
    req.flash('error', 'Could not find that campground')
    return res.redirect('/campgrounds')
  }
  res.render('campgrounds/show', { campground })
}

module.exports.editForm = async (req,res) => {
  const campground = await Campground.findById(req.params.id)
  if(!campground) {
    req.flash('error', 'Could not find that campground')
    return res.redirect('/campgrounds')
  }
  res.render('campgrounds/edit', { campground })
}

module.exports.post = async (req,res, next) => {

  const geoData = await geocoder.forwardGeocode({
    query: req.body.campground.location,
    limit: 1
  }).send()
  const campground = new Campground(req.body.campground)
  campground.geometry = geoData.body.features[0].geometry
  campground.images = req.files.map(file => ({
    url: file.path,
    filename: file.filename
  }))
  campground.author = req.user._id
  await campground.save()
  req.flash('success', 'Successfully made a new campground!')
  res.redirect(`/campgrounds/${campground._id}`)
}

module.exports.edit = async (req,res) => {
  const campground = await Campground.findByIdAndUpdate(
    req.params.id,
    req.body.campground,
    {
      runValidators: true,
      new: true
    })
    const images = req.files.map(file => ({
      url: file.path,
      filename: file.filename
    }))
    campground.images.push(...images)
    await campground.save()
    if (req.body.deleteImages) {
      // gets reached, somehting not happening
      for (let filename of req.body.deleteImages) {
        await cloudinary.uploader.destroy(filename)
      }
      await campground.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })
    }
    req.flash('success', 'Successfully updated campground!')
    res.redirect(`/campgrounds/${req.params.id}`)
}

module.exports.delete = async (req,res) => {
  await Campground.findOneAndDelete({_id: req.params.id})
  req.flash('success', 'Deleted a campground')
  res.redirect('/campgrounds')
}