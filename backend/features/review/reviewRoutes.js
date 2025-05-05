const express = require('express');
const router = express.Router();
const reviewController = require('./reviewController');
const authenticate = require('../../middleware/auth');

// Routes
router.get('/', reviewController.getAllReviews);
router.post('/book/:bookId', authenticate, reviewController.createReviewForBook);
router.put('/:id', authenticate, reviewController.updateReview);
router.delete('/:id', authenticate, reviewController.deleteReview);
router.get('/book/:bookId', reviewController.getReviewsByBook);

module.exports = router;