'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ChatMessage extends Model {
    static associate(models) {
      ChatMessage.belongsTo(models.User, {
        foreignKey: 'senderId',
        as: 'sender'
      });

      ChatMessage.belongsTo(models.User, {
        foreignKey: 'receiverId',
        as: 'receiver'
      });
    }
  }
  ChatMessage.init({
    senderId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    receiverId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    editedAt: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'ChatMessage',
    // tableName: 'ChatMessages',
    underscored: false,
    ...(process.env.NODE_ENV === 'production' && {
      schema: process.env.SCHEMA
    }),
    timestamps: true
  });

  return ChatMessage;
};