const express = require('express');
const router = express.Router();
const { getAvailableProviders, createBooking, getAllBookings, getUserBookings, getProviderBookings, updateBookingStatus } = require('../controllers/bookingController');
const { protect, admin } = require('../middleware/authMiddleware');

// Secure all booking actions using protect middleware
router.use(protect);

router.get('/providers', getAvailableProviders);
router.post('/', createBooking);
router.get('/all', admin, getAllBookings);
router.get('/my', getUserBookings);
router.get('/provider', getProviderBookings);
router.put('/:id/status', updateBookingStatus);

module.exports = router;
