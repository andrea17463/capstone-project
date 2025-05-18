'use strict';

const { User, ChatMessage } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      if (process.env.NODE_ENV === 'production') {
        const tableExists = await queryInterface.sequelize.query(
          `SELECT EXISTS (
            SELECT FROM information_schema.tables 
            WHERE table_schema = '${process.env.SCHEMA}'
            AND table_name = 'ChatMessages'
          );`,
          { type: Sequelize.QueryTypes.SELECT }
        );
        
        if (!tableExists[0].exists) {
          console.log('ChatMessages table does not exist, skipping seeding');
          return;
        }
      }

      const users = await User.findAll({
        attributes: ['id', 'username'],
        limit: 3
      });
      
      if (users.length < 3) {
        console.error('Not enough users found in the database for seeding chat messages');
        return;
      }
      
      const user1 = users[0];
      const user2 = users[1];
      const user3 = users[2];
      
      await ChatMessage.bulkCreate([
        {
          senderId: user1.id, // Sender: Demo-lition
          receiverId: user2.id, // Receiver: FakeUser1,
          content: 'Hey, how are you?',
          deletedBySender: false,
          deletedByReceiver: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          senderId: user2.id, // Sender: FakeUser1
          receiverId: user3.id, // Receiver: FakeUser2
          content: 'I\'ll see you on Saturday.',
          deletedBySender: false,
          deletedByReceiver: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          senderId: user1.id, // Sender: Demo-lition
          receiverId: user3.id, // Receiver: FakeUser2
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