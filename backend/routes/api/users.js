// backend/routes/api/users.js
const express = require('express')
const bcrypt = require('bcryptjs');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User } = require('../../db/models');

const router = express.Router();

const validateSignup = [
  check('email')
    .exists({ checkFalsy: true })
    .isEmail()
    .withMessage('Invalid email'),
  check('username')
    .exists({ checkFalsy: true })
    .isLength({ min: 4 })
    .withMessage('Please provide a username with at least 4 characters.'),
  check('username')
    .exists({ checkFalsy: true })
    .withMessage('Username is required'),
  check('username')
    .not()
    .isEmail()
    .withMessage('Username cannot be an email.'),
  check('firstName')
    .exists({ checkFalsy: true })
    .withMessage('First Name is required'),
  check('lastName')
    .exists({ checkFalsy: true })
    .withMessage('Last Name is required'),
  check('password')
    .exists({ checkFalsy: true })
    .isLength({ min: 6 })
    .withMessage('Password must be 6 characters or more.'),
  handleValidationErrors
];

// Sign up new User
router.post('/', validateSignup, async (req, res) => {
  const { firstName, lastName, email, username, password } = req.body;

  try {
    const hashedPassword = bcrypt.hashSync(password);
    const user = await User.create({ firstName, lastName, email, username, hashedPassword });

    const safeUser = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      username: user.username,
    };

    await setTokenCookie(res, safeUser);
    return res.status(201).json({ user: safeUser });

  } catch (e) {
    if (e.name === 'SequelizeUniqueConstraintError') {
      res.status(500);
      return res.json({
        message: "User already exists",
        errors: {
          email: "User with that email already exists",
          username: "User with that username already exists"
        }
      })
    }
    throw e;
  }
});

// Validation middleware
const validateUserInput = [
  check('email')
    .isEmail()
    .withMessage('Please provide a valid email address'),
  check('username')
    .isLength({ min: 4 })
    .withMessage('Username must be at least 4 characters long'),
  check('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
];

// GET /api/users
// Retrieve the logged-in user's profile

// POST /api/users
// Create a new user in the database

// PUT /api/users
// Update the logged-in user's profile (e.g., interests, availability)

// DELETE /api/users
// Delete the logged-in user's own account from the system

// GET /api/users
// Retrieve the logged-in user's profile
router.get('/users', requireAuth, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: {
        exclude: ['hashedPassword', 'fullName', 'email']
      }
    });

    if (!user) return res.status(404).json({ error: 'User not found' });

    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Unable to retrieve user profile' });
  }
});

// POST /api/users
// Create a new user in the database
router.post('/users', async (req, res) => {
  const {
    fullName,
    firstName,
    email,
    password,
    location,
    locationRadius,
    availability,
    interests,
    objectives
  } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      fullName,
      firstName,
      email,
      hashedPassword,
      location,
      locationRadius,
      availability,
      interests,
      objectives
    });

    res.status(201).json({ message: 'User created successfully', userId: newUser.id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create user' });
  }
});

// PUT /api/users
// Update the logged-in user's profile (e.g., interests, availability)
router.put('/users', requireAuth, async (req, res) => {
  const {
    first_name,
    location,
    locationRadius,
    availability,
    interests,
    objectives
  } = req.body;

  try {
    const user = await User.findByPk(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    user.first_name = first_name ?? user.first_name;
    user.location = location ?? user.location;
    user.locationRadius = locationRadius ?? user.locationRadius;
    user.availability = availability ?? user.availability;
    user.interests = interests ?? user.interests;
    user.objectives = objectives ?? user.objectives;

    await user.save();
    res.json({ message: 'Profile updated', user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// DELETE /api/users
// Delete the logged-in user's own account from the system
router.delete('/users', requireAuth, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    await user.destroy();
    res.json({ message: 'Account deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete account' });
  }
});

// POST /api/filter-results
router.post('/filter-results', requireAuth, async (req, res) => {
  const { interests, objectives, location, locationRadius } = req.body;

  const userId = req.user?.id;

  if (!userId) {
    return res.status(400).json({ error: 'User not authenticated or invalid user data' });
  }

  try {
    const filteredUsers = await User.findAll({
      where: {
        interests: { [Op.like]: `%${interests.toLowerCase()}%` },
        objectives: { [Op.like]: `%${objectives.toLowerCase()}%` },
        location: { [Op.like]: `%${location.toLowerCase()}%` },
        locationRadius: {
          [Op.lte]: parseInt(locationRadius) || 0
        }
      },
      attributes: ['id', 'username', 'location', 'interests', 'objectives']
    });

    return res.json(filteredUsers);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;