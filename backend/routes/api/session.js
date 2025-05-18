// backend/routes/api/session.js
const express = require("express");
const { Op } = require("sequelize");
const bcrypt = require("bcryptjs");
// const { check } = require('express-validator');
// const { handleValidationErrors } = require('../../utils/validation');
const { validateLogin } = require('../../utils/post-validators');
const { setTokenCookie, restoreUser } = require("../../utils/auth");
const { User } = require("../../db/models");

const router = express.Router();

router.use(restoreUser);

// Get the Current User / Restore session
router.get("/", (req, res) => {
  const { user } = req;
  if (user) {
    const safeUser = {
      id: user.id,
      fullName: user.fullName,
      // firstName: user.firstName,
      // lastName: user.lastName,
      email: user.email,
      username: user.username,
      age: user.age,
      location: user.location,
      locationRadius: user.locationRadius,
      availability: user.availability,
      interests: user.interests,
      objectives: user.objectives,
    };
    return res.json({
      user: safeUser,
    });
  } else return res.json({ user: null });
});

// Log in a User
router.post("/", validateLogin, async (req, res, next) => {
  const { credential, password } = req.body;
  const user = await User.unscoped().findOne({
    where: {
      [Op.or]: {
        username: credential,
        email: credential,
      },
    },
  });
  console.log('logged in user', user);
  if (!user || !bcrypt.compareSync(password, user.hashedPassword.toString())) {
    const err = new Error("Invalid credentials");
    return res.status(401).json({
      "message": "Invalid credentials"
    });
  }
  const safeUser = {
    id: user.id,
    fullName: user.fullName,
    // firstName: user.firstName,
    // lastName: user.lastName,
    email: user.email,
    username: user.username,
  };
  await setTokenCookie(res, safeUser);
  return res.json({
    user: safeUser,
  });
});

// Log out
router.delete("/", (_req, res) => {
  res.clearCookie("token");
  return res.json({ message: "success" });
});

module.exports = router;