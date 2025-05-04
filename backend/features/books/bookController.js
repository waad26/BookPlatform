const BookService = require('./bookModel');

function handleError(res, error) {
  console.error(error.message);
  res.status(500).json({ message: 'Something went wrong' });
}

exports.getAllBooks = async (req, res) => {
  try {
    const books = await BookService.getAllBooks();
    res.json(books);
  } catch (err) {
    handleError(res, err);
  }
};

exports.getBookById = async (req, res) => {
  try {
    const book = await BookService.getBookById(req.params.id); 
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    res.json(book);
  } catch (error) {
    console.error('Error fetching book by ID:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.addBook = async (req, res) => {
  if (!req.user) return res.status(401).json({ message: 'Unauthorized' });

  const { title, author, isbn, description } = req.body;
  const coverImage = req.file ? req.file.filename : null;

  try {
    const id = await BookService.addBook({ title, author, isbn, description, coverImage });
    res.status(201).json({ message: 'Book added', id });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.updateBook = async (req, res) => {
  const { id } = req.params;
  if (!id || isNaN(id)) return res.status(400).json({ message: 'Invalid ID' });

  try {
    const count = await BookService.updateBook(id, req.body);
    count > 0
      ? res.json({ message: 'Updated successfully' })
      : res.status(404).json({ message: 'Book not found' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.deleteBook = async (req, res) => {
  const { id } = req.params;
  if (!id || isNaN(id)) return res.status(400).json({ message: 'Invalid ID' });

  try {
    const count = await BookService.deleteBook(id);
    count > 0
      ? res.json({ message: 'Deleted successfully' })
      : res.status(404).json({ message: 'Book not found' });
  } catch (err) {
    handleError(res, err);
  }
};

exports.searchBooks = async (req, res) => {
  const { keyword } = req.query;
  try {
    const books = await BookService.searchBooks(keyword);
    res.json(books);
  } catch (err) {
    handleError(res, err);
  }
};
