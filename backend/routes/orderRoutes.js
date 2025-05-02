// routes/orderRoutes.js
const express = require('express');
const { placeOrder } = require('../controllers/orderController');
const router = express.Router();

router.post('/buy', placeOrder);

module.exports = router;
