'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasMany(models.Room, {
        foreignKey: 'host'
      });
      User.hasMany(models.UserRoom, {
        foreignKey: 'UserId',
        onDelete: 'CASCADE'
      });
    }
  }
  User.init({
    name: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Name is required'
        },
        notEmpty: {
          msg: 'Name is required'
        }
      }
    }
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};