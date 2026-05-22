# LuxeBook Project - End-to-End Test Cases

This document describes the manual and integration test cases used to verify LuxeBook's dynamic scheduling, multi-role views, and administrative tools.

---

## 🔐 1. Authentication & Role Registration Tests
### TC-01: Multi-Role Account Creation
- **Objective**: Verify that accounts can be successfully registered with different roles (Customer, Provider, Admin) from the registry.
- **Input**:
  - Name: "Alice customer", Email: "alice@luxebook.com", Password: "password123", Phone: "555-0199", Role: "Customer"
- **Expected Outcome**: Account created, user token received and saved in LocalStorage, redirects to Customer Dashboard.

### TC-02: Secure Login Verification
- **Objective**: Verify login with valid and invalid credentials.
- **Input**: Email: "alice@luxebook.com", Password: "wrongpassword" -> then correct password.
- **Expected Outcome**: Displays validation error alert on wrong password. Successful login redirects to Customer Dashboard.

---

## 📅 2. Dynamic Booking Scheduler Tests
### TC-03: Provider List Loading in Booking Modal
- **Objective**: Verify that opening the booking modal dynamically pulls the list of available providers from the backend.
- **Expected Outcome**: Provider drop-down list populated with registered providers who have `is_available: true`.

### TC-04: Submit Appointment Request
- **Objective**: Verify that submitting a scheduling request posts booking parameters correctly.
- **Input**: Service: "House Deep Cleaning", Provider: "John Doe", Date: "2026-06-01", Time: "10:00:00", Special Instructions: "Key is under the mat".
- **Expected Outcome**: Booking recorded with `status_id: 1` (Pending), modal displays a success animation card, resets form fields.

---

## 📊 3. Unified Dashboard Lifecycle Tests
### TC-05: Customer Scheduling View & Cancellation
- **Objective**: Verify that customers see their bookings and can request a cancellation.
- **Input**: Click "Cancel Booking" on a Pending slot.
- **Expected Outcome**: API updates booking state to Cancelled (`status_id: 4`). Card updates instantly to show "Cancelled" badge, and Cancel button disappears.

### TC-06: Provider Assignment & Status Transition
- **Objective**: Verify that providers see their assigned bookings and can accept/complete jobs.
- **Expected Outcome**:
  - Logging in as the assigned provider displays the appointment.
  - Clicking "Accept Job" changes status badge to Confirmed/Accepted (`status_id: 2`).
  - Clicking "Mark Completed" changes status badge to Completed (`status_id: 3`).

---

## 🛠️ 4. Administrative Service CRUD Tests
### TC-07: Admin Create New Service (Multipart Upload)
- **Objective**: Verify that admins can create new catalog items with uploaded images.
- **Input**: Service Name: "Premium Garden Styling", Category: "gardening", Price: "$65.00", Duration: "3 Hours", File: `garden.jpg`.
- **Expected Outcome**: Dynamic multi-part post returns code 201, service added to the DB, and image saved to local `/uploads` folder. New service immediately visible in the Catalog.

### TC-08: Admin Edit & Delete Service
- **Objective**: Verify updating details and service removal.
- **Expected Outcome**: Updating fields updates database record immediately. Clicking Delete removes the card from the active list.
