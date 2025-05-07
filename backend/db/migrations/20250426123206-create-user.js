'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // options.tableName = "Users";
    await queryInterface.createTable('Users', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
      },
      fullName: {
        type: Sequelize.STRING,
        allowNull: false
      },
      // firstName: {
      //   type: Sequelize.STRING,
      //   allowNull: false
      // },
      username: {
        type: Sequelize.STRING(30),
        allowNull: false,
        unique: true
      },
      email: {
        type: Sequelize.STRING(256),
        allowNull: false,
        unique: true
      },
      hashedPassword: {
        type: Sequelize.STRING.BINARY,
        allowNull: false
      },
      location: {
        type: Sequelize.STRING,
        allowNull: true
      },
      locationRadius: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      availability: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      interests: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      objectives: {
        type: Sequelize.TEXT,
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
    options.tableName = 'Users';
    try {
      if (process.env.NODE_ENV === 'production') {
        await queryInterface.sequelize.query(`
          DROP TABLE IF EXISTS ${process.env.SCHEMA}."ChatMessages" CASCADE;
          DROP TABLE IF EXISTS ${process.env.SCHEMA}."UserConnections" CASCADE;
          DROP TABLE IF EXISTS ${process.env.SCHEMA}."GamePlays" CASCADE;
        `);
      }
      return queryInterface.dropTable(options);
    } catch (error) {
      console.error('Error dropping Users table:', error);
    }
  }
};