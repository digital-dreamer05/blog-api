const { DataTypes } = require('sequelize');

const User = (sequelize) => {
  return sequelize.define(
    'user',
    {
      id: {
        allowNull: false,
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      avatar: {
        type: DataTypes.STRING,
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      role: {
        type: DataTypes.ENUM,
        values: ['user', 'admin'],
        allowNull: true,
        defaultValue: 'user',
      },
      provider: {
        type: DataTypes.ENUM,
        values: ['local', 'google'],
        allowNull: true,
        defaultValue: 'local',
      },
    },
    {
      tableName: 'users',
      timestamps: true,
    }
  );
};

module.exports = User;
