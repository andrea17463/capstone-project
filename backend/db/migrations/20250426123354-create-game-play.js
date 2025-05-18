'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA; // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    options.tableName = 'GamePlays';
    await queryInterface.createTable('GamePlays', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      user_1_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: {
            tableName: 'Users',
            schema: process.env.NODE_ENV === 'production' ? process.env.SCHEMA : undefined
          },
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      user_2_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: {
            tableName: 'Users',
            schema: process.env.NODE_ENV === 'production' ? process.env.SCHEMA : undefined
          },
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      traitCategory: {
        type: Sequelize.TEXT,
        // allowNull: false
        allowNull: true
      },
      traitName: {
        type: Sequelize.STRING,
        // allowNull: false
        allowNull: true
      },
      interactionType: {
        type: Sequelize.STRING,
        // allowNull: false
        allowNull: true
      },
      guesser_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: {
            tableName: 'Users',
            schema: process.env.NODE_ENV === 'production' ? process.env.SCHEMA : undefined
          },
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      guessedValue: {
        type: Sequelize.STRING,
        // allowNull: false
        allowNull: true
      },
      isCorrect: {
        type: Sequelize.BOOLEAN,
        // allowNull: false,
        allowNull: true,
        defaultValue: false
      },
      status: {
        type: Sequelize.STRING,
        allowNull: true
      },
      gameSessionId: {
        type: Sequelize.INTEGER,
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
    options.tableName = 'GamePlays';
    return queryInterface.dropTable(options);
  }
};