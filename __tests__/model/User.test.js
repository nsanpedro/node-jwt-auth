const mongoose = require('mongoose');
const User = require('../../models/User');

describe('User model', () => {
  // test case 1
  it('should throw an error if email is missing', async () => {
    const user = new User({ password: 'password' });
    let err;
    try {
      await user.save();
    } catch (error) {
      err = error;
    }
    expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
  });

  // test case 2
  it('should throw an error if password is missing', async () => {
    const user = new User({ email: 'test@example.com' });
    let err;
    try {
      await user.save();
    } catch (error) {
      err = error;
    }
    expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
  });

  // test case 3
  it('should throw an error if email is not valid', async () => {
    const user = new User({ email: 'invalid-email', password: 'password' });
    let err;
    try {
      await user.save();
    } catch (error) {
      err = error;
    }
    expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
  });
});
