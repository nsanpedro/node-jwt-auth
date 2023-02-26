const User = require('../models/User');
const jwt = require('jsonwebtoken');

const handleErrors = (error) => {
  const alreadyRegistered = error.code === 11000;

  let errorData = {
    email: '',
    password: '',
  };

  // incorrect email
  if (error.message === 'incorrect email') {
    errorData.email = 'That email is not registered';
  }

  // incorrect password
  if (error.message === 'incorrect password') {
    errorData.password = 'That password is incorrect';
  }

  if (alreadyRegistered) {
    errorData.email = 'that email is already registered';
    return errorData;
  }

  if (error.message.includes('user validation failed')) {
    Object.values(error?.errors).forEach(({ properties }) => {
      errorData[properties.path] = properties.message;
    });
  }

  return errorData;
};

//* jwt creation
const maxAge = 3 * 24 * 60 * 60;
const createToken = (id) =>
  jwt.sign({ id }, 'user secret', {
    expiresIn: maxAge,
  });

module.exports.signup_get = (req, res) => {
  res.render('signup');
};

module.exports.signup_post = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.create({ email, password });
    const jwtToken = createToken(user?._id);
    res.cookie('jwt', jwtToken, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(201).json({ user: user?._id });
  } catch (error) {
    const errors = handleErrors(error);
    res.status(400).json({ errors });
  }
};

module.exports.login_get = (req, res) => {
  res.render('login');
};

module.exports.login_post = async (req, res) => {
  const { email, password } = req?.body;

  try {
    const userData = await User.login(email, password);
    const jwtToken = createToken(userData?._id);
    res.cookie('jwt', jwtToken, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(200).json({ user: userData?._id });
  } catch (error) {
    const errors = handleErrors(error);
    res.status(400).json({ errors });
  }
};

module.exports.logout_get = (req, res) => {
  res.cookie('jwt', '', { maxAge: 1 });
  res.redirect('/');
};
