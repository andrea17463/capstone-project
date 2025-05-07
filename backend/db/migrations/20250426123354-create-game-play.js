'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA; // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    options.tableName = "GamePlays";
    await queryInterface.createTable("GamePlays", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      user_1_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        // references: { model: 'users', key: 'id' },
        references: { model: 'Users', key: 'id' },
        onDelete: 'CASCADE'
      },
      user_2_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        // references: { model: 'users', key: 'id' },
        references: { model: 'Users', key: 'id' },
        onDelete: 'CASCADE'
      },
      traitName: {
        type: Sequelize.STRING,
        allowNull: false
      },
      traitDescription: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      interactionType: {
        type: Sequelize.STRING,
        allowNull: false
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        // references: { model: 'users', key: 'id' },
        references: { model: 'Users', key: 'id' },
        onDelete: 'CASCADE'
      },
      guessedValue: {
        type: Sequelize.STRING,
        allowNull: false
      },
      isCorrect: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      promptText: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      status: {
        type: Sequelize.STRING,
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
      }
    }, options);
  },

  async down(queryInterface, Sequelize) {
    options.tableName = "GamePlays";
    return queryInterface.dropTable(options);
  }
};