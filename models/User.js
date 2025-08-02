const { DataTypes } = require('sequelize');

const User = (sequelize) => {
  return sequelize.define(
    'user',
    {
      id: {
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
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  );
};

module.exports = User;
