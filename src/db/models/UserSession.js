import { DataTypes } from 'sequelize';
import { sequelize } from '../config.js';
import User from './User.js';

const UserSession = sequelize.define(
  'UserSession',
  {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    userId: {
      type: DataTypes.STRING(191),
      allowNull: false,
      field: 'user_id',
      references: {
        model: User,
        key: 'id',
      },
    },
    accessJti: {
      type: DataTypes.STRING(191),
      allowNull: false,
      unique: true,
      field: 'access_jti',
    },
    refreshJti: {
      type: DataTypes.STRING(191),
      allowNull: false,
      unique: true,
      field: 'refresh_jti',
    },
    accessExpiresAt: {
      type: DataTypes.DATE,
      allowNull: false,
      field: 'access_expires_at',
    },
    refreshExpiresAt: {
      type: DataTypes.DATE,
      allowNull: false,
      field: 'refresh_expires_at',
    },
    refreshTokenHash: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: 'refresh_token_hash',
    },
    revokedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: null,
      field: 'revoked_at',
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: 'created_at',
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: 'updated_at',
    },
  },
  {
    tableName: 'user_sessions',
    timestamps: true,
    underscored: true,
  },
);

UserSession.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
User.hasMany(UserSession, { foreignKey: 'user_id', as: 'sessions' });

export default UserSession;

