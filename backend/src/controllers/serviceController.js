const Service = require('../models/Service');

/**
 * -----------------------------------------------------------------------------
 * Raw MySQL Query Equivalent:
 * SELECT * FROM services ORDER BY created_at DESC;
 * -----------------------------------------------------------------------------
 */
// @desc    List all services
// @route   GET /api/services
// @access  Public
const getServices = async (req, res) => {
  try {
    const services = await Service.findAll({ order: [['created_at', 'DESC']] });
    res.status(200).json(services);
  } catch (error) {
    res.status(500).json({ message: 'Server error listing services', error: error.message });
  }
};

/**
 * -----------------------------------------------------------------------------
 * Raw MySQL Query Equivalent:
 * INSERT INTO services (title, description, category, price, duration, image_url, created_at, updated_at)
 * VALUES ('Sofa Cleaning', 'Eco-friendly shampoo extraction...', 39.00, '2 Hours', 'cleaning', 'https://...', NOW(), NOW());
 * -----------------------------------------------------------------------------
 */
// @desc    Add a new service
// @route   POST /api/services
// @access  Private/Admin
const createService = async (req, res) => {
  const { service_name, description, category, price, duration, image_url } = req.body;

  if (!service_name || !category || !price) {
    return res.status(400).json({ message: 'Please provide service name, category, and price.' });
  }

  try {
    // If multer image is uploaded, resolve its static path
    let resolvedImageUrl = image_url || 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&q=80&w=600';
    if (req.file) {
      resolvedImageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    }

    const service = await Service.create({
      title: service_name,
      description,
      category,
      price: parseFloat(price),
      duration: duration || '1.5 Hours',
      image_url: resolvedImageUrl
    });

    res.status(201).json(service);
  } catch (error) {
    res.status(500).json({ message: 'Server error creating service', error: error.message });
  }
};

/**
 * -----------------------------------------------------------------------------
 * Raw MySQL Query Equivalent:
 * UPDATE services 
 * SET title = 'New Title', description = 'New Desc', category = 'cleaning', price = 45.00, duration = '2 Hours', image_url = 'https://...', updated_at = NOW()
 * WHERE id = 12;
 * -----------------------------------------------------------------------------
 */
// @desc    Edit/Update an existing service
// @route   PUT /api/services/:id
// @access  Private/Admin
const updateService = async (req, res) => {
  const { id } = req.params;
  const { service_name, description, category, price, duration, image_url } = req.body;

  try {
    const service = await Service.findByPk(id);

    if (!service) {
      return res.status(404).json({ message: 'Service not found.' });
    }

    // Resolve upload image or request string
    let resolvedImageUrl = image_url || service.image_url;
    if (req.file) {
      resolvedImageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    }

    // Apply updates
    service.title = service_name || service.title;
    service.description = description !== undefined ? description : service.description;
    service.category = category || service.category;
    service.price = price !== undefined ? parseFloat(price) : service.price;
    service.duration = duration || service.duration;
    service.image_url = resolvedImageUrl;

    await service.save();
    res.status(200).json(service);
  } catch (error) {
    res.status(500).json({ message: 'Server error updating service', error: error.message });
  }
};

/**
 * -----------------------------------------------------------------------------
 * Raw MySQL Query Equivalent:
 * DELETE FROM services WHERE id = 12;
 * -----------------------------------------------------------------------------
 */
// @desc    Delete an existing service
// @route   DELETE /api/services/:id
// @access  Private/Admin
const deleteService = async (req, res) => {
  const { id } = req.params;

  try {
    const service = await Service.findByPk(id);

    if (!service) {
      return res.status(404).json({ message: 'Service not found.' });
    }

    await service.destroy();
    res.status(200).json({ message: 'Service deleted successfully.', id });
  } catch (error) {
    res.status(500).json({ message: 'Server error deleting service', error: error.message });
  }
};

module.exports = {
  getServices,
  createService,
  updateService,
  deleteService
};
