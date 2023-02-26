const jwt = require('jsonwebtoken');
const User = require('../../models/User');
const { requireAuth, checkUser } = require('../../middleware/authMiddleware');

describe('requireAuth middleware', () => {
  const mockRequest = (token) => ({ cookies: { jwt: token } });
  const mockResponse = () => {
    const res = {};
    res.redirect = jest.fn(() => res);
    return res;
  };
  const mockNext = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should redirect to /login when no token provided', () => {
    const req = mockRequest();
    const res = mockResponse();
    requireAuth(req, res, mockNext);
    expect(res.redirect).toHaveBeenCalledWith('/login');
    expect(mockNext).not.toHaveBeenCalled();
  });

  test('should redirect to /login when token is invalid', () => {
    const req = mockRequest('invalid-token');
    const res = mockResponse();
    requireAuth(req, res, mockNext);
    expect(res.redirect).toHaveBeenCalledWith('/login');
    expect(mockNext).not.toHaveBeenCalled();
  });

  test('should call next when token is valid', () => {
    const token = jwt.sign({ id: 'valid-user-id' }, 'user secret');
    const req = mockRequest(token);
    const res = mockResponse();
    requireAuth(req, res, mockNext);
    expect(res.redirect).not.toHaveBeenCalled();
    expect(mockNext).toHaveBeenCalled();
  });
});

describe('checkUser middleware', () => {
  const mockRequest = (token) => ({ cookies: { jwt: token } });
  const mockResponse = () => ({ locals: {}, send: jest.fn() });
  const mockNext = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should set res.locals.user to null when no token provided', () => {
    const req = mockRequest();
    const res = mockResponse();
    checkUser(req, res, mockNext);
    expect(res.locals.user).toBeNull();
    expect(mockNext).toHaveBeenCalled();
  });

  test('should set res.locals.user to null when token is invalid', () => {
    const req = mockRequest('invalid-token');
    const res = mockResponse();
    checkUser(req, res, mockNext);
    expect(res.locals.user).toBeNull();
    expect(mockNext).toHaveBeenCalled();
  });

  test('should set res.locals.user to user data when token is valid', async () => {
    const user = { _id: 'valid-user-id' };
    const token = jwt.sign({ id: user._id }, 'user secret');
    jest.spyOn(User, 'findById').mockResolvedValueOnce(user);
    const req = mockRequest(token);
    const res = mockResponse();
    await checkUser(req, res, mockNext);
    expect(res.locals.user).toEqual(user);
    expect(mockNext).toHaveBeenCalled();
    jest.spyOn(User, 'findById').mockRestore();
  });
});
