const User = require("../models/User");

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

module.exports.signup_get = (req, res) => {
  res.render("signup");
};

module.exports.signup_post = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.create({ email, password });

    res.status(201).json(user);
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
