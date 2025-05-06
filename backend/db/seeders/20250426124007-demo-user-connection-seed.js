'use strict';

const { UserConnection } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await UserConnection.bulkCreate([
      {
        user_1_id: 1,
        user_2_id: 2,
        connectionStatus: 'pending',
        chatEnabled: false,
        meetingStatus: 'pending',
        suggestedActivity: 'Coffee chat at local cafe',
        meetingTime: new Date('2025-05-10T14:00:00Z'),
        meetAgainChoiceUser1: null,
        meetAgainChoiceUser2: null
      },
      {
        user_1_id: 2,
        user_2_id: 3,
        connectionStatus: 'accepted',
        chatEnabled: true,
        meetingStatus: 'confirmed',
        suggestedActivity: 'Hiking at local trail',
        meetingTime: new Date('2025-05-12T09:00:00Z'),
        meetAgainChoiceUser1: true,
        meetAgainChoiceUser2: null
      },
      {
        user_1_id: 1,
        user_2_id: 3,
        connectionStatus: 'accepted',
        chatEnabled: true,
        meetingStatus: 'completed',
        suggestedActivity: 'Lunch at local deli',
        meetingTime: new Date('2025-04-30T12:00:00Z'),
        meetAgainChoiceUser1: false,
        meetAgainChoiceUser2: true
      }
    ], { validate: true });
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'UserConnections';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      [Op.or]: [
        {
          user_1_id: 1,
          user_2_id: 2,
          meetingTime: new Date('2025-05-10T14:00:00Z')
        },
        {
          user_1_id: 2,
          user_2_id: 3,
          meetingTime: new Date('2025-05-12T09:00:00Z')
        },
        {
          user_1_id: 1,
          user_2_id: 3,
          meetingTime: new Date('2025-04-30T12:00:00Z')
        }
      ]
    }, {});
  }
};