// backend/app.js
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();
const path = require('path');

const userRoutes = require('./features/user/userRoutes');
const bookRoutes = require('./features/books/bookRoutes');
const reviewRoutes = require('./features/review/reviewRoutes');

const app = express();
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Middlewares
app.use(helmet());
app.use(cors({
    origin: 'http://127.0.0.1:5500',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
  }));
  
app.use(express.json());

// Routes
app.use('/api/user', userRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/review', reviewRoutes);

// Error handling for unknown routes
app.use((req, res) => {
res.status(404).send({ message: 'Route not found' });
});

// Sync database (optional, comment out if using mocking)
const sequelize = require('./config/db');
sequelize.sync()
.then(() => console.log("Connected to DB:", sequelize.config.database))
.catch(err => console.error('Database sync error:', err));

module.exports = app;
