'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UserConnection extends Model {
    static associate(models) {
      UserConnection.belongsTo(models.User, { foreignKey: 'user_1_id', as: 'user1' });
      UserConnection.belongsTo(models.User, { foreignKey: 'user_2_id', as: 'user2' });
    }
  }
  UserConnection.init({
    user_1_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'Users', key: 'id' },
      onDelete: 'CASCADE'
    },
    user_2_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'Users', key: 'id' },
      onDelete: 'CASCADE'
    },
    connectionStatus: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'pending',
      validate: {
        isIn: [[ 'active', 'pending', 'accepted', 'declined']]
      }
    },
    meetingStatus: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'pending',
      validate: {
        isIn: [['active', 'pending', 'accepted', 'confirmed', 'canceled', 'completed']]
      }
    },
    // chatEnabled: {
    //   type: DataTypes.BOOLEAN,
    //   allowNull: false,
    //   defaultValue: false
    // },
    suggestedActivity: {
      type: DataTypes.STRING,
      allowNull: true
    },
    meetingTime: {
      type: DataTypes.DATE,
      allowNull: true
    },
    meetAgainChoiceUser1: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    meetAgainChoiceUser2: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'UserConnection',
    tableName: 'UserConnections',
    underscored: false,
    ...(process.env.NODE_ENV === 'production' && {
      schema: process.env.SCHEMA
    }),
    timestamps: true
  });

  return UserConnection;
};