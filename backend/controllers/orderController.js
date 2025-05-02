// controllers/orderController.js
const db = require('../config/db');
const express = require('express');
const bodyParser = require('body-parser');
const { resolve } = require('path');
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
const { getWalletBalance, addWalletBalance, subWalletBalance } = require('./walletController.js');

const placeOrder = (req, res) => {
    const { userId, symbol, price, quantity } = req.body;
    
    if(req.session.user){
        console.log("here2");
    const userid=req.session.user.id;
    // Example logic to check if the price is valid and if we can buy
    // Here, you should implement your logic to check market price
    const marketPrice = getMarketPrice(symbol); // Replace with actual market price fetching logic
     console.log(userid, marketPrice);
    

    getWalletBalance(userid)
    .then(balance => {
        console.log('Wallet balance:', balance);
        if(balance<quantity*price){
            return res.status(400).json({message: 'Not enough balance'});
        }else{
            console.log("here i am");
            if (price < marketPrice) {
                return res.status(400).json({ message: 'Price is below the market price' });
            }   
           else{  
            const sql = `INSERT INTO portfolio (user_id, symbol, quantity, price) VALUES (?, ?, ?, ?)`;
            db.run(sql, [userid, symbol, quantity, price], function(err) {
                if (err) {
                    return res.status(500).json({ error: err.message });
                }
                subWalletBalance(userid, price*quantity);
                res.status(201).json({ id: this.lastID, userid, symbol, quantity, price });
            }); 
        }
        
    }})
    .catch(error => {
        console.error('Error fetching wallet balance:', error.message);
    });

    

}
else{
    res.status(401).json({Unauthorized});
}
};

// Dummy function to simulate fetching market price
const getMarketPrice = (symbol) => {
    // In a real application, you would fetch this from an external API
    return 100; // Placeholder value
};

module.exports = { placeOrder };
