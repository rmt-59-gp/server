'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Room extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Room.hasMany(models.UserRoom, {
        foreignKey: 'RoomId'
      });
      Room.belongsTo(models.User, {
        foreignKey: 'host',
      });
    }
  }
  Room.init({
    CodeRoom: DataTypes.STRING,
    question: DataTypes.JSON,
    host: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Users',
        key: 'id'
      },
    }
  }, {
    sequelize,
    modelName: 'Room',
  });
  return Room;
};