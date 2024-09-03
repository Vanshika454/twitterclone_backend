const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth/authController')

//User Registration
router.post("/register", authController.registerUser);

//LOG IN route
router.post("/login", authController.loginUser);

module.exports = router;