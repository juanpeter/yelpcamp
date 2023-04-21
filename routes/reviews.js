const express = require('express')
const router = express.Router({mergeParams: true})

const catchAsync = require('../utils/catchAsync')
const {validateReview, isLoggedIn, isReviewAuthor} = require('../middleware')
const reviewsController = require('../controllers/reviews')

router.post('/', isLoggedIn, validateReview, catchAsync(reviewsController.post))

router.delete('/:reviewId', isReviewAuthor, isLoggedIn, catchAsync(reviewsController.delete))

module.exports = router