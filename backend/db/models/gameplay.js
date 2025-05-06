'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class GamePlay extends Model {
    static associate(models) {
      GamePlay.belongsTo(models.User, { foreignKey: 'user_1_id', as: 'user1' });
      GamePlay.belongsTo(models.User, { foreignKey: 'user_2_id', as: 'user2' });
      GamePlay.belongsTo(models.User, { foreignKey: 'user_id', as: 'guesser' });
    }
  }
  GamePlay.init({
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
    traitName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    traitDescription: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    interactionType: {
      type: DataTypes.STRING,
      allowNull: false
    },
    guessedValue: {
      type: DataTypes.STRING,
      allowNull: true
    },
    isCorrect: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: { model: 'Users', key: 'id' },
      onDelete: 'SET NULL'
    },
    promptText: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'active'
    }
  }, {
    sequelize,
    modelName: 'GamePlay',
    tableName: 'GamePlays',
    underscored: false,
    timestamps: true
  });

  return GamePlay;
};