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
        foreignKey: 'RoomId',
        onDelete: 'CASCADE'
      });
    }
  }
  Room.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Name is required'
        },
        notEmpty: {
          msg: 'Name is required'
        }
      }
    },
    code: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Code is required'
        },
        notEmpty: {
          msg: 'Code is required'
        }
      },
      defaultValue: require('crypto').randomBytes(4).toString('hex')
    },
    topic: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Topic is required'
        },
        notEmpty: {
          msg: 'Topic is required'
        }
      }
    },
    questions: {
      type: DataTypes.JSON,
      defaultValue: []
    },
    members: {
      type: DataTypes.JSON,
      defaultValue: []
    },
    host: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Host is required'
        },
        notEmpty: {
          msg: 'Host is required'
        }
      },
    }
  }, {
    sequelize,
    modelName: 'Room',
  });

  Room.beforeCreate((room, options) => {
    room['code'] = require('crypto').randomBytes(4).toString('hex');
  })

  return Room;
};