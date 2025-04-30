const express = require('express');
const router = express.Router();
const BookController = require('./bookController');

// Get all books
router.get('/books', BookController.getAllBooks);

// Get a single book by ID
router.get('/books/:id', BookController.getBookById);

// Add a new book
router.post('/books', BookController.addBook);

// Update an existing book
router.put('/books/:id', BookController.updateBook);

// Delete a book
router.delete('/books/:id', BookController.deleteBook);

// Search for books
router.get('/books/search', BookController.searchBooks);

module.exports = router;
