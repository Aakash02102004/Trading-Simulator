const watchlistController = require('./watchlistController');
const db = require('../config/db'); // Mocked database
const httpMocks = require('node-mocks-http');

//jest.mock('../config/db'); // Mock the database module

jest.mock('../config/db', () => ({
    run: jest.fn(),
    all: jest.fn(),
  }));

describe('Watchlist Controller - addItem', () => {
  let req, res;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    req.session = {}; // Mock session object
    jest.spyOn(console, 'log').mockImplementation(() => {}); // Mock console.log
    jest.spyOn(console, 'error').mockImplementation(() => {}); // Mock console.error
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should add an item to the watchlist when user is logged in', () => {
    // Arrange
    req.session.user = { id: 1 }; // Mock logged-in user
    req.body = { symbol: 'AAPL' }; // Mock request body
    db.run.mockImplementation((query, params, callback) => callback(null)); // Mock successful DB insertion

    // Act
    watchlistController.addItem2(req, res);

    // Assert
    expect(console.log).toHaveBeenCalledWith('addItem function called');
    expect(console.log).toHaveBeenCalledWith('User is logged in');
    expect(console.log).toHaveBeenCalledWith('Database insertion successful');
    expect(db.run).toHaveBeenCalledWith(
      'INSERT INTO watchlist (user_id, symbol) VALUES (?, ?)',
      [1, 'AAPL'],
      expect.any(Function)
    );
    expect(res._getStatusCode()).toBe(302); // Redirect status
    expect(res._getRedirectUrl()).toBe('/watchlist'); // Redirect location
  });

  test('should add an item to the watchlist when user is not logged in but symbol is input', () => {
    // Arrange
    req.session.user = null ; // Mock logged-in user
    req.body = { symbol: 'AAPL' }; // Mock request body
    db.run.mockImplementation((query, params, callback) => callback(null)); // Mock successful DB insertion

    // Act
    watchlistController.addItem2(req, res);

    // Assert
    expect(console.log).toHaveBeenCalledWith('addItem function called');
    expect(console.log).toHaveBeenCalledWith('User is logged in');
    expect(console.log).toHaveBeenCalledWith('Database insertion successful');
    expect(db.run).toHaveBeenCalledWith(
      'INSERT INTO watchlist (user_id, symbol) VALUES (?, ?)',
      [1, 'AAPL'],
      expect.any(Function)
    );
    expect(res._getStatusCode()).toBe(302); // Redirect status
    expect(res._getRedirectUrl()).toBe('/watchlist'); // Redirect location
  });

  test('should redirect to /signin when user is not logged in', () => {
    // Arrange
    req.session.user = null; // Mock no logged-in user

    // Act
    watchlistController.addItem2(req, res);

    // Assert
    expect(console.log).toHaveBeenCalledWith('addItem function called');
    expect(console.log).toHaveBeenCalledWith('User is not logged in, redirecting to /signin');
    expect(db.run).not.toHaveBeenCalled(); // DB run should not be called
    expect(res._getStatusCode()).toBe(302); // Redirect status
    expect(res._getRedirectUrl()).toBe('/signin');; // Redirect location
  });




  test('should handle database errors gracefully', () => {
    // Arrange
    req.session.user = { id: 1 }; // Mock logged-in user
    req.body = { symbol: 'AAPL' }; // Mock request body

    // Mock database error
    db.run.mockImplementation((query, params, callback) =>
      callback(new Error('Database error'))
    );

    // Act
    watchlistController.addItem2(req, res);

    // Assert
    expect(console.log).toHaveBeenCalledWith('addItem function called');
    expect(console.log).toHaveBeenCalledWith('User is logged in');
    expect(console.error).toHaveBeenCalledWith(
      'Error saving user data:',
      expect.any(Error)
    );
    expect(res._getStatusCode()).toBe(400); // Error status
    expect(res._getData()).toBe('Error: User with this email already exists.'); // Assert error message
  });
});
