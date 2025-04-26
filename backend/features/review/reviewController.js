const Review = require('./reviewModel');
const sanitizeHtml = require('sanitize-html');

// Get all reviews
exports.getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.findAll({
      order: [['createdAt', 'DESC']]
    });
    res.json(reviews);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Create a new review
exports.createReview = async (req, res) => {
  try {
    let { title, content, rating } = req.body;

  title = sanitizeHtml(title, { allowedTags: [], allowedAttributes: {} });
  content = sanitizeHtml(content, { allowedTags: [], allowedAttributes: {} });
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized: Login required' });
    }

    
    if (!title || !content || !rating) {
      return res.status(400).json({ message: 'Missing required fields' });
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
    console.error(error); 
    res.status(400).json({ message: 'Failed to create review' });
  }
};