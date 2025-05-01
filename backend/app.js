// backend/app.js
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

const userRouter = require('./features/user/userRoutes');
const bookRouter = require('./features/book/bookRouter');
const reviewRouter = require('./features/review/reviewRouter');

const app = express();

// Middlewares
app.use(helmet());
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/user', userRouter);
app.use('/api/book', bookRouter);
app.use('/api/review', reviewRouter);

// Error handling for unknown routes
app.use((req, res) => {
  res.status(404).send({ message: 'Route not found' });
});

// Sync database (optional, comment out if using mocking)
const sequelize = require('./config/db');
sequelize.sync()
  .then(() => console.log('Database synchronized'))
  .catch(err => console.error('Database sync error:', err));

module.exports = app;
