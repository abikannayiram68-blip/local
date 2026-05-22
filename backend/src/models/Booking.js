const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const User = require('./User');
const Service = require('./Service');

const Booking = sequelize.define('Booking', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  service_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'services',
      key: 'id'
    }
  },
  provider_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'service_providers',
      key: 'id'
    }
  },
  status_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1, // 1 = Pending, 2 = Confirmed/Accepted, 3 = Completed, 4 = Cancelled
  },
  booking_date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  booking_time: {
    type: DataTypes.TIME,
    allowNull: false,
  },
  special_instructions: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  tableName: 'bookings',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

// Setup relationships
Booking.belongsTo(User, { foreignKey: 'user_id', as: 'customer' });
Booking.belongsTo(Service, { foreignKey: 'service_id', as: 'service' });
Booking.belongsTo(require('./ServiceProvider'), { foreignKey: 'provider_id', as: 'provider' });


module.exports = Booking;
