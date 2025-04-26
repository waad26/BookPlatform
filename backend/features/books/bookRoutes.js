
const express = require('express');
const router = express.Router();
const BookController = require('../controllers/BookController');


router.get('/books', BookController.getAllBooks);


router.get('/books/:id', BookController.getBookById);


router.post('/books', BookController.addBook);


router.put('/books/:id', BookController.updateBook);


router.delete('/books/:id', BookController.deleteBook);


router.get('/search', BookController.searchBooks);

module.exports = router;