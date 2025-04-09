'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UserRoom extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      UserRoom.belongsTo(models.User, {
        foreignKey: 'UserId',
        onDelete: 'CASCADE'
      });
      UserRoom.belongsTo(models.Room, {
        foreignKey: 'RoomId',
        onDelete: 'CASCADE'
      });
    }
  }
  UserRoom.init({
    UserId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
    RoomId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Rooms',
        key: 'id'
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
    score: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  }, {
    sequelize,
    modelName: 'UserRoom',
  });
  return UserRoom;
};