const express = require('express');
const passport = require('passport');
const userController = require('../controllers/users');

const router = express.Router();

//Local Registration
router.post("/register", userController.createUser);
router.post('/login', passport.authenticate('local'),
    (req, res) => {
        res.json({
            message: "Logged in successfully",
            user: req.user
        });
    }
);

//Google Auth
router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  (req, res) => {
    res.redirect("/profile");
  }
);

// View Profile
router.get("/profile", (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: "Not logged in" });
  }

  res.json({ user: req.user });
});

//Logout
router.post("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    res.json({ message: "Logged out" });
  });
});

module.exports = router;