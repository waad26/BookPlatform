const db = require('../../config/db');


async function getBookById(id) {
  const query = 'SELECT * FROM books WHERE id = ?';
  try {
    const [results] = await db.promise().query(query, [id]);
    return results[0]; 
  } catch (err) {
    throw err; 
  }
}


async function getAllBooks() {
  const query = 'SELECT * FROM books';
  try {
    const [results] = await db.promise().query(query);
    return results;
  } catch (err) {
    throw err;
  }
}


async function addBook(bookData) {
  const { title, author, isbn, coverImage } = bookData;

  
  if (!title || !author || !isbn) {
    throw new Error('Title, author, and ISBN are required!');
  }

  const query = 'INSERT INTO books (title, author, isbn, coverImage) VALUES (?, ?, ?, ?)';
  try {
    const [result] = await db.promise().query(query, [title, author, isbn, coverImage]);
    return result.insertId; 
  } catch (err) {
    throw err;
  }
}


async function updateBook(id, updatedData) {
  const query = 'UPDATE books SET ? WHERE id = ?';
  try {
    const [result] = await db.promise().query(query, [updatedData, id]);
    return result;
  } catch (err) {
    throw err;
  }
}


async function deleteBook(id) {
  const query = 'DELETE FROM books WHERE id = ?';
  try {
    const [result] = await db.promise().query(query, [id]);
    return result;
  } catch (err) {
    throw err;
  }
}


async function searchBooks(keyword) {
  const query = `
    SELECT * FROM books
    WHERE title LIKE ? OR author LIKE ? OR genre LIKE ? OR isbn LIKE ?`;
  const likeKeyword = `%${keyword}%`;
  try {
    const [results] = await db.promise().query(query, [likeKeyword, likeKeyword, likeKeyword, likeKeyword]);
    return results;
  } catch (err) {
    throw err;
  }
}

module.exports = {
  getBookById,
  getAllBooks,
  addBook,
  updateBook,
  deleteBook,
  searchBooks
};
