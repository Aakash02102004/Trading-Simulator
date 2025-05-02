const express = require('express');
const router = express.Router();
const { fetchPortfolio } = require('../controllers/fetchPortfolio');
console.log("hello");
console.log(fetchPortfolio);
router.get('/portfolio', fetchPortfolio);

module.exports = router;
