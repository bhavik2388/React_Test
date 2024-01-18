const express = require('express');
const authController = require('../Controller/authController');
const multer = require('multer')
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const router = express.Router();

// Authentication routes
router.post('/login', authController.login);
router.post('/signup', authController.signup);
router.get('/profile', authController.getUserDetails);
router.post('/updateProfile',upload.single('profilePicture'), authController.profilePicture);

module.exports = router;
