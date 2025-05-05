const { DataTypes, Op } = require('sequelize');
const db = require('../../config/db');

const Book = db.define('Book', {
  title: { type: DataTypes.STRING(255), allowNull: false },
  author: { type: DataTypes.STRING(255), allowNull: false },
  isbn: { type: DataTypes.STRING(13), allowNull: false },
  coverImage: { type: DataTypes.STRING, allowNull: true },
  description: { type: DataTypes.TEXT, allowNull: true }
}, {
  tableName : 'books',
  timestamps: true
});

function validateBookData(data) {
  const { title, author, isbn, coverImage, description } = data;
  if (!title || typeof title !== 'string' || title.length > 255)
    throw new Error('Invalid title');
  if (!author || typeof author !== 'string' || author.length > 255)
    throw new Error('Invalid author');
  if (!isbn || !/^\d{10,13}$/.test(isbn))
    throw new Error('Invalid ISBN');
  if (coverImage && typeof coverImage !== 'string')
    throw new Error('Invalid cover image');
  if (description && typeof description !== 'string')
    throw new Error('Invalid description');
}

module.exports = {
  Book,
  validateBookData,

  async getBookById(id) {
    return await Book.findByPk(id);
  },

  async getAllBooks() {
    return await Book.findAll();
  },

  async addBook(bookData) {
    validateBookData(bookData);
    const newBook = await Book.create(bookData);
    return newBook.id;
  },

  async updateBook(id, updatedData) {
    validateBookData(updatedData);
    const [count] = await Book.update(updatedData, { where: { id } });
    return count;
  },

  async deleteBook(id) {
    return await Book.destroy({ where: { id } });
  },

  async searchBooks(keyword) {
    if (!keyword || typeof keyword !== 'string')
      throw new Error('Invalid keyword');
    return await Book.findAll({
      where: {
        [Op.or]: [
          { title: { [Op.like]: `%${keyword}%` } },
          { author: { [Op.like]: `%${keyword}%` } },
          { isbn: { [Op.like]: `%${keyword}%` } },
          { description: { [Op.like]: `%${keyword}%` } }
        ]
      }
    });
  }
};
