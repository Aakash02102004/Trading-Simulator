const db = require('../config/db');

// Get Wallet Balance
async function getWalletBalance(userId) {
    return new Promise((resolve, reject) => {
        db.get('SELECT walletBalance FROM wallet WHERE userId = ?', [userId], (err, row) => {
            if (err) return reject(new Error('Database error'));
            resolve(row ? row.walletBalance : 0.0);
        });
    });
}

// Add Wallet Balance
async function addWalletBalance(userId, amount) {
    return new Promise((resolve, reject) => {
        db.run(
            `INSERT INTO wallet (userId, walletBalance) 
             VALUES (?, ?) 
             ON CONFLICT(userId) DO UPDATE SET walletBalance = walletBalance + ?`,
            [userId, amount, amount],
            function (err) {
                if (err) return reject(new Error('Failed to add balance'));
                resolve(`Added ${amount} to wallet for user ${userId}`);
            }
        );
    });
}

// Subtract Wallet Balance
async function subWalletBalance(userId, amount) {
    return new Promise((resolve, reject) => {
        db.get('SELECT walletBalance FROM wallet WHERE userId = ?', [userId], (err, row) => {
            if (err) return reject(new Error('Database error'));
            if (row && row.walletBalance >= amount) {
                db.run(
                    'UPDATE wallet SET walletBalance = walletBalance - ? WHERE userId = ?',
                    [amount, userId],
                    function (err) {
                        if (err) return reject(new Error('Failed to update balance'));
                        resolve(`Subtracted ${amount} from wallet for user ${userId}`);
                    }
                );
            } else {
                console.log("insufficient");
                resolve({ error: 'Insufficient balance' });
            }
        });
    });
}

module.exports = { getWalletBalance, addWalletBalance, subWalletBalance };
