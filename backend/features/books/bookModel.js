const db = require('../../config/db');


function validateBookData(bookData) {
  const { title, author, isbn, coverImage } = bookData;

  if (!title || typeof title !== 'string' || title.length > 255) {
    throw new Error('Invalid title. It must be a non-empty string and less than 255 characters.');
  }

  if (!author || typeof author !== 'string' || author.length > 255) {
    throw new Error('Invalid author. It must be a non-empty string and less than 255 characters.');
  }

  if (!isbn || !/^\d{10,13}$/.test(isbn)) {
    throw new Error('Invalid ISBN. It must be a 10 to 13 digit number.');
  }

  if (coverImage && typeof coverImage !== 'string') {
    throw new Error('Invalid cover image URL.');
  }
}


async function executeQuery(query, params) {
  try {
    const [results] = await db.promise().query(query, params);
    return results;
  } catch (error) {
    console.error('Database error:', error.message); 
    throw new Error('Something went wrong, please try again later.');
  }
}


async function getBookById(id) {
  const query = 'SELECT * FROM books WHERE id = ?';
  return await executeQuery(query, [id]);
}


async function getAllBooks() {
  const query = 'SELECT * FROM books';
  return await executeQuery(query);
}


async function addBook(bookData) {
  validateBookData(bookData);

  const { title, author, isbn, coverImage } = bookData;
  const query = 'INSERT INTO books (title, author, isbn, coverImage) VALUES (?, ?, ?, ?)';
  const result = await executeQuery(query, [title, author, isbn, coverImage]);
  
  return result.insertId;
}


async function updateBook(id, updatedData) {
  validateBookData(updatedData);

  const query = 'UPDATE books SET ? WHERE id = ?';
  return await executeQuery(query, [updatedData, id]);
}


async function deleteBook(id) {
  const query = 'DELETE FROM books WHERE id = ?';
  return await executeQuery(query, [id]);
}


async function searchBooks(keyword) {
  if (!keyword || typeof keyword !== 'string') {
    throw new Error('Search keyword must be a valid string.');
  }

  const query = `
    SELECT * FROM books
    WHERE title LIKE ? OR author LIKE ? OR genre LIKE ? OR isbn LIKE ?
  `;
  const likeKeyword = `%${keyword}%`;
  return await executeQuery(query, [likeKeyword, likeKeyword, likeKeyword, likeKeyword]);
}

module.exports = {
  getBookById,
  getAllBooks,
  addBook,
  updateBook,
  deleteBook,
  searchBooks
};

