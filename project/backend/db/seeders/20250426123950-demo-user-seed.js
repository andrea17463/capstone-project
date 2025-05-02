'use strict';

const { User } = require('../models');
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  async up(queryInterface, Sequelize) {
    await User.bulkCreate([
      {
        fullName: 'John Smith',
        firstName: 'John',
        email: 'demo@user.io',
        username: 'Demo-lition',
        hashedPassword: bcrypt.hashSync('password'),
        location: 'New York, NY',
        locationRadius: 25,
        availability: 'Weekends, 7PM-2AM',
        interests: 'Technology, Music, Hiking',
        objectives: 'Networking, Skill Development'
      },
      {
        fullName: 'Jane Doe',
        firstName: 'Jane',
        email: 'user1@user.io',
        username: 'FakeUser1',
        hashedPassword: bcrypt.hashSync('password2'),
        location: 'Los Angeles, CA',
        locationRadius: 30,
        availability: 'Weekends, 10AM-2PM',
        interests: 'Cooking, Traveling, Photography',
        objectives: 'Personal Growth, Meeting New People'
      },
      {
        fullName: 'Ashley Rodriguez',
        firstName: 'Ashley',
        email: 'user2@user.io',
        username: 'FakeUser2',
        hashedPassword: bcrypt.hashSync('password3'),
        location: 'Chicago, IL',
        locationRadius: 20,
        availability: 'Weekends, 10AM-2PM',
        interests: 'Fitness, Reading, Volunteering',
        objectives: 'Meeting New People'
      },
      {
        fullName: 'Michael Taylor',
        firstName: 'Michael',
        email: 'user3@user.io',
        username: 'FakeUser3',
        hashedPassword: bcrypt.hashSync('password4'),
        location: 'San Francisco, CA',
        locationRadius: 35,
        availability: 'Weekdays, 9AM-5PM',
        interests: 'Art, Hiking, Food',
        objectives: 'Networking, Personal Growth'
      },
      {
        fullName: 'Samantha Lee',
        firstName: 'Samantha',
        email: 'user4@user.io',
        username: 'FakeUser4',
        hashedPassword: bcrypt.hashSync('password5'),
        location: 'Austin, TX',
        locationRadius: 30,
        availability: 'Weekends, 9AM-12PM',
        interests: 'Yoga, Cooking, Photography',
        objectives: 'Building Connections'
      },
      {
        fullName: 'David Johnson',
        firstName: 'David',
        email: 'user5@user.io',
        username: 'FakeUser5',
        hashedPassword: bcrypt.hashSync('password6'),
        location: 'Miami, FL',
        locationRadius: 25,
        availability: 'Evenings, 5PM-10PM',
        interests: 'Technology, Reading, Traveling',
        objectives: 'Skill Development, Meeting New People'
      }
    ], { validate: true });
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'Users';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      username: { [Op.in]: ['Demo-lition', 'FakeUser1', 'FakeUser2', 'FakeUser3', 'FakeUser4', 'FakeUser5'] }
    }, {});
  }
};