// backend/config/db.js
const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT || 'mysql',
    logging: false
  }
);

module.exports = {
  username: 'root',
  password: '2410972',
  database: 'bookplatform_test',
  host: 'localhost',
  dialect: 'mysql', // أو ما يناسب قاعدة بياناتك
};
