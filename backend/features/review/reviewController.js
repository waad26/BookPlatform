const Review = require('./reviewModel');
const sanitizeHtml = require('sanitize-html');

// Custom Error Logger (A09 - Logging)
const logError = (error) => {
  console.error(`[ERROR] ${new Date().toISOString()}: ${error.message}`);
};

// Get all reviews (Public)
exports.getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.findAll({
      order: [['createdAt', 'DESC']],
      attributes: ['id', 'title', 'content', 'rating', 'createdAt', 'userId'],
    });
    res.status(200).json(reviews);
  } catch (error) {
    logError(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Create a new review
exports.createReview = async (req, res) => {
  try {
    let { title, content, rating } = req.body;

    if (!title || !content || !rating) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    title = sanitizeHtml(title, { allowedTags: [], allowedAttributes: {} });
    content = sanitizeHtml(content, { allowedTags: [], allowedAttributes: {} });

    const userId = req.user.id;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized: Login required' });
    }

    const review = await Review.create({
      title,
      content,
      rating,
      userId
    });

    res.status(201).json({
      message: 'Review created successfully',
      review
    });
  } catch (error) {
    logError(error);
    res.status(400).json({ message: 'Failed to create review' });
  }
};


exports.createReviewForBook = async (req, res) => {
  try {
    const { content , rating} = req.body;
    const bookId = req.params.bookId;

    if (!content || !rating ) {
      return res.status(400).json({ message: 'Review content or rating is required' });
    }

    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: 'Unauthorized: Login required' });
    }

    const userId = req.user.id;

    const review = await Review.create({
      title: 'Review',
      content,
      rating ,   
      bookId,
      userId
    });

    res.status(201).json({
      message: 'Review created successfully',
      review
    });
  } catch (error) {
    console.error('Error creating review:', error);
    res.status(500).json({ message: 'Failed to create review' });
  }
};


// Update an existing review
exports.updateReview = async (req, res) => {
  try {
    const { title, content, rating } = req.body;
    const reviewId = req.params.id;

    console.log('Review ID:', reviewId);
    console.log('User:', req.user);

    const review = await Review.findByPk(reviewId);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    if (review.userId !== req.user.id) {
      return res.status(403).json({ message: 'Forbidden: You cannot edit others reviews' });
    }

    if (title) review.title = sanitizeHtml(title, { allowedTags: [], allowedAttributes: {} });
    if (content) review.content = sanitizeHtml(content, { allowedTags: [], allowedAttributes: {} });
    if (rating) review.rating = rating;

    await review.save();
    res.status(200).json({ message: 'Review updated successfully', review });
  } catch (error) {
    console.error('Update Error:', error); // مهم جداً
    res.status(500).json({ message: 'Internal server error' });
  }
};


// Delete a review
exports.deleteReview = async (req, res) => {
  try {
    const reviewId = req.params.id;

    const review = await Review.findByPk(reviewId);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    if (review.userId !== req.user.id) {
      return res.status(403).json({ message: 'Forbidden: You cannot delete others reviews' });
    }

    await review.destroy();
    res.status(200).json({ message: 'Review deleted successfully' });
  } catch (error) {
    logError(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.getReviewsByBook = async (req, res) => {
  try {
    const reviews = await Review.findAll({ 
      where: {bookId: req.params.bookId }
    });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching reviews by book ID' });
  }
};