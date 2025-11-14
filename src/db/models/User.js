import { DataTypes } from 'sequelize';
import { sequelize } from '../config.js';

const User = sequelize.define(
  'User',
  {
    id: {
      type: DataTypes.STRING(191),
      primaryKey: true,
      allowNull: false,
    },
    passwordHash: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: 'password_hash',
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: 'created_at',
    },
  },
  {
    tableName: 'users',
    timestamps: false,
    underscored: true,
  },
);

export default User;

