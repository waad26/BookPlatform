jest.mock('../../features/review/reviewModel');
const Review = require('../../features/review/reviewModel');

const {
  getAllReviews,
  createReview,
  updateReview,
  deleteReview
} = require('../../features/review/reviewController');

describe('reviewController', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // -------------------- getAllReviews --------------------
  describe('getAllReviews', () => {
    it('should return all reviews', async () => {
      const req = {};
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      Review.findAll.mockResolvedValue([{ id: 1, title: 'Test' }]);

      await getAllReviews(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(expect.any(Array));
    });

    it('should return 500 if DB error occurs', async () => {
      const req = {};
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      Review.findAll.mockRejectedValue(new Error('DB Error'));

      await getAllReviews(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Internal server error' });
    });
  });

  // -------------------- createReview --------------------
  describe('createReview', () => {
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    it('should create a review', async () => {
      const req = {
        body: { title: 'A', content: 'B', rating: 5 },
        user: { id: 1 }
      };

      Review.create.mockResolvedValue({ id: 1 });

      await createReview(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        message: 'Review created successfully'
      }));
    });

    it('should return 400 if required fields are missing', async () => {
      const req = { body: { title: '', content: '', rating: null }, user: { id: 1 } };

      await createReview(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Missing required fields' });
    });

    it('should return 401 if user is not logged in', async () => {
      const req = { body: { title: 'A', content: 'B', rating: 5 }, user: {} };

      await createReview(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message: 'Unauthorized: Login required' });
    });

    it('should return 400 if DB error occurs', async () => {
      const req = { body: { title: 'A', content: 'B', rating: 5 }, user: { id: 1 } };
      Review.create.mockRejectedValue(new Error('DB Error'));

      await createReview(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Failed to create review' });
    });
  });

  // -------------------- updateReview --------------------
  describe('updateReview', () => {
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    it('should return 404 if review not found', async () => {
      const req = { params: { id: '1' }, user: { id: 1 }, body: {} };
      Review.findByPk.mockResolvedValue(null);

      await updateReview(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Review not found' });
    });

    it('should return 403 if user not owner', async () => {
      const req = { params: { id: '1' }, user: { id: 2 }, body: {} };
      Review.findByPk.mockResolvedValue({ id: 1, userId: 1 });

      await updateReview(req, res);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({ message: 'Forbidden: You cannot edit others reviews' });
    });

    it('should return 200 if updated by owner', async () => {
      const mockReview = { userId: 1, save: jest.fn() };
      const req = { params: { id: '1' }, user: { id: 1 }, body: { title: 'New' } };

      Review.findByPk.mockResolvedValue(mockReview);

      await updateReview(req, res);

      expect(mockReview.save).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        message: 'Review updated successfully'
      }));
    });

    it('should return 500 if DB error occurs', async () => {
      const req = { params: { id: '1' }, user: { id: 1 }, body: {} };
      Review.findByPk.mockRejectedValue(new Error('DB Error'));

      await updateReview(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Internal server error' });
    });
  });

  // -------------------- deleteReview --------------------
  describe('deleteReview', () => {
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    it('should return 404 if review not found', async () => {
      const req = { params: { id: '1' }, user: { id: 1 } };
      Review.findByPk.mockResolvedValue(null);

      await deleteReview(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Review not found' });
    });

    it('should return 403 if user not owner', async () => {
      const req = { params: { id: '1' }, user: { id: 2 } };
      Review.findByPk.mockResolvedValue({ userId: 1 });

      await deleteReview(req, res);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({ message: 'Forbidden: You cannot delete others reviews' });
    });

    it('should delete if user is owner', async () => {
      const req = { params: { id: '1' }, user: { id: 1 } };
      const mockReview = { userId: 1, destroy: jest.fn() };

      Review.findByPk.mockResolvedValue(mockReview);

      await deleteReview(req, res);

      expect(mockReview.destroy).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Review deleted successfully' });
    });

    it('should return 500 if DB error occurs', async () => {
      const req = { params: { id: '1' }, user: { id: 1 } };
      Review.findByPk.mockRejectedValue(new Error('DB Error'));

      await deleteReview(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Internal server error' });
    });
  });

});
