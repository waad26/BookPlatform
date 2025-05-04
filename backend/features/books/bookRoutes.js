const express = require('express');
const router = express.Router();
const BookController = require('./bookController');
const authenticateToken = require('../../middleware/auth');
const multer = require('multer');
const path = require('path');

// إعداد multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

// Routes
router.get('/books', BookController.getAllBooks);
router.get('/books/:id', BookController.getBookById);
router.get('/books/search', BookController.searchBooks);
router.post('/add', authenticateToken, upload.single('coverImage'), BookController.addBook);
router.put('/books/:id', BookController.updateBook);
router.delete('/books/:id', BookController.deleteBook);

module.exports = router;
