// client.js
// Node.JS program using Axios with different async patterns for Tasks 10-13
const axios = require('axios');
const API = 'http://localhost:5000';

// Helper: pretty print
function print(title, data) {
  console.log(`\n=== ${title} ===`);
  console.dir(data, { depth: null });
}

// Task 10: Get all books – Using async callback function
// We'll expose a function that accepts a Node-style callback
async function getAllBooksCallback(cb) {
  try {
    const res = await axios.get(`${API}/books`);
    cb(null, res.data);
  } catch (err) {
    cb(err);
  }
}

// Task 11: Search by ISBN – Using Promises (return a Promise)
function searchByISBN(isbn) {
  return axios.get(`${API}/books/isbn/${isbn}`).then(res => res.data);
}

// Task 12: Search by Author – Using async/await
async function searchByAuthor(author) {
  const res = await axios.get(`${API}/books/author/${encodeURIComponent(author)}`);
  return res.data;
}

// Task 13: Search by Title – Using .then/.catch chain
function searchByTitle(title) {
  return axios
    .get(`${API}/books/title/${encodeURIComponent(title)}`)
    .then(res => res.data);
}

// Demo runner for convenience (optional)
async function demo() {
  // Task 10
  await new Promise((resolve) => {
    getAllBooksCallback((err, data) => {
      if (err) {
        console.error('Task 10 Error:', err.response ? err.response.data : err.message);
      } else {
        print('Task 10: All Books', data);
      }
      resolve();
    });
  });

  // Task 11
  try {
    const t11 = await searchByISBN('9780451524935');
    print('Task 11: By ISBN 9780451524935', t11);
  } catch (err) {
    console.error('Task 11 Error:', err.response ? err.response.data : err.message);
  }

  // Task 12
  try {
    const t12 = await searchByAuthor('George Orwell');
    print('Task 12: By Author George Orwell', t12);
  } catch (err) {
    console.error('Task 12 Error:', err.response ? err.response.data : err.message);
  }

  // Task 13
  searchByTitle('1984')
    .then((data) => print('Task 13: By Title 1984', data))
    .catch((err) => console.error('Task 13 Error:', err.response ? err.response.data : err.message));
}

// Run demo if executed directly
if (require.main === module) {
  demo();
}

module.exports = {
  getAllBooksCallback,
  searchByISBN,
  searchByAuthor,
  searchByTitle,
};
