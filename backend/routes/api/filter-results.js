// backend/routes/api/filter-results.js
const { User } = require('../../db/models');
const { Op } = require('sequelize');
const { requireAuth } = require('../../utils/auth');

const router = require('express').Router();

// POST /api/filter-results
router.post('/', requireAuth, async (req, res) => {
  console.log('Request body:', req.body);
  const { interests, objectives, location, locationRadius, matchType, userId } = req.body;
  const parsedUserId = parseInt(userId);
  console.log('userId:', userId, 'parsedUserId:', parsedUserId);
  console.log('Received userId from client:', userId);
  if (isNaN(parsedUserId)) {
    return res.status(400).json({ error: 'Invalid userId' });
  }

  const filters = [];

  if (interests) {
    filters.push({ interests: { [Op.like]: `%${interests.toLowerCase()}%` } });
  }
  if (objectives) {
    filters.push({ objectives: { [Op.like]: `%${objectives.toLowerCase()}%` } });
  }
  if (location) {
    filters.push({ location: { [Op.like]: `%${location.toLowerCase()}%` } });
  }

  let radiusInt = parseInt(locationRadius);

  if (radiusInt === 10) {
    filters.push({ locationRadius: { [Op.gte]: 10, [Op.lte]: 14 } });
  } else if (radiusInt === 15) {
    filters.push({ locationRadius: { [Op.gte]: 15, [Op.lte]: 19 } });
  } else if (radiusInt === 20) {
    filters.push({ locationRadius: { [Op.gte]: 20, [Op.lte]: 24 } });
  } else if (radiusInt === 25) {
    filters.push({ locationRadius: { [Op.gte]: 25 } });
  } else if (locationRadius === "Other") {
    filters.push({
      locationRadius: {
        [Op.notBetween]: [10, 14]
      }
    });
    filters.push({
      locationRadius: {
        [Op.notBetween]: [15, 19]
      }
    });
    filters.push({
      locationRadius: {
        [Op.notBetween]: [20, 24]
      }
    });
    filters.push({
      locationRadius: {
        [Op.lt]: 10
      }
    });
  }

  try {
    let where = {};

    switch (matchType) {
      case 'any':
        where = { [Op.or]: filters };
        break;
      case 'all':
        where = { [Op.and]: filters };
        break;
      case 'one':
        const allUsers = await User.findAll({
          // attributes: ['id', 'username', 'firstName', 'location', 'interests', 'objectives', 'locationRadius']
          attributes: ['id', 'username', 'fullName', 'location', 'interests', 'objectives', 'locationRadius']
        });

        const matchingUsers = allUsers.filter(user => {
          console.log('Checking user:', user.id, user.username, 'vs', parsedUserId);

          if (user.id === parsedUserId) {
            console.log('Skipping self-match:', user.username);
            return false;
          }

          let matchCount = 0;
          if (interests && user.interests?.toLowerCase().includes(interests.toLowerCase())) matchCount++;
          if (objectives && user.objectives?.toLowerCase().includes(objectives.toLowerCase())) matchCount++;
          if (location && user.location?.toLowerCase().includes(location.toLowerCase())) matchCount++;
          if (!isNaN(radiusInt) && user.locationRadius <= radiusInt) matchCount++;

          return matchCount === 1;
        });

        return res.json(matchingUsers.map(user => ({
          id: user.id,
          username: user.username,
          // firstName: user.firstName,
          fullName: user.fullName,
          interests: user.interests,
          objectives: user.objectives
        })));

      case 'more':
        const moreUsers = await User.findAll({
          // attributes: ['id', 'username', 'firstName', 'location', 'interests', 'objectives', 'locationRadius']
          attributes: ['id', 'username', 'fullName', 'location', 'interests', 'objectives', 'locationRadius']
        });

        const multipleMatches = moreUsers.filter(user => {
          console.log('Checking user:', user.id, user.username, 'vs', parsedUserId);

          if (user.id === parsedUserId) {
            console.log('Skipping self-match:', user.username);
            return false;
          }

          let matchCount = 0;
          if (interests && user.interests?.toLowerCase().includes(interests.toLowerCase())) matchCount++;
          if (objectives && user.objectives?.toLowerCase().includes(objectives.toLowerCase())) matchCount++;
          if (location && user.location?.toLowerCase().includes(location.toLowerCase())) matchCount++;
          if (!isNaN(radiusInt) && user.locationRadius <= radiusInt) matchCount++;

          return matchCount > 1;
        });

        return res.json(multipleMatches.map(user => ({
          id: user.id,
          username: user.username,
          // firstName: user.firstName,
          fullName: user.fullName,
          interests: user.interests,
          objectives: user.objectives
        })));

      default:
        where = { [Op.and]: filters };
    }

    if (userId) {
      where = {
        [Op.and]: [
          { id: { [Op.ne]: parsedUserId } },
          where
        ]
      };
    }

    const filteredUsers = await User.findAll({
      where,
      // attributes: ['username', 'firstName', 'interests', 'objectives']
      attributes: ['id', 'username', 'fullName', 'interests', 'objectives']
    });

    return res.json(filteredUsers);

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/filter-results/reset
// Clear filtered results
router.post('/reset', requireAuth, async (req, res) => {
  console.log('Request body:', req.body);
  const { interests, objectives, location, locationRadius, matchType, userId } = req.body;
  const parsedUserId = parseInt(userId);
  if (isNaN(parsedUserId)) {
    return res.status(400).json({ error: 'Invalid userId' });
  }

  try {
    const user = await User.findByPk(parsedUserId);
    console.log('Clear filtered results of user', user);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    return res.json([]);
  } catch (err) {
    console.error('Error resetting filter results:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;