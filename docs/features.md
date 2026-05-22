# LuxeBook Project - Core Features

This document provides a directory of features implemented on the LuxeBook Local Service Booking Platform.

---

## 🔒 1. JWT Session Authentication & Multi-Role Registry
- **Dynamic Registry**: Let users register as a Customer, Service Provider, or System Admin directly.
- **Secure Sessions**: Passwords hashed with 10 salt rounds of `bcryptjs`. Session verified dynamically using signed JSON Web Tokens (JWT).
- **Auto Token Injector**: Client axios instance interceptor injects token headers on all authenticated paths.

## 💎 2. Premium Services Catalogue
- **Live Query Filtering**: Real-time searching and filtering of catalog items by text string, category (cleaning, handyman, wellness, tech, moving, gardening), and max price threshold slider.
- **Dynamic Price Sorting**: Sort by rating, popularity, and ascending/descending pricing.
- **Multer Uploads Integration**: Admin service additions support true static file storage upload (up to 3MB) with automatic system path generation.

## 📅 3. Dynamic Scheduling Wizard
- **Live Provider Listing**: Wizard reads available operators dynamically on opening the modal.
- **Provider Selection**: Integrated drop-down selector displaying name, specialty, and rating stars (e.g. `★ 4.90`).
- **Date & Time Picker**: Ensures future scheduling and records specific special instructions (key locations, entrance codes).

## 📊 4. Unified Glassmorphic Dashboard Portal
A high-fidelity central workspace that adapts dynamically to three active roles:
- **Customer View**:
  - Live indicator counts showing Active Schedules and Total Orders.
  - History cards sorting appointments, tracking dates, times, prices, and status badges.
  - Quick action to **Cancel** pending slots.
- **Provider View**:
  - Details panel showing contact name, client phone, date-time slots, and pricing.
  - Status transition triggers: **Accept Job** (Confirmed status) and **Mark Completed**.
- **Admin View**:
  - Overall system stats indicators.
  - **Service Management Panel**: Live table with controls to Add New Service, Edit Service info, or Delete from catalog.
