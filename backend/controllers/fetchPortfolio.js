const db = require('../config/db');

const fetchPortfolio = (req, res) => {
    if (req.session.user) {
        const userid = req.session.user.id;
        console.log("hello");
        console.log(userid);
        
        const sql = `
            SELECT 
                symbol, 
                SUM(quantity) AS totalQuantity, 
                SUM(quantity * price) / SUM(quantity) AS averagePrice
            FROM portfolio 
            WHERE user_id = ? 
            GROUP BY symbol
        `;

        db.all(sql, [userid], (err, rows) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }

            res.status(200).json(rows);
        });
    } else {
        res.status(401).json({ message: 'Unauthorized' });
    }
};

module.exports = { fetchPortfolio };
