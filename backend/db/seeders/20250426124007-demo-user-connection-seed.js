'use strict';

const { User, UserConnection } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      const users = await User.findAll({
        attributes: ['id', 'username'],
        limit: 3
      });

      if (users.length < 3) {
        console.error('Not enough users found in the database for seeding connections');
        return;
      }

      const demoUser = users.find(u => u.username === 'Demo-lition') || users[0];
      const user1 = users.find(u => u.username === 'FakeUser1') || users[1];
      const user2 = users.find(u => u.username === 'FakeUser2') || users[2];

      await UserConnection.bulkCreate([
        {
          // user_1_id: 1,
          // user_2_id: 2,
          user_1_id: demoUser.id,
          user_2_id: user1.id,
          connectionStatus: 'pending',
          chatEnabled: false,
          meetingStatus: 'pending',
          suggestedActivity: 'Coffee chat at local cafe',
          meetingTime: new Date('2025-05-10T14:00:00Z'),
          meetAgainChoiceUser1: null,
          meetAgainChoiceUser2: null
        },
        {
          // user_1_id: 2,
          // user_2_id: 3,
          user_1_id: user1.id,
          user_2_id: user2.id,
          connectionStatus: 'accepted',
          chatEnabled: true,
          meetingStatus: 'confirmed',
          suggestedActivity: 'Hiking at local trail',
          meetingTime: new Date('2025-05-12T09:00:00Z'),
          meetAgainChoiceUser1: true,
          meetAgainChoiceUser2: null
        },
        {
          // user_1_id: 1,
          // user_2_id: 3,
          user_1_id: demoUser.id,
          user_2_id: user2.id,
          connectionStatus: 'accepted',
          chatEnabled: true,
          meetingStatus: 'completed',
          suggestedActivity: 'Lunch at local deli',
          meetingTime: new Date('2025-04-30T12:00:00Z'),
          meetAgainChoiceUser1: false,
          meetAgainChoiceUser2: true
        }
      ], { validate: true });
    } catch (error) {
      console.error('Error seeding user connections:', error);
    }
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'UserConnections';
    try {
      if (process.env.NODE_ENV === 'production') {
        const tableExists = await queryInterface.sequelize.query(
          `SELECT EXISTS (
            SELECT FROM information_schema.tables 
            WHERE table_schema = '${process.env.SCHEMA}'
            AND table_name = 'UserConnections'
          );`,
          { type: Sequelize.QueryTypes.SELECT }
        );

        if (!tableExists[0].exists) {
          console.log('UserConnections table does not exist, skipping deletion');
          return;
        }
      }

      const Op = Sequelize.Op;
      return queryInterface.bulkDelete(options, {
        [Op.or]: [
          {
            // user_1_id: 1,
            // user_2_id: 2,
            meetingTime: new Date('2025-05-10T14:00:00Z')
          },
          {
            // user_1_id: 2,
            // user_2_id: 3,
            meetingTime: new Date('2025-05-12T09:00:00Z')
          },
          {
            // user_1_id: 1,
            // user_2_id: 3,
            meetingTime: new Date('2025-04-30T12:00:00Z')
          }
        ]
      }, {});
    } catch (error) {
      console.log('Error in user connections seeder down method:', error.message);
    }
  }
};