const Book = require('../models/BookModel');


function handleError(res, error) {
  console.error(error.message); 
  res.status(500).json({ message: 'Something went wrong, please try again later.' });
}

// Get all books
async function getAllBooks(req, res) {
  try {
    const books = await Book.getAllBooks();
    res.status(200).json(books);
  } catch (error) {
    handleError(res, error);
  }
}

// Get book by ID
async function getBookById(req, res) {
  const { id } = req.params;

  if (!id || isNaN(id)) {
    return res.status(400).json({ message: 'Invalid book ID.' });
  }

  try {
    const book = await Book.getBookById(id);
    if (book) {
      res.status(200).json(book);
    } else {
      res.status(404).json({ message: 'Book not found.' });
    }
  } catch (error) {
    handleError(res, error);
  }
}

// Add a new book
async function addBook(req, res) {
  const bookData = req.body;

  try {
    const newBookId = await Book.addBook(bookData);
    res.status(201).json({ message: 'Book added successfully.', id: newBookId });
  } catch (error) {
    res.status(400).json({ message: error.message }); 
  }
}

// Update a book
async function updateBook(req, res) {
  const { id } = req.params;
  const updatedData = req.body;

  if (!id || isNaN(id)) {
    return res.status(400).json({ message: 'Invalid book ID.' });
  }

  try {
    const result = await Book.updateBook(id, updatedData);
    if (result.affectedRows > 0) {
      res.status(200).json({ message: 'Book updated successfully.' });
    } else {
      res.status(404).json({ message: 'Book not found.' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

// Delete a book
async function deleteBook(req, res) {
  const { id } = req.params;

  if (!id || isNaN(id)) {
    return res.status(400).json({ message: 'Invalid book ID.' });
  }

  try {
    const result = await Book.deleteBook(id);
    if (result.affectedRows > 0) {
      res.status(200).json({ message: 'Book deleted successfully.' });
    } else {
      res.status(404).json({ message: 'Book not found.' });
    }
  } catch (error) {
    handleError(res, error);
  }
}

// Search for books
async function searchBooks(req, res) {
  const { keyword } = req.query;

  if (!keyword || typeof keyword !== 'string') {
    return res.status(400).json({ message: 'Invalid search keyword.' });
  }

  try {
    const books = await Book.searchBooks(keyword);
    res.status(200).json(books);
  } catch (error) {
    handleError(res, error);
  }
}

module.exports = {
  getAllBooks,
  getBookById,
  addBook,
  updateBook,
  deleteBook,
  searchBooks
};
