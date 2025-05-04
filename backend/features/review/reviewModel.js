// backend/features/review/reviewModel.js
const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');  

const Review = sequelize.define('Review', {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: { notEmpty: true, len: [3, 255] }
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: { notEmpty: true, len: [10, 5000] }
  },
  rating: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: { min: 1, max: 5 }
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  tableName:'reviews',
  timestamps: true,
  paranoid: true  // soft delete
});


module.exports = Review;
