const express = require('express');
const router = express.Router();
const { getWalletBalance, addWalletBalance, subWalletBalance } = require('../controllers/walletController');

// Get wallet balance
router.get('/balance', async (req, res) => {
    const userId = req.session.user?.id;
    if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
        const balance = await getWalletBalance(userId);
        res.status(200).json({ walletBalance: balance });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Add to wallet balance
router.post('/add', async (req, res) => {
    const userId = req.session.user?.id;
    const { amount } = req.body;

    if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    if (!amount || amount <= 0) {
        return res.status(400).json({ error: 'Invalid amount' });
    }

    try {
        const result = await addWalletBalance(userId, amount);
        res.status(200).json({ message: result });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Subtract from wallet balance
router.post('/subtract', async (req, res) => {
    const userId = req.session.user?.id;
    const { amount } = req.body;

    if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    if (!amount || amount <= 0) {
        return res.status(400).json({ error: 'Invalid amount' });
    }

    try {
        const result = await subWalletBalance(userId, amount);
        if (result.error) {
            res.status(400).json(result);
        } else {
            res.status(200).json({ message: result });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
