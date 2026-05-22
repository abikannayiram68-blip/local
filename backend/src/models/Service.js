const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Service = sequelize.define('Service', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  title: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  duration: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
  category: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  image_url: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
}, {
  tableName: 'services',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

module.exports = Service;
