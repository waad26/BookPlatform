const Book = require('./bookModel');


async function getAllBooks(req, res) {
  try {
    const books = await Book.getAllBooks();
    res.status(200).json(books); 
  } catch (err) {
    res.status(500).json({ message: err.message }); 
  }
}


async function getBookById(req, res) {
  const { id } = req.params;
  try {
    const book = await Book.getBookById(id);
    if (book) {
      res.status(200).json(book);
    } else {
      res.status(404).json({ message: 'Book not found' }); 
    }
  } catch (err) {
    res.status(500).json({ message: err.message }); 
  }
}


async function addBook(req, res) {
  const bookData = req.body; 
  try {
    const newBookId = await Book.addBook(bookData); 
    res.status(201).json({ message: 'Book added', id: newBookId }); 
  } catch (err) {
    res.status(400).json({ message: err.message }); 
  }
}


async function updateBook(req, res) {
  const { id } = req.params;
  const updatedData = req.body;
  try {
    const result = await Book.updateBook(id, updatedData);
    if (result.affectedRows > 0) {
      res.status(200).json({ message: 'Book updated' }); 
    } else {
      res.status(404).json({ message: 'Book not found' }); 
    }
  } catch (err) {
    res.status(400).json({ message: err.message }); 
  }
}


async function deleteBook(req, res) {
  const { id } = req.params;
  try {
    const result = await Book.deleteBook(id);
    if (result.affectedRows > 0) {
      res.status(200).json({ message: 'Book deleted' }); 
    } else {
      res.status(404).json({ message: 'Book not found' }); 
    }
  } catch (err) {
    res.status(500).json({ message: err.message }); 
  }
}


async function searchBooks(req, res) {
  const { keyword } = req.query; 
  try {
    const books = await Book.searchBooks(keyword);
    res.status(200).json(books); 
  } catch (err) {
    res.status(500).json({ message: err.message }); 
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
