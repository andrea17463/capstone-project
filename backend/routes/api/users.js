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
  // check('firstName')
  //   .exists({ checkFalsy: true })
  //   .withMessage('First Name is required'),
  // check('lastName')
  //   .exists({ checkFalsy: true })
  //   .withMessage('Last Name is required'),
  check('fullName')
    .exists({ checkFalsy: true })
    .withMessage('Full Name is required'),
  check('password')
    .exists({ checkFalsy: true })
    .isLength({ min: 6 })
    .withMessage('Password must be 6 characters or more.'),
  handleValidationErrors
];

router.post('/', validateSignup, async (req, res) => {
  const {
    email,
    username,
    firstName,
    lastName,
    fullName,
    password,
    location,
    locationRadius,
    availability,
    interests,
    objectives
  } = req.body;
  console.log('signup req body', req.body);

  try {
    const hashedPassword = bcrypt.hashSync(password);

    const user = await User.create({
      email,
      username,
      firstName,
      lastName,
      fullName,
      hashedPassword,
      location,
      locationRadius,
      availability,
      interests,
      objectives
    });
    console.log('signed up user', user);

    const safeUser = {
      id: user.id,
      fullName: user.fullName,
      // firstName: user.firstName,
      // lastName: user.lastName,
      email: user.email,
      username: user.username,
      location: user.location,
      locationRadius: user.locationRadius,
      availability: user.availability,
      interests: user.interests,
      objectives: user.objectives
    };

    await setTokenCookie(res, safeUser);
    return res.status(201).json({ user: safeUser });

  } catch (e) {
    console.error('Signup error:', e);

    if (e.name === 'SequelizeUniqueConstraintError') {
      res.status(400);
      return res.json({
        message: "User already exists",
        errors: {
          email: "User with that email already exists",
          username: "User with that username already exists"
        }
      });
    }

    res.status(500).json({ error: 'Signup failed due to server error' });
  }
});

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
router.get('/', requireAuth, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: {
        // exclude: ['hashedPassword', 'fullName', 'email']
        exclude: ['hashedPassword', 'email']
      }
    });
    console.log('Retrieve the logged-in user\'s profile of user', user);

    if (!user) return res.status(404).json({ error: 'User not found' });

    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Unable to retrieve user profile' });
  }
});

// PUT /api/users
// Update the logged-in user's profile (e.g., interests, objectives, availability)
router.put('/', requireAuth, async (req, res) => {
  const {
    // first_name,
    age,
    location,
    locationRadius,
    availability,
    interests,
    objectives
  } = req.body;
  console.log('update profile req body', req.body);

  try {
    const user = await User.findByPk(req.user.id);
    console.log('Update the logged-in user\'s profile of user', user);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const updatedData = {
      age,
      location,
      locationRadius,
      availability,
      interests: Array.isArray(interests) ? interests.join(', ') : interests,
      objectives: Array.isArray(objectives) ? objectives.join(', ') : objectives
    };

    await user.update(updatedData);
    console.log('User after update:', user);

    const updatedUser = {
      id: user.id,
      username: user.username,
      fullName: user.fullName,
      age: user.age,
      location: user.location,
      locationRadius: user.locationRadius,
      availability: user.availability,
      interests: user.interests,
      objectives: user.objectives
    };

    await setTokenCookie(res, updatedUser);

    res.json({ message: 'Profile updated', user: updatedUser });
  } catch (err) {
    console.error('Error updating user profile:', err);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// DELETE /api/users
// Delete the logged-in user's own account from the system
router.delete('/', requireAuth, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    console.log('Delete the logged-in user\'s profile of user', user);
    if (!user) return res.status(404).json({ error: 'User not found' });

    await user.destroy();
    res.json({ message: 'Account deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete account' });
  }
});

// POST /api/filter-results
// Filter user connections by interests, objectives, location, and/or location radius
router.post('/filter-results', requireAuth, async (req, res) => {
  const { interests, objectives, location, locationRadius } = req.body;
  console.log('filter results req body', req.body);

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

// GET /api/users/:id
// Retrieve profile info of a user connection
router.get('/:id', requireAuth, async (req, res) => {
  const userId = parseInt(req.params.id, 10);
  if (isNaN(userId)) return res.status(400).json({ error: 'Invalid user ID' });

  try {
    const user = await User.findByPk(userId, {
      attributes: ['id', 'username', 'fullName', 'age', 'location', 'interests', 'objectives']
    });
    console.log('Retrieve profile info of a user connection user', user);

    if (!user) return res.status(404).json({ error: 'User not found' });

    res.json(user);
  } catch (err) {
    console.error('Error fetching user profile:', err);
    res.status(500).json({ error: 'Failed to fetch user profile' });
  }
});

// Future features
// // Block a user
// router.post('blocks', async (req, res) => {
//   const { blockerId, blockedId } = req.body;

//   if (!blockerId || !blockedId) {
// return res.status(400).json({ error: 'blockerId and blockedId are required' });
// }
// 
//   try {
//   const [block, created] = await UserBlock.findOrCreate({
//     where: { userId: blockerId, blockedUserId: blockedId }
//   });

//   if (!created) {
//   return res.status(200).json({ message: 'User is already blocked', block });
// }

// res.status(201).json(block);
// } catch (error) {
//     console.error('Block error:', err);
//     res.status(500).json({ error: 'Failed to block user' });
//   // res.json({ message: 'User blocked', block });
//   }
// });

// // GET /api/users/:userId/blocked-users
// Retrieve a list of blocked users
// router.get('/:userId/blocked-users', async (req, res) => {
//   try {
//     const blocks = await UserBlock.findAll({
//       where: { userId: req.params.userId },
//       include: [{
//         model: User,
//         as: 'BlockedUser',
//         attributes: ['id', 'username', 'email']
//       }]
//     });

//     res.json(blocks);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Failed to fetch blocked users' });
//   }
// });

// // Report a user
// router.post('/:id/report', async (req, res) => {
//   const reporterId = req.user.id;
//   const reportedId = parseInt(req.params.id, 10);
//   const { reason } = req.body;

//   if (!reason || reason.trim().length < 3) {
//     return res.status(400).json({ error: 'A valid reason is required' });
//   }

//   try {
//
//   await UserReport.create({
//     reporterId,
//     reportedId,
//     reason
//   });
//   console.log(`User ${reporterId} reported ${reportedId}. Reason: ${reason}`);
//   res.status(201).json({ message: 'Report submitted' });
// } catch (err) {
//   console.error('Report error:', err);
//   res.status(500).json({ error: 'Failed to submit report' });
// }
// });

module.exports = router;