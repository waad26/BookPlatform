const express = require('express');
const router = express.Router();
const reviewController = require('./reviewController');
const authenticate = require('../../middleware/auth');

// Routes
router.get('/', reviewController.getAllReviews);
router.post('/', authenticate, reviewController.createReview);
router.put('/:id', authenticate, reviewController.updateReview);
router.delete('/:id', authenticate, reviewController.deleteReview);

module.exports = router;