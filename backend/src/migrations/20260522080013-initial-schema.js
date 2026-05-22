'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // 1. users
    await queryInterface.createTable('users', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING(100),
        allowNull: false,
        unique: true,
      },
      password: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      phone: {
        type: Sequelize.STRING(20),
      },
      role: {
        type: Sequelize.ENUM('user', 'admin'),
        defaultValue: 'user',
      },
      profile_photo: {
        type: Sequelize.STRING(255),
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      }
    });

    // 2. services
    await queryInterface.createTable('services', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      service_name: {
        type: Sequelize.STRING(100),
      },
      description: {
        type: Sequelize.TEXT,
      },
      category: {
        type: Sequelize.STRING(100),
      },
      price: {
        type: Sequelize.DECIMAL(10, 2),
      },
      image: {
        type: Sequelize.STRING(255),
      },
      status: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      }
    });

    // 3. service_providers
    await queryInterface.createTable('service_providers', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      provider_name: {
        type: Sequelize.STRING(100),
      },
      email: {
        type: Sequelize.STRING(100),
      },
      phone: {
        type: Sequelize.STRING(20),
      },
      address: {
        type: Sequelize.TEXT,
      },
      experience: {
        type: Sequelize.INTEGER,
      },
      rating: {
        type: Sequelize.FLOAT,
        defaultValue: 0,
      },
      profile_photo: {
        type: Sequelize.STRING(255),
      },
      service_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'services',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      }
    });

    // 4. booking_statuses
    await queryInterface.createTable('booking_statuses', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      status_name: {
        type: Sequelize.STRING(50),
      }
    });

    // Insert default statuses
    await queryInterface.bulkInsert('booking_statuses', [
      { status_name: 'Pending' },
      { status_name: 'Accepted' },
      { status_name: 'In Progress' },
      { status_name: 'Completed' },
      { status_name: 'Cancelled' }
    ]);

    // 5. bookings
    await queryInterface.createTable('bookings', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      user_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      service_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'services',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      provider_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'service_providers',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      booking_date: {
        type: Sequelize.DATE,
      },
      address: {
        type: Sequelize.TEXT,
      },
      notes: {
        type: Sequelize.TEXT,
      },
      total_amount: {
        type: Sequelize.DECIMAL(10, 2),
      },
      booking_status_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'booking_statuses',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('bookings');
    await queryInterface.dropTable('booking_statuses');
    await queryInterface.dropTable('service_providers');
    await queryInterface.dropTable('services');
    await queryInterface.dropTable('users');
  }
};
