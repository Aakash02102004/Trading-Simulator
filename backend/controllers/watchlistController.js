// controllers/watchlistController.js
const db = require('../config/db');
const express = require('express');
const bodyParser = require('body-parser');
const { resolve } = require('path');
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

// Add item to watchlist
exports.addItem = (req, res) => {
  const { symbol } = req.body;
  console.log('addItem function called'); // Log to indicate function entry

  if (req.session.user) {
    console.log('User is logged in'); // Log for session validation

    const userId = req.session.user.id;
    db.run(
      `INSERT INTO watchlist (user_id, symbol) VALUES (?, ?)`,
      [userId, symbol],
      (err) => {
        if (err) {
          console.error('Error saving user data:', err);
          res.status(400).send('Error: User with this email already exists.');
          return; // Ensure no further execution
        }
        console.log('Database insertion successful'); // Log for successful DB operation
        res.redirect('/watchlist');
      }
    );
  } else {
    console.log('User is not logged in, redirecting to /signin'); // Log for unauthenticated access
    res.redirect('/signin');
  }
};



// exports.addItem=(req, res) =>{
// const {symbol}=req.body;
// if(req.session.user){
//   userId=req.session.user.id;
//   db.run(`INSERT INTO watchlist (user_id, symbol) VALUES (?, ?)`, [userId, symbol],
//       (err) => {
//           if (err) {
//             console.error("Error saving user data:", err);
//             res.status(400).send("Error: User with this email already exists.");
//           }});
//   res.redirect('/watchlist');
// }
// else{
//   res.redirect('/signin');
// }
// }


  
exports.getItems = (userId) => {
    return new Promise((resolve, reject)=> {
        db.all('SELECT * FROM watchlist where user_id = ?', [userId],
            (err, row) => {
                if (err) {
                  console.error("Error fetching user data:", err);
                  reject(err);
                } else {
                  resolve(row); // Resolve with the fetched user row
                }
              }  
        );
    });
};

exports.deleteItems = (userId, symbol)=>{
    return new Promise((resolve, reject)=> {
    const query = `DELETE FROM watchlist WHERE id = ? `;
    
    // Delete symbol from the database for the current user
    db.run(query, [symbol.id], (err,row) =>{

    console.log("no error");
      if (err) {
        console.error("Error deleting symbol:", err);
        reject(err);
      }
      else{
        resolve(row);
      }
  
      
    });
    })
}

exports.addItem2 = (req, res) => {
  const { symbol } = req.body;
  console.log('addItem function called'); // Log to indicate function entry

  if (req.session.user) {
    console.log('User is logged in'); // Log for session validation

    const userId = req.session.user.id;
    db.run(
      `INSERT INTO watchlist (user_id, symbol) VALUES (?, ?)`,
      [userId, symbol],
      (err) => {
        if (err) {
          console.error('Error saving user data:', err);
          res.status(400).send('Error: User with this email already exists.');
          return; // Ensure no further execution
        }
        console.log('Database insertion successful'); // Log for successful DB operation
        res.redirect('/watchlist');
      }
    );
  } 
};



// Delete item from watchlist

