import { useState, useEffect, useContext, useCallback } from 'react';
import { AuthContext } from '../../context/AuthContextCore';
import api from '../../api/axios';
import './dashboard.css';

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  
  // Dashboard states
  const [bookings, setBookings] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // CRUD Service states (Admin view)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentServiceId, setCurrentServiceId] = useState(null);
  const [serviceName, setServiceName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('cleaning');
  const [price, setPrice] = useState('');
  const [duration, setDuration] = useState('1.5 Hours');
  const [imageFile, setImageFile] = useState(null);
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');

  // Tab switching state
  const [activeTab, setActiveTab] = useState('schedules'); // schedules, services (for admin)

  const fetchDashboardData = useCallback(async () => {
    if (!user) return;
    try {
      setLoading(true);
      setError('');
      
      if (user.role === 'user') {
        const { data } = await api.get('/bookings/my');
        setBookings(data);
      } else if (user.role === 'provider') {
        const { data } = await api.get('/bookings/provider');
        setBookings(data);
      } else if (user.role === 'admin') {
        const [servicesRes, bookingsRes] = await Promise.all([
          api.get('/services'),
          api.get('/bookings/all')
        ]);
        setServices(servicesRes.data);
        setBookings(bookingsRes.data);
      }
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Could not load dashboard data. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    queueMicrotask(fetchDashboardData);
  }, [fetchDashboardData]);

  // Status ID Mapper
  const getStatusBadge = (statusId) => {
    switch (parseInt(statusId)) {
      case 1: return <span className="status-badge pending">Pending</span>;
      case 2: return <span className="status-badge confirmed">Confirmed</span>;
      case 3: return <span className="status-badge completed">Completed</span>;
      case 4: return <span className="status-badge cancelled">Cancelled</span>;
      default: return <span className="status-badge unknown">Unknown</span>;
    }
  };

  // Status updates: Cancellation (Customers)
  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this appointment?')) return;
    try {
      await api.put(`/bookings/${bookingId}/status`, { status_id: 4 }); // 4 = Cancelled
      await fetchDashboardData();
    } catch (err) {
      alert(err.response?.data?.message || 'Error updating status.');
    }
  };

  // Status updates: Accept / Complete (Providers)
  const handleUpdateStatus = async (bookingId, newStatusId) => {
    try {
      await api.put(`/bookings/${bookingId}/status`, { status_id: newStatusId });
      await fetchDashboardData();
    } catch (err) {
      alert(err.response?.data?.message || 'Error updating status.');
    }
  };

  // CRUD Service actions (Admins)
  const handleOpenAddModal = () => {
    setIsEditing(false);
    setCurrentServiceId(null);
    setServiceName('');
    setDescription('');
    setCategory('cleaning');
    setPrice('');
    setDuration('1.5 Hours');
    setImageFile(null);
    setFormError('');
    setFormSuccess('');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (service) => {
    setIsEditing(true);
    setCurrentServiceId(service.id);
    setServiceName(service.title);
    setDescription(service.description || '');
    setCategory(service.category);
    setPrice(service.price);
    setDuration(service.duration || '1.5 Hours');
    setImageFile(null);
    setFormError('');
    setFormSuccess('');
    setIsModalOpen(true);
  };

  const handleDeleteService = async (serviceId) => {
    if (!window.confirm('Are you sure you want to permanently delete this service?')) return;
    try {
      await api.delete(`/services/${serviceId}`);
      fetchDashboardData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete service.');
    }
  };

  const handleServiceSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');

    if (!serviceName || !price || !category) {
      setFormError('Please fill in all required fields.');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('service_name', serviceName);
      formData.append('description', description);
      formData.append('category', category);
      formData.append('price', price);
      formData.append('duration', duration);
      if (imageFile) {
        formData.append('image', imageFile);
      }

      if (isEditing) {
        await api.put(`/services/${currentServiceId}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        setFormSuccess('Service updated successfully!');
      } else {
        await api.post('/services', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        setFormSuccess('Service created successfully!');
      }

      setTimeout(() => {
        setIsModalOpen(false);
        fetchDashboardData();
      }, 1500);
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to submit service. Check console details.');
    }
  };

  return (
    <div className="dashboard-container page-container fade-in-up">
      {/* Upper Welcome Header banner */}
      <div className="dashboard-header glass-panel">
        <div className="header-info">
          <h1>
            Welcome back, <span className="highlight-text">{user?.name}</span>
          </h1>
          <p className="role-indicator">
            Role: <strong style={{ color: 'var(--secondary)' }}>{user?.role?.toUpperCase()}</strong> | Email: {user?.email}
          </p>
        </div>
        <button onClick={logout} className="btn btn-secondary logout-btn-dash">
          Logout Session
        </button>
      </div>

      {error && (
        <div className="auth-error-alert" style={{ marginBottom: '24px' }}>
          <span className="alert-icon">⚠️</span>
          <span className="alert-message">{error}</span>
        </div>
      )}

      {/* Dynamic Statistics Cards */}
      <div className="stats-grid">
        {user?.role === 'user' && (
          <>
            <div className="glass-panel stat-card">
              <span className="stat-label">Active Appointments</span>
              <h3>{bookings.filter(b => b.status_id === 1 || b.status_id === 2).length}</h3>
            </div>
            <div className="glass-panel stat-card">
              <span className="stat-label">Total Services Used</span>
              <h3>{bookings.filter(b => b.status_id === 3).length}</h3>
            </div>
            <div className="glass-panel stat-card">
              <span className="stat-label">Spent Scheduled</span>
              <h3>₹{bookings.reduce((sum, b) => sum + parseFloat(b.service?.price || 0), 0).toFixed(2)}</h3>
            </div>
          </>
        )}

        {user?.role === 'provider' && (
          <>
            <div className="glass-panel stat-card">
              <span className="stat-label">Pending Invitations</span>
              <h3>{bookings.filter(b => b.status_id === 1).length}</h3>
            </div>
            <div className="glass-panel stat-card">
              <span className="stat-label">Confirmed Jobs</span>
              <h3>{bookings.filter(b => b.status_id === 2).length}</h3>
            </div>
            <div className="glass-panel stat-card">
              <span className="stat-label">Performance Rating</span>
              <h3>★ 5.0</h3>
            </div>
          </>
        )}

        {user?.role === 'admin' && (
          <>
            <div className="glass-panel stat-card">
              <span className="stat-label">Catalogued Services</span>
              <h3>{services.length}</h3>
            </div>
            <div className="glass-panel stat-card">
              <span className="stat-label">Global Bookings</span>
              <h3>{bookings.length}</h3>
            </div>
            <div className="glass-panel stat-card">
              <span className="stat-label">System Mode</span>
              <h3 style={{ fontSize: '1.4rem', color: 'var(--secondary)' }}>Active Admin</h3>
            </div>
          </>
        )}
      </div>

      {/* Admin Panel Toggles */}
      {user?.role === 'admin' && (
        <div className="admin-toggles glass-panel">
          <button 
            className={`tab-btn ${activeTab === 'services' ? 'active' : ''}`}
            onClick={() => setActiveTab('services')}
          >
            🛠️ Service Management CRUD
          </button>
          <button 
            className={`tab-btn ${activeTab === 'schedules' ? 'active' : ''}`}
            onClick={() => setActiveTab('schedules')}
          >
            📋 Booking Audits Feed
          </button>
        </div>
      )}

      {/* Main Panel View Area */}
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', margin: '40px 0' }}>
          <div className="loading-spinner" style={{ width: '40px', height: '40px', borderTopColor: 'var(--secondary)' }}></div>
        </div>
      ) : (
        <div className="dashboard-content-layout">
          {/* 1. CUSTOMER VIEW / SCHEDULES */}
          {user?.role === 'user' && (
            <div className="booking-list-wrapper">
              <h2>My Booking Appointments</h2>
              {bookings.length > 0 ? (
                <div className="schedules-grid">
                  {bookings.map((booking) => (
                    <div key={booking.id} className="booking-card glass-panel">
                      <div className="booking-card-header">
                        <div>
                          <h3>{booking.service?.title}</h3>
                          <span className="booking-price">₹{parseFloat(booking.service?.price || 0).toFixed(2)}</span>
                        </div>
                        {getStatusBadge(booking.status_id)}
                      </div>
                      <div className="booking-card-body">
                        <p><strong>📅 Date:</strong> {booking.booking_date}</p>
                        <p><strong>⏱️ Time:</strong> {booking.booking_time}</p>
                        {booking.provider?.user?.name && (
                          <p><strong>👤 Provider:</strong> {booking.provider.user.name}</p>
                        )}
                        {booking.special_instructions && (
                          <p className="special-note"><strong>📝 Notes:</strong> {booking.special_instructions}</p>
                        )}
                      </div>
                      <div className="booking-card-actions">
                        {(parseInt(booking.status_id) === 1 || parseInt(booking.status_id) === 2) && (
                          <button 
                            onClick={() => handleCancelBooking(booking.id)}
                            className="btn btn-secondary cancel-appointment-btn"
                          >
                            Cancel Appointment
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="no-schedules glass-panel">
                  <p>You don't have any bookings scheduled yet.</p>
                  <a href="/services" className="btn btn-primary" style={{ marginTop: '15px' }}>Book a Service</a>
                </div>
              )}
            </div>
          )}

          {/* 2. PROVIDER VIEW */}
          {user?.role === 'provider' && (
            <div className="booking-list-wrapper">
              <h2>Assigned Service Contracts</h2>
              {bookings.length > 0 ? (
                <div className="schedules-grid">
                  {bookings.map((booking) => (
                    <div key={booking.id} className="booking-card glass-panel">
                      <div className="booking-card-header">
                        <div>
                          <h3>{booking.service?.title}</h3>
                          <span className="client-name">Client: {booking.customer?.name}</span>
                        </div>
                        {getStatusBadge(booking.status_id)}
                      </div>
                      <div className="booking-card-body">
                        <p><strong>📅 Date:</strong> {booking.booking_date}</p>
                        <p><strong>⏱️ Time:</strong> {booking.booking_time}</p>
                        {booking.customer?.phone && (
                          <p><strong>📞 Contact:</strong> {booking.customer.phone}</p>
                        )}
                        {booking.special_instructions && (
                          <p className="special-note"><strong>📝 Notes:</strong> {booking.special_instructions}</p>
                        )}
                      </div>
                      <div className="booking-card-actions">
                        {parseInt(booking.status_id) === 1 && (
                          <button 
                            onClick={() => handleUpdateStatus(booking.id, 2)}
                            className="btn btn-accent accept-job-btn"
                          >
                            Accept Job Request
                          </button>
                        )}
                        {parseInt(booking.status_id) === 2 && (
                          <button 
                            onClick={() => handleUpdateStatus(booking.id, 3)}
                            className="btn btn-primary complete-job-btn"
                          >
                            Mark as Completed
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="no-schedules glass-panel">
                  <p>No active service requests have been assigned to you yet.</p>
                </div>
              )}
            </div>
          )}

          {/* 3. ADMIN: SERVICE MANAGEMENT CRUD PANEL */}
          {user?.role === 'admin' && activeTab === 'services' && (
            <div className="admin-crud-wrapper">
              <div className="crud-header">
                <h2>Service Directory Inventory</h2>
                <button onClick={handleOpenAddModal} className="btn btn-accent add-service-btn">
                  ✚ Add New Service
                </button>
              </div>

              <div className="services-table-wrapper glass-panel">
                <table className="crud-table">
                  <thead>
                    <tr>
                      <th>Image</th>
                      <th>Service Name</th>
                      <th>Category</th>
                      <th>Price</th>
                      <th>Duration</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {services.length > 0 ? (
                      services.map((service) => (
                        <tr key={service.id}>
                          <td>
                            <div 
                              className="table-img" 
                              style={{ backgroundImage: `url(${service.image_url})` }}
                            ></div>
                          </td>
                          <td>
                            <strong>{service.title}</strong>
                            <p className="desc-preview">{service.description}</p>
                          </td>
                          <td><span className="table-cat">{service.category.toUpperCase()}</span></td>
                          <td><strong>₹{parseFloat(service.price).toFixed(2)}</strong></td>
                          <td>⏱️ {service.duration || '1.5 Hours'}</td>
                          <td className="table-actions">
                            <button onClick={() => handleOpenEditModal(service)} className="action-btn edit">
                              ✏️ Edit
                            </button>
                            <button onClick={() => handleDeleteService(service.id)} className="action-btn delete">
                              🗑️ Delete
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6" style={{ textAlign: 'center', padding: '24px' }}>
                          No services found in inventory database.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 4. ADMIN: BOOKING AUDITS */}
          {user?.role === 'admin' && activeTab === 'schedules' && (
            <div className="admin-audits-wrapper">
              <h2>All Booking Transactions (Audits)</h2>
              {bookings.length > 0 ? (
                <div className="schedules-grid">
                  {bookings.map((booking) => (
                    <div key={booking.id} className="booking-card glass-panel">
                      <div className="booking-card-header">
                        <div>
                          <h3>{booking.service?.title}</h3>
                          <span className="client-name">Customer: {booking.customer?.name}</span>
                        </div>
                        {getStatusBadge(booking.status_id)}
                      </div>
                      <div className="booking-card-body">
                        <p><strong>📅 Date:</strong> {booking.booking_date}</p>
                        <p><strong>⏱️ Time:</strong> {booking.booking_time}</p>
                        {booking.special_instructions && (
                          <p className="special-note"><strong>📝 Notes:</strong> {booking.special_instructions}</p>
                        )}
                      </div>
                      <div className="booking-card-actions">
                        {(parseInt(booking.status_id) === 1 || parseInt(booking.status_id) === 2) && (
                          <button 
                            onClick={() => handleCancelBooking(booking.id)}
                            className="btn btn-secondary cancel-appointment-btn"
                          >
                            Cancel (Force Override)
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="no-schedules glass-panel">
                  <p>No booking appointments have been recorded globally yet.</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* CRUD Add/Edit Service Modal Drawer */}
      {isModalOpen && (
        <div className="crud-modal-overlay">
          <div className="crud-modal-card glass-panel">
            <button className="modal-close-btn" onClick={() => setIsModalOpen(false)}>×</button>
            <h2>{isEditing ? '✏️ Edit Catalogued Service' : '✚ Add New Local Service'}</h2>
            
            {formError && (
              <div className="auth-error-alert" style={{ margin: '12px 0 20px 0' }}>
                <span className="alert-icon">⚠️</span>
                <span className="alert-message">{formError}</span>
              </div>
            )}

            {formSuccess && (
              <div className="booking-success-wrapper" style={{ padding: '12px', margin: '12px 0 20px 0' }}>
                <span className="success-check-icon" style={{ width: '32px', height: '32px', fontSize: '1rem' }}>✓</span>
                <p style={{ margin: 0, fontSize: '0.9rem' }}>{formSuccess}</p>
              </div>
            )}

            <form onSubmit={handleServiceSubmit} className="crud-form">
              <div className="form-input-group">
                <label>Service Name *</label>
                <input 
                  type="text" 
                  value={serviceName}
                  onChange={(e) => setServiceName(e.target.value)}
                  className="modal-form-input" 
                  placeholder="e.g. Sofa Cleaning Elite"
                  required
                />
              </div>

              <div className="form-group-row">
                <div className="form-input-group">
                  <label>Category *</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="modal-form-input"
                    required
                  >
                    <option value="cleaning">Cleaning</option>
                    <option value="handyman">Repairs & Plumbing</option>
                    <option value="wellness">Salon & Wellness</option>
                    <option value="moving">Relocation & Moving</option>
                    <option value="tech">Smart Tech Support</option>
                    <option value="gardening">Gardening & Outdoor</option>
                  </select>
                </div>
                <div className="form-input-group">
                  <label>Base Price (₹) *</label>
                  <input 
                    type="number" 
                    step="0.01"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="modal-form-input" 
                    placeholder="e.g. 59.99"
                    required
                  />
                </div>
              </div>

              <div className="form-group-row">
                <div className="form-input-group">
                  <label>Estimated Duration</label>
                  <input 
                    type="text" 
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="modal-form-input" 
                    placeholder="e.g. 2 Hours"
                  />
                </div>
                <div className="form-input-group">
                  <label>Header Image (File Upload)</label>
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={(e) => setImageFile(e.target.files[0])}
                    className="modal-form-input" 
                    style={{ paddingTop: '8px' }}
                  />
                </div>
              </div>

              <div className="form-input-group">
                <label>Detailed Description</label>
                <textarea 
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="modal-form-textarea" 
                  placeholder="Describe focus points, crew sizes, material inclusions..."
                  rows="3"
                ></textarea>
              </div>

              <div className="modal-actions">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn btn-primary"
                >
                  {isEditing ? 'Save Changes' : 'Publish Service'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
