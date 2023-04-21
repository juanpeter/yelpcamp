if(process.env.NODE_ENV !=="production") {
  require('dotenv').config()
}

const express = require('express')
const router = express.Router()

const catchAsync = require('../utils/catchAsync')
const {isLoggedIn, validateCampground, isAuthor} = require('../middleware')
const campgroundController = require('../controllers/campgrounds')

const multer = require('multer')
const {storage} = require('../cloudinary')
const upload = multer({storage})

router.route('/')
  .get(catchAsync(campgroundController.index))
  // .post(isLoggedIn, validateCampground, catchAsync(campgroundController.post))


router.get("/new", isLoggedIn, campgroundController.new)

router.route('/:id')
  .get(catchAsync(campgroundController.show))
  .put(isLoggedIn, isAuthor, validateCampground, catchAsync(campgroundController.edit))
  .delete(isLoggedIn, isAuthor, catchAsync(campgroundController.delete))

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgroundController.editForm))

module.exports = router