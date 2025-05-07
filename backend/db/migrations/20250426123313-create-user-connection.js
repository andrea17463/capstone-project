'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    options.tableName = "UserConnections";
    await queryInterface.createTable('UserConnections', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      user_1_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'users', key: 'id' },
        onDelete: 'CASCADE'
      },
      user_2_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        // references: { model: 'users', key: 'id' },
        references: { model: 'Users', key: 'id' },
        onDelete: 'CASCADE'
      },
      connectionStatus: {
        type: Sequelize.STRING,
        allowNull: false
      },
      chatEnabled: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      meetingStatus: {
        type: Sequelize.STRING,
        allowNull: true
      },
      suggestedActivity: {
        type: Sequelize.STRING,
        allowNull: true
      },
      meetingTime: {
        type: Sequelize.DATE,
        allowNull: true
      },
      meetAgainChoiceUser1: {
        type: Sequelize.BOOLEAN,
        allowNull: true
      },
      meetAgainChoiceUser2: {
        type: Sequelize.BOOLEAN,
        allowNull: true
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
      },
    }, options);
  },
  async down(queryInterface, Sequelize) {
    options.tableName = "UserConnections";
    return queryInterface.dropTable(options);
  }
};