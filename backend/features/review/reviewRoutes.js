const express = require('express');
const router = express.Router();
const reviewController = require('./reviewController');
const authenticate = require('../../middleware/authenticate'); 

router.get('/', reviewController.getAllReviews);
router.post('/', authenticate, reviewController.createReview);

module.exports = router;