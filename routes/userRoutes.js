// 'use strict';

const express = require('express');

const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

// user routes
const router = express.Router();

// router.param('id', (req, res, next, val) => {
//   console.log(`User id is : ${val}`);
//   next();
// });

// routes to allow sign up, login, and forgotten password without being signed in
router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.get('/logout', authController.logout);

router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);

// only logged in users are allowed on these routes
router.use(authController.protect);
router.get('/me', userController.getMe, userController.getUser);
router.patch(
  '/updateMe',
  userController.uploadUserPhoto,
  userController.resizeUserPhoto,
  userController.updateMe
);
router.delete('/deleteMe', userController.deleteMe);

// only admins for the following routes
router.use(authController.restrictTo('admin'));

router
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createUser);
router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
