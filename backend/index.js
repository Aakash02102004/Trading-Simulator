// backend/index.js
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const session = require('express-session');
const signUpRoute = require('./routes/signup');
const signInRoute = require('./routes/signin');
const watchlistRoute = require('./routes/watchlist');
//const cors = require('cors');
const orderRoutes = require('./routes/orderRoutes');
const portfolioRoutes = require('./routes/portfolioRoutes');
const fetchPortfolioRoutes = require('./routes/portfolior');
const walletRoutes = require('./routes/walletRoutes');

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../frontend')));

// Session setup
app.use(session({
    secret: 'your_secret_key',  // Use a strong secret in production
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }  // Set to true if using HTTPS
}));

// Serve Home Page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// Serve Signup Page
app.get('/signup', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/signup.html'));
});

// Serve Signin Page
app.get('/signin', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/signin.html'));
});
app.get('/buy', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/buy.html'));
});

// Serve Home Page After Login
// Routes
app.get('/home', (req, res) => {
    if (req.session.user) {
        const username=req.session.user.username;
        console.log(username);
        res.sendFile(path.join(__dirname, '../frontend/home.html'));
    } else {
        res.redirect('/signin');
    }
    
});

app.get('/watchlist', (req, res) => {
    // You may need to specify the path to 'watchlist.html' if it's in a subdirectory, e.g., 'views/watchlist.html'
    if (req.session.user) {
        res.sendFile(path.join(__dirname, '../frontend/watchlist.html'));
    } else {
        res.redirect('/signin');
    }
  });
  app.get('/portfoliomain', (req, res) => {
    // You may need to specify the path to 'watchlist.html' if it's in a subdirectory, e.g., 'views/watchlist.html'
    if (req.session.user) {
        res.sendFile(path.join(__dirname, '../frontend/portfolio.html'));
    } else {
        res.redirect('/signin');
    }
  });
  app.get('/wallet', (req, res) => {
    // You may need to specify the path to 'watchlist.html' if it's in a subdirectory, e.g., 'views/watchlist.html'
    if (req.session.user) {
        res.sendFile(path.join(__dirname, '../frontend/wallet.html'));
    } else {
        res.redirect('/signin');
    }
  });


// API Routes

app.use('/api/signup', signUpRoute);
app.use('/api/signin', signInRoute);
app.use(express.json());
app.use('/api/watchlist', watchlistRoute); // Add watchlist route
app.use('/api/order', orderRoutes);
app.use('/api/portfolio', portfolioRoutes);
app.use('/api/fetchportfolio', fetchPortfolioRoutes);
app.use('/api/wallet/', walletRoutes);

// Logout route
app.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.redirect('/home');
        }
        res.redirect('/signin'); // Redirect to sign-in page after logout
    });
});


// Start Server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
