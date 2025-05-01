const userController = require('../../features/user/userController');
const User = require('../../features/user/userModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

jest.mock('../../features/user/userModel');
jest.mock('bcryptjs');
jest.mock('jsonwebtoken', () => ({
    verify: jest.fn(),
    sign: jest.fn(),
  }));

  beforeAll(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
    jest.spyOn(console, 'warn').mockImplementation(() => {});
  });
  afterAll(() => {
    console.error.mockRestore();
    console.warn.mockRestore();
  });
  
  

describe('User Controller (unit)', () => {
  let req, res;

  beforeEach(() => {
    req = { body: {}, params: {}, user: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      clearCookie: jest.fn()
    };
  });

  describe('signup', () => {
    it('returns 400 if user exists', async () => {
      User.findOne.mockResolvedValue({});
      req.body = { email: 'test@example.com' };
      await userController.signup(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it('creates user when not exists', async () => {
      User.findOne.mockResolvedValue(null);
      User.create.mockResolvedValue({});
      req.body = { email: 'test@example.com', password: '123' };
      await userController.signup(req, res);
      expect(res.status).toHaveBeenCalledWith(201);
    });
  });

  describe('loginUser', () => {
    it('returns 401 if no user', async () => {
      User.findOne.mockResolvedValue(null);
      req.body = { email: 'x', password: 'p' };
      await userController.loginUser(req, res);
      expect(res.status).toHaveBeenCalledWith(401);
    });

    it('returns 401 if wrong password', async () => {
      User.findOne.mockResolvedValue({ password: 'hashed' });
      bcrypt.compare.mockResolvedValue(false);
      req.body = { email: 'x', password: 'p' };
      await userController.loginUser(req, res);
      expect(res.status).toHaveBeenCalledWith(401);
    });

    it('returns token if success', async () => {
      User.findOne.mockResolvedValue({ id: 1, password: 'hashed', toJSON: () => ({ id: 1 }) });
      bcrypt.compare.mockResolvedValue(true);
      jwt.sign.mockReturnValue('token');
      req.body = { email: 'x', password: 'p' };
      await userController.loginUser(req, res);
      expect(res.status).toHaveBeenCalledWith(200);
    });
  });

  describe('updateAC', () => {
    it('404 if no user', async () => {
      User.findByPk.mockResolvedValue(null);
      req.params = { id: 1 };
      await userController.updateAC(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
    });

    it('updates fields', async () => {
      const u = { save: jest.fn() };
      User.findByPk.mockResolvedValue(u);
      req.params = { id: 1 };
      req.body = { username: 'a' };
      await userController.updateAC(req, res);
      expect(u.save).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
    });
  });

  describe('forgetPass & resetPass', () => {
    it('resetPass invalid code', async () => {
      const now = Date.now();
      const codeHash = crypto.createHash('sha256').update('c').digest('hex');
      const u = { resetToken: 'wrong', resetTokenExpiry: now + 10000 };
      User.findOne.mockResolvedValue(u);
      req.body = { email: 'e', resetCode: 'c', newPassword: 'n' };
      await userController.resetPass(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it('resetPass success', async () => {
      const now = Date.now();
      const codeHash = crypto.createHash('sha256').update('c').digest('hex');
      const u = { resetToken: codeHash, resetTokenExpiry: now + 10000, save: jest.fn() };
      User.findOne.mockResolvedValue(u);
      req.body = { email: 'e', resetCode: 'c', newPassword: 'n' };
      bcrypt.hash.mockResolvedValue('hashed');
      await userController.resetPass(req, res);
      expect(res.status).toHaveBeenCalledWith(200);
    });
  });

  describe('logoutUser', () => {
    it('clears cookie and returns 200', async () => {
      await userController.logoutUser(req, res);
      expect(res.clearCookie).toHaveBeenCalledWith('token');
      expect(res.status).toHaveBeenCalledWith(200);
    });
  });

  describe('deleteUser', () => {
    it('404 if no user found', async () => {
      User.findByPk.mockResolvedValue(null);
      req.params = { id: 1 };
      await userController.deleteUser(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
    });

    it('destroys and returns 200', async () => {
      const u = { destroy: jest.fn() };
      User.findByPk.mockResolvedValue(u);
      req.params = { id: 1 };
      await userController.deleteUser(req, res);
      expect(u.destroy).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
    });
  });

  describe('changePass', () => {
    it('404 if no user found', async () => {
      User.findByPk.mockResolvedValue(null);
      req.params = { id: 1 };
      req.body = { oldPassword: 'a', newPassword: 'b' };
      await userController.changePass(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
    });

    it('400 if incorrect old password', async () => {
      User.findByPk.mockResolvedValue({ password: 'oldHash' });
      req.params = { id: 1 };
      req.body = { oldPassword: 'wrong', newPassword: 'b' };
      bcrypt.compare.mockResolvedValue(false);
      await userController.changePass(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it('200 if password updated successfully', async () => {
      const u = { password: 'oldHash', save: jest.fn() };
      User.findByPk.mockResolvedValue(u);
      req.params = { id: 1 };
      req.body = { oldPassword: 'correct', newPassword: 'b' };
      bcrypt.compare.mockResolvedValue(true);
      bcrypt.hash.mockResolvedValue('newHash');
      await userController.changePass(req, res);
      expect(u.save).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
    });
  });

  describe('verifyEmail', () => {
    it('400 if invalid token', async () => {
      jwt.verify.mockImplementation(() => { throw new Error('Invalid token'); });
      req.params = { token: 'invalidtoken' };
  
      await userController.verifyEmail(req, res);
  
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Invalid or expired token' });
    });
  
    it('404 if user not found', async () => {
      jwt.verify.mockReturnValue({ id: 1 });
      req.params = { token: 'validtoken' };
      User.findByPk.mockResolvedValue(null);
  
      await userController.verifyEmail(req, res);
  
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'User not found' });
    });
  
    it('200 if valid token and user found', async () => {
        const u = { isVerified: false, save: jest.fn() };
        jwt.verify.mockReturnValue({ id: 1 });
        req.params = { token: 'validtoken' };
        User.findByPk.mockResolvedValue(u);
    
        await userController.verifyEmail(req, res);
    
        expect(u.isVerified).toBe(true);
        expect(u.save).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ message: 'Email verified successfully.' });
      });
    });
  
      describe('blockUser', () => {
        it('should return 403 if not admin', async () => {
          req.user = { role: 'user' };
          await userController.blockUser(req, res);
          expect(res.status).toHaveBeenCalledWith(403);
          expect(res.json).toHaveBeenCalledWith({ message: 'Access denied.' });
        });
      
        it('should return 404 if user not found', async () => {
          req.user = { role: 'admin' };
          req.params = { userId: 1 };
          User.findByPk.mockResolvedValue(null);
          await userController.blockUser(req, res);
          expect(res.status).toHaveBeenCalledWith(404);
          expect(res.json).toHaveBeenCalledWith({ message: 'User not found.' });
        });
      
        it('should return 400 if admin blocks themselves', async () => {
          req.user = { role: 'admin', id: 1 };
          req.params = { userId: 1 };
          User.findByPk.mockResolvedValue({ id: 1 });
          await userController.blockUser(req, res);
          expect(res.status).toHaveBeenCalledWith(400);
          expect(res.json).toHaveBeenCalledWith({ message: 'You cannot block yourself.' });
        });
      
        it('should block user and return 200', async () => {
          const u = { id: 2, name: 'Ali', save: jest.fn() };
          req.user = { role: 'admin', id: 1 };
          req.params = { userId: 2 };
          User.findByPk.mockResolvedValue(u);
          await userController.blockUser(req, res);
          expect(u.isBlocked).toBe(true);
          expect(u.save).toHaveBeenCalled();
          expect(res.status).toHaveBeenCalledWith(200);
          expect(res.json).toHaveBeenCalledWith({ message: 'User Ali has been blocked.' });
        });
      });
      
      describe('unblock', () => {
        it('should return 403 if not admin', async () => {
          req.user = { role: 'user' };
          await userController.unblock(req, res);
          expect(res.status).toHaveBeenCalledWith(403);
          expect(res.json).toHaveBeenCalledWith({ message: 'Access denied.' });
        });
      
        it('should return 404 if user not found', async () => {
          req.user = { role: 'admin' };
          req.params = { userId: 1 };
          User.findByPk.mockResolvedValue(null);
          await userController.unblock(req, res);
          expect(res.status).toHaveBeenCalledWith(404);
          expect(res.json).toHaveBeenCalledWith({ message: 'User not found.' });
        });
      
        it('should unblock user and return 200', async () => {
          const u = { name: 'Sara', save: jest.fn() };
          req.user = { role: 'admin' };
          req.params = { userId: 3 };
          User.findByPk.mockResolvedValue(u);
          await userController.unblock(req, res);
          expect(u.isBlocked).toBe(false);
          expect(u.save).toHaveBeenCalled();
          expect(res.status).toHaveBeenCalledWith(200);
          expect(res.json).toHaveBeenCalledWith({ message: 'User Sara has been unblocked.' });
        });
      });
    });