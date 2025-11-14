import { DataTypes } from 'sequelize';
import { sequelize } from '../config.js';
import User from './User.js';

const File = sequelize.define(
  'File',
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
    originalName: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: 'original_name',
    },
    storedName: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: 'stored_name',
    },
    extension: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    mimeType: {
      type: DataTypes.STRING(100),
      allowNull: true,
      field: 'mime_type',
    },
    size: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: true,
    },
    uploadedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: 'uploaded_at',
    },
  },
  {
    tableName: 'files',
    timestamps: false,
    underscored: true,
    indexes: [
      {
        fields: ['user_id', 'uploaded_at'],
        name: 'idx_files_user_uploaded_at',
      },
    ],
  },
);

File.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
User.hasMany(File, { foreignKey: 'user_id', as: 'files' });

export default File;

