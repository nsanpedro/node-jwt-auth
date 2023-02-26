const User = require("../models/User");
const jwt = require("jsonwebtoken");

const handleErrors = (error) => {
  let errorData = {
    email: "",
    password: "",
  };

  const alreadyRegistered = error.code === 11000;

  if (alreadyRegistered) {
    errorData.email = "that email is already registered";
    return errorData;
  }

  if (error.message.includes("user validation failed")) {
    Object.values(error?.errors).forEach(({ properties }) => {
      errorData[properties.path] = properties.message;
    });
  }

  return errorData;
};

//* jwt creation
const maxAge = 3 * 24 * 60 * 60;
const createToken = (id) =>
  jwt.sign({ id }, "user secret", {
    expiresIn: maxAge,
  });

module.exports.signup_get = (req, res) => {
  res.render("signup");
};

module.exports.signup_post = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.create({ email, password });
    const jwtToken = createToken(user?._id);
    res.cookie("jwt", jwtToken, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(201).json({ user: user?._id });
  } catch (error) {
    const errors = handleErrors(error);
    res.status(400).json({ errors });
  }
};

module.exports.login_get = (req, res) => {
  res.render("login");
};

module.exports.login_post = async (req, res) => {
  const { email, password } = req.body;

  res.send("login");
};
