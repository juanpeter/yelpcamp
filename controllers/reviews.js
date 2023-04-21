const Campground = require('../models/campgrounds')
const Review = require('../models/review')

module.exports.post = async (req,res) => {
  const campground = await Campground.findById(req.params.id)
  const review = new Review(req.body.review)
  review.author = req.user._id
  campground.reviews.push(review)
  await review.save()
  await campground.save()
  req.flash('success', 'Created a new review')
  res.redirect(`/campgrounds/${req.params.id}`)
}

module.exports.delete = async (req,res) => {
  const {id, reviewId} = req.params
  await Campground.findByIdAndUpdate(id, {$pull: {reviews: reviewId}})
  await Review.findByIdAndDelete(reviewId)
  req.flash('success', 'Deleted a review')
  res.redirect(`/campgrounds/${req.params.id}`)
}