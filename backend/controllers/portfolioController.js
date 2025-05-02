// controllers/portfolioController.js
const db = require('../config/db');

const getPortfolio = (req, res) => {
    const userId = req.params.userId;
    const sql = `SELECT * FROM portfolio WHERE user_id = ?`;

    db.all(sql, [userId], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
};

module.exports = { getPortfolio };
