const Campground = require('../models/campgrounds')

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
  const campground = new Campground(req.body.campground)
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
  await Campground.findByIdAndUpdate(
    req.params.id,
    req.body.campground,
    {
      runValidators: true,
      new: true
    })
    req.flash('success', 'Successfully updated campground!')
    res.redirect(`/campgrounds/${req.params.id}`)
}

module.exports.delete = async (req,res) => {
  await Campground.findOneAndDelete({_id: req.params.id})
  req.flash('success', 'Deleted a campground')
  res.redirect('/campgrounds')
}