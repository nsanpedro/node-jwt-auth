const User = require('../../models/User');
const jwt = require('jsonwebtoken');
const { signup_post, login_post } = require('../../controllers/authController');

jest.mock('../../models/User');

describe('Authentication controller', () => {
  describe('signup_post', () => {
    it('should create a new user and return a JWT', async () => {
      const req = { body: { email: 'test@example.com', password: 'password' } };
      const res = {
        cookie: jest.fn(),
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const user = { _id: 'user-id' };
      User.create.mockResolvedValueOnce(user);

      await signup_post(req, res);

      expect(User.create).toHaveBeenCalledWith(req.body);
      expect(res.cookie).toHaveBeenCalledWith(
        'jwt',
        expect.any(String),
        expect.objectContaining({ httpOnly: true, maxAge: 259200000 })
      );
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ user: user._id });
    });

    it('should handle errors and return error messages', async () => {
      const req = { body: { email: 'test@example.com', password: 'password' } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const error = {
        message: 'user validation failed',
        errors: { password: { message: 'Password is required', path: 'password' } },
      };
      User.create.mockRejectedValueOnce(error);

      await signup_post(req, res);

      expect(User.create).toHaveBeenCalledWith(req.body);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        errors: { email: '', password: '' },
      });
    });
  });

  describe('login_post', () => {
    it('should log in a user and return a JWT', async () => {
      const req = { body: { email: 'test@example.com', password: 'password' } };
      const res = {
        cookie: jest.fn(),
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const user = { _id: 'user-id' };
      User.login.mockResolvedValueOnce(user);

      await login_post(req, res);

      expect(User.login).toHaveBeenCalledWith(req.body.email, req.body.password);
      expect(res.cookie).toHaveBeenCalledWith(
        'jwt',
        expect.any(String),
        expect.objectContaining({ httpOnly: true, maxAge: 259200000 })
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ user: user._id });
    });

    it('should handle errors and return error messages', async () => {
      const req = { body: { email: 'test@example.com', password: 'password' } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const error = { message: 'incorrect email' };
      User.login.mockRejectedValueOnce(error);

      await login_post(req, res);

      expect(User.login).toHaveBeenCalledWith(req.body.email, req.body.password);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        errors: { email: 'That email is not registered', password: '' },
      });
    });
  });
});
