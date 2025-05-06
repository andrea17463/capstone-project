'use strict';

const { ChatMessage } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      await ChatMessage.bulkCreate([
        {
          senderId: 1,   // Sender: Demo-lition
          receiverId: 2, // Receiver: FakeUser1
          content: 'Hey, how are you?',
          deletedBySender: false,
          deletedByReceiver: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          senderId: 2,   // Sender: FakeUser1
          receiverId: 3, // Receiver: FakeUser2
          content: 'I\'ll see you on Saturday.',
          deletedBySender: false,
          deletedByReceiver: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          senderId: 1,   // Sender: Demo-lition
          receiverId: 3, // Receiver: FakeUser2
          content: 'Something came up. Let\'s meet next week.',
          deletedBySender: true,
          deletedByReceiver: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        }
      ], { validate: true });
    } catch (error) {
      console.error('Error inserting chat messages:', error);
    }
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'ChatMessages';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      [Op.or]: [
        { content: 'Hey, how are you?' },
        { content: 'I\'ll see you on Saturday.' },
        { content: 'Something came up. Let\'s meet next week.' }
      ]
    }, {});
  }
};