// routes/watchlist.js

const express = require('express');
const router = express.Router();
const watchlistController = require('../controllers/watchlistController');


// Middleware to check if user is logged in
function isAuthenticated(req, res, next) {
    if (req.session && req.session.user) {
        return next();
    } else {
        res.status(401).json({ error: "Unauthorized" }).redirect('/signin');;
    }
    
}

// Add item to watchlist
router.post('/add', isAuthenticated, watchlistController.addItem);

// Get all watchlist items for user
router.get('/show', isAuthenticated, async (req, res) => {
    const userId = req.session.user.id;
    if (!req.session.user) {
        return res.status(401).json({ error: "Unauthorized access" });
    }
    const items = await watchlistController.getItems(userId);
    res.json(items);
    
});


// Delete item from watchlist
router.delete('/delete', (req, res) => {
    // Check if the user is authenticated
    if (!req.session.user) {
      return res.status(401).json({ error: "Unauthorized access" });
    }
    const userId = req.session.user.id;
    const { symbol } = req.body;
    const items= watchlistController.deleteItems(userId,symbol);
    res.json(items).status(200);
});

module.exports = router;
