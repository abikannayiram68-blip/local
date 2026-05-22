-- =============================================================================
-- MySQL Schema Setup for LuxeBook Service Booking Application
-- Database Name: localbooking
-- =============================================================================

CREATE DATABASE IF NOT EXISTS `localbooking`;
USE `localbooking`;

-- -----------------------------------------------------------------------------
-- 1. Table: users
-- Holds authentication, basic detail credentials, role filters, and profile photo.
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `users` (
  `id` INT AUTO_INCREMENT,
  `name` VARCHAR(100) NOT NULL,
  `email` VARCHAR(100) NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  `phone` VARCHAR(20) DEFAULT NULL,
  `role` ENUM('user', 'admin', 'provider') DEFAULT 'user',
  `profile_photo` VARCHAR(255) DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_users_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 2. Table: services
-- Holds the inventory of services offered (e.g. cleaning, repairs, wellness).
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `services` (
  `id` INT AUTO_INCREMENT,
  `title` VARCHAR(100) NOT NULL,
  `description` TEXT DEFAULT NULL,
  `price` DECIMAL(10,2) NOT NULL,
  `duration` VARCHAR(50) DEFAULT NULL, -- e.g. "2 Hours", "45 Minutes"
  `category` VARCHAR(50) NOT NULL,    -- e.g. "cleaning", "handyman", "wellness"
  `image_url` VARCHAR(255) DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_services_category` (`category`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 3. Table: service_providers
-- Profiles of users registered as service operators (extends the users table).
-- Contains provider ratings, skills, and availability flags.
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `service_providers` (
  `id` INT AUTO_INCREMENT,
  `user_id` INT NOT NULL,
  `bio` TEXT DEFAULT NULL,
  `rating` DECIMAL(3,2) DEFAULT 5.00,  -- Out of 5.00
  `skills` VARCHAR(255) DEFAULT NULL,  -- e.g. "HVAC, Plumbing, Electrical"
  `is_available` TINYINT(1) DEFAULT 1, -- 1 = True, 0 = False
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_provider_user_id` (`user_id`),
  CONSTRAINT `fk_provider_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 4. Table: booking_statuses
-- Standard lookup codes for booking lifecycle stages.
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `booking_statuses` (
  `id` INT AUTO_INCREMENT,
  `name` VARCHAR(50) NOT NULL,
  `description` VARCHAR(255) DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_status_name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 5. Table: bookings
-- Captures scheduled appointments linking customers, services, and operators.
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `bookings` (
  `id` INT AUTO_INCREMENT,
  `user_id` INT NOT NULL,
  `service_id` INT NOT NULL,
  `provider_id` INT DEFAULT NULL, -- Can be assigned later
  `status_id` INT NOT NULL DEFAULT 1,
  `booking_date` DATE NOT NULL,
  `booking_time` TIME NOT NULL,
  `special_instructions` TEXT DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_bookings_date` (`booking_date`),
  KEY `fk_booking_user_idx` (`user_id`),
  KEY `fk_booking_service_idx` (`service_id`),
  KEY `fk_booking_provider_idx` (`provider_id`),
  KEY `fk_booking_status_idx` (`status_id`),
  CONSTRAINT `fk_booking_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_booking_service` FOREIGN KEY (`service_id`) REFERENCES `services` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_booking_provider` FOREIGN KEY (`provider_id`) REFERENCES `service_providers` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_booking_status` FOREIGN KEY (`status_id`) REFERENCES `booking_statuses` (`id`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================================================
-- SEED DATA SETUP
-- Bootstrap tables with initial default values for test flows.
-- =============================================================================

-- Seed default booking statuses
INSERT INTO `booking_statuses` (`id`, `name`, `description`) VALUES
(1, 'Pending', 'Booking requested, awaiting provider assignment'),
(2, 'Confirmed', 'Provider assigned, booking confirmed and scheduled'),
(3, 'Completed', 'Service completed successfully'),
(4, 'Cancelled', 'Booking cancelled by user or administrator')
ON DUPLICATE KEY UPDATE `description` = VALUES(`description`);

-- Seed some premium sample services matching the frontend catalog
INSERT INTO `services` (`id`, `title`, `description`, `price`, `duration`, `category`, `image_url`) VALUES
(1, 'Full House Deep Cleaning', 'Complete sanitization and detailed cleaning of all rooms, bathrooms, kitchens, and hallways by a professional 2-person crew.', 89.00, '4-5 Hours', 'cleaning', 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&q=80&w=600'),
(2, 'AC Maintenance & Servicing', 'Filter cleaning, refrigerant pressure testing, coil vacuuming, and general thermal performance audit for optimal cooling.', 49.00, '1.5 Hours', 'handyman', 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80&w=600'),
(3, 'Deep Tissue Body Massage', 'Therapeutic deep muscle pressure release and tension dissipation designed to recharge body and mind in your own home.', 75.00, '60 Minutes', 'wellness', 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=600')
ON DUPLICATE KEY UPDATE `price` = VALUES(`price`), `duration` = VALUES(`duration`), `description` = VALUES(`description`);
