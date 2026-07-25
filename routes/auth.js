const express = require('express');
const passport = require('passport');
const authController = require("../controllers/auth");

const router = express.Router();

//Local Registration
router.post("/register", authController.register);
router.post('/login', passport.authenticate('local'), authController.login);

//Google Auth
router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  authController.googleCallback
);

// View Profile
router.get("/profile", authController.profile);

//Logout
router.post("/logout", authController.logout);

module.exports = router;