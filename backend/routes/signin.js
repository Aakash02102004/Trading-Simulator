// backend/routes/signin.js
const express = require('express');
const router = express.Router();
const { signInUser } = require('../controllers/authController');

router.post('/', signInUser);

module.exports = router;
