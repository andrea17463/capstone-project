'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    options.tableName = 'ChatMessages';
    try {
      // await queryInterface.createTable('ChatMessages', {
      await queryInterface.createTable(options, {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
          allowNull: false
        },
        senderId: {
          type: Sequelize.INTEGER,
          allowNull: false,
          // references: { model: 'Users', key: 'id' },
          references: {
            model: {
              tableName: 'Users',
              schema: process.env.NODE_ENV === 'production' ? process.env.SCHEMA : undefined
            },
            key: 'id'
          },
          onDelete: 'CASCADE'
        },
        receiverId: {
          type: Sequelize.INTEGER,
          allowNull: false,
          // references: { model: 'Users', key: 'id' },
          references: {
            model: {
              tableName: 'Users',
              schema: process.env.NODE_ENV === 'production' ? process.env.SCHEMA : undefined
            },
            key: 'id'
          },
          onDelete: 'CASCADE'
        },
        content: {
          type: Sequelize.TEXT,
          allowNull: false
        },
        editedAt: {
          type: Sequelize.DATE,
          allowNull: true
        },
        deletedBySender: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: false
        },
        deletedByReceiver: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: false
        },
        createdAt: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
        },
        updatedAt: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
        }
      });
    } catch (error) {
      console.error('Error creating chat messages table:', error);
    }
  },
  async down(queryInterface, Sequelize) {
    options.tableName = 'ChatMessages';
    try {
      return queryInterface.dropTable(options);
    } catch (error) {
      console.error('Error deleting chat messages table:', error);
    }
  }
};