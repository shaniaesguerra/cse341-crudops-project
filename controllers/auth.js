const User = require('../models/users');

const register = async (req, res) => {
    //#swagger.tags=['Authorization']
  try {
    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const user = await User.create({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: req.body.password || null,
      authMethod: "local",
      role: req.body.role || "member",
    });

    return res.status(201).json({
      message: "User created",
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      },
    });
  } catch (error) {
    console.error(error);

    if (error.name === "ValidationError") {
      return res.status(400).json({ error: error.message });
    }

    return res.status(500).json({ error: error.message });
  }
};

const login = (req, res) => {
    //#swagger.tags=['Authorization']
  return res.json({
    message: "Logged in successfully",
    user: req.user,
  });
};

const googleCallback = (req, res) => {
    //#swagger.tags=['Authorization']
  return res.redirect("/profile");
};

const profile = (req, res) => {
    //#swagger.tags=['Authorization']
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: "Not logged in" });
  }

  return res.json({ user: req.user });
};

const logout = (req, res, next) => {
    //#swagger.tags=['Authorization']
  req.logout((err) => {
    if (err) return next(err);
    return res.json({ message: "Logged out" });
  });
};

module.exports = {
  register,
  login,
  googleCallback,
  profile,
  logout,
};