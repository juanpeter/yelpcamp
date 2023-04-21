const express = require('express')
const router = express.Router()
const passport = require('passport')
const catchAsync = require('../utils/catchAsync')
const userController = require('../controllers/users')

router.route('/register')
  .get(userController.register)
  .post(catchAsync(userController.post))

router.route('/login')
  .get(userController.login)
  .post(passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), userController.authenticate)

router.get('/logout', userController.logout)

module.exports = router