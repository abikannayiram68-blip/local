const Booking = require('../models/Booking');
const Service = require('../models/Service');
const ServiceProvider = require('../models/ServiceProvider');
const User = require('../models/User');

/**
 * -----------------------------------------------------------------------------
 * Raw MySQL Query Equivalent:
 * SELECT sp.*, u.name, u.email, u.phone 
 * FROM service_providers sp 
 * JOIN users u ON sp.user_id = u.id 
 * WHERE sp.is_available = 1;
 * -----------------------------------------------------------------------------
 */
// @desc    Get all available service providers
// @route   GET /api/bookings/providers
// @access  Private
const getAvailableProviders = async (req, res) => {
  try {
    const providers = await ServiceProvider.findAll({
      where: { is_available: true },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'email', 'phone', 'profile_photo']
        }
      ]
    });
    res.status(200).json(providers);
  } catch (error) {
    res.status(500).json({ message: 'Server error listing providers', error: error.message });
  }
};

/**
 * -----------------------------------------------------------------------------
 * Raw MySQL Query Equivalent:
 * INSERT INTO bookings (user_id, service_id, provider_id, status_id, booking_date, booking_time, special_instructions, created_at, updated_at)
 * VALUES (2, 1, 1, 1, '2026-05-24', '14:30:00', 'Leave keys with concierge', NOW(), NOW());
 * -----------------------------------------------------------------------------
 */
// @desc    Create a new booking appointment
// @route   POST /api/bookings
// @access  Private
const createBooking = async (req, res) => {
  const { service_id, provider_id, booking_date, booking_time, special_instructions } = req.body;
  const user_id = req.user.id; // Logged-in user

  if (!service_id || !booking_date || !booking_time) {
    return res.status(400).json({ message: 'Please provide service ID, booking date, and booking time.' });
  }

  try {
    // Verify service exists
    const service = await Service.findByPk(service_id);
    if (!service) {
      return res.status(404).json({ message: 'Selected service not found.' });
    }

    // Verify provider is available if provider_id is sent
    if (provider_id) {
      const provider = await ServiceProvider.findByPk(provider_id);
      if (!provider || !provider.is_available) {
        return res.status(400).json({ message: 'Selected service provider is not available.' });
      }
    }

    const booking = await Booking.create({
      user_id,
      service_id,
      provider_id: provider_id || null,
      status_id: 1, // Defaulting to 1 (Pending)
      booking_date,
      booking_time,
      special_instructions
    });

    // Fetch the newly created booking details including associations
    const completedBooking = await Booking.findByPk(booking.id, {
      include: [
        { model: Service, as: 'service', attributes: ['title', 'price', 'category', 'image_url'] },
        { model: User, as: 'customer', attributes: ['name', 'email'] }
      ]
    });

    res.status(201).json(completedBooking);
  } catch (error) {
    res.status(500).json({ message: 'Server error creating booking', error: error.message });
  }
};

/**
 * -----------------------------------------------------------------------------
 * Raw MySQL Query Equivalent:
 * SELECT b.*, s.title, s.price, s.category, sp.rating 
 * FROM bookings b
 * JOIN services s ON b.service_id = s.id
 * LEFT JOIN service_providers sp ON b.provider_id = sp.id
 * WHERE b.user_id = 2
 * ORDER BY b.booking_date DESC;
 * -----------------------------------------------------------------------------
 */
// @desc    Get user bookings
// @route   GET /api/bookings/my
// @access  Private
const getUserBookings = async (req, res) => {
  const user_id = req.user.id;

  try {
    const bookings = await Booking.findAll({
      where: { user_id },
      include: [
        { model: Service, as: 'service', attributes: ['id', 'title', 'price', 'category', 'image_url'] },
        {
          model: ServiceProvider,
          as: 'provider',
          attributes: ['id', 'rating'],
          include: [{ model: User, as: 'user', attributes: ['name', 'phone'] }]
        }
      ],
      order: [['booking_date', 'DESC'], ['booking_time', 'DESC']]
    });
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Server error listing customer bookings', error: error.message });
  }
};

/**
 * -----------------------------------------------------------------------------
 * Raw MySQL Query Equivalent:
 * SELECT b.*, s.title, s.price, u.name, sp.rating
 * FROM bookings b
 * JOIN services s ON b.service_id = s.id
 * JOIN users u ON b.user_id = u.id
 * LEFT JOIN service_providers sp ON b.provider_id = sp.id
 * ORDER BY b.booking_date DESC, b.booking_time DESC;
 * -----------------------------------------------------------------------------
 */
// @desc    Get all bookings for admin audit feed
// @route   GET /api/bookings/all
// @access  Private/Admin
const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.findAll({
      include: [
        { model: Service, as: 'service', attributes: ['id', 'title', 'price', 'category', 'image_url'] },
        { model: User, as: 'customer', attributes: ['id', 'name', 'phone', 'email'] },
        {
          model: ServiceProvider,
          as: 'provider',
          attributes: ['id', 'rating'],
          include: [{ model: User, as: 'user', attributes: ['id', 'name', 'phone', 'email'] }]
        }
      ],
      order: [['booking_date', 'DESC'], ['booking_time', 'DESC'], ['created_at', 'DESC']]
    });

    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Server error listing all bookings', error: error.message });
  }
};

/**
 * -----------------------------------------------------------------------------
 * Raw MySQL Query Equivalent:
 * SELECT b.*, s.title, s.price, u.name, u.phone 
 * FROM bookings b
 * JOIN services s ON b.service_id = s.id
 * JOIN users u ON b.user_id = u.id
 * WHERE b.provider_id = 1
 * ORDER BY b.booking_date DESC;
 * -----------------------------------------------------------------------------
 */
// @desc    Get service provider bookings
// @route   GET /api/bookings/provider
// @access  Private
const getProviderBookings = async (req, res) => {
  try {
    // Find provider associated with user_id
    const provider = await ServiceProvider.findOne({ where: { user_id: req.user.id } });
    if (!provider) {
      return res.status(404).json({ message: 'Service Provider profile not found.' });
    }

    const bookings = await Booking.findAll({
      where: { provider_id: provider.id },
      include: [
        { model: Service, as: 'service', attributes: ['id', 'title', 'price', 'category', 'image_url'] },
        { model: User, as: 'customer', attributes: ['id', 'name', 'phone', 'email'] }
      ],
      order: [['booking_date', 'DESC'], ['booking_time', 'DESC']]
    });
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Server error listing provider bookings', error: error.message });
  }
};

/**
 * -----------------------------------------------------------------------------
 * Raw MySQL Query Equivalent:
 * UPDATE bookings 
 * SET status_id = 2, updated_at = NOW() 
 * WHERE id = 5;
 * -----------------------------------------------------------------------------
 */
// @desc    Update booking status (Pending, Accepted, Completed, Cancelled)
// @route   PUT /api/bookings/:id/status
// @access  Private
const updateBookingStatus = async (req, res) => {
  const { id } = req.params;
  const { status_id } = req.body; // 1 = Pending, 2 = Accepted/Confirmed, 3 = Completed, 4 = Cancelled

  if (!status_id) {
    return res.status(400).json({ message: 'Please provide status_id.' });
  }

  try {
    const booking = await Booking.findByPk(id, {
      include: [
        { model: Service, as: 'service', attributes: ['title'] },
        { model: User, as: 'customer', attributes: ['email'] }
      ]
    });

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found.' });
    }

    // Authorization checks
    // Users can cancel their own bookings
    // Providers can accept/complete their assigned bookings
    // Admins can change any status
    const isOwner = booking.user_id === req.user.id;
    const isAdmin = req.user.role === 'admin';
    
    let isAssignedProvider = false;
    const provider = await ServiceProvider.findOne({ where: { user_id: req.user.id } });
    if (provider && booking.provider_id === provider.id) {
      isAssignedProvider = true;
    }

    if (!isOwner && !isAdmin && !isAssignedProvider) {
      return res.status(403).json({ message: 'Unauthorized status transition permissions.' });
    }

    // Apply the status transition
    booking.status_id = parseInt(status_id);
    await booking.save();

    res.status(200).json({
      message: 'Booking status updated successfully.',
      booking
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error updating booking status', error: error.message });
  }
};

module.exports = {
  getAvailableProviders,
  createBooking,
  getAllBookings,
  getUserBookings,
  getProviderBookings,
  updateBookingStatus
};
