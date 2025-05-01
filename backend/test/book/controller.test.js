const bookController = require('../../features/books/bookController');
const Book = require('../../features/books/bookModel');
const db = require('../../config/db');

jest.mock('../../features/books/bookModel');
jest.mock('../../config/db');

beforeAll(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
    jest.spyOn(console, 'warn').mockImplementation(() => {});
  });
  afterAll(() => {
    console.error.mockRestore();
    console.warn.mockRestore();
  });
  

describe('Book Controller (unit)', () => {
  let req, res;

  beforeEach(() => {
    req = { body: {}, params: {}, query: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
  });

  describe('getAllBooks', () => {
    it('should return 200 with list of books', async () => {
      const books = [{ id: 1, title: 'Book 1' }, { id: 2, title: 'Book 2' }];
      Book.getAllBooks.mockResolvedValue(books);

      await bookController.getAllBooks(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(books);
    });

    it('should return 500 if database error occurs', async () => {
      const error = new Error('Database error');
      Book.getAllBooks.mockRejectedValue(error);

      await bookController.getAllBooks(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Something went wrong, please try again later.' });
    });
  });

  describe('getBookById', () => {
    it('should return 400 if id is invalid', async () => {
      req.params = { id: 'invalid' };

      await bookController.getBookById(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Invalid book ID.' });
    });

    it('should return 404 if book not found', async () => {
      req.params = { id: 1 };
      Book.getBookById.mockResolvedValue(null);

      await bookController.getBookById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Book not found.' });
    });

    it('should return 200 with book data if found', async () => {
      const book = { id: 1, title: 'Book 1' };
      req.params = { id: 1 };
      Book.getBookById.mockResolvedValue(book);

      await bookController.getBookById(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(book);
    });
  });

  describe('addBook', () => {
    it('should return 201 if book is added successfully', async () => {
      const bookData = { title: 'Book 1', author: 'Author 1', isbn: '1234567890', coverImage: 'image.jpg' };
      req.body = bookData;
      Book.addBook.mockResolvedValue(1);  // Assuming it returns the new book's ID.

      await bookController.addBook(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ message: 'Book added successfully.', id: 1 });
    });

    it('should return 400 if there is a validation error', async () => {
      const error = new Error('Invalid title');
      req.body = { title: '', author: 'Author', isbn: '123' };
      Book.addBook.mockRejectedValue(error);

      await bookController.addBook(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Invalid title' });
    });
  });

  describe('updateBook', () => {
    it('should return 400 if id is invalid', async () => {
      req.params = { id: 'invalid' };
      req.body = { title: 'Updated Book' };

      await bookController.updateBook(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Invalid book ID.' });
    });

    it('should return 404 if book not found', async () => {
      req.params = { id: 1 };
      req.body = { title: 'Updated Book' };
      Book.updateBook.mockResolvedValue({ affectedRows: 0 });

      await bookController.updateBook(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Book not found.' });
    });

    it('should return 200 if book is updated successfully', async () => {
      req.params = { id: 1 };
      req.body = { title: 'Updated Book' };
      Book.updateBook.mockResolvedValue({ affectedRows: 1 });

      await bookController.updateBook(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Book updated successfully.' });
    });
  });

  describe('deleteBook', () => {
    it('should return 400 if id is invalid', async () => {
      req.params = { id: 'invalid' };

      await bookController.deleteBook(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Invalid book ID.' });
    });

    it('should return 404 if book not found', async () => {
      req.params = { id: 1 };
      Book.deleteBook.mockResolvedValue({ affectedRows: 0 });

      await bookController.deleteBook(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Book not found.' });
    });

    it('should return 200 if book is deleted successfully', async () => {
      req.params = { id: 1 };
      Book.deleteBook.mockResolvedValue({ affectedRows: 1 });

      await bookController.deleteBook(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Book deleted successfully.' });
    });
  });

  describe('searchBooks', () => {
    it('should return 400 if keyword is missing', async () => {
      req.query = {};

      await bookController.searchBooks(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Invalid search keyword.' });
    });

    it('should return 200 with books matching the keyword', async () => {
      req.query = { keyword: 'test' };
      const books = [{ id: 1, title: 'Book 1' }];
      Book.searchBooks.mockResolvedValue(books);

      await bookController.searchBooks(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(books);
    });

    it('should return 500 if database error occurs', async () => {
      const error = new Error('Database error');
      req.query = { keyword: 'test' };
      Book.searchBooks.mockRejectedValue(error);

      await bookController.searchBooks(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Something went wrong, please try again later.' });
    });
  });
});
