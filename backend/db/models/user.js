'use strict';

const { Model } = require('sequelize');
const Validator = require('validator');
// const sequelize = require('../../config/database');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.hasMany(models.UserConnection, {
        foreignKey: 'user_1_id',
        as: 'connections1'
      });
      User.hasMany(models.UserConnection, {
        foreignKey: 'user_2_id',
        as: 'connections2'
      });
    }
  }
  User.init({
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        len: [4, 30],
        isNotEmail(value) {
          if (Validator.isEmail(value)) {
            throw new Error('Username cannot be an email.');
          }
        }
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        len: [3, 256],
        isEmail: true
      }
    },
    hashedPassword: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [60, 60]
      }
    },
    // firstName: {
    //   type: DataTypes.STRING,
    //   allowNull: false
    // },
    fullName: {
      type: DataTypes.STRING,
      allowNull: true
    },
    age: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    location: {
      type: DataTypes.STRING,
      allowNull: true
    },
    locationRadius: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    availability: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    interests: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    objectives: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'Users',
    underscored: false,
    ...(process.env.NODE_ENV === 'production' && {
      schema: process.env.SCHEMA
    }),
    defaultScope: {
      attributes: {
        exclude: ['hashedPassword', 'email', 'createdAt', 'updatedAt']
      }
    },
    scopes: {
      currentUser: {
        attributes: { exclude: ['hashedPassword'] }
      },
      loginUser: {
        attributes: {}
      }
    }
  });

  return User;
};