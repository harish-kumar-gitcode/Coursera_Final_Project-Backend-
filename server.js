// server.js
const express = require('express');
const jwt = require('jsonwebtoken');
const morgan = require('morgan');
const books = require('./data/books');

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key-change-me';

app.use(express.json());
app.use(morgan('dev'));

// In-memory users
// Each user: { username, password }
const users = [];

// Auth middleware
function auth(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.status(401).json({ error: 'Missing Authorization header' });
  const token = authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Invalid Authorization header' });
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload; // { username }
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

app.get('/', (req, res) => {
  res.json({ message: 'Book Review API is running' });
});

// Task 1: Get the book list available in the shop
app.get('/books', (req, res) => {
  res.json(books);
});

// Task 2: Get the books based on ISBN
app.get('/books/isbn/:isbn', (req, res) => {
  const { isbn } = req.params;
  const book = books[isbn];
  if (!book) return res.status(404).json({ error: 'Book not found' });
  res.json({ [isbn]: book });
});

// Task 3: Get all books by Author
app.get('/books/author/:author', (req, res) => {
  const { author } = req.params;
  const result = Object.fromEntries(
    Object.entries(books).filter(([_, b]) => b.author.toLowerCase() === author.toLowerCase())
  );
  if (Object.keys(result).length === 0) return res.status(404).json({ error: 'No books by that author' });
  res.json(result);
});

// Task 4: Get all books based on Title
app.get('/books/title/:title', (req, res) => {
  const { title } = req.params;
  const result = Object.fromEntries(
    Object.entries(books).filter(([_, b]) => b.title.toLowerCase() === title.toLowerCase())
  );
  if (Object.keys(result).length === 0) return res.status(404).json({ error: 'No books with that title' });
  res.json(result);
});

// Task 5: Get book Review
app.get('/books/review/:isbn', (req, res) => {
  const { isbn } = req.params;
  const book = books[isbn];
  if (!book) return res.status(404).json({ error: 'Book not found' });
  res.json(book.reviews || {});
});

// Task 6: Register New user
app.post('/register', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: 'username and password are required' });
  if (users.find(u => u.username === username)) {
    return res.status(409).json({ error: 'User already exists' });
  }
  users.push({ username, password });
  res.status(201).json({ message: 'User registered successfully' });
});

// Task 7: Login as a Registered user
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username && u.password === password);
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });
  const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '2h' });
  res.json({ token });
});

// Registered Users:
// Task 8: Add/Modify a book review
app.put('/review/:isbn', auth, (req, res) => {
  const { isbn } = req.params;
  const { review } = req.body;
  const { username } = req.user;

  const book = books[isbn];
  if (!book) return res.status(404).json({ error: 'Book not found' });
  if (!review || typeof review !== 'string') return res.status(400).json({ error: 'review (string) is required' });

  if (!book.reviews) book.reviews = {};
  book.reviews[username] = review;
  res.json({ message: 'Review added/updated', reviews: book.reviews });
});

// Task 9: Delete book review added by that particular user
app.delete('/review/:isbn', auth, (req, res) => {
  const { isbn } = req.params;
  const { username } = req.user;
  const book = books[isbn];
  if (!book) return res.status(404).json({ error: 'Book not found' });
  if (!book.reviews || !book.reviews[username]) {
    return res.status(404).json({ error: 'No review by this user to delete' });
  }
  delete book.reviews[username];
  res.json({ message: 'Review deleted', reviews: book.reviews });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
