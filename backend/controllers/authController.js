// backend/controllers/authController.js
const db = require('../config/db');

const signUpUser = (req, res) => {
  const { username, email, password } = req.body;
  db.run(
    `INSERT INTO users (username, email, password) VALUES (?, ?, ?)`,
    [username, email, password],
    (err) => {
      if (err) {
        console.error("Error saving user data:", err);
        res.status(400).send("Error: User with this email already exists.");
      } else {
        console.log(username, email);
        db.run(
            `INSERT INTO wallet (userId, walletBalance) VALUES (?, ?)`,
            [email, 100000],
            (err) => {
              if (err) {
                console.error("Error saving user data:", err);
                res.status(400).send("Error: User with this email already exists.");
              } else {
                console.log(username, email);
                res.redirect('/signin'); // Redirect to sign-in page upon successful signup
              }
            }
          );
        //res.redirect('/signin'); // Redirect to sign-in page upon successful signup
      }
    }
  );
  
};

const getUser = (email, password) => {
    return new Promise((resolve, reject) => {
      db.get(
        `SELECT * FROM users WHERE email = ? AND password = ?`,
        [email, password],
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
  
  // Use getUser in the signInUser function
  const signInUser = async (req, res) => {
    if (req.session.user) {
      return res.redirect('/home'); // Redirect if already signed in
    }
  
    const { email, password } = req.body;
    try {
      const user = await getUser(email, password); // Await the result from getUser
  
      if (user) {
        req.session.user = { id: user.email, username: user.username }; // Store user in session
        console.log('User found:', user); // Should now correctly log the user
        res.redirect('/home'); // Redirect to home page after successful sign-in
      } else {
        res.send('Invalid username or password'); // Simple error message
      }
    } catch (error) {
      console.error("Error during sign-in:", error);
      res.status(500).send("Error: Something went wrong.");
    }
  };
  



module.exports = { signUpUser, signInUser };
