// backend/routes/api/filter-results.js
const { User } = require('../../db/models');
const { Op } = require('sequelize');

const router = require('express').Router();

// POST /api/filter-results
router.post('/', async (req, res) => {
  const { interests, objectives, location, locationRadius, matchType } = req.body;

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

  const radiusInt = parseInt(locationRadius);
  if (!isNaN(radiusInt) && radiusInt > 0) {
    filters.push({ locationRadius: { [Op.lte]: radiusInt } });
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
          attributes: ['id', 'username', 'firstName', 'location', 'interests', 'objectives', 'locationRadius']
        });

        const matchingUsers = allUsers.filter(user => {
          let matchCount = 0;
          if (interests && user.interests.toLowerCase().includes(interests.toLowerCase())) matchCount++;
          if (objectives && user.objectives.toLowerCase().includes(objectives.toLowerCase())) matchCount++;
          if (location && user.location.toLowerCase().includes(location.toLowerCase())) matchCount++;
          if (!isNaN(radiusInt) && user.locationRadius <= radiusInt) matchCount++;
          return matchCount === 1;
        });

        return res.json(matchingUsers.map(user => ({
          username: user.username,
          firstName: user.firstName,
          interests: user.interests,
          objectives: user.objectives
        })));

      case 'more':
        const moreUsers = await User.findAll({
          attributes: ['id', 'username', 'firstName', 'location', 'interests', 'objectives', 'locationRadius']
        });

        const multipleMatches = moreUsers.filter(user => {
          let matchCount = 0;
          if (interests && user.interests.toLowerCase().includes(interests.toLowerCase())) matchCount++;
          if (objectives && user.objectives.toLowerCase().includes(objectives.toLowerCase())) matchCount++;
          if (location && user.location.toLowerCase().includes(location.toLowerCase())) matchCount++;
          if (!isNaN(radiusInt) && user.locationRadius <= radiusInt) matchCount++;
          return matchCount > 1;
        });

        return res.json(multipleMatches.map(user => ({
          username: user.username,
          firstName: user.firstName,
          interests: user.interests,
          objectives: user.objectives
        })));

      default:
        where = { [Op.and]: filters };
    }

    const filteredUsers = await User.findAll({
      where,
      attributes: ['username', 'firstName', 'interests', 'objectives']
    });

    return res.json(filteredUsers);

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;