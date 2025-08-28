# Book Review Project (Coursera Final Project)

This repository implements all API endpoints and Node.js Axios methods.

## How to Run

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the server:
   ```bash
   npm start
   # Server runs on http://localhost:5000
   ```
3. In another terminal, run the Axios client demo (Tasks 10–13):
   ```bash
   npm run client
   ```

## API Endpoints (Tasks 1–9)

- **Task 1**: `GET /books` – Get the book list available in the shop.
- **Task 2**: `GET /books/isbn/:isbn` – Get book by ISBN.
- **Task 3**: `GET /books/author/:author` – Get all books by author (exact match, case-insensitive).
- **Task 4**: `GET /books/title/:title` – Get all books by title (exact match, case-insensitive).
- **Task 5**: `GET /books/review/:isbn` – Get reviews for a book (object keyed by username).
- **Task 6**: `POST /register` – Register new user.
  - Body: `{ "username": "alice", "password": "secret" }`
- **Task 7**: `POST /login` – Login as registered user.
  - Body: `{ "username": "alice", "password": "secret" }`
  - Returns: `{ "token": "..." }` (JWT). Use in header: `Authorization: Bearer <token>`
- **Task 8**: `PUT /review/:isbn` – Add/Modify a book review (auth required).
  - Header: `Authorization: Bearer <token>`
  - Body: `{ "review": "Great read!" }`
- **Task 9**: `DELETE /review/:isbn` – Delete your own review (auth required).
  - Header: `Authorization: Bearer <token>`

### Sample cURL for Screenshots

Use these commands and take screenshots of the responses for submission.

```bash
# Task 1
curl http://localhost:5000/books

# Task 2
curl http://localhost:5000/books/isbn/9780451524935

# Task 3
curl http://localhost:5000/books/author/George%20Orwell

# Task 4
curl http://localhost:5000/books/title/1984

# Task 5
curl http://localhost:5000/books/review/9780451524935

# Task 6
curl -X POST http://localhost:5000/register -H "Content-Type: application/json" -d '{"username":"alice","password":"secret"}'

# Task 7
curl -X POST http://localhost:5000/login -H "Content-Type: application/json" -d '{"username":"alice","password":"secret"}'
# Copy token from response into the next two requests:
TOKEN=PASTE_YOUR_TOKEN_HERE

# Task 8
curl -X PUT http://localhost:5000/review/9780451524935 \
     -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
     -d '{"review":"Disturbingly relevant classic."}'

# Task 9
curl -X DELETE http://localhost:5000/review/9780451524935 -H "Authorization: Bearer $TOKEN"
```

## Axios Methods (Tasks 10–13)

Implemented in `client.js`:

- **Task 10** – `getAllBooksCallback(cb)` uses `async/await` internally and invokes a Node-style callback.
- **Task 11** – `searchByISBN(isbn)` returns a **Promise**.
- **Task 12** – `searchByAuthor(author)` uses **async/await** and returns data.
- **Task 13** – `searchByTitle(title)` uses a **then/catch** promise chain.
