const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const User = require('./User');

const ServiceProvider = sequelize.define('ServiceProvider', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  bio: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  rating: {
    type: DataTypes.DECIMAL(3, 2),
    allowNull: true,
    defaultValue: 5.00,
  },
  skills: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  is_available: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  },
}, {
  tableName: 'service_providers',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

// Associations
ServiceProvider.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
User.hasOne(ServiceProvider, { foreignKey: 'user_id', as: 'providerProfile' });

module.exports = ServiceProvider;
