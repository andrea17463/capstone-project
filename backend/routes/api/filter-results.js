// backend/routes/api/filter-results.js
const { User } = require('../../db/models');
const { Op, Sequelize } = require('sequelize');
const { requireAuth } = require('../../utils/auth');

const router = require('express').Router();

// POST /api/filter-results
// Filter connection results

// POST /api/filter-results/reset
// Clear filtered connection results

// POST /api/filter-results
// Filter connection results
router.post('/', requireAuth, async (req, res) => {
  const { interests, objectives, location, locationRadius, matchType, userId } = req.body;
  const parsedUserId = parseInt(userId);

  if (isNaN(parsedUserId)) {
    return res.status(400).json({ error: 'Invalid userId' });
  }

  const filters = [];

  if (Array.isArray(interests) && interests.length > 0) {
    filters.push({
      [Op.or]: interests.map(i =>
        Sequelize.where(
          Sequelize.fn('lower', Sequelize.col('interests')),
          { [Op.like]: `%${i.toLowerCase()}%` }
        )
      )
    });
  }

  if (Array.isArray(objectives) && objectives.length > 0) {
    filters.push({
      [Op.or]: objectives.map(o =>
        Sequelize.where(
          Sequelize.fn('lower', Sequelize.col('objectives')),
          { [Op.like]: `%${o.toLowerCase()}%` }
        )
      )
    });
  }

  if (Array.isArray(location) && location.length > 0) {
    filters.push({
      [Op.or]: location.map(l =>
        Sequelize.where(
          Sequelize.fn('lower', Sequelize.col('location')),
          { [Op.like]: `%${l.toLowerCase()}%` }
        )
      )
    });
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
    filters.push({ locationRadius: { [Op.notBetween]: [10, 14] } });
    filters.push({ locationRadius: { [Op.notBetween]: [15, 19] } });
    filters.push({ locationRadius: { [Op.notBetween]: [20, 24] } });
    filters.push({ locationRadius: { [Op.lt]: 10 } });
  }

  try {
    let where = {};

    switch (Array.isArray(matchType) ? matchType[0] : matchType) {
      case 'any':
        where = { [Op.or]: filters };
        break;

      case 'all':
        where = { [Op.and]: filters };
        break;

      case 'one': {
        const allUsers = await User.findAll({
          attributes: ['id', 'username', 'fullName', 'location', 'interests', 'objectives', 'locationRadius']
        });

        const matchingUsers = allUsers.filter(user => {
          if (user.id === parsedUserId) {
            return false;
          }

          let matchCount = 0;

          if (Array.isArray(interests)) {
            const userInterests = user.interests?.toLowerCase() || '';
            if (interests.some(i => userInterests.includes(i.toLowerCase()))) matchCount++;
          }

          if (Array.isArray(objectives)) {
            const userObjectives = user.objectives?.toLowerCase() || '';
            if (objectives.some(o => userObjectives.includes(o.toLowerCase()))) matchCount++;
          }

          if (Array.isArray(location)) {
            const userLocation = user.location?.toLowerCase() || '';
            if (location.some(l => userLocation.includes(l.toLowerCase()))) matchCount++;
          }

          if (!isNaN(radiusInt) && user.locationRadius <= radiusInt) matchCount++;

          return matchCount === 1;
        });

        return res.json(matchingUsers.map(user => ({
          id: user.id,
          username: user.username,
          fullName: user.fullName,
          interests: user.interests,
          objectives: user.objectives
        })));
      }

      case 'more': {
        const allUsers = await User.findAll({
          attributes: ['id', 'username', 'fullName', 'location', 'interests', 'objectives', 'locationRadius']
        });

        const multipleMatches = allUsers.filter(user => {

          if (user.id === parsedUserId) {
            return false;
          }

          let matchCount = 0;

          if (Array.isArray(interests)) {
            const userInterests = user.interests?.toLowerCase() || '';
            if (interests.some(i => userInterests.includes(i.toLowerCase()))) matchCount++;
          }

          if (Array.isArray(objectives)) {
            const userObjectives = user.objectives?.toLowerCase() || '';
            if (objectives.some(o => userObjectives.includes(o.toLowerCase()))) matchCount++;
          }

          if (Array.isArray(location)) {
            const userLocation = user.location?.toLowerCase() || '';
            if (location.some(l => userLocation.includes(l.toLowerCase()))) matchCount++;
          }

          if (!isNaN(radiusInt) && user.locationRadius <= radiusInt) matchCount++;

          return matchCount > 1;
        });

        return res.json(multipleMatches.map(user => ({
          id: user.id,
          username: user.username,
          fullName: user.fullName,
          interests: user.interests,
          objectives: user.objectives
        })));
      }

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
      attributes: ['id', 'username', 'fullName', 'interests', 'objectives']
    });

    return res.json(filteredUsers);

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/filter-results/reset
// Clear filtered connection results
router.post('/reset', requireAuth, async (req, res) => {
  const { userId } = req.body;
  const parsedUserId = parseInt(userId);
  if (isNaN(parsedUserId)) {
    return res.status(400).json({ error: 'Invalid userId' });
  }

  try {
    const user = await User.findByPk(parsedUserId);
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