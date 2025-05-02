// backend/routes/signup.js
const express = require('express');
const router = express.Router();
const { signUpUser } = require('../controllers/authController');

router.post('/', signUpUser);

module.exports = router;
